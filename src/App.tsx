import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import Landing from './components/Landing/Landing';
import RoomContainer from './components/Room/RoomContainer';

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/room" element={<RoomContainer />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
