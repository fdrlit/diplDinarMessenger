import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate, useLocation  } from 'react-router-dom';
import axios from 'axios';
import './Restore.scss'
import Cookies from 'js-cookie';
import config from '../../config';
import { FiEye, FiEyeOff } from "react-icons/fi";

const Restore = () => {
    const URL = config.apiUrl;
    const location = useLocation();
    const navigate = useNavigate();
    
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('token');
    const id = searchParams.get('id');

    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [successMessage, setSuccessMessage] = useState();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [language, setLanguage] = useState(localStorage.getItem('interface-language') || 'ru');

    const translates = {
        signIn: {
            'ru': 'Войти',
            'en': 'Sign In',
            'tt': 'Керү'
        },
        changePassword: {
            'ru': 'Сменить пароль',
            'en': 'Change password',
            'tt': 'Серсүзне үзгәртү'
        },
        enterNewPassword: {
            'ru': 'Введите новый пароль',
            'en': 'Enter new password',
            'tt': 'Яңа серсүз кертегез'
        },
        fillPassword: {
            'ru': 'Необходимо заполнить поле пароля',
            'en': 'The password field must be filled in',
            'tt': 'Серсүз кырын тутырырга кирәк'
        },
        minPasswordLength: {
            'ru': 'Минимальная длина пароля - 8 символов',
            'en': 'Minimum password length - 8 characters',
            'tt': 'Парольнең минималь озынлыгы 8 символ'
        },
        passChangesSuccessfully: {
            'ru': 'Пароль изменен успешно',
            'en': 'Password changed successfully!',
            'tt': 'Серсүз уңышлы үзгәртелде!'
        },
        error: {
            'ru': 'Произошла ошибка. Попробуйте запросить письмо повторно.',
            'en': 'An error has occurred. Try requesting the email again',
            'tt': 'Хата килеп чыкты. Хатны кабат сорарга тырышыгыз.'
        }
    };
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    useEffect(() => {
        if (!code || !id) {
            navigate('/login');
        }
    }, [code, id, navigate]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPassword(value);
        setErrorMessage(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password.length) {
                setErrorMessage(translates.changePassword[language]);
                return;
            }
        if (password.length < 8) {
            setErrorMessage(translates.minPasswordLength[language]);
            return;
        }
        

        try {
            await axios.post(
                URL + '/api/passwordrestore/restore',
                {
                    'code': decodeURIComponent(code),
                    'id': id,
                    'newPassword': password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setSuccessMessage(translates.passChangesSuccessfully[language])
        } catch (e) {
            setErrorMessage(translates.error[language])
            console.error(e);
        }
    };
    return (
        <div className='restore-password-container'>
            <Form onSubmit={handleSubmit} className="restore-password-form">
                <Form.Group className="mb-3 restore-password-control" controlId="formPassword">
                    <Form.Label>{translates.enterNewPassword[language]}</Form.Label>
                    <div className="password-input-container">
                        <Form.Control 
                            onChange={handleInputChange} 
                            name="password" 
                            type={passwordVisible ? "text" : "password"}
                            placeholder={translates.enterNewPassword[language]} 
                        />
                        <span 
                            className="password-icon" 
                            onClick={togglePasswordVisibility}
                        >
                            {!!password && (passwordVisible ? <FiEyeOff /> : <FiEye />)}
                        </span>
                    </div>
                </Form.Group>

                <Button className={`restore-password-btn-submit`} variant="primary" type="submit">
                    <span>{translates.changePassword[language]}</span>
                </Button>
                {!!errorMessage && <div className='restore-password-error mb-3'>{errorMessage}</div>}
                {!!successMessage && <div className='restore-password-success mb-3'>{successMessage} <a className='' href="/login">{translates.signIn[language]}</a>.</div>}
            </Form>
        </div>
    );
}

export default Restore;