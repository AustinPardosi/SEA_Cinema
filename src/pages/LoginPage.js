import React, { useState } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import { css } from "@emotion/react";
import { BeatLoader } from "react-spinners";

import styled from "styled-components";
import Header from "../components/Header";
import BackgroundImage from "../components/BackgroundImage";
import { firebaseAuth } from "../utils/firebase-config";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      await signInWithEmailAndPassword(firebaseAuth, email, password);

      setIsLoading(false);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
      toast.error("Invalid credentials. Please check your email and password.");
      setIsLoading(false);
    }
  };

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) navigate("/");
  });

  const override = css`
    display: block;
    margin: 0 auto;
  `;

  return (
    <Wrappper>
      <ToastContainer />
      <BackgroundImage />
      <div className="loginContent">
        <Header />
        <div className="form-wrapper">
          <div className="form">
            <div className="title">
              <h1>Login</h1>
            </div>
            <div className="container">
              <input
                type="email"
                placeholder="Email or phone number"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button onClick={handleLogin}>
                {isLoading ? (
                  <BeatLoader color="#ffffff" size={10} css={override} />
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal or popup */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Login Success"
      >
        <h2>Login Success!</h2>
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </Modal>
    </Wrappper>
  );
};

const Wrappper = styled.div`
  position: relative;
  .loginContent {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100vh;
    width: 100vw;
    grid-template-columns: 15vh 80vh;
    .form-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      height: 85vh;
    }
    .form {
      display: flex;
      flex-direction: column;
      align-items: left;
      justify-content: center;
      gap: 2rem;
      background-color: rgba(0, 0, 0, 0.67);
      padding: 3rem;
      color: white;
      border-radius: 0.4rem;
      

      .container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        input {
          border-radius: 0.4rem;
          padding: 0.5rem 1rem;
          width: 25rem;
          height: 2.4rem;
          outline: none;
        }
        button {
          padding: 0.5rem;
          background-color: red;
          border: none;
          cursor: pointer;
          border-radius: 0.4rem;
          height: 3.4rem;
          color: white;
          font-weight: bolder;
          font-size: 1.05rem;
        }
      }
    }
  }
`;

export default LoginPage;
