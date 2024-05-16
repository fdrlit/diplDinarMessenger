import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';
import './RestorePassword.scss'
import Cookies from 'js-cookie';
import config from '../../config';
import { IoArrowBackOutline } from "react-icons/io5";

const RestorePassword = () => {

    const [language, setLanguage] = useState(localStorage.getItem('interface-language') || 'ru');

    const translates = {
        emailOrLogin: {
            'ru': 'Электронная почта или логин',
            'en': 'E-mail or username',
            'tt': 'Электрон почта яки логин'
        },
        restorePassword: {
            'ru': 'Восстановить пароль',
            'en': 'Restore password',
            'tt': 'Серсүзне торгызу'
        },
        success: {
            'ru': 'Успех',
            'en': 'Success',
            'tt': 'Уңыш'
        },
        enterEmailOrUsername: {
            'ru': 'Введите почту или логин',
            'en': 'Enter e-mail or username',
            'tt': 'Почта яки логин кертегез'
        },
        letterSent: {
            'ru': 'Письмо с инструкцией для восстановления пароля отправлено на почту.',
            'en': 'A letter with instructions for password recovery has been sent by email.',
            'tt': 'Серсүзне торгызу өчен инструкцияле хат почтага җибәрелгән.'
        },
        userNotFound: {
            'ru': 'Аккаунт не найден, проверьте правильность заполнения.',
            'en': 'Account not found, please check fill correctness.',
            'tt': 'Аккаунт табылмады, тутыруның дөреслеген тикшерегез.'
        },
        emailNotFound: {
            'ru': 'Необходимо подтвердить электронную почту.',
            'en': 'You need to confirm your email.',
            'tt': 'Электрон почтаны расларга кирәк.'
        },
        internalError: {
            'ru': 'Произошла внутренняя ошибка. Попробуйте повторить позднее',
            'en': 'An internal error has occurred. Try again later',
            'tt': 'Эчке хата булды. Соңрак кабатларга тырышыгыз'
        }
    };


    var URL = config.apiUrl;
    const classNames = {
        'success': 'success-without-spinner',
        'loading': 'loading',
        'default': ''
    };
    const btnNames = {
        'default': translates.restorePassword[language],
        'loading': '',
        'success': translates.success[language]
    }
    
    const [emailOrUsername, setEmailOrUsername] = useState();
    const [errorMessage, setErrorMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [btnState, setBtnState] = useState('default');
    const navigate = useNavigate();
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmailOrUsername(value);
        setErrorMessage(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailOrUsername) return;

        setBtnState('loading');
        try {
            await axios.post(
                URL + '/api/passwordrestore/getlinkonemail',
                {
                    'emailOrUsername': emailOrUsername,
                    'clientUrl': config.clientUrl + '/restore'
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setTimeout(() => {
                setBtnState('success');
                setSuccessMessage(true);
            }, 400);
          } catch (error) {
            if (error.response.status === 400) {
                setTimeout(() => {
                    setBtnState('default');
                    if (error.response.data.message === 'user not found')
                        setErrorMessage(translates.userNotFound[language]);
                    if (error.response.data.message === 'email not confirmed')
                        setErrorMessage(translates.emailNotFound[language]);
                }, 400);
                
            } else {
                setErrorMessage(translates.internalError[language])
                console.error('Error:', error);
            }
          }
    };
    return (
        <div className='center-container restore-password-container'>
            <Form onSubmit={handleSubmit}>
                <IoArrowBackOutline onClick={() => navigate('/login')} className="back-icon" />
                <Form.Group className="mb-3 restore-password-control" controlId="formEmailOrUsername">
                    <Form.Label>{translates.emailOrLogin[language]}</Form.Label>
                    <Form.Control onChange={handleInputChange} name="emailorusername" type="text" placeholder={translates.enterEmailOrUsername[language]} />
                </Form.Group>

                <Button className={`btn-submit ${classNames[btnState]}`} variant="primary" type="submit">
                    <span>{btnNames[btnState]}</span>
                </Button>
                {!!errorMessage && <div className='error-text mb-3'>{errorMessage}</div>}
                {!!successMessage && <div className='success-text mb-3'>{translates.letterSent[language]}</div>}
            </Form>
        </div>
    );
}

export default RestorePassword;