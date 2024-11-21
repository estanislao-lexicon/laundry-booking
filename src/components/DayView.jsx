import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useBooking } from './BookingContext';
import UserLogin from './LogIn';
import './DayView.css';
import dayjs from 'dayjs';


function DayView () {
  const { selectedDate, setSelectedRoom, setSelectedTimeBlock, 
          bookingChangedFlag } = useBooking();    
  const [data, setData] = useState([]);
  const [showLogin, setShowLogin] = useState(false); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleTimeBlockClick = (e, room, timeBlock) => {     
    //const buttonClass = e.target.className; // Get the className of the button

    // if(buttonClass.includes('available')) {      
    setSelectedRoom(room);
    setSelectedTimeBlock(timeBlock);
    setShowLogin(true);
    //}    
  };

  function DayViewRoomButton( {room, userid, slot, disabled } )
  {
    if(!disabled)
    {
      return (
        <button onClick={(e) => handleTimeBlockClick(e, room, slot)}
          className={userid ? 'booked' : 'available' } >
          {userid ? userid : 'Book'}
        </button>
      );
    }
    else 
    {
      return (
        <button className={userid ? 'booked' : 'disabled' } >
          {userid ? userid : 'Book'}
        </button>)
    }
  }

  function DayViewRoom( {slots, room, disabled} ) {


    return (
      <div>
        {Object.keys(slots).map((slot, index) => (
          <div key={index} className="time-slot">
            <span>{slot}</span>
            <DayViewRoomButton room={room} userid={slots[slot]} slot={slot} disabled={disabled} />
          </div>
        ))}
      </div>
    )
  
  }

  const closeModal = () => {
    setShowLogin(false);
  };

  useEffect(() => {    
    const fetchBookedSlots = async () => {
      
      // console.log("DayView useEffect");

      try {
        setLoading(true);

        const { data, error } = await supabase        
        .from('booking')
        .select(`
          date,
          timeslot,
          room, 
          user_id
          `)
        .eq('date', selectedDate?selectedDate:dayjs().format("YYYY-MM-DD")); 

        setData(data);
        // console.log(data);
      
        if(error) {
          console.error(error);
          throw error;
        }           


      } catch(err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSlots();
  }, [ bookingChangedFlag, selectedDate ]);   
   
  
  if (loading) return; //  <p>Loading available slots...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>; 

  const displayDate = dayjs(selectedDate).format('dddd DD MMMM YYYY');
 
  const room_slots = [ { "08-12": null, "12-16": null, "16-19": null, "19-22": null } ,
                       { "08-12": null, "12-16": null, "16-19": null, "19-22": null } ];

  data.forEach( row => {
      room_slots[row.room-1][row.timeslot] = row.user_id;
  });

  // console.table(room_slots);

  // Object.keys(room_slots[0]).map((slot, index) => { console.log( slot + room_slots[0][slot]) });

  let dayViewClassName = 'dayView';
  let roomClassName = 'room';
  let disabled = false;
  let today = dayjs();
  
  if( today.isAfter( selectedDate, 'day') )
  {
    dayViewClassName += ' dayView-disabled';
    roomClassName += ' room-disabled';
    disabled = true;
  }

  return (    
    <div className={dayViewClassName}>
      <h1>{displayDate}</h1><p></p>
      <div className="day"> 

        <div className={roomClassName} key="r1">
          <h3>Laundry Room 1</h3>
          <div> 
            <DayViewRoom slots={room_slots[0]} room="1" disabled={disabled} /> 
          </div>
        </div>

        <div className={roomClassName} key="r2">
          <h3>Laundry Room 2</h3>
          <div> 
            <DayViewRoom slots={room_slots[1]} room="2" disabled={disabled} /> 
          </div>
        </div>

      </div>
      {showLogin && <UserLogin onClose={closeModal} />}
      <p></p>
      <a href="/"><button className="back">Back to Calendar</button></a>
      <p></p>
    </div>
  );
};
 
export default DayView;