import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortAmountDown, faSortAmountUp } from '@fortawesome/free-solid-svg-icons'
import Button from "./Button";

function getIcon(sortKey, activeSortKey, isSortReverse) {
  if (sortKey === activeSortKey && isSortReverse) {
    return faSortAmountDown;
  } else if(sortKey === activeSortKey && !isSortReverse) {
    return faSortAmountUp;
  } else {
    return faSort;
  }
}

const Sort = ({
    sortKey,
    activeSortKey,
    onSort,
    isSortReverse,
  }) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );

  return(
    <Button
      onClick={() => onSort(sortKey)}
      className={sortClass}
    >
      <FontAwesomeIcon icon={getIcon(sortKey, activeSortKey, isSortReverse)} />
    </Button>
  )
};

export default Sort;
