import React, { Component, useEffect, useState } from 'react';
import './ContextMenu.scss';
import { MdOutlineNightsStay,  } from "react-icons/md";
import { BsReply } from "react-icons/bs";
import { GrPin } from "react-icons/gr";
import { LuForward } from "react-icons/lu";
import { BsTranslate } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";
import config from '../../../config';
import axios from 'axios';
import Cookies from 'js-cookie';
import ContextMenuTranslate from './ContextMenuTranslate/ContextMenuTranslate';
import ModalDialog from '../../ModalDialog/ModalDialog';

const ContextMenu = ({ left, top, hideContextMenu, contextMenuHiding, messageId, setReplyMessage, setMessageText, translatedMessages, windowHeight, setDeleteMessage, language }) => {
    const handleContextMenu = (e) => {
        e.preventDefault();
        hideContextMenu();
    }
    const translates = {
      reply: {
          'ru': 'Ответить',
          'en': 'Reply',
          'tt': 'Җавап бирү'
      },
      pin: {
          'ru': 'Закрепить',
          'en': 'Pin',
          'tt': 'Беркетү'
      },
      send: {
          'ru': 'Отправить',
          'en': 'Forward',
          'tt': 'Җибәргэ'
      },
      translate: {
          'ru': 'Перевести',
          'en': 'Translate',
          'tt': 'Күчерү'
      },
      showOriginal: {
          'ru': 'Показать оригинал',
          'en': 'Show original',
          'tt': 'Оригиналны күрсәтү'
      },
      delete: {
          'ru': 'Удалить',
          'en': 'Delete',
          'tt': 'Бетерү'
      },
    };
    const URL = config.apiUrl;
    const [isTranslating, setIsTranslating] = useState(false);
    const [leftWidth, setLeftWidth] = useState(left);
    const [topWidth, setTopWidth] = useState(top);
    const fetchTranslateText = async (targetLanguageCode) => {
        var token = Cookies.get('login-token');
        const response = await axios.get(
            URL + `/api/message/translate-message?messageId=${messageId}&targetLanguageCode=${targetLanguageCode}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        hideContextMenu();
        setMessageText(response.data.translate);
    }

    const translateText = () => {
        setIsTranslating(true);
        let menuHeight = 320;
        const y = top + menuHeight + 20 > windowHeight ? windowHeight - 320 - 20 : top;
        setTopWidth(y);
    }

    const back = () => {
        setIsTranslating(false);
    }
    const showOriginal = () => {
        setMessageText(null);
        hideContextMenu();
    }
    const handleDeleteMessage = () => {
        setDeleteMessage(true);
        hideContextMenu();
    }

    const handleReplyMessage = () => {
        setReplyMessage(messageId);
        hideContextMenu();
    }

    return (
        <div>
            <div className='ContextMenuContainer open shown'>
                <div className='Menu compact MessageContextMenu fluid' style={{left: leftWidth+'px', top: topWidth+'px'}}>
                    <div onContextMenu={handleContextMenu} onClick={hideContextMenu} className='backdrop'></div>
                    <div className={'bubble menu-container custom-scroll bottom left opacity-transition fast' + (contextMenuHiding ? ' not-open not-shown' : ' open shown')}>
                        {!isTranslating ? (<div className='MessageContextMenu_items scrollable-content custom-scroll'>
                            
                            <div onClick={handleReplyMessage} className='MenuItem compact'>
                                <BsReply className='icon' />
                                {translates.reply[language]}
                            </div>

                            <div className='MenuItem compact'>
                                <GrPin className='icon' />
                                {translates.pin[language]}
                            </div>
                            <div className='MenuItem compact'>
                                <LuForward className='icon' />
                                {translates.send[language]}
                            </div>
                            {!translatedMessages[messageId] ? (<div onClick={translateText} className='MenuItem compact'>
                                <BsTranslate className='icon' />
                                {translates.translate[language]}
                            </div>) : <div onClick={showOriginal} className='MenuItem compact'>
                                <BsTranslate className='icon' />
                                {translates.showOriginal[language]}
                            </div>}
                            <div onClick={handleDeleteMessage} className='MenuItem destructive compact'>
                                <MdDeleteForever className='icon destructive' />
                                {translates.delete[language]}
                            </div>
                        </div>) : 
                        (<ContextMenuTranslate language={language} back={back} fetchTranslateText={fetchTranslateText}/>)}
                        
                    </div>
                </div>
            </div>
            
        </div>
    );
}
export default ContextMenu;