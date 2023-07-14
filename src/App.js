import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Player from "./pages/Player";
import TvShow from "./pages/TvShow";
import Netflix from "./pages/Netflix";
import MoviePage from "./pages/MoviePage";
import MyListPage from "./pages/MyListPage";
import ReviewPage from "./pages/ReviewPage";
import TheBalancePage from "./pages/TheBalancePage";
import HistoryPage from "./pages/HistoryPage";
import BackgroundImage from "./components/BackgroundImage";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/signup" element={<SignUpPage />} />
        <Route exact path="/player" element={<Player />} />
        <Route exact path="/tv" element={<TvShow />} />
        <Route exact path="/" element={<Netflix />} />
        <Route exact path="/movies" element={<MoviePage />} />
        <Route exact path="/mylist" element={<MyListPage />} />
        <Route exact path="/review" element={<ReviewPage />} />
        <Route exact path="/balance" element={<TheBalancePage />} />
        <Route exact path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
