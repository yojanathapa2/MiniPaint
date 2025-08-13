import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import PaintApp from './components/PaintApp';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'paint'>('landing');

  const handleStart = () => {
    setCurrentPage('paint');
  };

  const handleBack = () => {
    setCurrentPage('landing');
  };

  return (
    <>
      {currentPage === 'landing' && <LandingPage onStart={handleStart} />}
      {currentPage === 'paint' && <PaintApp onBack={handleBack} />}
    </>
  );
}

export default App;