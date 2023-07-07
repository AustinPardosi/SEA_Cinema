import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styled from "styled-components";
import { db } from "../utils/firebase-config";
import { firebaseAuth } from "../utils/firebase-config";
import TopNav from "../components/TopNav";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TheBalance() {
  const [balance, setBalance] = useState(null);
  const [customAmount, setCustomAmount] = useState("");

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

  const handleTopUp = async () => {
    const amount = parseInt(customAmount);
    if (!isNaN(amount) && amount > 0) {
      const newBalance = balance + amount;
      setBalance(newBalance);
      await updateBalanceInFirestore(newBalance);
      toast.success("Top Up successful");
      setCustomAmount("");
    }
  };

  const handleWithdrawal = async () => {
    if (balance !== null) {
      const amount = parseInt(customAmount);
      if (!isNaN(amount) && amount > 0) {
        if (amount > balance) {
          toast.error("Balance is not sufficient");
        } else {
          const newBalance = balance - amount;
          setBalance(newBalance);
          await updateBalanceInFirestore(newBalance);
          toast.success("Withdrawal successful");
        }
      } else {
        toast.error("Invalid amount");
      }
    }
  };

  const handleCustomAmountChange = (event) => {
    setCustomAmount(event.target.value);
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
          <button onClick={() => setCustomAmount("20000")}>Rp20,000</button>
          <button onClick={() => setCustomAmount("50000")}>Rp50,000</button>
          <button onClick={() => setCustomAmount("100000")}>Rp100,000</button>
          <button onClick={() => setCustomAmount("200000")}>Rp200,000</button>
          <button onClick={() => setCustomAmount("300000")}>Rp300,000</button>
          <button onClick={() => setCustomAmount("500000")}>Rp500,000</button>
        </div>
        <div className="CustomAmountContainer">
          <input
            type="number"
            value={customAmount}
            onChange={handleCustomAmountChange}
            placeholder="Custom Amount"
          />
        </div>
        <ButtonContainer>
          <button onClick={handleTopUp}>Top Up</button>
          <button onClick={handleWithdrawal}>Withdraw</button>
        </ButtonContainer>
      </div>
      <ToastContainer />
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
      margin-top: 3rem;
      margin-bottom: 2rem;

      button {
        border: none;
        border-radius: 30%;
        width: 100px;
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
    }

    .CustomAmountContainer {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;

      input {
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
        width: 160px;
        outline: none;
      }
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
  button{
    width: 100px;
    height: 30px;
    font-size: 15px;
  }
`;
