import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './EmailConfirm.scss';
import config from '../../config';
import Cookies from 'js-cookie';
import Alert from 'react-bootstrap/Alert';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const EmailConfirm = () => {
  const clientUrl = config.clientUrl;
  const apiUrl = config.apiUrl;
  const token = Cookies.get('login-token');
  const [emailSent, setEmailSent] = useState(false);

  const handleButtonClick = async () => {
    try {
      const response = await axios.post(apiUrl + '/api/EmailConfirm/resend', 
      {
        'successCallbackUrl': clientUrl + '/im?emailConfirmed=true',
        'errorCallbackUrl':  clientUrl + '/error'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      });
      showToast("success", "Письмо успешно отправлено");
    } catch (error) {
      showToast("error", "Произошла ошибка! Попробуйте позднее");
    }
  };

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
    <div className="email-confirm-container">
      <ToastContainer />
      <div className="red-bar">
        <div className="confirmation-message">
          <div>Необходимо подтвердить адрес электронной почты!</div>
          <Button className='email-confirm-button' onClick={handleButtonClick} variant="outline-danger">Подтвердить</Button>
        </div>
      </div>
    </div>
  );
}

export default EmailConfirm;
