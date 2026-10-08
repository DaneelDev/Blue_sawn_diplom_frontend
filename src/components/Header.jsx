import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSvg from "../scss/assets/img/swan-logo.png";
import Button from "./Button";
import {Link} from "react-router-dom";
import { useSelector } from "react-redux";
import VerifyModal from '../components/VerifyModal'; 



function Header() {
  const { verificationConfirm } = useSelector((state) => state.verification || {});
  const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleProfileClick = () => {
        if (verificationConfirm) {
            navigate('/profile');
        } else {
            openModal();
        }
    };



  const {totalPrice, totalCount} = useSelector(({cart}) => cart)
    return  <div className="header">
    <div className="container">
      <Link to={"/"}>
      <div className="header__logo">
        <img width="38" src={logoSvg} alt="Product logo" />
        <div>
        <h1>BLUE SWAN</h1>
        <p>Мы верны нашим покупателям</p>
        </div>
      </div>
      </Link>
      
      <div className="header__cart">
      

        <Link to = {'/cart'}>
        <Button className="button--cart" >
                <span>{totalPrice} р</span>
                <div className="button__delimiter"></div>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.33333 16.3333C7.06971 16.3333 7.66667 15.7364 7.66667 15C7.66667 14.2636 7.06971 13.6667 6.33333 13.6667C5.59695 13.6667 5 14.2636 5 15C5 15.7364 5.59695 16.3333 6.33333 16.3333Z"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.3333 16.3333C15.0697 16.3333 15.6667 15.7364 15.6667 15C15.6667 14.2636 15.0697 13.6667 14.3333 13.6667C13.597 13.6667 13 14.2636 13 15C13 15.7364 13.597 16.3333 14.3333 16.3333Z"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.78002 4.99999H16.3334L15.2134 10.5933C15.1524 10.9003 14.9854 11.176 14.7417 11.3722C14.4979 11.5684 14.1929 11.6727 13.88 11.6667H6.83335C6.50781 11.6694 6.1925 11.553 5.94689 11.3393C5.70128 11.1256 5.54233 10.8295 5.50002 10.5067L4.48669 2.82666C4.44466 2.50615 4.28764 2.21182 4.04482 1.99844C3.80201 1.78505 3.48994 1.66715 3.16669 1.66666H1.66669"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{totalCount}</span>
            </Button></Link>
        
        
      </div>
        <Button className="button--profile" onClick={handleProfileClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path 
              fill="white" 
              stroke="white" 
              stroke-width="1"  
              fill-rule="evenodd" 
              clip-rule="evenodd" 
              transform="translate(2, 0)" 
              d="M8.5 6C8.5 4.067 10.067 2.5 12 2.5C13.933 2.5 15.5 4.067 15.5 6C15.5 7.933 13.933 9.5 12 9.5C10.067 9.5 8.5 7.933 8.5 6ZM12 1.5C9.51472 1.5 7.5 3.51472 7.5 6C7.5 8.48528 9.51472 10.5 12 10.5C14.4853 10.5 16.5 8.48528 16.5 6C16.5 3.51472 14.4853 1.5 12 1.5ZM4.5 19.5C4.5 17.5798 4.98043 16.0558 5.66603 15.0274C6.35605 13.9923 7.21867 13.5 8 13.5C8.88201 13.5 9.30025 13.7091 9.7689 13.9435L9.77639 13.9472C10.3047 14.2114 10.8867 14.5 12 14.5C13.1133 14.5 13.6953 14.2114 14.2236 13.9472L14.2311 13.9435C14.6997 13.7091 15.118 13.5 16 13.5C16.7813 13.5 17.6439 13.9923 18.334 15.0274C19.0196 16.0558 19.5 17.5798 19.5 19.5V20.5H4.5V19.5ZM8 12.5C6.78133 12.5 5.64395 13.2577 4.83397 14.4727C4.01957 15.6943 3.5 17.4203 3.5 19.5V21C3.5 21.2761 3.72386 21.5 4 21.5H20C20.2761 21.5 20.5 21.2761 20.5 21V19.5C20.5 17.4203 19.9804 15.6943 19.166 14.4727C18.3561 13.2577 17.2187 12.5 16 12.5C14.8867 12.5 14.3047 12.7886 13.7764 13.0528L13.7689 13.0565C13.3003 13.2909 12.882 13.5 12 13.5C11.118 13.5 10.6997 13.2909 10.2311 13.0565L10.2236 13.0528C9.69531 12.7886 9.11329 12.5 8 12.5Z">
            </path>
          </svg>

        </Button>
        <VerifyModal isOpen={isModalOpen} onRequestClose={closeModal} />
    </div>
  </div>
}

export default Header;