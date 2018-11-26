import React, { Component } from "react";
import propTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive } from '@fortawesome/free-solid-svg-icons'
import Button from "./Button";
import Sort from "./Sort";
import SORTS from "../utils";
import {
  LARGE_COLUMN,
  MID_COLUMN,
  SMALL_COLUMN,
} from '../constants';

export default class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };
  }

  onSort = (sortKey) => {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const {
      list,
      onDismiss
    } = this.props;

    const {
      sortKey,
      isSortReverse,
    } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;

    return (
      <div className='table'>
        <div className="table-header">
          <span style={LARGE_COLUMN}>
            Title &nbsp;
            <Sort
              onSort={this.onSort}
              sortKey={'TITLE'}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
            </Sort>
          </span>
          <span style={MID_COLUMN}>
            Author &nbsp;
            <Sort
              onSort={this.onSort}
              sortKey={'AUTHOR'}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
            </Sort>
          </span>
          <span style={SMALL_COLUMN}>
            Comments &nbsp;
            <Sort
              onSort={this.onSort}
              sortKey={'COMMENTS'}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
            </Sort>
          </span>
          <span style={SMALL_COLUMN}>
            Points &nbsp;
            <Sort
              onSort={this.onSort}
              sortKey={'POINTS'}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
            </Sort>
          </span>
          <span style={SMALL_COLUMN}>
            Archive
          </span>
        </div>
        {reverseSortedList.map(item =>
          <div key={item.objectID} className='table-row'>
            <span style={LARGE_COLUMN}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={MID_COLUMN}>{item.author}</span>
            <span style={SMALL_COLUMN}>{item.num_comments}</span>
            <span style={SMALL_COLUMN }>{item.points}</span>
            <span style={SMALL_COLUMN}>
              <Button onClick={() => onDismiss(item.objectID)} className='button-inline'>
                <FontAwesomeIcon icon={faArchive} />
              </Button>
            </span>
          </div>
        )}
      </div>
    )
  }
}

Table.propTypes = {
  list: propTypes.arrayOf(
    propTypes.shape({
      objectID: propTypes.string.isRequired,
      author: propTypes.string,
      url: propTypes.string,
      num_comments: propTypes.number,
      points: propTypes.number,
    })
  ).isRequired,
  onDismiss: propTypes.func.isRequired,
};