import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customFetch from '../../utils/axios';
import {
  addUserToLocalStorage,
  getUserToLocalStorage,
  removeUserToLocalStorage,
} from '../../utils/localStorage';
import { clearAllJobsState } from '../allJobs/allJobsSlice';
import { clearBtn } from '../job/jobSlice';

const initialState = {
  user: getUserToLocalStorage(),
  isLoading: false,
  isSidebarOpen: false,
};
// register
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user, thunkAPI) => {
    try {
      const resp = await customFetch.post('/auth/register', user);
      return resp.data;
    } catch (error) {
      toast.error(error.response.data.msg, {
        position: 'top-center',
      });
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);
// login
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (user, thunkAPI) => {
    try {
      const resp = await customFetch.post('auth/login', user);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

// profile
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user, thunkAPI) => {
    try {
      const resp = await customFetch.patch('auth/updateUser', user, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
        },
      });
      return resp.data;
    } catch (error) {
      // if status code is 401 log out user
      if (error.response.status === 401) {
        thunkAPI.dispatch(logoutUser());
        return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
      }
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

//clear store
export const clearStore = createAsyncThunk(
  'user/clearStore',
  async (message, thunkAPI) => {
    try {
      // logout user
      thunkAPI.dispatch(logoutUser(message));
      // clear jobs value
      thunkAPI.dispatch(clearAllJobsState());
      // clear job input values
      thunkAPI.dispatch(clearBtn());
      return Promise.resolve();
    } catch (error) {
      // console.log(error);
      return Promise.reject();
    }
  }
);
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    logoutUser: (state, { payload }) => {
      state.isSidebarOpen = false;
      state.user = null;
      removeUserToLocalStorage;
      if (payload) {
        toast.success(payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(registerUser.fulfilled, (state, { payload }) => {
        const { user } = payload;
        state.isLoading = false;
        state.user = user;
        toast.success(`Hello There ${user.name}`, {
          position: 'top-center',
        });
        addUserToLocalStorage(user);
      })

      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload, {
          position: 'top-center',
        });
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(loginUser.fulfilled, (state, { payload }) => {
        const { user } = payload;
        state.isLoading = false;
        state.user = user;
        toast.success(`Welcome back ${user.name}`, {
          position: 'top-center',
        });
        addUserToLocalStorage(user);
      })

      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload, {
          position: 'top-center',
        });
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(updateUser.fulfilled, (state, { payload }) => {
        const { user } = payload;
        state.isLoading = false;
        state.user = user;

        toast.success('User Updated');
        addUserToLocalStorage(user);
      })

      .addCase(updateUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload, {
          position: 'top-center',
        });
      })

      // clear store
      .addCase(clearStore.rejected, () => {
        toast.error('There was an error..');
      });
  },
});

export const { toggleSidebar, logoutUser, closeSidebar } = userSlice.actions;
export default userSlice.reducer;
