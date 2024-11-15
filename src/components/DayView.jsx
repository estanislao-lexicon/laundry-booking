import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useBooking } from './BookingContext';
import UserLogin from './LogIn';
import './DayView.css';

function DayView () {
  const { selectedDate, setSelectedRoom, setSelectedTimeBlock } = useBooking();  
  const predefinedTimeSlots = ["08-12", "12-16", "16-19", "19-22"];
  const [availableSlots, setSlots] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
      
  const handleTimeBlockClick = (e, room, timeBlock) => {     
    const buttonClass = e.target.className; // Get the className of the button

    if(buttonClass.includes('available')) {      
      setSelectedRoom(room);
      setSelectedTimeBlock(timeBlock);
      setShowLogin(true);

    } else if (buttonClass.includes('booked')) {      
      handleCancelBookedSlot(room, timeBlock);
    }    
  };

  const closeModal = () => {
    setShowLogin(false);
  };

  const handleCancelBookedSlot = async (room, timeBlock) => {
    try {
      // Perform cancellation logic here
      console.log(`Canceling booking for ${room} at ${timeBlock}`);
      // Example: update Supabase to remove the owner
      const { error } = await supabase
        .from('Room_Schedule')
        .update({ owner: null })
        .match({ 'Rooms.room_name': room, time_block: timeBlock });
  
      if (error) throw error;
  
      // Refresh the state
      setSlots((prev) => {
        const updated = { ...prev };
        const roomSlots = updated[room];
        const slot = roomSlots.find((s) => s.time_block === timeBlock);
        if (slot) slot.owner = null;
        return updated;
      });
    } catch (err) {
      console.error('Error canceling booking:', err.message);
      setError('Failed to cancel booking.');
    }
  };

  useEffect(() => {    
    const fetchAvailableSlots = async () => {
      if (!selectedDate) return;
      
      try {
        // Fetch room schedule data with relationships to Dates and Rooms tables
        const { data, error } = await supabase        
        .from('Room_Schedule')
        .select(`
          time_block,
          owner,
          Rooms!inner(room_name),
          Dates!inner(date)
          `)
        .eq('Dates.date', selectedDate) //Filter by day
        .in('Rooms.room_name', ['room1', 'room2']); //All rooms        
      
      if(error) {
        console.error(error);
        throw error;
      }
      console.log(data);

      // Reformat data to group by room
      const slotsByRoom = data.reduce((acc, slot) => {
        const roomName = slot.Rooms.room_name;
        if (!acc[roomName]) acc[roomName] = [];
        acc[roomName].push({ 
          time_block: slot.time_block, 
          owner: slot.owner || null,
         });
        return acc;
      }, {});
      
      // Fill missing time slots
      for (const room in slotsByRoom) {
        predefinedTimeSlots.forEach((time_block) => {
          if (!slotsByRoom[room].some((slot) => slot.time_block === time_block)) {
            slotsByRoom[room].push({
              time_block,
              owner: null, // Default to no owner
            });
          }
        });
      }

      setSlots(slotsByRoom);
      } catch(err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]); // Re-run whenever timeBlock or date changes
   
  if (loading) return <p>Loading available slots...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>; 

 
  return (
    <div>
      <div className="day"> 
        {Object.keys(availableSlots).map((room) => (
          <div className="room" key={room}>
            <h3>{room}</h3>
            <div>
              {/* Sort the slots array by time_block before rendering */}
              {availableSlots[room]
                .sort((a, b) => {
                  // Split time blocks into start and end times
                  const [startA, endA] = a.time_block.split('-').map(Number);
                  const [startB, endB] = b.time_block.split('-').map(Number);                  
                  // Compare start times first
                  if (startA !== startB) {
                    return startA - startB;
                  }                  
                  // If start times are equal, compare end times
                  return endA - endB;
                })
                .map((slot, index) => (
                  <div key={index} className="time-slot">
                    <span>{slot.time_block}</span>
                    <button
                        onClick={(e) => handleTimeBlockClick(e, room, slot.time_block)}
                        className={slot.owner ? 'booked' : 'available'}                        
                      >
                        {slot.owner ? slot.owner : 'Book'}
                    </button>
                  </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {showLogin && <UserLogin onClose={closeModal} />}
    </div>
  );
};
 
export default DayView;
