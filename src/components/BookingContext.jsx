import React, { createContext, useState, useContext } from 'react';
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

  
  // Function to update booking information in the database, 
  // just wraps the call to checkTimeSlot that books or cancel
  const bookTimeSlot = async (owner) => {
    if (!selectedDate || !selectedRoom || !selectedTimeBlock || !owner) {
      console.error("Missing required booking information");
      return;
    }

    await checkTimeSlot(owner);
  }

  /* first check if the slot is available */
  const checkTimeSlot = async (owner) => 
  {
    try {
      // Fetch room schedule data with relationships to Dates and Rooms tables
      const { data, error } = await supabase        
      .from('Room_Schedule')
      .select(`
        id,
        time_block,
        owner,
        Rooms!inner(room_name),
        Dates!inner(date)
        `)  
      .eq('Dates.date', selectedDate)
      .eq('time_block', selectedTimeBlock )
      .in('Rooms.room_name', [selectedRoom]);

      console.log(data);

      if (error) {
        console.error("Error checking booking: ", error);
      }

      if( data.length === 0 ) {
        await _bookTimeSlot( owner ); 
      }
      else if( data.length > 0 && data[0].owner !== owner )
      {
        return; // notify user that time was unavailable
      } else {
        await cancelTimeSlot(data[0].id);
      }

    } catch (err) {
      console.error("availability check error", err);
    }  
  }  


  /* the actual booking */ 
  const _bookTimeSlot = async (owner) => {

    try {
      // Insert the date and get the inserted date ID
      const { data: dateData, error: dateError } = await supabase
      .from('Dates')
      .insert([{ date: selectedDate }])
      .select('id')
      .single();
    
      if (dateError) throw dateError;

      const dateId = dateData.id;

      // Insert the room and get the inserted room ID
      const { data: roomData, error: roomError } = await supabase
      .from('Rooms')
      .insert([{ room_name: selectedRoom }])
      .select('id')
      .single();

      if (roomError) throw roomError;

      const roomId = roomData.id;
      
      // Insert into Room_Schedule with the obtained IDs
      const { data, error } = await supabase
        .from('Room_Schedule')
        .insert({
            date_id: dateId,
            room_id: roomId,
            time_block: selectedTimeBlock,
            owner,
        });

      if (error) {
        console.error("Error booking slot: ", error);
      } else {
        console.log("Booking successful:", data);
        setBookingChangedFlag(!bookingChangedFlag);
      }
    } catch (err) {
      console.error("Booking failed", err);
    }
  };

  //  Function to cancel booked information in the database
  const cancelTimeSlot = async (id) => {

    console.log(`cancelTimeSlot ${id}`);

    try {
      const { error } = await supabase
      .from('Room_Schedule')
      .delete()
      .update( {owner:null})
      .eq('id', id );
      
      if (error) {
        console.error("Error booking slot: ", error);
      } else {
        console.log("cancel done");
        setBookingChangedFlag(!bookingChangedFlag);
      }

    } catch (err) {
      console.error('Error canceling booking:', err.message);

    }
  };


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
