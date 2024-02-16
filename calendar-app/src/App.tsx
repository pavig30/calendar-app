import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import Calendar from './components/Calendar/Calendar';

function App() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

  return (
      <div className="App" data-testid="app-component">
          <Routes>
              <Route path="/" element={<Navigate to={`/${currentYear}/${currentMonth}`} replace />} />
              <Route path="/:year/:month" element={<Calendar />} />
              <Route path="*" element={<Navigate to={`/${currentYear}/${currentMonth}`} replace />} />
          </Routes>
      </div>
  );
}

export default App;