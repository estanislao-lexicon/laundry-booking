import { createContext, useState, useContext } from 'react';
import { supabase } from '../utils/supabase';

const BookingContext = createContext();

// Create the provider component
export const BookingProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [availability, setAvailability] = useState({});  
  const [user, setUser] = useState(null);
  const [bookingChangedFlag, setBookingChangedFlag] = useState(false);

  // Function to update booking information in the database
  const bookTimeSlot = async (user_id) => {
    if (!selectedDate || !selectedRoom || !selectedTimeBlock || !user_id) {
      console.error("Missing required booking information");
      return;
    }
    
    // Check time slot first
    await checkTimeSlot(user_id);
  }

  const checkTimeSlot = async (owner) => {

    try {
      // Fetch room schedule data with relationships to Dates and Rooms tables
      const { data, error } = await supabase    
      .from('booking')
      .select('id, date, timeslot, room, user_id')
      .eq('date', selectedDate )
      .eq('timeslot', selectedTimeBlock )
      .eq('room', selectedRoom );
      
      // console.log(data);

      if (error) {
        console.error("Error checking booking: ", error);
      }

      // empty data = free slot
      if( data.length === 0 ) {
        await _bookTimeSlot( owner ); 
      }
      else if( data.length > 0 && data[0].user_id !== owner )
      {
        return; // notify user that time was unavailable
      } else {
        await cancelTimeSlot(data[0].id);
      }

    } catch (err) {
      console.error("availability check error", err);
    }

  }

  /** the actual booking */
  const _bookTimeSlot = async (_user_id) => {
    try {
      // Insert the date and get the inserted date ID
      const { data, error } = await supabase
      .from('booking')
      .insert({date: selectedDate, room: selectedRoom, timeslot: selectedTimeBlock, user_id: _user_id})
      .select('id')
      .single();
    
      // if (dateError) throw dateError;

      // const dateId = dateData.id;

      if (error) {
        console.error("Error booking slot: ", error);
      } else {
        console.log("Booking successful:", data);
        setBookingChangedFlag(!bookingChangedFlag);
      }
    } catch (err) {
      console.error("Booking failed", err);
    }
  }


  const cancelTimeSlot = async (id) => {
    console.log(`cancel ${id}`);
    try {
      const { data, error } = await supabase
      .from('booking')
      .delete()
      .eq('id', id);
      
      const touch = x => {}; 
      touch(data);

      if (error) {
        console.error("Error cancel slot: ", error);
      } else {
        console.log("cancel done");
        setBookingChangedFlag(!bookingChangedFlag);
      }
    


    } catch (err) {
      console.error("Cancel failed", err);
    }
  }


  return (
    <BookingContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        selectedRoom,
        setSelectedRoom,
        selectedTimeBlock,
        setSelectedTimeBlock,
        availability,
        setAvailability,
        selectedOwner, 
        setSelectedOwner,
        user,
        setUser,
        bookTimeSlot,
        bookingChangedFlag,
        setBookingChangedFlag
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Hook to access the BookingContext
export const useBooking = () => useContext(BookingContext);
