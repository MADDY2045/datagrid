import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import ForecastTable from './components/ForecastTable';
import ForecastTableTwo from './components/ForecastTableTwo';

const App = () => {
  return (
    <div>
      <Navbar />
      {/* <ForecastTable /> */}
      <ForecastTableTwo />
    </div>
  );
};

export default App;
