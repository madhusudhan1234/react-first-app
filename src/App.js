import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import propTypes from 'prop-types';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
    };

    this.needsToSearchTopStories = this.needToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needToSearchTopStories(searchTerm) {
    return  !this.state.results[searchTerm];
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];
    
    this.setState({ 
      results: { 
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
     });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => this.setState({ error: e }));
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;

    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    })
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }
  
  render() {
    const { 
      searchTerm, 
      results, 
      searchKey,
      error
    } = this.state;
    
    const page = (
      results && 
      results[searchKey] && 
      results[searchKey].page
    ) || 0;

    const list = (
      results && 
      results[searchKey] && 
      results[searchKey].hits
    ) || [];

    if (error) {
      return <p>Something went wrong.</p>;
    }

    return (
      <div className="page">
        <div className="interactions">
            <Search 
              value={searchTerm}
              onChange={this.onSearchChange}
              onSubmit={this.onSearchSubmit}
            >
              Search
            </Search>
          { error 
            ? <div className="interactions">
              <p> Something went wrong. </p>
            </div>
            : <Table 
              list={list}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
            />
          }
          <div className="interactions">
            <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
              More
            </Button>  
          </div>
        </div>
      </div>
    );
  }
}

const Search = ({
    value,
    onChange,
    onSubmit,
    children 
  }) => 
      <form onSubmit={onSubmit}>
        {children} <input
          type="text"
          value={value}
          onChange={onChange}
        />
        <button type="submit">
          {children}
        </button>
      </form>

const Button = ({ onClick, className, children }) => 
  <button
    onClick={onClick}
    className={className}
    type="button"
  >  
    {children}
  </button>


Button.propTypes = {
  onClick: propTypes.func.isRequired,
  className: propTypes.string,
  children: propTypes.node.isRequired,
};  

Button.defaultProps = {
  className: '',
};

const Table = ({ list, onDismiss }) => {
  const largeColumn = {
    width: '40%',
  }

  const midColumn = {
    width: '30%',
  }

  const smallColumn = {
    width: '10%',
  }

  return (
    <div className='table'>
    {list.map(item => 
      <div key={item.objectID} className='table-row'>
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn }>{item.points}</span>
        <span style={smallColumn}>
          <Button onClick={() => onDismiss(item.objectID)} className='button-inline'>
            Dismiss
          </Button>  
        </span>
      </div>
    )}
  </div>
  )
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

export default App;
export { Button, Search, Table };
