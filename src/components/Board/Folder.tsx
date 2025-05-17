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
  compact?: boolean;
}

const FolderComponent = ({
  folder,
  onOpen,
  isActive,
  compact,
}: FolderProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: folder.id,
    data: { type: "folder" },
  });
  return (
    <div
      className={`folder-tile${isOver ? " over" : ""}${
        isActive ? " active" : ""
      }${compact ? " compact" : ""}`}
      ref={setNodeRef}
      tabIndex={0}
      onClick={() => onOpen(folder.id)}
      aria-label={`Open folder '${folder.displayName}'`}
      role="button"
      style={
        compact
          ? {
              background: isOver ? "#faf6e8" : "#f2f2ef",
              border: isActive ? "2px solid #e9ce6d" : "1px solid #ddd",
              borderRadius: "8px",
              padding: "0.8em 0.7em 0.7em 0.7em",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              width: 86,
              height: 78,
              margin: 4,
              fontWeight: 600,
              fontSize: "0.94em",
              color: "#36332b",
              boxShadow: isActive ? "0 2px 14px #ffe2a955" : "0 1px 4px #0001",
            }
          : {
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
            }
      }
    >
      <FontAwesomeIcon
        icon={faFolder}
        style={{
          marginRight: compact ? 0 : 12,
          marginBottom: compact ? 5 : 0,
          fontSize: compact ? 30 : 20,
          color: compact ? "#d9bb49" : "#EBCB8B",
        }}
      />
      <span
        style={{
          flex: compact ? "unset" : 1,
          fontWeight: 700,
          fontSize: compact ? "0.88em" : "1em",
          textAlign: "center",
          width: "100%",
          margin: compact ? "2px 0 0 0" : 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {folder.displayName}
      </span>
      {!compact && (
        <>
          <FontAwesomeIcon icon={faChevronRight} />
          <span style={{ marginLeft: 10, fontSize: "0.88em", color: "#aaa" }}>
            {folder.items.length} item{folder.items.length === 1 ? "" : "s"}
          </span>
        </>
      )}
      {compact && (
        <span
          style={{
            fontSize: "0.75em",
            color: "#b5ab84",
            marginTop: 3,
          }}
        >
          {folder.items.length}
        </span>
      )}
    </div>
  );
};

export default memo(FolderComponent);
