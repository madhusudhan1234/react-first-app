import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    const helloworld = "Welcome to the Road to learn HMR Working";

    return (
      <div className="App">
        <h2>{helloworld}</h2>
      </div>
    );
  }
}

export default App;
