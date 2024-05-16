import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import './Register.scss'
import config from '../../config';
import '../../styles/global.scss';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaArrowRight } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ModalDialog from '../ModalDialog/ModalDialog';

const Register = () => {
    const URL = config.apiUrl;
    const navigate = useNavigate();
    const [language, setLanguage] = useState(localStorage.getItem('interface-language') || 'ru');

    const translates = {
        signUpButton: {
            'ru': 'Зарегистрироваться',
            'en': 'Sign up',
            'tt': 'Теркәлү'
        },
        signUp: {
            'ru': 'Регистрация',
            'en': 'Sign up',
            'tt': 'Теркәү'
        },
        enterEmail: {
            'ru': 'Введите ваш e-mail',
            'en': 'Enter your e-mail',
            'tt': 'Сезнең e-mail'
        },
        enterPhone: {
            'ru': 'Введите ваш номер телефона',
            'en': 'Enter your phone number',
            'tt': 'Сезнең e-mail'
        },
        login: {
            'ru': 'Логин',
            'en': 'Username',
            'tt': 'Логин'
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
        repeatPassword: {
            'ru': 'Подтвердите пароль',
            'en': 'Confirm password',
            'tt': 'Серсүзне раслагыз'
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
            'en': 'Register',
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
        },
        enterAllRows: {
            'ru': 'Необходимо заполнить все поля',
            'en': 'All fields must be filled',
            'tt': 'Барлык кырларны тутырырга кирәк'
        },
        differentPasswords: {
            'ru': 'Пароли отличаются',
            'en': 'Passwords are different',
            'tt': 'Парольләр аерыла'
        },
        minPasswordLength: {
            'ru': 'Минимальная длина пароля - 8 символов',
            'en': 'Minimum password length - 8 characters',
            'tt': 'Парольнең минималь озынлыгы 8 символ'
        },
        emailTaken: {
            'ru': 'Пользователь с данным e-mail уже зарегистрирован',
            'en': 'A user with this e-mail is already registered',
            'tt': 'E-mail мәгълүматлары булган кулланучы инде теркәлгән'
        },
        usernameTaken: {
            'ru': 'Пользователь с таким логином уже зарегистрирован',
            'en': 'A user with this login is already registered',
            'tt': 'Мондый логинлы кулланучы инде теркәлгән'
        },
        internalError: {
            'ru': 'Произошла внутренняя ошибка. Попробуйте повторить позднее',
            'en': 'An internal error has occurred. Try again later',
            'tt': 'Эчке хата булды. Соңрак кабатларга тырышыгыз'
        },
        alreadyHaveAccount: {
            'ru': 'Уже есть аккаунт?',
            'en': 'Already have an account?',
            'tt': 'Аккаунт бармы?'
        },
        signIn: {
            'ru': 'Вход',
            'en': 'Sign in',
            'tt': 'Керү'
        }

    }

    const classNames = {
        'success': 'success',
        'waiting': 'loading',
        'default': ''
    };

    const btnNames = {
        'default': translates.signUpButton[language],
        'success': '',
        'waiting': ''
    }
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordRepeat: ''
    });
    const [btnState, setBtnState] = useState('default');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordRepeatVisible, setPasswordRepeatVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // Event handler for input changes
    const handleInputChange = (e) => {
        if (errorMessage != '') setErrorMessage('');
        let { name, value } = e.target;
        if (name == 'phone') {
            value = value.replace(/(\d{1})(\d{3})(\d{3})(\d{3})/, "+$1 ($2)-$3-$4");
        }
        // Update the corresponding field in the form data state
        setFormData((prevData) => ({
        ...prevData,
        [name]: value.trim(),
        }));
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const togglePasswordRepeatVisibility = () => {
        setPasswordRepeatVisible(!passwordRepeatVisible);
    };
    // Event handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.password.length ||
            !formData.passwordRepeat ||
            !formData.email ||
            !formData.username ||
            formData.username.trim().length === 0) {
                setErrorMessage(translates.enterAllRows[language]);
                return;
            }
        if (formData.password != formData.passwordRepeat) {
            setErrorMessage(translates.differentPasswords[language]);
            return;
        }
        if (formData.passwordRepeat.length < 8) {
            setErrorMessage(translates.minPasswordLength[language]);
            return;
        }
        
        setBtnState('waiting');
        try {
            // Perform Axios POST request
            const response = await axios.post(
                URL + '/api/register',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            setBtnState('success');

            setTimeout(() => {
                navigate('/login');
            }, 400);
        }
        catch (error) {
            setTimeout(() => {
                setBtnState('default');
                if (error.response.status === 400) {
                    if (error.response.data.message === "email already exists") {
                        setErrorMessage(translates.emailTaken[language]);
                    }
                    if (error.response.data.message === "username already exists") {
                        setErrorMessage(translates.usernameTaken[language]);
                    }
                } else {
                    setErrorMessage(translates.internalError[language]);
                    console.error(error);
                    return;
                }
            }, 600);
            
        }

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
                        <h1>{translates.signUp[language]}</h1>
                        <div>
                            <form onSubmit={handleSubmit} noValidate>
                                <label style={{float: 'left'}}>{translates.enterEmail[language]} *</label>
                                <br />
                                <input 
                                    value={formData.email}
                                    className='input' 
                                    placeholder='fdrlit@foder.com' 
                                    onChange={handleInputChange} 
                                    name="email" 
                                    type="text" />
                                <div style={{height: 30 + 'px'}}></div>
                                {/* <label style={{float: 'left'}}>{translates.enterPhone[language]}</label>
                                <br />
                                <input 
                                    value={formData.phone}
                                    className='input' 
                                    placeholder='+7 (123) 456-78-90' 
                                    onChange={handleInputChange} 
                                    name="phone" 
                                    type="text" />
                                <div style={{height: 30 + 'px'}}></div> */}
                                <label style={{float: 'left'}}>{translates.login[language]} *</label>
                                <br />
                                <input 
                                    value={formData.username}
                                    onChange={handleInputChange} 
                                    placeholder='user123'
                                    name="username" 
                                    type='text' />
                                <div style={{height: 30 + 'px'}}></div>
                                <label style={{float: 'left'}}>{translates.enterPassword[language]} *</label>
                                <br />
                                <input 
                                    value={formData.password}
                                    onChange={handleInputChange} 
                                    name="password" 
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="******"  />
                                    
                        
                                <div style={{height: 30 + 'px'}}></div>
                                <label style={{float: 'left'}}>{translates.repeatPassword[language]} *</label>
                                <br />
                                <input 
                                    value={formData.passwordRepeat}
                                    onChange={handleInputChange} 
                                    name="passwordRepeat" 
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="******"  />
                                <div style={{height: 10 + 'px'}}></div>
                                <label style={{float: 'left'}}>* - обязательное</label>
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
                            <Link to={'/login'}>{translates.alreadyHaveAccount[language]}</Link>
                        </div>
                        {/* TODO ERROR MESSAGE */}
                    {!!errorMessage && <div controlId="register" className='error-container'>
                     <p>{errorMessage}</p>
                 </div>}
                    </div>
                    
                </div>
                <div className='register'>
                    <div className="containerLogin">

                        <div><FaUserPlus className='icon-register'/></div>
                        <h1>{translates.welcome[language]}</h1>
                        <p>{translates.alreadyHaveAccount[language]}</p>
                        <Link type="button"
                            className="v-btn"
                            to={'/login'}>
                                <span className="v-btn__content" data-no-activator=""><span>{translates.signIn[language]}</span> <FaArrowRight className='icon' /></span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        // <div className='center-container'>
        //     <Form onSubmit={handleSubmit}>
        //         <Form.Group className="mb-3 center-form-control" controlId="formEmail">
        //             <Form.Label>Электронная почта</Form.Label>
        //             <Form.Control 
        //                 value={formData.email} 
        //                 onChange={handleInputChange} 
        //                 name="email" 
        //                 type="email" 
        //                 placeholder="Введите эл. почту" 
        //             />
        //         </Form.Group>
        //         <Form.Group className="mb-3 center-form-control" controlId="formUsername">
        //             <Form.Label>Логин</Form.Label>
        //             <Form.Control 
        //                 value={formData.username} 
        //                 onChange={handleInputChange} 
        //                 name="username" 
        //                 type="text" 
        //                 placeholder="Введите логин" 
        //             />
        //         </Form.Group>

        //         <Form.Group controlId="formPassword" className="center-form-control mb-3">
        //             <Form.Label>Пароль</Form.Label>
        //             <div className="password-input-container">
        //                 <Form.Control 
        //                     value={formData.password}
        //                     onChange={handleInputChange} 
        //                     name="password" 
        //                     type={passwordVisible ? "text" : "password"}
        //                     placeholder="Введите пароль" 
        //                 />
        //                 <span 
        //                     className="password-icon" 
        //                     onClick={togglePasswordVisibility}
        //                 >
        //                     {!!formData.password && (passwordVisible ? <FiEyeOff /> : <FiEye />)}
        //                 </span>
        //             </div>
        //         </Form.Group>

        //         <Form.Group controlId="formPasswordRepeat" className="center-form-control mb-3">
        //             <Form.Label>Повторный пароль</Form.Label>
        //             <div className="password-input-container">
        //                 <Form.Control
        //                     value={formData.passwordRepeat} 
        //                     onChange={handleInputChange} 
        //                     name="passwordRepeat" 
        //                     type={passwordRepeatVisible ? "text" : "password"}
        //                     placeholder="Введите пароль еще раз" 
        //                 />
        //                 <span 
        //                     className="password-icon" 
        //                     onClick={togglePasswordRepeatVisibility}
        //                 >
        //                     {!!formData.passwordRepeat && (passwordRepeatVisible ? <FiEyeOff /> : <FiEye />)}
        //                 </span>
        //             </div>
        //         </Form.Group>
        //         {!!errorMessage && <Form.Group controlId="register" className='error-text'>
        //             <p>{errorMessage}</p>
        //         </Form.Group>}
        //         {/* {!!errorMessage && <div className='Register-error mb-3'>Аккаунт не найден. Повторите попытку или зарегистрируйтесь по номеру телефона</div>} */}
        //         <Button className={`btn-submit ${classNames[btnState]}`} variant="primary" type="submit">
        //             <span>{btnNames[btnState]}</span>
        //         </Button>
        //         <Form.Group controlId="register" className='mb-3' style={{marginTop: 10+'px'}}>
        //             <p>Уже есть аккаунт? <a href="/login">Войти</a></p>
        //         </Form.Group>
        //     </Form>
        // </div>
    );
}

export default Register;