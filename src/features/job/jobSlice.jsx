import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customFetch from '../../utils/axios';
import { getUserToLocalStorage } from '../../utils/localStorage';
import { logoutUser } from '../user/userSlice';
import { showLoading, hideLoading, getAllJobs } from '../allJobs/allJobsSlice';

const initialState = {
  isLoading: false,
  position: '',
  company: '',
  jobLocation: '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  isEditing: false,
  editJobId: '',
};

// create job or add job
export const createJob = createAsyncThunk(
  'job/createJob',
  async (job, thunkAPI) => {
    try {
      const resp = await customFetch.post('/jobs', job, {
        headers: {
          //protected route
          authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
        },
      });
      thunkAPI.dispatch(clearBtn());
      return resp.data;
    } catch (error) {
      if (error.response.status === 401) {
        thunkAPI.dispatch(logoutUser());
        return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
      }
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

//nb when you delete a job,the server produces a new job i.e once delete request is successful,fetch new set  of jobs

// delete jobs
export const deleteJob = createAsyncThunk(
  'job/deleteJob',
  async (jobId, thunkAPI) => {
    thunkAPI.dispatch(showLoading());
    try {
      const resp = await customFetch.delete(`/jobs/${jobId}`, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
        }, //authorized because i want only the user who created the job  to delete the job
      });
      thunkAPI.dispatch(getAllJobs());
      return resp.data.msg;
    } catch (error) {
      thunkAPI.dispatch(hideLoading());

      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

//edit job

export const editJob = createAsyncThunk(
  'job/editJob',
  async ({ jobId, job }, thunkAPI) => {
    thunkAPI.dispatch(showLoading());
    try {
      const resp = await customFetch.patch(`/jobs/${jobId}`, job, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
        }, //authorized because i want only the user who created the job  to delete the job
      });
      thunkAPI.dispatch(clearBtn()); //if it is successful clear the inputs
      return resp.data.msg;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },

    clearBtn: () => {
      return {
        ...initialState,
        //get user location from local storage and prevent it from being cleared when clear btn is clicked
        jobLocation: getUserToLocalStorage()?.location || '',
      };
    },

    // edit
    setEditJob: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // create job
      .addCase(createJob.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success('Job Created');
      })

      .addCase(createJob.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })

      // delete job
      .addCase(deleteJob.fulfilled, (state, { payload }) => {
        toast.success(payload);
      })

      .addCase(deleteJob.rejected, (state, { payload }) => {
        toast.error(payload);
      })

      // edit job

      .addCase(editJob.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(editJob.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success('Job Modified...');
      })

      .addCase(editJob.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      });
  },
});

export const { handleChange, clearBtn, setEditJob } = jobSlice.actions;
export default jobSlice.reducer;
