import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FormRow from '../components/FormRow';
import Logo from '../components/Logo';
// import toast
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.section`
  display: grid;
  align-items: center;
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-500);
  }

  h3 {
    text-align: center;
  }
  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--primary-500);
    cursor: pointer;
    letter-spacing: var(--letterSpacing);
  }
`;

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading } = useSelector((store) => store.user);

  const [values, setValues] = useState(initialState);

  const toggleMember = () => {
    setValues({
      ...values,
      isMember: !values.isMember,
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    //if email,password,name is empty and is member is false && show name
    if (!email || !password || (!isMember && !name)) {
      toast.error('please fill out all fields', {
        position: 'top-center',
      });
      return;
    }
    if (isMember) {
      dispatch(loginUser({ email: email, password: password }));
      return;
    } else {
      dispatch(registerUser({ name: name, email: email, password: password }));
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [user]); //navigate to home page after 3sec

  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={handleSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {/* name field*/}
        {/* if isMember is  false or if member is not logged in register i.e add the name */}
        {!values.isMember && (
          <FormRow
            type='text'
            name='name'
            value={values.name}
            handleChange={handleChange}
          />
        )}
        <FormRow
          type='email'
          name='email'
          value={values.email}
          handleChange={handleChange}
        />
        <FormRow
          type='password'
          name='password'
          value={values.password}
          handleChange={handleChange}
        />
        <button type='submit' className='btn btn-block' disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>

        <button
          type='submit'
          className='btn btn-hipster btn-block'
          disabled={isLoading}
          onClick={() =>
            dispatch(
              loginUser({ email: 'testUser@test.com', password: 'secret' })
            )
          }
        >
          {isLoading ? 'Loading...' : 'Demo App'}
        </button>
        {/*while loading,button would be disabled */}
        <p>
          {values.isMember ? ' Not a member yet?' : 'Already a member?'} {''}
          <button type='button' className='member-btn' onClick={toggleMember}>
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};

export default RegisterPage;
