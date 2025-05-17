// src/components/Board/Board.tsx
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { loadBoardItems, saveBoardItems } from "../../utils/storage";
import { BoardItem, PastedItem, Folder, isCard } from "../../types/PastedItem";
import { useClearPastes } from "../../hooks/useClearPastes";
import { useSavePaste } from "../../hooks/useSavePaste";
import { useClipboard } from "../../hooks/useClipboard";
import { useClipboardPaste } from "../../hooks/useClipboardPaste";
import BoardMain from "./BoardMain";
import FolderBoard from "./FolderBoard";
import NameModal from "./NameModal";
import { generateId } from "../../utils/generateId";

interface ClipboardBoardProps {
  triggerToast: (message: string) => void;
}

const ClipboardBoard = ({ triggerToast }: ClipboardBoardProps) => {
  const [boardItems, setBoardItems] = useState<BoardItem[]>(() =>
    loadBoardItems()
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<PastedItem | null>(null);

  // Memoize folders to avoid recalculation
  const folders = useMemo(
    () => boardItems.filter((item): item is Folder => !isCard(item)),
    [boardItems]
  );

  const { handleClearAll } = useClearPastes(
    setBoardItems,
    setShowFavoritesOnly
  );
  const { newPaste, setNewPaste, showModal, setShowModal, handleSaveName } =
    useSavePaste(setBoardItems);
  const { copyToClipboard } = useClipboard(triggerToast);
  const { triggerClipboardPaste, handleClipboardEventPaste } =
    useClipboardPaste(setNewPaste, setShowModal, triggerToast);

  // Favorite toggle for cards
  const toggleFavorite = useCallback((id: string) => {
    setBoardItems((prev) =>
      prev.map((item) =>
        isCard(item) && item.id === id
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    );
  }, []);

  useEffect(() => {
    document.addEventListener("paste", handleClipboardEventPaste);
    return () => {
      document.removeEventListener("paste", handleClipboardEventPaste);
    };
  }, [handleClipboardEventPaste]);

  // Debounced saveBoardItems
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      saveBoardItems(boardItems);
    }, 300);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [boardItems]);

  // Active folder
  const activeFolder =
    activeFolderId && folders.length
      ? folders.find((f) => f.id === activeFolderId) || null
      : null;

  // Handlers for FolderBoard
  function handleMoveCardOut(card: PastedItem) {
    if (!activeFolder) return;
    setBoardItems((prev) => {
      const newItems = prev.map((item) => {
        if (
          "type" in item &&
          item.type === "folder" &&
          item.id === activeFolder.id
        ) {
          return { ...item, items: item.items.filter((i) => i.id !== card.id) };
        }
        return item;
      });
      return [{ ...card }, ...newItems];
    });
  }
  function handleMoveCardWithin(newItems: PastedItem[]) {
    if (!activeFolder) return;
    setBoardItems((prev) =>
      prev.map((item) =>
        "type" in item && item.type === "folder" && item.id === activeFolder.id
          ? { ...item, items: newItems }
          : item
      )
    );
  }
  function handleToggleFavoriteInFolder(id: string) {
    if (!activeFolder) return;
    setBoardItems((prev) =>
      prev.map((item) => {
        if (
          "type" in item &&
          item.type === "folder" &&
          item.id === activeFolder.id
        ) {
          return {
            ...item,
            items: item.items.map((c) =>
              c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
            ),
          };
        }
        return item;
      })
    );
  }
  function handleCopyInFolder(text: string, displayName: string) {
    copyToClipboard(text, displayName);
  }

  // === RENDER ===
  if (activeFolder) {
    return (
      <FolderBoard
        folder={activeFolder}
        onBack={() => setActiveFolderId(null)}
        onMoveCardOut={handleMoveCardOut}
        onMoveCardWithin={handleMoveCardWithin}
        onToggleFavorite={handleToggleFavoriteInFolder}
        copyToClipboard={handleCopyInFolder}
      />
    );
  }

  // Show main board
  return (
    <div className="paste-container-wrapper">
      {showModal && (
        <NameModal
          isOpen={showModal}
          pastedText={newPaste}
          onSave={handleSaveName}
          onClose={() => setShowModal(false)}
        />
      )}
      {showFolderModal && (
        <NameModal
          isOpen={showFolderModal}
          onSave={(name) => {
            if (!name.trim()) return;
            setBoardItems((prev) => [
              {
                id: generateId(),
                type: "folder",
                displayName: name.trim(),
                items: [],
              },
              ...prev,
            ]);
            setShowFolderModal(false);
          }}
          onClose={() => setShowFolderModal(false)}
          label="Name your folder"
        />
      )}
      <BoardMain
        boardItems={boardItems}
        setBoardItems={setBoardItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        showFolderModal={showFolderModal}
        setShowFolderModal={setShowFolderModal}
        setActiveFolderId={setActiveFolderId}
        activeDragItem={activeDragItem}
        setActiveDragItem={setActiveDragItem}
        triggerClipboardPaste={triggerClipboardPaste}
        copyToClipboard={copyToClipboard}
        toggleFavorite={toggleFavorite}
        handleClearAll={handleClearAll}
      />
    </div>
  );
};

export default ClipboardBoard;
