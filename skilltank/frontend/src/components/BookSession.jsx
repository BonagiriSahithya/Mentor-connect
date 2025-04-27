import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookSession = () => {
  const { mentorId } = useParams();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const mentee = JSON.parse(localStorage.getItem("user"));
  const menteeId = mentee?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slotsRes = await axios.get(
          `http://localhost:5000/api/mentors/${mentorId}/slots`
        );
        setSlots(slotsRes.data);
      } catch {
        setError("Failed to load slots.");
      }

      if (menteeId) {
        try {
          const bookingsRes = await axios.get(
            `http://localhost:5000/api/bookings/mentee/${menteeId}`
          );
          setBookings(bookingsRes.data);
          localStorage.setItem("bookings", JSON.stringify(bookingsRes.data));
        } catch {
          setError("Failed to load bookings.");
        }
      }
    };

    fetchData();
  }, [mentorId, menteeId]);

  const bookSlot = async () => {
    if (!selectedSlot || !menteeId) {
      setError("Please select a slot and ensure you're logged in.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/bookings/book/${mentorId}`,
        {
          menteeId,
          date: selectedSlot.date,
          time: selectedSlot.time,
          meetingLink: selectedSlot.meetingLink,
          course: selectedSlot.course,
          subtopics: selectedSlot.subtopics,
        }
      );

      const newBooking = res.data;
      const updatedBookings = [...bookings, newBooking];
      setBookings(updatedBookings);
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));

      const updatedMentee = {
        ...mentee,
        bookedSessions: [
          ...(mentee.bookedSessions || []),
          {
            mentorId,
            date: selectedSlot.date,
            time: selectedSlot.time,
            meetingLink: selectedSlot.meetingLink,
            courseName: selectedSlot.course,
            subtopics: selectedSlot.subtopics,
          },
        ],
      };

      localStorage.setItem("user", JSON.stringify(updatedMentee));
      setSuccess(`✅ Booking confirmed! Meeting Link: ${newBooking.meetingLink}`);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed");
      setSuccess(null);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/bookings/cancel/${bookingId}/${menteeId}`
      );

      if (response.status === 200) {
        const updatedBookings = bookings.filter(
          (booking) => booking._id !== bookingId
        );
        setBookings(updatedBookings);
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));

        const updatedBookedSessions = (mentee.bookedSessions || []).filter(
          (session) => session._id !== bookingId
        );

        const updatedMentee = {
          ...mentee,
          bookedSessions: updatedBookedSessions,
        };

        localStorage.setItem("user", JSON.stringify(updatedMentee));
        alert("Booking canceled successfully!");
      }
    } catch (error) {
      alert("Error canceling booking");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Slots</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <ul>
        {slots.length === 0 ? (
          <p>No available slots at the moment.</p>
        ) : (
          slots.map((slot, index) => (
            <li key={slot?._id || `slot-${index}`} style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="radio"
                  name="slot"
                  onChange={() => setSelectedSlot(slot)}
                />
                <strong>{slot.course}</strong> — {slot.date} at {slot.time}
              </label>
              {selectedSlot === slot &&
                Array.isArray(slot.subtopics) &&
                slot.subtopics.length > 0 && (
                  <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                    <strong>Subtopics:</strong>
                    <ul>
                      {slot.subtopics.map((sub, subIndex) => (
                        <li key={subIndex}>{sub}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </li>
          ))
        )}
      </ul>

      <button onClick={bookSlot} disabled={!selectedSlot}>
        Book Selected Slot
      </button>

      <h2 style={{ marginTop: "30px" }}>Your Bookings</h2>
      <ul>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          bookings.map((booking, index) => (
            <li key={booking?._id || `booking-${index}`} style={{ marginBottom: "10px" }}>
              <strong>{booking.course}</strong> — {booking.date} at {booking.time}
              <br />
              {booking.subtopics?.length > 0 && (
                <>
                  <em>Subtopics:</em>
                  <ul>
                    {booking.subtopics.map((sub, subIndex) => (
                      <li key={subIndex}>{sub}</li>
                    ))}
                  </ul>
                </>
              )}
              <a
                href={booking.meetingLink}
                target="_blank"
                rel="noreferrer"
                style={{ marginRight: "10px" }}
              >
                Join Meeting
              </a>
              <button onClick={() => cancelBooking(booking._id)}>Cancel</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default BookSession;
