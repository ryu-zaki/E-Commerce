import logo from './logo.svg';
import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
/* Components */

import ContentsComp from './components/ContentsComp';

function App() {
  return (  
    <div className="App">
      {/* Contents of the Web page */}
      <ContentsComp />
    </div>
  );
}

export default App;
