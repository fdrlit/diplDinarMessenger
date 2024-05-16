import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../../config';
import Cookies from 'js-cookie';
import { formatLastOnline } from '../../../middleware/dateFormat';
import { IoMdArrowRoundBack } from "react-icons/io";
const MiddleColumnHeader = ({ selectedConversationId, language }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [lastOnlineDate, setLastOnlineDate] = useState();
    const [isOnline, setIsOnline] = useState(false);
    const [userName, setUserName] = useState();
    const URL = config.apiUrl;
    const translates = {
      'savedMessages': {
        'ru': 'Избранное',
        'en': 'Saved Messages',
        'tt': 'Сакланган хәбәрләр'
      }
    }
    const token = Cookies.get('login-token');
    useEffect(() => {
      if (!selectedConversationId) return;
      axios.get(URL + '/api/message/lastOnlineDate?userId=' + selectedConversationId, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        const data = response.data;
        setIsOnline(data.self ? null : data.isOnline);
        setLastOnlineDate(data.self ? null : formatLastOnline(new Date(data.lastOnlineDate), language));
        setUserName(data.self 
          ? translates.savedMessages[language] 
          : (data.firstName || data.lastName ? `${data.firstName} ${data.lastName}` : data.userName));
      })
      .catch((error) => {
        console.error(error);
      });
    }, [selectedConversationId, language]);
    const handleBackClick = () => {
      var mainElements = document.getElementsByClassName("Main");
      for (var i = 0; i < mainElements.length; i++) {
        var element = mainElements[i];
        if (element.classList.contains("left-column-open")) {
          element.classList.remove("left-column-open");
        } else {
          element.classList.add("left-column-open");
        }
      }
    }
    return (
        <div className='MiddleHeader'>
          <div className='Transition'>
            <div className='Transition_slide Transition_slide-active'>
              {windowWidth < 925 && <div className="back-button">
                <button onClick={handleBackClick} type="button" className="Button smaller translucent round" aria-label="Back" title="Back">
                  <IoMdArrowRoundBack className="animated-close-icon state-back" />
                </button>
              </div>}
              <div className='chat-info-wrapper'>
                <div className='ChatInfo'>
                  <div className='info'>
                    <div className='title'>
                      <h3 dir='auto' role='button' className='fullName'>{userName}</h3>
                    </div>
                    {!isOnline && !!lastOnlineDate && <span className='status'>{lastOnlineDate}</span>}
                    {!!isOnline && <span className='status status-online'>online</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}
export default MiddleColumnHeader;
