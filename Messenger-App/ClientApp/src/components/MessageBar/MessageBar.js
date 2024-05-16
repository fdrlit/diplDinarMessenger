import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './MessageBar.scss'
import config from '../../config';
import { AiOutlineMenu } from "react-icons/ai";
import MessageBarMenu from './MessageBarMenu/MessageBarMenu';
import { MdSearch } from "react-icons/md";
import { IoChevronForwardOutline } from "react-icons/io5";
import LeftMainHeader from './LeftMainHeader/LeftMainHeader';
import { formatDate } from '../../middleware/dateFormat';
import SearchBar from './SearchBar/SearchBar';
import Avatar from '../Avatar/Avatar';
import ChangeLanguage from './ChangeLanguage/ChangeLanguage';
import AccountDetails from './AccountDetails/AccountDetails';
import Settings from './Settings/Settings';

const MessageBar = ({ isDarkTheme, setIsDarkTheme, handleSelectMessage, updateList, language, setLanguage, setSelectedConversation, connection }) => {
  const URL = config.apiUrl;
  const FILESERVERURL = config.fileServerUrl;
  const [transitionSlideClass, setTransitionSlideClass] = useState('Transition_slide-active');
  const [searchTransitionSlideClass, setSearchTransitionSlideClass] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [changeLanguageOpened, setChangeLanguageOpened] = useState(false);
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedConversationId = searchParams.get('sel');
  const [isResizing, setIsResizing] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [width, setWidth] = useState(() => {
    const storedWidth = localStorage.getItem('message-bar-width');
    return storedWidth ? parseInt(storedWidth) : 400; // начальная ширина вашего resizable div
  });
  const translates = {
    'savedMessages': {
      'ru': 'Избранное',
      'en': 'Saved Messages',
      'tt': 'Сакланган хәбәрләр'
    }
  }
  useEffect(() => {
    localStorage.setItem('message-bar-width', width.toString());
  }, [width]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizing) return;
      if (e.clientX > 185 && e.clientX < 800)
        setWidth(e.clientX);
    };

    const onMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isResizing]);
  useEffect(() => {
    if (!!selectedItem) {
      setSettingsOpened(true);
    }
  }, [selectedItem]);
  const [conversations, setConversations] = useState();
  const navigate = useNavigate();

  const updateMessages = async () => {
      const token = Cookies.get('login-token');
      if (token) {
        axios.get(URL + '/api/message/user-conversations-with-last-message', {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
        })
        .then((response) => {
          setConversations(response.data);
        })
        .catch((error) => console.error(error));
      } else {
        navigate('/login');
      }
  }

  useEffect(() => {
    updateMessages();
  }, []);

  useEffect(() => {
    if (!!connection) {
      connection.off('updateMessages');
      connection.on('updateMessages', (convId) => {
        updateMessages();
      });
    }
  }, [connection]);
  
  useEffect(() => {
    updateMessages();
  }, [updateList]);
  
  const hideSettings = () => {
    setSettingsOpened(false);
    setSelectedItem('');
    setSearchText(''); 
    setTransitionSlideClass('Transition_slide-to');
    setTimeout(() => setTransitionSlideClass('Transition_slide-active'), 200);
  }
  const showSettings = () => {
    setSettingsOpened(true);
    setTransitionSlideClass('Transition_slide-from');
    setTimeout(() => setTransitionSlideClass('Transition_slide-inactive'), 200);
  }
  const handleUserClick = (user_id) => {
    setSelectedConversation({conversationId: user_id, messageId: null});
    var mainElements = document.getElementsByClassName("Main");
    for (var i = 0; i < mainElements.length; i++) {
      var element = mainElements[i];
      if (element.classList.contains("left-column-open")) {
        element.classList.remove("left-column-open");
      } else {
        element.classList.add("left-column-open");
      }
    }
    let conversationList = conversations;
    conversations.map(x => {
      if (x.UserId == user_id)
        x.UnreadCount = 0;
    })
    setConversations(conversations);
  }
  
  return (
    <div className='message-bar-container' style={{ width: windowWidth > 925 ? `${width}px` : 'auto'}}>
      <div onMouseDown={handleMouseDown} className="resize-handle" style={{left: (width-4) + 'px'}} ></div>
      <LeftMainHeader selectedItem={selectedItem} language={language} setSelectedItem={setSelectedItem} isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} showSettings={showSettings} settingsOpened={settingsOpened} setSettingsOpened={setSettingsOpened} hideSettings={hideSettings} searchText={searchText} setSearchText={setSearchText}/>
      <div className='Transition transition-left-column'>
        <div className={`chat-folders Transition_slide ${transitionSlideClass}`}>
          {!!conversations && conversations.map((conversation, index) => (
            <div className={'chat listItem ' + (selectedConversationId === conversation.UserId ? 'selected' : '')} style={{top: 72*(index) + 'px'}} key={conversation.UserId} id={conversation.UserId}>
              <Link className='listItem-button ' onClick={() => handleUserClick(conversation.UserId)} to={`/im?sel=${conversation.UserId}`}> 
              {/* href={"/im?sel=" + conversation.UserId} */}
                {/* avatar */}
                <div className='status status-clickable'>
                  <Avatar img_url={conversation.Self ? null : conversation.AvatarUrl ? `${FILESERVERURL}/getImage?fileHash=${conversation.AvatarUrl}&width=150&height=150` : null} userName={conversation.Self ? translates.savedMessages[language] : conversation.UserName}/>
                  <div className="avatar-badge-wrapper">
                    <div className={`avatar-online ${!conversation.Self && conversation.isOnline ? 'avatar-online-shown' : ''}`}></div>
                  </div>
                </div>
                <div className='info'>
                  <div className="info-row">
                    <div className="title">
                      <div dir="auto" role="button" className="fullName">{conversation.Self ? translates.savedMessages[language] : (conversation.FirstName || conversation.LastName 
            ? `${conversation.FirstName} ${conversation.LastName}`
            : conversation.UserName)}</div>
                    </div>
                    <div className='separator'></div>
                    <div className='last-message-meta'>
                      <span className="time">{formatDate(new Date(Date.parse(conversation.LastMessage.CreateDate)), language)}</span>
                    </div>
                  </div>
                  <div className='subtitle'>
                    <p className="last-message shared-canvas-container" dir="ltr">
                      <span>
                        {conversation.LastMessage.Text}
                      </span>
                    </p>
                    {conversation.UnreadCount != 0 && 
                      <div className='ChatBadge-transition open shown'>
                        <div className='ChatBadge unread'>
                          {conversation.UnreadCount}
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        {selectedItem == 'changeLanguage' && <ChangeLanguage language={language} setLanguage={setLanguage} transitionSlideClass={'Transition_slide-active'}/>}
        {selectedItem == 'accountDetails' && <AccountDetails language={language} transitionSlideClass={searchTransitionSlideClass}/>}
        {selectedItem == 'settings' && <Settings language={language} transitionSlideClass={searchTransitionSlideClass}/>}
        {settingsOpened && <SearchBar setSelectedConversation={setSelectedConversation} language={language} handleSelectMessage={handleSelectMessage} hideSettings={hideSettings} searchText={searchText} transitionSlideClass={searchTransitionSlideClass} />}
      </div>
    </div>
  );
}
export default MessageBar;