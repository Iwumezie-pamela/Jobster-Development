import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import FormRow from '../../components/FormRow';
import { toast } from 'react-toastify';

import {
  handleChange,
  clearBtn,
  createJob,
  editJob,
} from '../../features/job/jobSlice';

const Wrapper = styled.section`
  border-radius: var(--borderRadius);
  width: 100%;
  background: var(--white);
  padding: 3rem 2rem 4rem;
  box-shadow: var(--shadow-2);
  h3 {
    margin-top: 0;
  }
  .form {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-width: 100%;
    width: 100%;
  }
  .form-row {
    margin-bottom: 0;
  }
  .form-center {
    display: grid;
    row-gap: 0.5rem;
  }
  .form-center button {
    align-self: end;
    height: 35px;
    margin-top: 1rem;
  }
  .btn-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
    align-self: flex-end;
    margin-top: 0.5rem;
    button {
      height: 35px;
    }
  }
  .clear-btn {
    background: var(--grey-500);
  }
  .clear-btn:hover {
    background: var(--black);
  }
  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }
    .btn-container {
      margin-top: 0;
    }
  }
  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .form-center button {
      margin-top: 0;
    }
  }
`;

const AddJob = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const {
    isLoading,
    position,
    company,
    jobLocation,
    jobTypeOptions,
    jobType,
    statusOptions,
    status,
    isEditing,
    editJobId,
  } = useSelector((store) => store.job);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position || !company || !jobLocation) {
      toast.error('please fill out all fields');
      return;
    }

    // edit job
    if (isEditing) {
      dispatch(
        editJob({
          jobId: editJobId,
          job: {
            position,
            company,
            jobLocation,
            jobType,
            status,
          },
        })
      );
      return;
    }

    dispatch(createJob({ position, company, jobLocation, jobType, status }));
  };

  const handleJob = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(handleChange({ name, value }));
  };

  // shows the user location on our fly
  useEffect(() => {
    if (!isEditing) {
      //if we are not editing, dispatch the handlechange for location
      dispatch(
        handleChange({
          name: 'jobLocation',
          value: user.location,
        })
      );
    }
  }, []);

  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing ? 'edit job' : 'add job'}</h3>

        <div className='form-center'>
          <FormRow
            type='text'
            name='position'
            value={position}
            handleChange={handleJob}
          />
          <FormRow
            type='text'
            name='company'
            value={company}
            handleChange={handleJob}
          />
          <FormRow
            type='text'
            name='jobLocation'
            labelText='job location'
            value={jobLocation}
            handleChange={handleJob}
          />
          {/* status */}
          <div className='form-row'>
            <label htmlFor='status' className='form-label'>
              status
            </label>
            <select
              name='status'
              id='status'
              className='form-select'
              value={status}
              onChange={handleJob}
            >
              {statusOptions.map((statusItem, index) => {
                return (
                  <option key={index} value={statusItem}>
                    {statusItem}
                  </option>
                );
              })}
            </select>
          </div>

          {/* job type */}
          <div className='form-row'>
            <label htmlFor='jobType' className='form-label'>
              job type
            </label>
            <select
              name='jobType'
              id='jobType'
              className='form-select'
              value={jobType}
              onChange={handleJob}
            >
              {jobTypeOptions.map((jobTypeItem, index) => {
                return (
                  <option key={index} value={jobTypeItem}>
                    {jobTypeItem}
                  </option>
                );
              })}
            </select>
          </div>

          <div className='btn-container'>
            <button
              type='button'
              className='clear-btn btn-block btn'
              onClick={() => dispatch(clearBtn())}
            >
              Clear
            </button>
            <button
              type='submit'
              className='btn btn-block submit-btn'
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? 'loading...' : 'submit'}
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
