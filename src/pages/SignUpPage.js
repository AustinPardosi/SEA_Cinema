import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth, db } from '../utils/firebase-config';
import Header from '../components/Header';
import BackgroundImage from '../components/BackgroundImage';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', password: '', name: '', age: '' });
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) navigate('/');
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignUp = async () => {
    try {
      const { email, password } = formValues;
      setIsSigningUp(true);
      const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password);

      // Save user data in Firestore
      const userRef = db.collection('users').doc(user.uid);
      await userRef.set({
        uid: user.uid,
        email: formValues.email,
        name: formValues.name,
        age: formValues.age,
        balance: 0,
      });

      navigate('/');
    } catch (error) {
      console.log(error);
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container showPassword={showPassword}>
      <BackgroundImage />
      <div className='content'>
        <Header login />
        <div className='body'>
          <div className='text'>
            <h1>Unlimited movies, TV shows, and more</h1>
            <p>Watch anywhere. Cancel anytime.</p>
            <h8>Ready to watch? Enter your email to create or restart membership</h8>
          </div>
          <div className='form'>
            {showPassword ? (
              <>
                <input
                  type='password'
                  placeholder='Password'
                  name='password'
                  value={formValues.password}
                  onChange={handleInputChange}
                />
                <input
                  type='text'
                  placeholder='Name'
                  name='name'
                  value={formValues.name}
                  onChange={handleInputChange}
                />
                <input
                  type='number'
                  placeholder='Age'
                  name='age'
                  value={formValues.age}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <input
                type='email'
                placeholder='Email address'
                name='email'
                value={formValues.email}
                onChange={handleInputChange}
              />
            )}
            {!showPassword ? (
              <button onClick={() => setShowPassword(true)}>Get Started {'>'}</button>
            ) : (
              <button className={isSigningUp ? 'loading' : ''} onClick={handleSignUp}>
                {isSigningUp ? 'Signing Up...' : 'Sign Up'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  position: relative;

  .content {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    height: 100vh;
    width: 100vw;
    grid-template-columns: 15vh 80vh;

    .body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .text {
      display: flex;
      flex-direction: column;
      text-align: center;
      font-size: 1.75rem;
      color: white;
    }

    h1 {
      padding: 8rem 0rem 0rem 0rem;
    }

    p {
      margin-top: 0.5rem;
    }

    h8 {
      margin-top: -0.5rem;
      margin-bottom: 1rem;
      font-size: 1.5ch;
    }
  }

  .form {
    display: grid;
    width: 60%;
    grid-template-columns: ${({ showPassword }) => (showPassword ? '1fr 1fr' : '2fr 1fr')};

    input {
      color: black;
      padding: 1.5rem 10.5rem 1.5rem 1.5rem;
      font-size: 1.2rem;
      &:focus {
        outline: none;
      }
      border-radius: 10px;
      height: 1rem;
      width: 25rem;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: red;
      border: none;
      cursor: pointer;
      color: white;
      font-size: 1.5rem;
      font-weight: bolder;
      width: 10rem;
      border-radius: 10px;
      width: 13rem;
      height: 4rem;

      &.loading {
        position: relative;

        &:after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          border: 0.5rem solid rgba(255, 255, 255, 0.2);
          border-top-color: #ffffff;
          animation: spin 1s infinite linear;
        }
      }
    }
  }

  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

export default SignUpPage;
