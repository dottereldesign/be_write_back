// src/components/Board/SortButtons.tsx
// src/components/Board/SortButtons.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortAlphaDown,
  faSortAlphaUp,
  faSortNumericDown,
  faSortNumericUp,
  faGripLines,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/SortButtons.css";
import type { SortType } from "../../hooks/useSorting";

interface SortButtonsProps {
  onSortChange: (type: SortType) => void;
  isAscending: boolean;
  sortType: SortType;
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
          className={sortType === "custom" ? "active" : ""}
          onClick={() => onSortChange("custom")}
          aria-pressed={sortType === "custom"}
          aria-label="Custom drag order"
          type="button"
          title="Manual custom order (drag & drop enabled)"
        >
          <FontAwesomeIcon icon={faGripLines} />
        </button>
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
          title="Sort by name"
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
          title="Sort by time"
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
