import React, {useState, useEffect} from 'react'
import styled from 'styled-components';

import TopNav from "../components/TopNav";

const MyListPage = () => {

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
  <MyListPagesContainer>
    <TopNav isScrolled={isScrolled} />
    <h1>My List</h1>
  </MyListPagesContainer>
  )
}

const MyListPagesContainer = styled.div`
  h1 {
    font-size: 50px;
    text-align: center;
    color: #e50914;
    margin-bottom: 1rem;
    margin-top: 6rem;
  }
`
export default MyListPage