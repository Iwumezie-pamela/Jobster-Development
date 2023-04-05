import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customFetch from '../../utils/axios';

const initialFiltersState = {
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
};

const initialState = {
  isLoading: true,
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  ...initialFiltersState,
};

export const getAllJobs = createAsyncThunk(
  'allJobs/getAllJobs',
  async (_, thunkAPI) => {
    // search query

    const { page, search, searchStatus, searchType, sort } =
      thunkAPI.getState().allJobs;

    let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}&page=${page}`; //?& added to the url for the search query

    if (search) {
      url = url + `&search=${search}`;
    }

    try {
      const resp = await customFetch.get(url, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
        },
      });
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('There was an error');
    }
  }
);

// stats page
export const showStats = createAsyncThunk(
  'allJobs/showStats',
  async (_, thunkAPI) => {
    //_ because its a get request

    try {
      const resp = await customFetch.get('/jobs/stats', {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
        },
      });

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const allJobsSlice = createSlice({
  name: 'allJobs',
  initialState,
  reducers: {
    // show the spinner when job is deleted and hide it afterwards
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },

    handleChange: (state, { payload: { name, value } }) => {
      state.page = 1; //anytime the user change something in the search form,the state returns back  to page 1 i.e with every new request i want to  start with the first page not the page we are currently on
      state[name] = value;
    },

    clearFilter: (state) => {
      return { ...state, ...initialFiltersState };
    },

    changePage: (state, { payload }) => {
      state.page = payload;
    },

    clearAllJobsState: (state) => initialState, //set store to default values
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllJobs.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getAllJobs.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.jobs = payload.jobs;
        // handles the search by producing data that matches the request
        state.numOfPages = payload.numOfPages;
        state.totalJobs = payload.totalJobs;
      })

      .addCase(getAllJobs.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })

      // stats
      .addCase(showStats.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(showStats.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.stats = payload.defaultStats;
        state.monthlyApplications = payload.monthlyApplications;
      })

      .addCase(showStats.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      });
  },
});

export const {
  showLoading,
  hideLoading,
  handleChange,
  clearFilter,
  changePage,
  clearAllJobsState,
} = allJobsSlice.actions;
export default allJobsSlice.reducer;
