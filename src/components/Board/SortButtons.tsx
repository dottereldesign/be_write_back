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
    <div className="sort-buttons-container">
      <span className="sort-label">Sort</span>
      <div className="sort-buttons">
        <button
          className={sortType === "displayName" ? "active" : ""}
          onClick={() => onSortChange("displayName")}
          aria-pressed={sortType === "displayName"}
          aria-label={
            sortType === "displayName"
              ? isAscending
                ? "Sort by name, ascending"
                : "Sort by name, descending"
              : "Sort by name"
          }
          type="button"
        >
          <FontAwesomeIcon
            icon={
              sortType === "displayName"
                ? isAscending
                  ? faSortAlphaUp
                  : faSortAlphaDown
                : faSortAlphaDown
            }
          />
        </button>
        <button
          className={sortType === "timestamp" ? "active" : ""}
          onClick={() => onSortChange("timestamp")}
          aria-pressed={sortType === "timestamp"}
          aria-label={
            sortType === "timestamp"
              ? isAscending
                ? "Sort by time, ascending"
                : "Sort by time, descending"
              : "Sort by time"
          }
          type="button"
        >
          <FontAwesomeIcon
            icon={
              sortType === "timestamp"
                ? isAscending
                  ? faSortNumericUp
                  : faSortNumericDown
                : faSortNumericDown
            }
          />
        </button>
      </div>
    </div>
  );
};
export default SortButtons;
