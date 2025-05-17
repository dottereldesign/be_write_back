// src/hooks/useBoard.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { loadBoardItems, saveBoardItems } from "../utils/storage";
import { BoardItem, Folder, isCard, PastedItem } from "../types/PastedItem";
import { useClearPastes } from "./useClearPastes";
import { useSavePaste } from "./useSavePaste";
import { useClipboard } from "./useClipboard";
import { useClipboardPaste } from "./useClipboardPaste";
import { LOCAL_STORAGE_KEY } from "../constants/storage";
import { useDebounce } from "./useDebounce";

export function useBoard(triggerToast: (msg: string) => void) {
  const [boardItems, setBoardItems] = useState<BoardItem[]>(() =>
    loadBoardItems()
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<PastedItem | null>(null);

  const { handleClearAll } = useClearPastes(
    setBoardItems,
    setShowFavoritesOnly
  );
  const { newPaste, setNewPaste, showModal, setShowModal, handleSaveName } =
    useSavePaste(setBoardItems);
  const { copyToClipboard } = useClipboard(triggerToast);
  const { triggerClipboardPaste, handleClipboardEventPaste } =
    useClipboardPaste(setNewPaste, setShowModal, triggerToast);

  // Memoize folders to avoid recalculation
  const folders = useMemo(
    () => boardItems.filter((item): item is Folder => !isCard(item)),
    [boardItems]
  );

  // Favorite toggle for cards
  const toggleFavorite = useCallback(
    (id: string) => {
      setBoardItems((prev) =>
        prev.map((item) =>
          isCard(item) && item.id === id
            ? { ...item, isFavorite: !item.isFavorite }
            : item
        )
      );
    },
    [setBoardItems]
  );

  // Debounced saving and cross-tab sync
  const debouncedBoardItems = useDebounce(boardItems, 300);

  // Save (debounced)
  useEffect(() => {
    saveBoardItems(debouncedBoardItems, triggerToast);
    // eslint-disable-next-line
  }, [debouncedBoardItems]);

  // Cross-tab sync
  useEffect(() => {
    const syncHandler = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        setBoardItems(loadBoardItems());
      }
    };
    window.addEventListener("storage", syncHandler);
    return () => window.removeEventListener("storage", syncHandler);
  }, []);

  // Cancel drag if search/favorites changes mid-drag
  useEffect(() => {
    if (activeDragItem && (searchQuery || showFavoritesOnly)) {
      setActiveDragItem(null);
    }
  }, [searchQuery, showFavoritesOnly, activeDragItem]);

  // Clipboard "paste" event
  useEffect(() => {
    document.addEventListener("paste", handleClipboardEventPaste);
    return () => {
      document.removeEventListener("paste", handleClipboardEventPaste);
    };
  }, [handleClipboardEventPaste]);

  // Folders
  const activeFolder =
    activeFolderId && folders.length
      ? folders.find((f) => f.id === activeFolderId) || null
      : null;

  return {
    boardItems,
    setBoardItems,
    searchQuery,
    setSearchQuery,
    showFavoritesOnly,
    setShowFavoritesOnly,
    showFolderModal,
    setShowFolderModal,
    activeFolderId,
    setActiveFolderId,
    activeDragItem,
    setActiveDragItem,
    folders,
    handleClearAll,
    newPaste,
    setNewPaste,
    showModal,
    setShowModal,
    handleSaveName,
    copyToClipboard,
    triggerClipboardPaste,
    handleClipboardEventPaste,
    activeFolder,
    toggleFavorite, // <--- Now exposed for usage
  };
}
