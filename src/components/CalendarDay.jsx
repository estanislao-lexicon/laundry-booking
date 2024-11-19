import './CalendarDay.css';
import { Link } from "react-router-dom";
import { useBooking } from './BookingContext';
// import { supabase } from '../utils/supabase';
import dayjs from 'dayjs';

export default function CalendarDay( {date, data} ) {
 
    const { setSelectedDate } = useBooking();   
    
    // if( data!== null && data!== undefined){
    //   console.log(`CalendarDay ${date} ${data.length}`);
    // }

    function dayClickHandler()
    {
        // console.log("clickHandler: "+currentDate+" "+selectedDate);
        setSelectedDate(date);        
    }
  
    let dayClassName="calendar-day";
    let containerClassName="calendar-day-container";
    let bookingButton = <button className="calendar-day-button">Book</button>;

    if( dayjs().isAfter( date, 'day') )
    {
        dayClassName = "calendar-day-disabled";  
        containerClassName = "calendar-day-container-disabled";
        bookingButton = <button className="calendar-day-button-show">Show</button>;
    }
    // else if( (dayjs(date).date() % 5) === 0 ) // just set some dates as full for now
    else if( data?.length >= 8 )
    {
        // check that all slots are booked, there can be duplicates currently
        bookingButton = <button className="calendar-day-button-full">Full</button>;            
    }

    return (
        <div className={containerClassName}>
          <Link className="calendar-link" to="/day/">
            <div className={dayClassName} onClick={dayClickHandler}>
              {date}
              {bookingButton}     
            </div>
          </Link>
        </div>
    );
      
};

