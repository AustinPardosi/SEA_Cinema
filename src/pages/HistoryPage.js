import React, { useState, useEffect } from "react";
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  arrayRemove
} from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../utils/firebase-config";
import TopNav from "../components/TopNav";
import styled from "styled-components";

const HistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const querySnapshot = await getDocs(collection(db, "transactions"));
      const transactionData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTransactions(transactionData);
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        setCurrentUserEmail(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleDeleteTransaction = async (transactionId) => {
    const transactionRef = doc(db, "transactions", transactionId);
    const transactionSnapshot = await getDoc(transactionRef);
  
    if (transactionSnapshot.exists()) {
      const transactionData = transactionSnapshot.data();
  
      if (transactionData.email === currentUserEmail) {
        await deleteDoc(transactionRef);
        setTransactions((prevTransactions) =>
          prevTransactions.filter(
            (transaction) => transaction.id !== transactionId
          )
        );
        toast.success("Transaction cancelled successfully");
  
        // Update balance in users collection
        const usersCollectionRef = collection(db, "users");
        const userQuerySnapshot = await getDocs(
          query(usersCollectionRef, where("email", "==", currentUserEmail))
        );
  
        if (!userQuerySnapshot.empty) {
          const userDocRef = userQuerySnapshot.docs[0].ref;
          const userDocSnapshot = await getDoc(userDocRef);
  
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const updatedBalance =
              userData.balance + transactionData.totalCost;
  
            await updateDoc(userDocRef, { balance: updatedBalance });
          }
        }
  
        // Remove seats from movie document
        const movieDocRef = doc(db, "movies", transactionData.movieTitle);
        const movieDocSnapshot = await getDoc(movieDocRef);
  
        if (movieDocSnapshot.exists()) {
          const movieData = movieDocSnapshot.data();
          const updatedSeats = movieData.seats.filter(
            (seat) => !transactionData.seats.includes(seat)
          );
  
          await updateDoc(movieDocRef, { seats: updatedSeats });
        }
      } else {
        toast.error("You are not authorized to cancel this transaction");
      }
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

  return (
    <HistoryContainer>
      <ToastContainer />
      <TopNav isScrolled={isScrolled} />
      <h1>History Page</h1>
      <BubbleWrapper>
        {transactions.map((transaction) => (
          <Bubble key={transaction.id}>
            <BubbleContent>
              <p>Email: {transaction.email}</p>
              <p>Movie Title: {transaction.movieTitle}</p>
              <p>Seats: {transaction.seats.join(", ")}</p>
              <p>Total Cost: {transaction.totalCost}</p>
            </BubbleContent>
            <BubbleAction>
              <CancelButton onClick={() => handleDeleteTransaction(transaction.id)}>
                Cancel
              </CancelButton>
            </BubbleAction>
          </Bubble>
        ))}
      </BubbleWrapper>
    </HistoryContainer>
  );
};

const HistoryContainer = styled.div`
  margin: 1rem;
  h1 {
    font-size: 50px;
    text-align: center;
    color: #e50914;
    margin-bottom: 1rem;
    margin-top: 6rem;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 30px;
      margin-top: 4rem;
    }
  }
`;

const BubbleWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  justify-items: center;
  margin-top: 2rem;
`;

const Bubble = styled.div`
  background-color: #f5f5f5;
  color: #000;
  padding: 1rem;
  margin: 1rem;
  border-radius: 20px;
  min-width: 300px;
`;

const BubbleContent = styled.div`
  p {
    margin: 0;
    margin-bottom: 0.5rem;
  }
`;

const BubbleAction = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  background-color: red;
  color: white;
  border-radius: 15%;
  width: 8vw;
  height: 4vh;
  font-size: 1rem;
`;

export default HistoryPage;
