import { Routes, Route } from "react-router-dom";
import HomePage from "../components/HomePage";
import Login from "../components/Login";
import Signup from "../components/Signup";
import MentorProfile from "../components/MentorProfile";
import Dashboard from "../components/Dashboard";
import MentorDashboard from "../components/MentorDashboard";
import UpdateProfile from "../components/UpdateProfile";
import ManageSlots from "../components/ManageSlots";
import UploadFiles from "../components/UploadFiles";
import ChatBox from "../components/ChatBox";
import BookSession from "../components/BookSession";
import MenteesList from "../components/MenteesList";


import Feedback from "../components/Feedback";
import Assessments from "../components/Assessments";
import ProgressTracking from "../components/ProgressTracking";



const Allroutes = () => {
  return (
    <Routes>
  {/* Public Routes */}
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/mentor/:mentorId" element={<MentorProfile />} />
  <Route path="/dashboard" element={<Dashboard />} />
  


  {/* Mentor Dashboard with Nested Routes */}
 

  <Route path="/mentor-dashboard/:mentorId" element={<MentorDashboard />}>
    <Route path="update-profile" element={<UpdateProfile />} />
    <Route path="slots" element={<ManageSlots />} />
    <Route path="files" element={<UploadFiles />} />
    <Route path="chat" element={<ChatBox />} />
    <Route path="book-session" element={<BookSession />} />
    <Route path="mentees-dashboard" element={<MenteesList />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="progress-tracking" element={<ProgressTracking />} />
        
  </Route>
</Routes>

  );
};

export default Allroutes;














