// src/components/Board/BoardControls.tsx
import PasteButton from "./PasteButton";
import SearchBar from "./SearchBar";
import ClearButton from "./ClearButton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface BoardControlsProps {
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: React.Dispatch<React.SetStateAction<boolean>>;

  setShowFolderModal: (b: boolean) => void;
  triggerClipboardPaste: () => void;
  setSearchQuery: (q: string) => void;
  handleClearAll: () => void;
}

const BoardControls = ({
  showFavoritesOnly,
  setShowFavoritesOnly,
  setShowFolderModal,
  triggerClipboardPaste,
  setSearchQuery,
  handleClearAll,
}: BoardControlsProps) => (
  <div className="buttons-container">
    <div className="buttons-row">
      <button
        type="button"
        className="create-folder-btn"
        onClick={() => setShowFolderModal(true)}
        aria-label="Create a new folder"
      >
        <FontAwesomeIcon icon={faPlus} style={{ fontSize: "1em" }} />
        Create a Folder
      </button>

      <PasteButton onPaste={triggerClipboardPaste} />
      {/* Could wire in SortButtons here if needed, otherwise keep in FolderBoard/Main */}
      <button
        className={`favorites-toggle ${showFavoritesOnly ? "active" : ""}`}
        onClick={() => setShowFavoritesOnly((prev) => !prev)}
        aria-pressed={showFavoritesOnly}
        aria-label={
          showFavoritesOnly
            ? "Show all pastes, including non-favorites"
            : "Show only favorites"
        }
        title={
          showFavoritesOnly
            ? "Show all pastes, including non-favorites"
            : "Show only starred favorites"
        }
        type="button"
      >
        {showFavoritesOnly ? "Show All" : "Show ⭐ Favorites"}
      </button>
      <ClearButton onClear={handleClearAll} />
    </div>
    <div className="search-row">
      <SearchBar onSearch={setSearchQuery} />
    </div>
  </div>
);

export default BoardControls;
