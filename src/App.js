import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import ForecastTable from './components/ForecastTable';

const App = () => {
  return (
    <div>
      <Navbar />
      <ForecastTable />
    </div>
  );
};

export default App;
