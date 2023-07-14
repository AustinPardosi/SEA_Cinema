import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { db } from '../utils/firebase-config';
import TopNav from "../components/TopNav";

const ReviewPage = () => {
  const [inputValues, setInputValues] = useState({
    title: "",
    year: "",
    stars: "",
  });

  const [editIndex, setEditIndex] = useState(-1);
  const [reviews, setReviews] = useState([]);

  const handleInputChange = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const handleAddReview = async () => {
    const { title, year, stars } = inputValues;
    if (title.trim() !== "" && year.trim() !== "" && stars.trim() !== "") {
      if (editIndex === -1) {
        // Add new review to Firestore
        const newReview = {
          title: title,
          year: year,
          stars: stars,
        };
        await addDoc(collection(db, "reviews"), newReview);
      } else {
        // Update existing review in Firestore
        const reviewToUpdate = reviews[editIndex];
        const reviewRef = doc(db, "reviews", reviewToUpdate.id);
        await updateDoc(reviewRef, {
          title: title,
          year: year,
          stars: stars,
        });
        setEditIndex(-1); // Reset editIndex after update
      }
      setInputValues({ title: "", year: "", stars: "" });

      // Fetch updated reviews from Firestore
      const data = await getDocs(collection(db, "reviews"));
      setReviews(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    toast.success("Review added successfully");
  };

  const handleDeleteReview = async (index) => {
    const reviewToDelete = reviews[index];
    const reviewRef = doc(db, "reviews", reviewToDelete.id);
    await deleteDoc(reviewRef);

    // Fetch updated reviews from Firestore
    const data = await getDocs(collection(db, "reviews"));
    setReviews(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    toast.success("Review deleted successfully");
  };

  const handleEditReview = (index) => {
    const reviewToEdit = reviews[index];
    setInputValues({
      title: reviewToEdit.title,
      year: reviewToEdit.year,
      stars: reviewToEdit.stars,
    });
    setEditIndex(index);
  };

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const getReviews = async () => {
      const data = await getDocs(collection(db, "reviews"));
      setReviews(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getReviews();
  }, []);

  return (
    <ReviewContainer>
      <ToastContainer />
      <TopNav isScrolled={isScrolled} />
      <h1>Movie Reviews</h1>
      <InputContainer>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={inputValues.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="year"
          placeholder="Year"
          value={inputValues.year}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="stars"
          placeholder="Stars"
          value={inputValues.stars}
          onChange={handleInputChange}
        />
        {editIndex === -1 ? (
          <button onClick={handleAddReview}>Add Review</button>
        ) : (
          <button onClick={handleAddReview}>Update Review</button>
        )}
      </InputContainer>
      <ReviewsWrapper>
        {reviews.map((review, index) => (
          <Bubble key={index}>
            <BubbleContent>
              <BubbleTitle>{review.title}</BubbleTitle>
              <BubbleDetails>
                <p>Year: {review.year}</p>
                <p>Stars: {review.stars}</p>
              </BubbleDetails>
            </BubbleContent>
            <BubbleActions>
              <ActionButton onClick={() => handleEditReview(index)}>
                <FaEdit />
              </ActionButton>
              <ActionButton onClick={() => handleDeleteReview(index)}>
                <FaTrash />
              </ActionButton>
            </BubbleActions>
          </Bubble>
        ))}
      </ReviewsWrapper>
    </ReviewContainer>
  );
};

const ReviewContainer = styled.div`
  margin: 1rem;
  h1 {
    font-size: 50px;
    text-align: center;
    color: #e50914;
    margin-bottom: 1rem;
    margin-top: 6rem;
  }
`;

const ReviewsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 2rem;
  flex-direction: column;
`;

const Bubble = styled.div`
  background-color: #f5f5f5;
  color: #000;
  padding: 1rem;
  margin: 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  min-width: 500px; /* Atur panjang yang diinginkan */
`;

const BubbleContent = styled.div`
  flex: 1;
`;

const BubbleTitle = styled.h3`
  margin: 0;
  color: #000;
`;

const BubbleDetails = styled.div`
  p {
    margin: 0;
  }
`;

const BubbleActions = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButton = styled.button`
  margin-right: 0.5rem;
  background-color: #e50914;
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  border: none;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 23rem;
  background-color: #333;
  padding: 1rem;
  border-radius: 5px;

  input {
    margin-right: 1rem;
    padding: 0.5rem;
    border-radius: 5px;
    border: none;
  }

  button {
    background-color: #e50914;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: none;
  }
`;

export default ReviewPage;
