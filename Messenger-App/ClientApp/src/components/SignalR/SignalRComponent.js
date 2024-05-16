import React, { useState, useEffect } from 'react';
import * as signalR from "@microsoft/signalr";
import config from '../../config';
import axios from 'axios';
import Cookies from 'js-cookie';

function SignalRComponent({ setUpdateList, selectedConversationId, updateList, receiveMessages }) {
  const [connection, setConnection] = useState(null);
  const URL = config.apiUrl;
  const token = Cookies.get('login-token');
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(URL + '/hub', { accessTokenFactory: () => token }) // Замените на URL вашего сервера SignalR
      .configureLogging(signalR.LogLevel.Information)
      .build();
    console.log(newConnection);
    setConnection(newConnection);
  }, []);
  
  useEffect(() => {
    if (connection && connection.state === signalR.HubConnectionState.Disconnected) {
      connection.start().then(() => {
        connection.on('messageReceived', () => {
          // receiveMessages();
          setUpdateList(!updateList);
        });
      }).catch(err => console.error(err));
    }
  }, [connection]);

  return () => {
    connection.off('messageReceived');
  }; // Мы не отображаем компонент, поскольку он просто устанавливает соединение и слушает сообщения
}

export default SignalRComponent;