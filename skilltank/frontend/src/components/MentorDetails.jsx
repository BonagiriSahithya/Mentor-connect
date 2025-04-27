import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function MentorDetails() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/mentors/${id}`)
      .then(res => res.json())
      .then(data => setMentor(data))
      .catch(err => console.error("Error fetching mentor details:", err));
  }, [id]);

  if (!mentor) return <p>Loading mentor details...</p>;

  return (
    <div>
      <h2>{mentor.name}</h2>
      <p><strong>Email:</strong> {mentor.email}</p>
      <p><strong>Experience:</strong> {mentor.experience} years</p>
      <p><strong>Areas of Expertise:</strong> {mentor.areasOfExpertise.join(", ")}</p>
      <p><strong>Available Slots:</strong></p>
      <ul>
        {mentor.slots.map(slot => (
          <li key={slot}>{slot}</li>
        ))}
      </ul>
    </div>
  );
}

export default MentorDetails;
