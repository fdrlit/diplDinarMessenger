import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Settings.scss'
import config from '../../../config';
import { formatDate } from '../../../middleware/dateFormat';

const Settings = ({ transitionSlideClass, language }) => {
    const [transitionClass, setTransitionClass] = useState(transitionSlideClass);
    useEffect(() => {
        setTransitionClass('Transition_slide-to');
        setTimeout(() => setTransitionClass('Transition_slide-active'), 200);
    }, [transitionSlideClass]);

    return (
        <div className='settings'>
            <div className={`Transition_slide ${transitionClass}`}>
                <div class="settings-content settings-language custom-scroll">
                    <div class="settings-item">
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Settings;