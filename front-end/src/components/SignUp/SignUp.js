import { BASE_URL } from '../Common/constants';
import React from 'react';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import styled from '@emotion/styled';
import './styles.css';
import './styles-custom.css';

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className='text-input' {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className='error'>{meta.error}</div>
      ) : null}
    </>
  );
};

const StyledSelect = styled.select`
  color: var(--blue);
`;

const StyledErrorMessage = styled.div`
  font-size: 12px;
  color: var(--red-600);
  width: 400px;
  margin-top: 0.25rem;
  &:before {
    content: '❌ ';
    font-size: 10px;
  }
  @media (prefers-color-scheme: dark) {
    color: var(--red-300);
  }
`;

const StyledLabel = styled.label`
  margin-top: 1rem;
`;

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <StyledLabel htmlFor={props.id || props.name}>{label}</StyledLabel>
      <StyledSelect {...field} {...props} />
      {meta.touched && meta.error ? (
        <StyledErrorMessage>{meta.error}</StyledErrorMessage>
      ) : null}
    </>
  );
};

const SignupForm = ({ history }) => {
  const register = (values) => {
    const userToSend = {
      username: values.username,
      password: values.password,
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      country: values.country,
    };

    fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userToSend),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error) {
          throw new Error(result.message);
        }
        history.push('/login');
      })
      .catch((error) => error.message);
  };

  return (
    <>
      <div
        id={'forma'}
        style={{ position: 'absolute', top: '10%', left: '40%' }}
      >
        <h2>Register!</h2>
        <Formik
          initialValues={{
            username: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmpassword: '',
            email: '',
            country: '',
          }}
          validationSchema={Yup.object({
            username: Yup.string()
              .min(1, 'Must be more than 5 characters')
              .max(15, 'Must be 15 characters or less')
              .required('Please enter your username'),
            firstName: Yup.string()
              .min(5, 'Must be more than 5 characters')
              .max(15, 'Must be 15 characters or less')
              .required('Please enter your first name'),
            lastName: Yup.string()
              .max(20, 'Must be 20 characters or less')
              .required('Please enter your last name'),
            email: Yup.string()
              .email('Invalid email addresss`')
              .required('Please enter your email address'),
            password: Yup.string()
              .required('Please Enter your password')
              .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
              ),
            confirmpassword: Yup.string()
              .required()
              .oneOf([Yup.ref('password'), null], 'Passwords must match'),
            country: Yup.string()

              .oneOf(
                ['USA', 'Germany', 'France', 'Bulgaria'],
                'Invalid Job Type'
              )
              .required('Pleae enter your country'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            register(values);

            await new Promise((r) => setTimeout(r, 500));
            setSubmitting(false);
          }}
        >
          <Form>
            <MyTextInput
              label='Username'
              name='username'
              type='text'
              placeholder=''
            />
            <MyTextInput
              label='First Name'
              name='firstName'
              type='text'
              placeholder=''
            />
            <MyTextInput
              label='Last Name'
              name='lastName'
              type='text'
              placeholder=''
            />
            <MyTextInput
              label='Password'
              name='password'
              type='password'
              placeholder=''
            />
            <MyTextInput
              label='Confirm Password'
              name='confirmpassword'
              type='password'
              placeholder=''
            />
            <MyTextInput
              label='Email Address'
              name='email'
              type='email'
              placeholder=''
            />
            <MySelect label='Country' name='country'>
              <option value=''>Select a Country</option>
              <option value='USA'>USA</option>
              <option value='Germany'>Germany</option>
              <option value='France'>France</option>
              <option value='Bulgaria'>Bulgaria</option>
            </MySelect>

            <button type='submit' style={{ display: 'block', left: '40%' }}>
              Submit
            </button>
            <button
              onClick={() => history.push('/login')}
              style={{ display: 'block', left: '40%' }}
            >
              login
            </button>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default SignupForm;
