import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './SearchBar.scss';

import config from '../../../config';
import { formatDate } from '../../../middleware/dateFormat';

const SearchBar = ({ searchText, transitionSlideClass, hideSettings, language, setSelectedConversation }) => {
    const [searchData, setSearchData] = useState();
    const token = Cookies.get('login-token');
    const navigate = useNavigate();
    const URL = config.apiUrl;
    const translates = {
        chats: {
            'ru': 'Чаты и контакты',
            'en': 'Chats and contacts',
            'tt': 'Чатлар һәм контактлар'
        },
        messages: {
            'ru': 'Сообщения',
            'en': 'Messages',
            'tt': 'Хәбәр'
        },
        noResults: {
            'ru': 'Нет результатов',
            'en': 'No results',
            'tt': 'Нәтиҗә юк'
        },
        tryAnother: {
            'ru': 'Попробуйте другой запрос.',
            'en': 'Try another request.',
            'tt': 'Башка сорауны карагыз.'
        }
    };
    const handleUserClick = (href) => {
        navigate(href);
        const userId = href.split('=')[1];
        setSelectedConversation({ conversationId: userId, messageId: null });
        hideSettings();
    };
    const handleMessageClick = (userId, messageId) => {
        setSelectedConversation({ conversationId: userId, messageId: messageId });
    }
    const searchRequest = async () => {
        try {
            let response = await axios.get(URL + '/api/message/search', {
                params: {
                    searchText,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            console.log(response.data);
            setSearchData(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (searchText === '') {
            setSearchData(null);
            return;
        };
        const timeout = setTimeout(() => {
            searchRequest();
        }, 400);
        
        return () => clearTimeout(timeout);
      }, [searchText]);

    return (
        <div className={`Transition_slide ${transitionSlideClass}`}>
            <div className='LeftSearch'>
                <div className='Transition search-transition'>
                    <div className='LeftSearch custom-scroll' style={{overflowY: 'scroll'}}>
                        {!!searchData && searchData.Users.length != 0 &&

                            <div className='search-section'>
                                <h3 className='section-heading'>
                                    {translates.chats[language]}
                                </h3>
                                { searchData.Users.map(u => (
                                    <div onClick={() => handleUserClick(`/im?sel=${u.Id}`)}>
                                        <div className='ListItem chat-item-clickable search-result'>
                                            <div className='ListItem-button' role="button">
                                                <div className='ChatInfo'>
                                                    <div className='Avatar size-large peer-color-3'>

                                                    </div>
                                                    <div className='info'>
                                                        <div className='title'>
                                                            <h3 dir='auto' role='button' className='fullName'>{u.UserName}</h3>
                                                        </div>
                                                        <span className='status' dir='auto'>был(-а) в сети недавно</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                        {!!searchData && searchData.Messages.length != 0 && 
                            <div className='search-section'>
                                <h3 className='section-heading'>
                                    {translates.messages[language]}
                                </h3>
                                { searchData.Messages.map(m => (
                                    <div onClick={() => handleMessageClick(m.UserId, m.Id)} className='ListItem ChatMessage chat-item-clickable has-ripple'>
                                        <div className='ListItem-button' role='button'>
                                            <div className='Avatar size-large peer-color-6'></div>
                                            <div className='info'>
                                                <div className='info-row'>
                                                    <div className='title'>
                                                        <h3 dir='auto' role='button' className='fullName'>
                                                            {m.UserName}
                                                        </h3>
                                                    </div>
                                                    <div className='message-date'>
                                                        <div className='Link date'>{formatDate(new Date(m.MessageDate), language)}</div>
                                                    </div>
                                                </div>
                                                <div className='subtitle'>
                                                    <div className='message' dir='auto'>
                                                        {m.LastMessage}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                        {!!searchData && searchData.Messages.length == 0 && searchData.Users.length == 0 && 
                            <div className='NothingFound opacity-transition fast open shown with-description'>
                                {translates.noResults[language]}
                                <p className='description'>
                                    {translates.tryAnother[language]}
                                </p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SearchBar;

// value={searchText}
// onChange={(e) => setSearchText(e.target.value)}