// src/components/Board/Folder.tsx
import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../../styles/Card.css";
import { Folder } from "../../types/PastedItem";

// DnD-kit
import { useDroppable } from "@dnd-kit/core";

interface FolderProps {
  folder: Folder;
  onOpen: (folderId: string) => void;
  isActive: boolean;
}

const FolderComponent = ({ folder, onOpen, isActive }: FolderProps) => {
  // DnD
  const { setNodeRef, isOver } = useDroppable({
    id: folder.id,
    data: { type: "folder" },
  });

  return (
    <div
      className={`folder-tile${isOver ? " over" : ""}${
        isActive ? " active" : ""
      }`}
      ref={setNodeRef}
      tabIndex={0}
      onClick={() => onOpen(folder.id)}
      aria-label={`Open folder '${folder.displayName}'`}
      role="button"
      style={{
        background: isOver ? "#2e2e2e" : "#232323",
        border: isActive ? "2px solid #EBCB8B" : "1px solid #777",
        marginBottom: "6px",
        borderRadius: "7px",
        padding: "0.6em 1em",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "1em",
        color: "#ececec",
      }}
    >
      <FontAwesomeIcon
        icon={faFolder}
        style={{ marginRight: 12, color: "#EBCB8B" }}
      />
      <span style={{ flex: 1 }}>{folder.displayName}</span>
      <FontAwesomeIcon icon={faChevronRight} />
      <span style={{ marginLeft: 10, fontSize: "0.88em", color: "#aaa" }}>
        {folder.items.length} item{folder.items.length === 1 ? "" : "s"}
      </span>
    </div>
  );
};

export default memo(FolderComponent);
