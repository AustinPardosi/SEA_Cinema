import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { firebaseAuth } from "../utils/firebase-config";

import { onAuthStateChanged, signOut } from "firebase/auth";

const TopNav = ({ isScrolled }) => {
  const navlinks = [
    { name: "Home", link: "/" },
    // { name: "TV Shows", link: "/tv" },
    { name: "Balance", link: "/balance" },
    { name: "Movies", link: "/movies" },
    // { name: "My List", link: "/mylist" },
    { name: "Review", link: "/review" },
  ];

  const navigate = useNavigate();
  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (!currentUser) navigate('/login');
  });

  return (
    <NavContainer>
      <nav className={`${isScrolled ? "scrolled" : "notScrolled"}`}>
        <div className="leftSide">
          <div className="logo">
            <img
              src="https://res.cloudinary.com/dxdclqs4g/image/upload/v1689189426/IMG_2103-removebg-preview_uha2zp.png"
              alt="logo"
            />
          </div>
          <ul className="links">
            {navlinks.map(({ name, link }) => {
              return (
                <li key={name}>
                  <Link to={link}>{name}</Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rightSide">
          <button onClick={() => signOut(firebaseAuth)}>
            <AiOutlineLogout />
          </button>
        </div>
      </nav>
    </NavContainer>
  );
};

const NavContainer = styled.div`
  .notScrolled {
    display: flex;
  }
  .scrolled {
    display: flex;
    background-color: black;
  }
  nav {
    position: sticky;
    top: 0;
    height: 6rem;
    width: 100%;
    justify-content: space-between;
    position: fixed;
    z-index: 2;
    padding: 0.4rem;
    align-items: center;
    transition: 0.3s ease-in-out;
    .leftSide {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-left: 5rem;
      .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        transform: scale(1.5);
      }
      img {
        width: 10rem;
        height: 2rem;
      }
      .links {
        display: flex;
        margin-left: 2rem;
        list-style-type: none;
        gap: 3rem;
        li {
          a {
            color: white;
            text-decoration: none;
            transition: 0.3s ease-in-out;
            &:hover {
              color: red;
            }
          }
        }
      }
    }
    .rightSide {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-right: 1rem;
      button {
        background-color: red;
        border: none;
        cursor: pointer;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      svg {
        color: white;
        font-size: 2rem;
      }
    }
  }

  @media (max-width: 768px) {
    nav {
      padding: 0.4rem 1rem;
      .leftSide {
        margin-left: 2rem;
        .logo {
          transform: scale(1);
        }
        .links {
          margin-left: 1rem;
          li {
            a {
              font-size: 0.8rem;
            }
          }
        }
      }
      .rightSide {
        margin-right: 0.5rem;
        button {
          width: 2.5rem;
          height: 2.5rem;
        }
        svg {
          font-size: 1.5rem;
        }
      }
    }
  }
`;

export default TopNav;
