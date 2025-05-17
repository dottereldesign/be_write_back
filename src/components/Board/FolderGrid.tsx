// src/components/Board/FolderGrid.tsx
import FolderComponent from "./Folder";
import { Folder } from "../../types/PastedItem";

interface FolderGridProps {
  folders: Folder[];
  onOpen: (folderId: string) => void;
}

const FolderGrid = ({ folders, onOpen }: FolderGridProps) => {
  if (folders.length === 0) return null;
  return (
    <div className="desktop-folder-grid">
      {folders.map((folder) => (
        <FolderComponent
          key={folder.id}
          folder={folder}
          onOpen={onOpen}
          isActive={false}
          compact
        />
      ))}
    </div>
  );
};

export default FolderGrid;
