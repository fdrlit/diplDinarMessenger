import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.scss';
import Cookies from 'js-cookie';
import config from '../../config';
import '../../styles/global.scss';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaUserPlus, FaArrowRight } from "react-icons/fa";
const Login = ({ onLogin }) => { // эффект формочки
    const URL = config.apiUrl;
    const [language, setLanguage] = useState(localStorage.getItem('interface-language') || 'ru');
    const translates = {
        login: {
            'ru': 'Вход',
            'en': 'Sign In',
            'tt': 'Керү'
        },
        enterEmailOrLogin: {
            'ru': 'Введите электронную почту или логин',
            'en': 'Enter your e-mail or username',
            'tt': 'Электрон почта яки логин кертегез'
        },
        forgotPassword: {
            'ru': 'Забыли пароль?',
            'en': 'Forgot password?',
            'tt': 'Серсүзне оныттыгызмы?'
        },
        enterPassword: {
            'ru': 'Введите пароль',
            'en': 'Enter password',
            'tt': 'Серсүз кертегез'
        },
        noAccount: {
            'ru': 'Еще нет аккаунта?',
            'en': `Don't have an account?`,
            'tt': 'Хисап юк?'
        },
        welcome: {
            'ru': 'Добро пожаловать!',
            'en': 'Welcome!',
            'tt': 'Рәхим Итегез!'
        },
        register: {
            'ru': 'Регистрация',
            'en': 'Sign up',
            'tt': 'Регистрациясы'
        },
        signIn: {
            'ru': 'Войти',
            'en': 'Sign In',
            'tt': 'Керү'
        },
        incorrectLoginOrPass: {
            'ru': 'Неверный логин или пароль',
            'en': 'Wrong login or password',
            'tt': 'Логин яки серсүз дөрес булмаган'
        }

    }
    const classNames = {
        'success': 'success',
        'error': 'shake',
        'waiting': 'loading',
        'default': ''
    };

    const btnNames = {
        'default': translates.signIn[language],
        'success': '',
        'error': translates.incorrectLoginOrPass[language],
        'waiting': ''
    }
    
    const [formData, setFormData] = useState({
        emailorusername: '',
        password: ''
    });
    const [btnState, setBtnState] = useState('default');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
        setBtnState('default');
        
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.emailorusername || !formData.password)
            return;
        setBtnState('waiting');
        await axios.post(
                URL + '/api/login',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
        )
        .then((response) => {
            Cookies.set('login-token', response.data.token);
            setBtnState('success');
            setTimeout(() => {
                navigate('/home');
                onLogin();
            }, 400);
        })
        .catch ((error) => {
            if (error.response.status === 401) {
                setTimeout(() => {
                    setBtnState('error')
                }, 400);
              } else {
                console.error('Error:', error);
              }
        })
    };
    const setLang = (lang) => {
        localStorage.setItem('interface-language', lang);
        setLanguage(lang);
    }

    return (
        <div className='container mt-5'>
            {/* <div className='languages-container'>
                <button onClick={() => setLang('ru')} className={`lang-button ${language == 'ru' ? 'selected' : ''}`}>Русский</button> 
                <div className='lang-separator'>/</div>
                <button onClick={() => setLang('en')} className={`lang-button ${language == 'en' ? 'selected' : ''}`}>English</button>
                <div className='lang-separator'>/</div>
                <button onClick={() => setLang('tt')} className={`lang-button ${language == 'tt' ? 'selected' : ''}`}>Татарча</button>
            </div> */}
            <div className='containerLogin d-flex'>
                <div className='login'>
                    <div className='containerLogin'>
                        <h1>{translates.login[language]}</h1>
                        <div>
                            <form onSubmit={handleSubmit} noValidate>
                                <label style={{float: 'left'}}>{translates.enterEmailOrLogin[language]}</label>
                                <br />
                                <input className='input' placeholder='fdrlit@foder.com' onChange={handleInputChange} name="emailorusername" type="text" />
                                <div style={{height: 40 + 'px'}}></div>
                                <label style={{float: 'left'}}>{translates.enterPassword[language]}</label>
                                <br />
                                <input 
                                    value={formData.password}
                                    onChange={handleInputChange} 
                                    name="password" 
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="******"  />
                                <div style={{height: 30 + 'px'}}></div>
                                <button type='submit' className={`button-login ${classNames[btnState]}`}>
                                    <span className='button-content'>
                                        {btnNames[btnState]}
                                    </span>
                                </button>
                            </form>
                        </div>
                        <div style={{height: 10 + 'px'}}></div>
                        <div className='d-flex flex-column align-start'>
                            <Link to={'/restorepassword'}>{translates.forgotPassword[language]}</Link>
                        </div>
                        <div style={{height: 10 + 'px'}}></div>
                        <div className='d-flex flex-column align-start mobile'>
                            <Link to={'/register'}>{translates.noAccount[language]}</Link>
                        </div>
                    </div>
                </div>
                <div className='register'>
                    <div className="containerLogin">

                        <div><FaUserPlus className='icon-register'/></div>
                        <h1>{translates.welcome[language]}</h1>
                        <p>{translates.noAccount[language]}</p>
                        <Link type="button"
                            className="v-btn"
                            to={'/register'}>
                                <span className="v-btn__content" data-no-activator=""><span>{translates.register[language]}</span> <FaArrowRight className='icon' /></span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;