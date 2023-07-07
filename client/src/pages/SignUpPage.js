import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styled from "styled-components";
import { db } from "../utils/firebase-config";
import { firebaseAuth } from "../utils/firebase-config";
import TopNav from "../components/TopNav";

export default function TheBalance() {
  const [balance, setBalance] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      const currentUser = firebaseAuth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const userBalance = userData.balance;
          setBalance(userBalance);
        }
      }
    };

    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        fetchBalance();
      }
    });
  }, []);

  const handleTopUp = async (amount) => {
    if (balance !== null) {
      const newBalance = balance + amount;
      setBalance(newBalance);
      await updateBalanceInFirestore(newBalance);
      setToastMessage("Top Up successful");
    }
  };

  const handleWithdrawal = async () => {
    if (balance !== null) {
      const maxWithdrawal = Math.min(balance, 500000);
      const newBalance = balance - maxWithdrawal;
      setBalance(newBalance);
      await updateBalanceInFirestore(newBalance);
      setToastMessage("Withdrawal successful");
    }
  };

  const handleCustomAmountChange = (event) => {
    setCustomAmount(event.target.value);
  };

  const handleCustomTopUp = async () => {
    const amount = parseInt(customAmount);
    if (!isNaN(amount) && amount > 0) {
      await handleTopUp(amount);
      setCustomAmount("");
    }
  };

  const updateBalanceInFirestore = async (newBalance) => {
    const currentUser = firebaseAuth.currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { balance: newBalance });
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (toastMessage !== "") {
      const timeout = setTimeout(() => {
        setToastMessage("");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [toastMessage]);

  if (balance === null) {
    return null; // Menampilkan loading state jika saldo belum diambil
  }

  return (
    <BalanceContainer>
      <TopNav isScrolled={isScrolled} />
      <div className="MoneyContainer">
        <h1>The Balance</h1>
        <h3>Current Balance: {balance} Rupiah</h3>
        <div className="BubbleContainer">
          <button onClick={() => handleTopUp(20000)}>20,000</button>
          <button onClick={() => handleTopUp(50000)}>50,000</button>
          <button onClick={() => handleTopUp(100000)}>100,000</button>
          <button onClick={() => handleTopUp(200000)}>200,000</button>
          <button onClick={() => handleTopUp(300000)}>300,000</button>
          <button onClick={() => handleTopUp(500000)}>500,000</button>
          <div className="CustomAmountContainer">
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Custom Amount"
            />
            <button onClick={handleCustomTopUp}>Top Up</button>
          </div>
        </div>
        <button onClick={handleWithdrawal}>Withdraw</button>
      </div>
      {toastMessage && <Toast>{toastMessage}</Toast>}
    </BalanceContainer>
  );
}

const BalanceContainer = styled.div`
  color: white;
  .MoneyContainer {
    margin-top: 6rem;
    h1 {
      text-align: center;
      font-size: 50px;
      color: #e50914;
      margin-bottom: 0.5rem;
    }
    h3 {
      text-align: center;
    }
    .BubbleContainer {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;

      button {
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        background-color: #e50914;
        color: white;
        font-size: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        outline: none;

        &:hover {
          background-color: #cc0810;
        }
      }

      .CustomAmountContainer {
        display: flex;
        gap: 1rem;

        input {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
          width: 120px;
          outline: none;
        }
      }
    }
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 9999;
`;
