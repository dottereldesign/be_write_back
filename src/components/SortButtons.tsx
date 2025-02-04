// src/components/SortButtons.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortAlphaDown,
  faSortAlphaUp,
  faSortNumericDown,
  faSortNumericUp,
} from "@fortawesome/free-solid-svg-icons";
import "./SortButtons.css";

interface SortButtonsProps {
  setSortType: (type: "name" | "date") => void;
  setIsAscending: (value: boolean) => void;
  isAscending: boolean;
  sortType: "name" | "date";
}

const SortButtons = ({
  setSortType,
  setIsAscending,
  isAscending,
  sortType,
}: SortButtonsProps) => {
  return (
    <div className="sort-buttons">
      <button
        onClick={() => {
          setSortType("name");
          setIsAscending(sortType === "name" ? !isAscending : true);
        }}
      >
        <FontAwesomeIcon
          icon={
            sortType === "name" && isAscending ? faSortAlphaUp : faSortAlphaDown
          }
        />
        Sort A-Z
      </button>

      <button
        onClick={() => {
          setSortType("date");
          setIsAscending(sortType === "date" ? !isAscending : true);
        }}
      >
        <FontAwesomeIcon
          icon={
            sortType === "date" && isAscending
              ? faSortNumericUp
              : faSortNumericDown
          }
        />
        Sort by Date
      </button>
    </div>
  );
};

export default SortButtons;
