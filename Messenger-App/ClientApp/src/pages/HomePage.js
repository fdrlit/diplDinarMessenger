import React, { useEffect, useRef, useState } from 'react';
import MessageBar from '../components/MessageBar/MessageBar';
import './HomePage.scss';
import * as signalR from "@microsoft/signalr";
import SignalRComponent from '../components/SignalR/SignalRComponent';
import Cookies from 'js-cookie';
import config from '../config';
import { useLocation } from 'react-router-dom';
import MessagePage from '../components/MessagePage/MessagePage';

const HomePage = ({isDarkTheme, setIsDarkTheme }) => {
  const [conversationId, setConversationId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [selectedConversation, setSelectedConversation] = useState({conversationId: null, messageId: null });
  const [updateList, setUpdateList] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('interface-language') || 'ru');
  const messageBarRef = useRef();
  const [connection, setConnection] = useState();
  const URL = config.apiUrl;
  const token = Cookies.get('login-token');
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(URL + '/hub', { accessTokenFactory: () => token }) // Замените на URL вашего сервера SignalR
      .configureLogging(signalR.LogLevel.Information)
      .build();
    newConnection.start();
    setConnection(newConnection);
    const selectedConversationId = searchParams.get('sel');
    setSelectedConversation({conversationId: selectedConversationId, messageId: null});
  }, []);
  
  const handleConversationSelect = (_conversationId) => {
    setConversationId(_conversationId);
  }
  const handleSelectMessage = (message_id) => {
    setSelectedMessageId(message_id);
  }

  return (
    <div className={`Main ${windowWidth < 925 ? 'left-column-open left-column-shown' : ''}`}>
      <div className='background'></div>
      <MessageBar setSelectedConversation={setSelectedConversation} selectedConversation={selectedConversation} language={language} setLanguage={setLanguage} ref={messageBarRef} connection={connection} isDarkTheme={isDarkTheme}  updateList={updateList} setIsDarkTheme={setIsDarkTheme} handleSelectMessage={handleSelectMessage}/>
      <MessagePage language={language} selectedConversation={selectedConversation} selectedMessageId={selectedMessageId} connection={connection} setUpdateList={setUpdateList} updateList={updateList} />
    </div>
  );
}; 

export default HomePage;