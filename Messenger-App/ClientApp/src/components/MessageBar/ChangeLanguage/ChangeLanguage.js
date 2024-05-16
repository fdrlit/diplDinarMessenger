import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './ChangeLanguage.scss'
import config from '../../../config';
import { formatDate } from '../../../middleware/dateFormat';

const ChangeLanguage = ({ transitionSlideClass, setLanguage, language }) => {
    const [transitionClass, setTransitionClass] = useState(transitionSlideClass);
    useEffect(() => {
        setTransitionClass('Transition_slide-to');
        setTimeout(() => setTransitionClass('Transition_slide-active'), 200);
    }, [transitionSlideClass]);
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('interface-language'));
    const setLang = (lang_code) => {
        localStorage.setItem('interface-language', lang_code);
        setLanguage(lang_code);
        setSelectedLanguage(lang_code);
    }
    
    return (
        <div className='settings'>
            <div className={`Transition_slide ${transitionClass}`}>
                <div class="settings-content settings-language custom-scroll">
                    <div class="settings-item">
                        <div class="radio-group">
                            <label class="Radio" onClick={() => setLang('ru')}>
                                <input type="radio" checked={!selectedLanguage || selectedLanguage === 'ru'} name="language-settings" value="ru" />
                                <div class="Radio-main">
                                    <span class="label">
                                        Русский
                                    </span>
                                    <span class="subLabel">
                                        Russian
                                    </span>
                                </div>
                            </label>
                            <label class="Radio" onClick={() => setLang('en')}>
                                <input type="radio" checked={selectedLanguage === 'en'} name="language-settings" value="en" />
                                <div class="Radio-main">
                                    <span class="label">
                                        English
                                    </span>
                                    <span class="subLabel">
                                        English
                                    </span>
                                </div>
                            </label>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ChangeLanguage;