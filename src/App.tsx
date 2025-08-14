import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import PaintApp from './components/PaintApp';
import AlgorithmVisualizer from './components/AlgorithmVisualizer'; // Add this import

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'paint' | 'algorithms'>('landing');

  const handleStartPaint = () => {
    setCurrentPage('paint');
  };

  const handleStartAlgorithms = () => {
    setCurrentPage('algorithms');
  };

  const handleBack = () => {
    setCurrentPage('landing');
  };

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage 
          onStartPaint={handleStartPaint}
          onStartAlgorithms={handleStartAlgorithms}
        />
      )}
      {currentPage === 'paint' && <PaintApp onBack={handleBack} />}
      {currentPage === 'algorithms' && <AlgorithmVisualizer onBack={handleBack} />}
    </>
  );
}

export default App;


// My try is above
//////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////


// import React, { useState } from 'react';
// import LandingPage from './components/LandingPage';
// import PaintApp from './components/PaintApp';

// function App() {
//   const [currentPage, setCurrentPage] = useState<'landing' | 'paint'>('landing');

//   const handleStart = () => {
//     setCurrentPage('paint');
//   };

//   const handleBack = () => {
//     setCurrentPage('landing');
//   };

//   return (
//     <>
//       {currentPage === 'landing' && <LandingPage onStart={handleStart} />}
//       {currentPage === 'paint' && <PaintApp onBack={handleBack} />}
//     </>
//   );
// }

// export default App;