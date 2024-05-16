import React, { useEffect, useRef, useState } from "react";
import ContextMenu from "../ContextMenu/ContextMenu";
import MessageListItem from "./MessageListItem/MessageListItem";
import { isLink } from "../../../searchDomains";
import ModalDialog from "../../ModalDialog/ModalDialog";
import axios from "axios";
import config from "../../../config";
import Cookies from "js-cookie";
import { IoDocument } from "react-icons/io5";

const MessageList = ({ messages, scrollToBottom, setReplyMessage, receiveMessages, language, unreadStatusRef, dragOverOpened, setDragOverOpened, setAddedFiles }) => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [translatedMessages, setTranslatedMessages] = useState({});
    const [contextMenuHiding, setContextMenuHiding] = useState();
    const [messageId, setMessageId] = useState();
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0, windowHeight: 0 });
    const [deleteMessage, setDeleteMessage] = useState();
    const [leftMouseButtonPressed, setLeftMouseButtonPressed] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const URL = config.apiUrl;
    const token = Cookies.get('login-token');
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const translates = {
        deleteMessageTitle: {
            'ru': 'Удалить сообщение',
            'en': 'Delete message',
            'tt': 'Хәбәрне бетерү'
        },
        areYouSureDeleteMessage: {
            'ru': 'Вы уверены, что хотите удалить это сообщение?',
            'en': 'Are you sure you want to delete this message?',
            'tt': 'Сез бу Хәбәрне бетерергә телисезме?'
        },
        deleteForAll: {
            'ru': 'Удалить у всех',
            'en': 'Delete for all',
            'tt': 'Барысыннан да бетерү'
        },
        deleteForMe: {
            'ru': 'Удалить у меня',
            'en': 'Delete for me',
            'tt': 'Минем өчен бетерү'
        },
        cancel: {
            'ru': 'Отмена',
            'en': 'Cancel',
            'tt': 'Отмена'
        }
    };
    const hideContextMenu = () => {
        const elements = document.querySelectorAll('.has-menu-open');

        // Перебираем найденные элементы и удаляем класс has-menu-open
        elements.forEach(element => {
            element.classList.remove('has-menu-open');
        });
        setContextMenuHiding(true);
        setTimeout(() => setShowContextMenu(false), 50);
    };

    const handleContextMenu = (message_id) => (event) => {
        console.log(message_id);
        setMessageId(message_id);
        event.preventDefault();
        event.currentTarget.classList.add('has-menu-open');
        if (showContextMenu) {
          hideContextMenu();
        } else {
          setShowContextMenu(true);
          setContextMenuHiding(false);
        }
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const menuHeight = 180;
        const menuWidth = 215;
        const y = event.clientY + menuHeight + 20 > windowHeight ? event.clientY - menuHeight - 10 : event.clientY + 10;
        const x = event.clientX + menuWidth + 20 > windowWidth ? event.clientX - menuWidth - 10 : event.clientX + 10;
    
        setContextMenuPosition({ x: x, y: y, windowHeight: windowHeight });
    };

    const setMessageText = (translate) => {
        if (!!translatedMessages[messageId]) {
          document.querySelector(`#message-${messageId}-inner`).innerHTML = translatedMessages[messageId];
          var translatedMessagesList = translatedMessages;
          translatedMessagesList[messageId] = null;
          setTranslatedMessages(translatedMessagesList);
          return;
        } else {
          var translatedMessagesList = translatedMessages;
          translatedMessagesList[messageId] = document.querySelector(`#message-${messageId}-inner`).innerHTML;
          setTranslatedMessages(translatedMessagesList);
          document.querySelector(`#message-${messageId}-inner`).innerHTML = translate.split(/(\s+)/).map(str => (
            str = (urlRegex.test(str) ? (`<a href="${str}" target="_blank">${str}</a>`) : isLink(str) ? `<a href="https://${str}" target="_blank">${str}</a>` : str)
          )).join('');
        }
    };
    
    const handleDeleteMessageForMe = () => {
        axios.post(
            URL + '/api/message/deleteMessageForMe',
            {
                'messageId': messageId
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        .then(response => {
            receiveMessages();

        })
        .catch(e => console.error(e));
        setDeleteMessage(false);
    }
    const handleDeleteMessageForAll = () => {
        axios.post(
            URL + '/api/message/deleteMessageForAll',
            {
                'messageId': messageId
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        .then(response => {
            receiveMessages();

        })
        .catch(e => console.error(e));
        setDeleteMessage(false);
    }


    const handleDragOver = (event) => {
        event.stopPropagation();
        setDragOverOpened(true);
        event.preventDefault();
        event.stopPropagation();
        // Добавляем класс, чтобы показать, что область можно перетаскивать файлы
    };
    const handleDragLeave = (event) => {
        const dragContainer = document.querySelector('.DropArea');
        const dragContainerRect = dragContainer.getBoundingClientRect();

        const x = event.clientX;
        const y = event.clientY;

        if (x < dragContainerRect.left || x > dragContainerRect.right ||
            y < dragContainerRect.top || y > dragContainerRect.bottom) {
                setDragOverOpened(false);
        }
        // document.getElementsByClassName('DropTarget')[0].classList.remove('hovered');
    }
    const handleDragMenuLeave = () => {
        document.getElementsByClassName('DropTarget')[0].classList.remove('hovered');
    }
    const handleDragMenuOver = (event) => {
        event.preventDefault();
        var element = document.getElementsByClassName('DropTarget')[0]
        if (!!element)
            document.getElementsByClassName('DropTarget')[0].classList.add('hovered');
    }
    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        setDragOverOpened(false);
        setAddedFiles(files);
    }
    useEffect(() => {
        if (!dragOverOpened) return;
        document.getElementsByClassName('DropTarget')[0].classList.add('hovered');
    }, [dragOverOpened]);
    return (
        <>
        {dragOverOpened && 
            <div className="DropArea"
            onDragLeave={handleDragLeave}>
                <div className="DropTarget"
                onDragOver={handleDragMenuOver}
                onDrop={handleDrop}
                onDragLeave={handleDragMenuLeave}
                // onDragLeave={handleDragLeave}
                >
                    <div 
                        className="target-content"
                        onDragLeaveCapture={handleDragMenuLeave}
                        >
                        <div className="icon icon-document">
                            <IoDocument />
                        </div>
                        <div className="title">Drop files here to send them</div>
                    </div>
                </div>
            </div>}
            <div 
                onDragOver={handleDragOver}
                // onDragLeave={handleDragLeave}
                // onDrop={handleDrop}
                onMouseDown={() => setLeftMouseButtonPressed(true)} 
                onMouseUp={() => setLeftMouseButtonPressed(false)} 
                className='messages-container'>
                {showContextMenu && <ContextMenu setReplyMessage={setReplyMessage} language={language} setDeleteMessage={setDeleteMessage} translatedMessages={translatedMessages} setMessageText={setMessageText} messageId={messageId} contextMenuHiding={contextMenuHiding} hideContextMenu={hideContextMenu} left={contextMenuPosition.x} windowHeight={contextMenuPosition.windowHeight} top={contextMenuPosition.y}/>}
                {
                    !!messages && messages.keys.map(key => (
                        <div className='message-date-group'>
                            <div className='sticky-date interactive'>
                                <span dir="auto">{key}</span>
                            </div>
                            {
                                messages[key].map((x, index) => (
                                    <>
                                        {x.FirstUnread && <div className="unread-container">
                                                <div ref={unreadStatusRef} className="unread-status">
                                                    Unread messages
                                                </div></div>}
                                        <MessageListItem leftMouseButtonPressed={leftMouseButtonPressed} setReplyMessage={setReplyMessage} handleContextMenu={handleContextMenu} messageData={x}/>
                                    </>
                                ))
                            }  
                        </div>
                    ))
                }
                {deleteMessage && <ModalDialog 
                                    modalTitle={translates.deleteMessageTitle[language]} 
                                    modalMainContent={translates.areYouSureDeleteMessage[language]} 
                                    buttons={[
                                        {handleClick: handleDeleteMessageForAll, content: translates.deleteForAll[language], danger: true}, 
                                        {handleClick: handleDeleteMessageForMe, content: translates.deleteForMe[language], danger: true}, 
                                        {handleClick: () => setDeleteMessage(false), content: translates.cancel[language], danger: false}]
                                    } />}
            </div>
        </>
    );
}
export default MessageList;
