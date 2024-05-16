import axios from 'axios';
import Cookies from 'js-cookie';
import React, { Component, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import config from '../../config';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Home = () => {
  const URL = config.apiUrl;
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const emailConfirmed = searchParams.get('emailConfirmed');
  const [conversations, setConversations] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    if (!!emailConfirmed) {
      showToast("success", "Электронная почта успешно подтверждена!");
    }
    
  }, []);

  
  const showToast = (type, message) => {
    toast[type](message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div>
      <ToastContainer />
      <ul>
      </ul>
    </div>
  );
}
export default Home;