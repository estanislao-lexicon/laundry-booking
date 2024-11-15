import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

// Create the provider component
export const BookingProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState(null);
  const [availability, setAvailability] = useState({});
  const [user, setUser] = useState(null);

  // Function to update booking information in the database
  const bookTimeSlot = async () => {
    if (!selectedDate || !selectedRoom || !selectedTimeBlock || !user) {
      console.error("Missing required booking information");
      return;
    }
    
    try {
      // Replace with actual database booking logic
      // Example:
      console.log(`Booking ${selectedRoom} for ${selectedTimeBlock} on ${selectedDate} by ${user}`);
      
      // After booking, you may want to update availability or notify the user.
      
    } catch (error) {
      console.error("Booking failed", error);
    }
  };

  // Function to update booking information in the database
  const cancelBookedTimeSlot = async () => {
    if (!selectedDate || !selectedRoom || !selectedTimeBlock || !user) {
      console.error("Missing required booking information");
      return;
    }
  }

  return (
    <BookingContext.Provider
      value={{
        selectedDate: '2024-11-10',
        setSelectedDate,
        selectedRoom,
        setSelectedRoom,
        selectedTimeBlock,
        setSelectedTimeBlock,
        availability,
        setAvailability,
        user,
        setUser,
        bookTimeSlot,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Hook to access the BookingContext
export const useBooking = () => useContext(BookingContext);
