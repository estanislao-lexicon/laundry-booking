import React, { useState } from 'react';
import { useBooking } from './BookingContext';
import { supabase } from '../utils/supabase'
import './LogIn.css'


const UserLogin = ({ onClose, onLoginSuccess }) => {
  const { setSelectedOwner, bookTimeSlot } = useBooking(); // Update db with data stored in BookingContext  
  const [userLgh, setUserLgh] = useState('');  // User login (user_lgh)
  const [password, setPassword] = useState(''); // User password
  const [error, setError] = useState(null);    // Error state  
  const [loading, setLoading] = useState(false);

  
  const handleSubmit = async (e) => {    
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Fetch user data
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('user_lgh', userLgh)
        .eq('password', password)  // Ensure password matches
        .single();  // Expect only one result

      if (error) {
        setError("Wrong apartment number or PIN code. Please try again");
      } else {      
        setError(null);        
        setSelectedOwner(userLgh); 
        bookTimeSlot(userLgh);
        onLoginSuccess();
      }
    } catch (err) {
      setError('Error connecting to the server. Please try again later');        
    } finally {
      setLoading(false); // Hide loading state      
    };    
  };
 
  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Appartment number" 
            value={userLgh} 
            onChange={(e) => setUserLgh(e.target.value)}
            required
          />
          <input 
            type="password"
            placeholder="PIN Code (4 digits)" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ): (
            <div className='modal-actions'>
              <button type='submit'>Log In</button>
              <button type='button' onClick={onClose}>Cancel</button>
            </div>
          )}
        </form>          
      </div>
    </div>
  );
};

export default UserLogin;