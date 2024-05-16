import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import config from './config';
import EmailConfirm from './components/EmailConfirm/EmailConfirm';
import Sidebar from './components/Sidebar/Sidebar';
import './styles/dark-theme.scss';
import './styles/light-theme.scss';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const URL = config.apiUrl;

  const [authenticated, setAuthenticated] = useState();
  const [emailConfirmed, setEmailConfirmed] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    let darkThemeEnabled =  localStorage.getItem('dark-theme-enabled');
    return !!darkThemeEnabled ? darkThemeEnabled == "true" : false;
  });
  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname == '')
      navigate('/home')

    // var darkTheme = Cookies.get('darkTheme');
  });

  const validateToken = async () => {
    const token = Cookies.get('login-token');

    if (token) {
      try {
        let response = await axios.get(URL + '/api/tokenvalidation/validate', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        setAuthenticated(true);
        try {
          response = await axios.get(URL + '/api/emailconfirm/isEmailConfirmed', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          setEmailConfirmed(response.data.emailConfirmed);
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        if (!config.allowAnonymous.includes(location.pathname)) {
          navigate('/login');
        }
        setAuthenticated(false);
      }
    
    } else {
      if (!config.allowAnonymous.includes(location.pathname)) {
        navigate('/login');
      }
      setAuthenticated(false);
    }
  } 
  useEffect(() => {
    validateToken();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //       const token = Cookies.get('login-token');
  //       if (token) {
  //               try {
  //                   let response = await axios.get(URL + '/api/tokenvalidation/validate', {
  //                       headers: {
  //                           'Content-Type': 'application/json',
  //                           'Authorization': `Bearer ${token}`
  //                       },
  //                   });
  //                   navigate('/home');
  //               } catch (error) {
  //                   navigate('/login');
  //               }
  //       } else {
  //         navigate('/login');
  //       }
  //   }

  //   fetchData();
  //   }, []);

  return (
    <div className={`private-route ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      {authenticated && !emailConfirmed && <EmailConfirm />}
      {/* {authenticated && <Sidebar />} */}
      {React.cloneElement(children, {
        onLogin: validateToken,
        isDarkTheme: isDarkTheme,
        setIsDarkTheme: setIsDarkTheme
      })}
    </div>
  );
};

export default PrivateRoute;