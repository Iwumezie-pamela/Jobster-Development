import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import jobSlice from './features/job/jobSlice'; //jobReducer
import allJobsSlice from './features/allJobs/allJobsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    job: jobSlice,
    allJobs: allJobsSlice,
  },
});
