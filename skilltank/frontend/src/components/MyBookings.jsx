import { useEffect, useState } from "react";
import axios from "axios";

const MyBookings = () => {
  const mentee = JSON.parse(localStorage.getItem("user"));
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/bookings/mentee/${mentee.id}`)
      .then(res => {
        setBookings(res.data);
        localStorage.setItem("myBookings", JSON.stringify(res.data)); // Save in localStorage
      })
      .catch(err => console.error(err));
  }, [mentee.id]);

  const handleCancel = async (bookingId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/bookings/cancel/${bookingId}/${mentee.id}`);
      
      setBookings(res.data.updatedBookings);
      localStorage.setItem("myBookings", JSON.stringify(res.data.updatedBookings));
  
      // Optional: clear mentee info if they cancel all bookings
      if (res.data.updatedBookings.length === 0) {
        localStorage.removeItem("myBookings");
      }
  
      alert("Booking cancelled successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
    }
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? <p>No bookings available.</p> : (
        bookings.map((b, idx) => (
          <div key={idx} style={{ marginBottom: "10px" }}>
            <p><strong>Date:</strong> {b.date} | <strong>Time:</strong> {b.time}</p>
            <p><strong>Meeting Link:</strong> {b.meetingLink}</p>
            <button onClick={() => handleCancel(b._id)}>Cancel Booking</button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;

