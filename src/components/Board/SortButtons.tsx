// src/components/Board/SortButtons.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortAlphaDown,
  faSortAlphaUp,
  faSortNumericDown,
  faSortNumericUp,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/SortButtons.css";

interface SortButtonsProps {
  onSortChange: (type: "displayName" | "timestamp") => void;
  isAscending: boolean;
  sortType: "displayName" | "timestamp";
}

const SortButtons = ({
  onSortChange,
  isAscending,
  sortType,
}: SortButtonsProps) => {
  return (
    <div className="sort-buttons">
      <button onClick={() => onSortChange("displayName")}>
        <FontAwesomeIcon
          icon={
            sortType === "displayName" && isAscending
              ? faSortAlphaUp
              : faSortAlphaDown
          }
        />
      </button>

      <button onClick={() => onSortChange("timestamp")}>
        <FontAwesomeIcon
          icon={
            sortType === "timestamp" && isAscending
              ? faSortNumericUp
              : faSortNumericDown
          }
        />
      </button>
    </div>
  );
};

export default SortButtons;
