import React, {useState, useEffect} from 'react'
import styled from 'styled-components';

import TopNav from "../components/TopNav";

const TvShow = () => {

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

  return (
  <TvShowsContainer>
    <TopNav isScrolled={isScrolled} />
    <h1>TV Shows</h1>
  </TvShowsContainer>
  )
}

const TvShowsContainer = styled.div`
  h1 {
    font-size: 50px;
    text-align: center;
    color: #e50914;
    margin-bottom: 1rem;
    margin-top: 6rem;
  }
`
export default TvShow