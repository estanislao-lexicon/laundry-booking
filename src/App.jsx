import React from 'react';
import { BookingProvider } from './components/BookingContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarView from './components/CalendarView';
import DayView from './components/DayView';
import LogIn from './components/LogIn';
import { useState, useEffect } from 'react';

// 28 days (4 weeks) in json format
import bookings from './dummybookings.jsx';

function App() {
  const [data, setData] = useState(bookings);

  console.log("App.jsx");
  console.log(bookings.length); // sanity check that dummy bookings was loaded

  return (
    <BookingProvider>
      <Router>
        <Routes> 
          {/* change this to have a different start page */}
          <Route path="/" element={<DayView />} />

          <Route path="/calendar" element={<CalendarView bookings={data} />} /> 
          <Route path="/day" element={<DayView />}  /> 
          <Route path="/login" element={<LogIn />} />  
        </Routes>
      </Router>      
    </BookingProvider>       
  );
}

export default App;
