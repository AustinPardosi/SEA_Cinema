import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TopNav from "../components/TopNav";

const HistoryPage = () => {
  const [transactions, setTransactions] = useState([]);

  const cancelTransaction = (transactionId) => {
    // Find the transaction by its ID and remove it from the transactions array
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== transactionId);
    setTransactions(updatedTransactions);
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
    <HistoryPageContainer>
      <TopNav isScrolled={isScrolled} />
      <div className="HistoryContainer">
        <h1>Transaction History</h1>
        {transactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Booker</th>
                <th>Movie Title</th>
                <th>Seat Numbers</th>
                <th>Total Cost</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.booker}</td>
                  <td>{transaction.movieTitle}</td>
                  <td>{transaction.seatNumbers.join(", ")}</td>
                  <td>{transaction.totalCost}</td>
                  <td>
                    <button onClick={() => cancelTransaction(transaction.id)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </HistoryPageContainer>
  );
};

const HistoryPageContainer = styled.div`
  .HistoryContainer {
    color: white;
    margin-top: 6rem;
    h1 {
      text-align: center;
      font-size: 50px;
      color: #e50914;
      margin-bottom: 1rem;
    }
    p {
      text-align: center;
    }
    table {
      margin: 0 auto;
      border-collapse: collapse;
      width: 80%;
      th,
      td {
        padding: 8px;
        text-align: center;
        border-bottom: 1px solid #ddd;
      }
      th {
        background-color: #f2f2f2;
      }
      button {
        padding: 4px 8px;
        background-color: #e50914;
        color: white;
        border: none;
        cursor: pointer;
      }
    }
  }
`;

export default HistoryPage;
