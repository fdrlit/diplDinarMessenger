import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import SignalRComponent from '../SignalR/SignalRComponent';
import MiddleColumnFooter from './MiddleColumnFooter/MiddleColumnFooter';
import MiddleColumnHeader from './MiddleColumnHeader/MiddleColumnHeader';
import { isLink } from '../../searchDomains';
import { FaRegHandPointDown } from "react-icons/fa";
import { formatDateDay } from '../../middleware/dateFormat';
import './MessageList.scss';
import config from '../../config';
import { useLocation } from 'react-router-dom';
import MessageList from './MessageList/MessageList';
import ModalDialog from '../ModalDialog/ModalDialog';

const MessagePage = ({ setUpdateList, updateList, connection, language, selectedConversation }) => {
  const location = useLocation();
  const token = Cookies.get('login-token');
  const URL = config.apiUrl;
  
  const [prevSelectedConversationId, setPrevSelectedConversationId] = useState();
  const [replyMessage, setReplyMessage] = useState();
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(null);
  const [offsetSt, setOffsetSt] = useState(30);
  const [messagesUpdated, setMessagesUpdated] = useState(false);
  const messagesEndRef = useRef(null);
  const unreadStatusRef = useRef(null);
  const [dragOverOpened, setDragOverOpened] = useState(false);
  const [cursorIndex, setCursorIndex] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const messagesRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [messagesCount, setMessagesCount] = useState(30);
  const [scrolled, setScrolled] = useState(false);
  const [removedMessagesCount, setRemovedMessagesCount] = useState(0);
  const [addedFiles, setAddedFiles] = useState([]);
  const removeMessages = async (removeCount) => {
    let messagesMapped = JSON.parse(JSON.stringify(messages));
    if (messagesMapped.keys.length) {
      for (var i = 0; i < removeCount; i++) {
        if (messagesMapped[messagesMapped.keys[messagesMapped.keys.length - 1]].length == 0) 
          messagesMapped.keys.pop()
        messagesMapped[messagesMapped.keys[messagesMapped.keys.length - 1]].pop()
      }
      setMessagesCount(messagesCount - removeCount);
      setMessages(messagesMapped);
    }
    setRemovedMessagesCount(removedMessagesCount + removeCount);
  }

  const removeMessagesFromTop = async (removeCount) => {
    let messagesMapped = JSON.parse(JSON.stringify(messages));
    if (messagesMapped.keys.length) {
      for (var i = 0; i < removeCount; i++) {
        if (messagesMapped[messagesMapped.keys[0]].length == 0) 
          messagesMapped.keys.shift();
        messagesMapped[messagesMapped.keys[0]].shift();
      }
      setMessagesCount(messagesCount - removeCount);
      setMessages(messagesMapped);
      setOffsetSt(offsetSt-30);
    }
  }
  
  const loadLess = async (offset, takeCount) => {
    setPrevSelectedConversationId(selectedConversation.conversationId)
    if (!selectedConversation.conversationId) return;
    axios.get(URL + `/api/message/receivemessages?groupOrUserId=${selectedConversation.conversationId}&offset=${offset}&takeCount=${takeCount}`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      var data = response.data;
      data = data.Messages;
      var messagesCountCounter = 0;
      let messagesMapped = JSON.parse(JSON.stringify(messages));
      let unreadCount = 0;
      data.reverse().forEach(x => {
        var date = formatDateDay(new Date(x.CreateDate), language);
        if (!messagesMapped[date]) {
          messagesMapped[date] = [];
        }
        if (messagesMapped.keys.indexOf(date) === -1)
          messagesMapped.keys.push(date);

        messagesMapped[date].push(x);
      });
      let firstUnreadFlag = false;
      messagesMapped.keys.forEach(key => {
        messagesMapped[key].map(x => {
          messagesCountCounter++;
          if (typeof(x.Text) == 'string')
            x.Text = x.Text.split(/(\s+)/);

          if (!x.ReadStatus && !x.SentByUser ) {
            unreadCount++;
            if (!firstUnreadFlag) {
              x.FirstUnread = true;
              firstUnreadFlag = true;
            }
          }
        });
      });
      setMessagesCount(messagesCountCounter);
      setMessages(messagesMapped);
      setMessagesUpdated(!messagesUpdated);
      setIsLoading(false);
      
    })
    .catch((error) => {
      console.error(error)
    });
  }
  const loadMore = async (offset, takeCount) => {
    setPrevSelectedConversationId(selectedConversation.conversationId)
    if (!selectedConversation.conversationId) return;
    axios.get(URL + `/api/message/receivemessages?groupOrUserId=${selectedConversation.conversationId}&offset=${offset}&takeCount=${takeCount}`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      var data = response.data;
      data = data.Messages;
      var messagesCountCounter = 0;
      var messagesMapped = JSON.parse(JSON.stringify(messages));
      let unreadCount = 0;
      data.forEach(x => {
        var date = formatDateDay(new Date(x.CreateDate), language);
        if (!messagesMapped[date]) { 
          messagesMapped = {[date]: [], ...messagesMapped};
        }
        if (messagesMapped.keys.indexOf(date) === -1) {
          messagesMapped.keys.unshift(date);
        }

        messagesMapped[date].unshift(x);
      });
      let firstUnreadFlag = false;
      messagesMapped.keys.forEach(key => {
        messagesMapped[key].map(x => {
          messagesCountCounter++;
          if (typeof(x.Text) == 'string')
            x.Text = x.Text.split(/(\s+)/);

          if (!x.ReadStatus && !x.SentByUser ) {
            unreadCount++;
            if (!firstUnreadFlag) {
              x.FirstUnread = true;
              firstUnreadFlag = true;
            }
          }
        });
      });
      setMessagesCount(messagesCountCounter);
      setMessages(messagesMapped);
      setMessagesUpdated(!messagesUpdated);
      setIsLoading(false);
      
    })
    .catch((error) => {
      console.error(error)
    });
  };
  
  const receiveMessages = async () => {
    setPrevSelectedConversationId(selectedConversation.conversationId)
    if (!selectedConversation.conversationId) return;
    axios.get(URL + `/api/message/receivemessages?groupOrUserId=${selectedConversation.conversationId}&offset=0&takeCount=30`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      var data = response.data;
      var messageKeys = [];
      data = data.Messages;
      var messagesMapped = {};
      let unreadCount = 0;
      console.log(data);
      data.forEach(x => {
        var date = formatDateDay(new Date(x.CreateDate), language);
        if (!messagesMapped[date]) {
          messagesMapped[date] = [];
          messageKeys.unshift(date);
        }
        messagesMapped[date].unshift(x);
      });
      let firstUnreadFlag = false;
      messageKeys.forEach(key => {
        messagesMapped[key].map(x => {
          x.Text = x.Text.split(/(\s+)/);

          if (!x.ReadStatus && !x.SentByUser ) {
            unreadCount++;
            if (!firstUnreadFlag) {
              x.FirstUnread = true;
              firstUnreadFlag = true;
            }
          }
        });
      });
      messagesMapped = { 'keys': messageKeys, ...messagesMapped};
      setMessages(messagesMapped);
      setMessagesUpdated(!messagesUpdated);
      setIsLoading(false);
      setOffsetSt(30);
    })
    .catch((error) => {
      console.error(error)
    });
  };
  
  const scrollToBottom = () => {
    if (unreadStatusRef.current) {
      unreadStatusRef.current?.scrollIntoView({ block: 'center' })
    } else messagesEndRef.current?.scrollIntoView({ block: 'end' })
  };

  const scrollToBottomSmooth = () => {
    setScrolled(false);
    setMessagesCount(30);
    receiveMessages();
    // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  };
  
  const scrollToMessage = () => {
    if (!messages || !selectedConversation.messageId) return;
    const element = document.getElementById(`message-${selectedConversation.messageId}`);
    if (!element) return;
    const elements = document.querySelectorAll('.has-menu-open');

    // Перебираем найденные элементы и удаляем класс has-menu-open
    elements.forEach(element => {
        element.classList.remove('has-menu-open');
    });
    element.classList.add('has-menu-open');
    const elementRect = element.getBoundingClientRect();
    const isVisible =
        elementRect.top >= 0 &&
        elementRect.left >= 0 &&
        elementRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - 100 &&
        elementRect.right <= (window.innerWidth || document.documentElement.clientWidth);

    if (!isVisible) {
        element.scrollIntoView({ block: "center" });
    }
    setTimeout(() => element.classList.remove('has-menu-open'), 3500);
  };
  useEffect(() => {
    if (!messages) return;
    if (scrolled) return;
    scrollToBottom();
    setScrolled(true);
}, [messages]);

  useEffect(() => {
    scrollToMessage();
    const element = document.getElementById('messageList');
    setDownloading(false);
    if (element.scrollHeight > scrollPosition.scrollHeight) {
      if (scrollPosition.scrollTop < ((scrollPosition.scrollHeight - scrollPosition.clientHeight) - (scrollPosition.scrollHeight - scrollPosition.clientHeight)* 25 / 100))
        element.scrollTo({
          top: element.scrollHeight-scrollPosition.scrollHeight+element.scrollTop,
        });
    }
    
    if (!!connection) {
      connection.off('updateMessages');
      connection.on('updateMessages', (convId, receivedMessages) => {
        if (convId == selectedConversation.conversationId) {
          receivedMessages = JSON.parse(receivedMessages);
          let messagesEdit = JSON.parse(JSON.stringify(messages));
          receivedMessages.map(x => {
            x.Text = x.Text.split(/(\s+)/);
            var date = formatDateDay(new Date(x.CreateDate), language);
            if (!messagesEdit[date]) messagesEdit[date] = [];
            messagesEdit[date].push(x);
          });
          setMessages(messagesEdit);
        }
      });
      connection.off('changeReadStatus');
      connection.on('changeReadStatus', (convId, readMessagesJSON) => {
        let readMessages = JSON.parse(readMessagesJSON);
        if (convId == selectedConversation.conversationId) {
          var messagesEdit = JSON.parse(JSON.stringify(messages));
          readMessages.forEach(x => {
            messagesEdit.keys.forEach(key => {
              messagesEdit[key].map(message => {
                if (message.Id == x.Id)
                  message.ReadStatus = true;
              })
            });
          });
          
          setMessages(messagesEdit);
        }
      });
    }
  }, [messages]);
  
  useEffect(() => {
    scrollToMessage();
    setOffsetSt(0);
    setRemovedMessagesCount(0);
    setMessagesCount(30);
    setScrolled(false);
    if (!!selectedConversation.conversationId && selectedConversation.conversationId != prevSelectedConversationId) {
      setMessages(null);
      setMessagesUpdated(!messagesUpdated);
      setIsLoading(true);
      setTimeout(() => receiveMessages(), 300);
    }
  }, [selectedConversation, language]);

  const handleScroll = async (e) => { 
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setScrollPosition({ scrollTop, scrollHeight, clientHeight });
    if (scrollTop < (scrollHeight - clientHeight) * 20 / 100 && !downloading) {
      if (messagesCount > 60) {
        removeMessages(30);
        return;
      }
    }
    if (scrollTop < (scrollHeight - clientHeight) * 15 / 100 && !downloading) {
      loadMore(offsetSt, 30);
      setDownloading(true);
      setOffsetSt(offsetSt+30);
    }
    
    if (offsetSt != 0 && (removedMessagesCount >= 30 || (removedMessagesCount == 0 && offsetSt == 60)) && scrollTop > ((scrollHeight - clientHeight) - (scrollHeight - clientHeight)* 25 / 100) && !downloading) {
      // if (messagesCount <= 60) {
        loadLess(removedMessagesCount - 30, 30);
        setRemovedMessagesCount(removedMessagesCount-30);
        setDownloading(true);
      // }
      // if (messagesCount >= 180) {
      //   removeMessagesFromTop(30);
      //   setDownloading(true);
      // }
    }
    if ((removedMessagesCount == 0) && scrollTop > ((scrollHeight - clientHeight) - (scrollHeight - clientHeight)* 25 / 100) && !downloading) {
      receiveMessages();
      setMessagesCount(30);
    }
    
    if ((clientHeight + scrollTop + 120)  < scrollHeight)
      setScrollButtonVisible(true);
    else setScrollButtonVisible(false);
  }

  return (
    <div>
      <div id='MiddleColumn'>
        <div className='messages-layout'>
          {selectedConversation.conversationId && <MiddleColumnHeader language={language} selectedConversationId={selectedConversation.conversationId} />}
          <div className='Transition'>
            <div className='Transition_slide Transition_slide-active' >
              <div onScroll={handleScroll} id='messageList' ref={messagesRef} className='MessageList custom-scroll no-avatars with-default-bg scrolled' >
                
                {isLoading && <div className='loader-container'><div className="loader"></div></div>}
                <MessageList setAddedFiles={setAddedFiles} dragOverOpened={dragOverOpened} setDragOverOpened={setDragOverOpened} setReplyMessage={setReplyMessage} language={language} receiveMessages={receiveMessages} messages={messages} scrollToBottom={scrollToBottom} />

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
          {!dragOverOpened && !!selectedConversation.conversationId && <MiddleColumnFooter addedFiles={addedFiles} scrollButtonVisible={scrollButtonVisible} setReplyMessage={setReplyMessage} replyMessage={replyMessage} receiveMessages={receiveMessages} setUpdateList={setUpdateList} updateList={updateList} selectedConversationId={selectedConversation.conversationId} scrollToBottom={scrollToBottom}/>}
          <div className={'bottom-scroll-container' + (scrollButtonVisible ? ' visible' : '')}>
            <button className='Button default secondary round button-scroll' onClick={scrollToBottomSmooth}><FaRegHandPointDown className="icon"/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagePage;