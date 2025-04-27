import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const mentorSlice = createSlice({
    name: "mentors",
    initialState: {
        mentors: []
    },
    reducers: {
        setMentors: (state, action) => {
            state.mentors = action.payload;
        }
    }
});

export const { setMentors } = mentorSlice.actions;
export default mentorSlice.reducer;

export const fetchMentors = () => async (dispatch) => {
    try {
        const response = await axios.get("/api/mentors");
        dispatch(setMentors(response.data));
    } catch (error) {
        console.error("Error fetching mentors:", error);
    }
};
