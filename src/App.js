import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    var welcome = "Welcome to the Road to learn React";

    return (
      <div className="App">
        <h2>{welcome}</h2>
      </div>
    );
  }
}

export default App;
