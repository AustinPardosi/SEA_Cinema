import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { db } from "../utils/firebase-config";
import { firebaseAuth } from "../utils/firebase-config";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const MoviePage = () => {
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

  const movies = [
    "Fast X",
    "John Wick: Chapter 4",
    "The Super Mario Bros. Movie",
    "Avatar: The Way of Water",
    "Guardians of the Galaxy Vol. 3",
    "Ant-Man and the Wasp: Quantumania",
    "The Pope's Exorcist",
    "To Catch a Killer",
    "Transformers: Age of Extinction",
    "Puss in Boots: The Last Wish",
    "Scream VI",
    "Black Adam",
    "Dungeons & Dragons: Honor Among Thieves",
    "Peter Pan & Wendy",
    "Spider-Man: No Way Home",
    "Black Panther: Wakanda Forever",
    "Transformers: The Last Knight",
    "Renfield",
    "Cocaine Bear",
    "Prey",
    "Fall",
    "Avatar",
    "Split",
    "Top Gun: Maverick",
    "Thor: Love and Thunder",
    "Sonic the Hedgehog 2",
    "Avengers: Infinity War",
    "The Whale",
    "The Batman",
    "Smile",
    "Encanto",
  ];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [balance, setBalance] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [allSeats, setAllSeats] = useState(Array(64).fill(false));
  const [initialSeats, setInitialSeats] = useState(Array(64).fill(true));
  const [movieAgeRating, setMovieAgeRating] = useState(0);

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

    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (selectedMovie) {
        try {
          const movieDocRef = doc(db, "movies", selectedMovie);
          const movieDocSnapshot = await getDoc(movieDocRef);
          if (movieDocSnapshot.exists()) {
            const movieData = movieDocSnapshot.data();
            setAllSeats(movieData.seats);
            setInitialSeats(movieData.seats);
            setMovieAgeRating(movieData.age_rating);
          }
        } catch (error) {
          console.log("Error fetching movie data:", error);
          toast.error("An error occurred. Please try again.");
        }
      }
    };

    fetchMovieData();
  }, [selectedMovie]);

  const handleSeatSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      if (!allSeats[seatNumber - 1]) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  const handleBooking = async () => {
    if (!selectedMovie) {
      toast.error("Please select a movie.");
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }
    if (selectedSeats.length > 6) {
      toast.error("You can book a maximum of 6 tickets in one transaction.");
      return;
    }
    if (age < movieAgeRating) {
      toast.error("You are not eligible to watch this movie.");
      return;
    }
    if (balance < calculateTotalCost()) {
      toast.error("Insufficient balance. Please top up your account.");
      return;
    }

    try {
      // Update the seats in the Firestore document
      const movieDocRef = doc(db, "movies", selectedMovie);
      await updateDoc(movieDocRef, {
        seats: arrayUnion(...selectedSeats),
      });

      const totalCost = calculateTotalCost();
      const newBalance = balance - totalCost;

      // Update the balance in the Firestore document
      const currentUser = firebaseAuth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { balance: newBalance });

        // Update the balance state
        setBalance(newBalance);

        // Mark the selected seats as booked
        setSelectedSeats([]);

        toast.success("Booking successful!");
      }
    } catch (error) {
      console.log("Error updating balance:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const calculateTotalCost = () => {
    const ticketPrice = 10;
    return selectedSeats.length * ticketPrice;
  };

  return (
    <MoviePageContainer>
      <TopNav isScrolled={isScrolled} />
      <div className="MovieContainer">
        <h1>MoviePage</h1>
        <div className="SeatSelection">
          <Select
            className="movieSelect"
            id="movie"
            value={selectedMovie}
            onChange={(option) => setSelectedMovie(option.value)}
            options={movies.map((movie) => ({ value: movie, label: movie }))}
            isClearable
            placeholder="Select a movie"
            styles={{
              control: (provided) => ({
                ...provided,
                width: 300,
                margin: "2rem auto",
              }),
            }}
          />
          {selectedMovie && (
            <>
              <h2>Seat Selection</h2>
              <div className="SeatGrid">
                {initialSeats.map((seat, index) => (
                  <div
                    key={index + 1}
                    className={`Seat ${
                      selectedSeats.includes(index + 1) ? "selected" : ""
                    } ${allSeats[index] ? "booked" : ""}`}
                    onClick={() => {
                      if (allSeats[index]) {
                        toast.error("The seat is already booked by someone else.");
                      } else {
                        handleSeatSelect(index + 1);
                      }
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

            </>
          )}
        </div>
        <div className="Form">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />

          <label htmlFor="age">Age:</label>
          <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} />

          <button onClick={handleBooking}>Book Tickets</button>
        </div>
        <Link to="/history" className="Link">
          View Transaction History
        </Link>
      </div>
      <ToastContainer />
    </MoviePageContainer>
  );
}

const MoviePageContainer = styled.div`
  .MovieContainer {
    color: black;
    margin-top: 6rem;
    text-align: center;

    h1 {
      font-size: 50px;
      color: #e50914;
      margin-bottom: 0.5rem;
    }
  }

  .Form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
    color: white;

    label {
      margin-top: 1rem;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    input {
      padding: 0.5rem;
      font-size: 16px;
      margin-bottom: 1rem;
    }

    button {
      padding: 0.5rem 1rem;
      font-size: 16px;
      background-color: #e50914;
      color: white;
      border: none;
      cursor: pointer;
    }
  }

  .SeatSelection {
    margin-top: 2rem;
    text-align: center;
    color: white;

    h2 {
      font-size: 24px;
      margin-bottom: 1rem;
    }
    .movieSelect{
      color: black;
      width: auto;
    }
    
  }

  .Link{
    margin-top: 1rem;
  }

  .SeatGrid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 10px;
    max-width: 400px;
    margin: 0 auto;
  }

  .Seat {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background-color: #f0f0f0;
    cursor: pointer;
    color: black;

    &.selected {
      background-color: green;
      color: white;
    }

    &.booked {
      background-color: red;
      color: white;
      cursor: not-allowed;
    }
  }

  .Error {
    color: red;
    margin-top: 0.5rem;
  }
`;

export default MoviePage;
