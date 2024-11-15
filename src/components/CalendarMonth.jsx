import './CalendarMonth.css';
import CalendarDay from './CalendarDay';

const dayjs = require('dayjs');

export default function CalendarMonth({bookings}) {

    // unique key property required by react for list items
    // const uidStr = (dates[0]+"-"+dates[27]).replaceAll(" ","-");

    // console.log("CalendarMonth");
    // console.log(bookings?.length);
    // let items = [];

    // console.log("CalendarMonth " + bookings?.length);
    // if( bookings !== null ) {
    //     items = bookings.map( (item, index) => item );
    //     // console.log(datez);
    // }
    // else
    // {
    //     console.log("CalendarMonth bookings was null");
    //     return;
    // }

    const days = bookings.map(
        (item, index) => <CalendarDay key={index} index={index} data={item}/>  
    );

    return (
        <div className="calendar-month">
            {days}
        </div>
    );
}

