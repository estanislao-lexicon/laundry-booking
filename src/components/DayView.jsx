import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useBooking } from './BookingContext';
import UserLogin from './LogIn';
import './DayView.css';
import dayjs from 'dayjs';

function DayView () {
  const { selectedDate, setSelectedRoom, setSelectedTimeBlock, 
          cancelBookedSlot, bookingChangedFlag } = useBooking();    
  const predefinedTimeSlots = useMemo(() => ["08-12", "12-16", "16-19", "19-22"], []);
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
      // cancelBookedSlot();
      setSelectedRoom(room);      
      setSelectedTimeBlock(timeBlock);
      setShowLogin(true);      
    }    
  };

  const closeModal = () => {
    setShowLogin(false);
  };

  
  useEffect(() => {    
    const fetchBookedSlots = async () => {
      if (!selectedDate) return;    
      
      // console.log("DayView useEffect");

      try {
        setLoading(true);

        let slotsByRoom = {
          room1: predefinedTimeSlots.map((time_block) => ({ time_block, owner: null})),
          room2: predefinedTimeSlots.map((time_block) => ({ time_block, owner: null})),
        };

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

      // Reformat data to group by room
      data.forEach((slot) => {
        const roomName = slot.Rooms.room_name;
        const timeBlockIndex = slotsByRoom[roomName]?.findIndex(
          (item) => item.time_block === slot.time_block
        );
        if(timeBlockIndex !== -1) {
          slotsByRoom[roomName][timeBlockIndex] = { 
            time_block: slot.time_block, 
            owner: slot.owner,
          };  
        }        
      });       

      setSlots(slotsByRoom);
      } catch(err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSlots();
  }, [ bookingChangedFlag, selectedDate, predefinedTimeSlots]); // Re-run whenever timeBlock or date changes    
   
  if (loading) return <p>Loading available slots...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>; 

  const displayDate = dayjs(selectedDate).format('dddd DD MMMM YYYY');
 
  return (    
    <div className='dayView'>
      <h1>{displayDate}</h1>
      <div className="day"> 
        {Object.keys(availableSlots).map((room) => (
          <div className="room" key={room}>
            <h3>Laundry Room { room === "room1" ? 1 : 2 }</h3>
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
      <a href="/"><button className="back">Back to Calendar</button></a>
    </div>
  );
};
 
export default DayView;