import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AccountDetails.scss';
import config from '../../../config';
import { AiOutlineMenu } from "react-icons/ai";
import { IoChevronForwardOutline } from "react-icons/io5";
import { BiImageAdd } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { error } from 'jquery';
import { set } from 'date-fns';
import { MdOutlineAddAPhoto } from "react-icons/md";
import Avatar from './Avatar/avatar';

const AccountDetails = ({language, transitionSlideClass}) => {
  const [selectedImage, setSelectedImage] = useState();
  const translates = {
    placeholderFirstName: {
        'ru': 'Имя (обязательно)',
        'en': 'First name (required)',
        'tt': 'Исем (мәҗбүри)'
    },
    placeholderLastName: {
      'ru': 'Фамилия (необязательно)',
      'en': 'Last name (optional)',
      'tt': 'Фамилия (өстәмә)'
    },
    placeholderBio: {
      'ru': 'О себе',
      'en': 'Bio',
      'tt': 'Биографиясе'
    },
    placeholderUserName: {
      'ru': 'Имя пользователя',
      'en': 'Username',
      'tt': 'Кулланучы исеме'
    },
    interfaceUserName: {
      'ru': 'Имя пользователя',
      'en': 'Username',
      'tt': 'Кулланучы исеме'
    },
    interfaceBio: {
      'ru': 'Любые детали, такие как возраст, профессия или город.',
      'en': 'Any details such as age, occupation or city.',
      'tt': 'Яшь, һөнәр яки шәһәр кебек төрле мәгълүмат.'
    },
    interfaceBioExample: {
      'ru': 'Пример: 20 лет, арбитражник криптовалют из Казани',
      'en': 'Example: 20 y.o. cryptocurrency arbitrageur from Kazan',
      'tt': 'Өлге: 20 яшьлек криптовалюталар арбитражчысы Казаннан'
    },
    interfaceUsernameDescriptionTop: {
      'ru': ['Вы можете выбрать публичное имя пользователя в ' , (<b>вайперр</b>) , '. В этом случае другие люди смогут найти Вас по такому имени и связаться, не зная Вашей электронной почты.'],
      'en': ['You can choose a username on ' , (<b>viperr</b>) , '. If you do, people will be able to find you by this username and contact you without needing your E-Mail.'],
      'tt': ['Сез ' , (<b>вайперрда</b>) , ' кулланучының җәмәгать исемен сайлый аласыз. Бу очракта, бүтән кешеләр сезне шундый исем белән таба алалар һәм электрон почтагызны белмичә элемтәгә керә алалар.']
    },
    interfaceUsernameDescriptionMiddle: {
      'ru': ['Вы можете использовать символы ' , (<b>a-z</b>) , ', ' , (<b>0-9</b>) , ' и подчёркивания. Минимальная длина – ' , (<b>5</b>) , ' символов.'],
      'en': ['You can use ' , (<b>a-z</b>) , ', ' , (<b>0-9</b>) , ' and underscores. Minimum length is ' , (<b>5</b>) , ' characters.'],
      'tt': ['Сез ' , (<b>a-z</b>) , ', ' , (<b>0-9</b>) , ' һәм басым символларын куллана аласыз. Минималь озынлыгы ' , (<b>5</b>) , ' символ.']
    },
    interfaceUsernameDescriptionBottom: {
      'ru': 'По этой ссылке открывается чат с Вами:',
      'en': 'This link opens a chat with you:',
      'tt': 'Бу сылтама буенча Сезнең белән чат ачыла:'
    },
    success: {
      'ru': 'Имя пользователя свободно.',
      'en': 'Username is available.'
    },
    error: {
      'ru': 'Имя пользователя уже занято.',
      'en': 'This username is already taken.'
    },
    checking: {
      'ru': 'Проверка...',
      'en': 'Checking...'
    },
    invalid: {
      'ru': 'Недопустимое имя пользователя.',
      'en': 'This username is invalid.'
    },
    invalidlength: {
      'ru': 'Имя пользователя должно содержать не меньше 5 символов.',
      'en': 'Usernames must have at least 5 characters.'
    }
  };
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [userName, setUserName] = useState('');
  const [defaultFirstName, setDefaultFirstName] = useState('');
  const [defaultLastName, setDefaultLastName] = useState('');
  const [defaultBio, setDefaultBio] = useState('');
  const [defaultUserName, setDefaultUserName] = useState('');
  const [userNameValidity, setUserNameValidity] = useState();
  const [saveButtonVisibility, setSaveButtonVisibility] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState();
  const [preview, setPreview] = useState();
  const [showModal, setShowModal] = useState(false);
  const maxBioLength = 120;
  const usernameRegex = /^[a-z0-9_]{0,}$/;
  const bioRef = useRef(null);
  const URL = config.apiUrl;
  const token = Cookies.get('login-token');
  const [transitionClass, setTransitionClass] = useState(transitionSlideClass);
  const FILESERVERURL = config.fileServerUrl;
    useEffect(() => {
        setTransitionClass('Transition_slide-to');
        setTimeout(() => setTransitionClass('Transition_slide-active'), 200);
    }, [transitionSlideClass]);

  const handleBioChange = (event) => {
    if (bioRef.current) {
      bioRef.current.style.height = '0px';

      let scrollHeight = bioRef.current.scrollHeight;
      bioRef.current.style.height = scrollHeight + 'px';
      const textarea = event.target;
      setBio(event.target.value.slice(0, maxBioLength));
      // textarea.style.height = 'auto';
      // textarea.style.height = `${textarea.scrollHeight}px`;
    }
    if (event.target.value.slice(0, maxBioLength) != defaultBio && !saveButtonVisibility)
      setSaveButtonVisibility(true)
  };

  const saveUserInfo = async () => {
    if ((!!userNameValidity && userNameValidity != 'success') || !userName ) return;
    try {
      await axios.post(URL + '/api/account/UpdateUserInfo', {
        FirstName: firstName,
        LastName: lastName,
        Bio: bio,
        UserName: userName
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setSaveButtonVisibility(false)
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const receiveUserInfo = async () => {
    
      await axios.get(URL + '/api/account/receiveUserInfo', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        const userInfo = response.data;
        setDefaultFirstName(userInfo.FirstName || '');
        setDefaultLastName(userInfo.LastName || '');
        setDefaultBio(userInfo.Bio || '');
        setDefaultUserName(userInfo.UserName || '');
        setFirstName(userInfo.FirstName || '');
        setLastName(userInfo.LastName || '');
        setBio(userInfo.Bio || '');
        setUserName(userInfo.UserName || '');
        setAvatarUrl(userInfo.AvatarUrl || 'ef35a078bcee491ae894385105c2ca808d61876aaa4441c3019a0d7d5abae4cd')
      })
      .catch((error) => console.error('Error fetching user info:', error));
  };

  useEffect(() => {
    receiveUserInfo();
  },[])

  const handleFirstNameChange = (e) => {
    if (e.target.value.length > 20) return;
    setFirstName(e.target.value);
    if (e.target.value != defaultFirstName && !saveButtonVisibility)
      setSaveButtonVisibility(true)
  };

  const handleLastNameChange = (e) => {
    if (e.target.value.length > 20) return;
    setLastName(e.target.value);
    if (e.target.value != defaultLastName && !saveButtonVisibility)
      setSaveButtonVisibility(true)
  };

  const handleUserNameChange = (e) => {
    if (e.target.value.length > 20) return;
    setUserName(e.target.value);
    if (e.target.value != defaultUserName && !saveButtonVisibility)
      setSaveButtonVisibility(true)
  };

  const isUserNameAvailable = () => {
    if (userName.length < 5) {
      setUserNameValidity('invalidlength')
      return;
    }
    if (!usernameRegex.test(userName)) {
      setUserNameValidity('invalid');
      return;
    }
    setUserNameValidity('checking')
    axios.get(URL + '/api/account/isUserNameAvailable?userName=' + userName, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then((response) => {
      if (response.data) {
        setTimeout(setUserNameValidity('success'), 1000);
      } else {
        setTimeout(setUserNameValidity('error'), 1000);
      }
    })
    .catch((error) => console.error('Error fetching username:', error));
  };

  useEffect(() => {
    if (userName == defaultUserName || !userName) return
    const timeout = setTimeout(() => {
        isUserNameAvailable();
    }, 400);
    
    return () => clearTimeout(timeout);
  }, [userName])
  ;
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    
    setSelectedImage(file);
    //     // Проверяем, что выбранный файл - изображение
    //     if (file.type === 'image/jpeg' || file.type === 'image/png') {
    //         // Обновляем состояние выбранного изображения
    //         const formData = new FormData();
    //         formData.append('image', file);
    //         axios.post(URL + '/api/account/UpdateUserAvatar', formData, {
    //           headers: {
    //             'Content-Type': 'multipart/form-data',
    //             'Authorization': `Bearer ${token}`
    //           }
    //         })
    //         .then((response) => {

    //         });
    //         setShowModal(true);
    //     } else {
    //         // Если выбранный файл не является изображением, выводим сообщение об ошибке
    //         alert('Пожалуйста, выберите изображение формата JPEG или PNG.');
    //     }
    // }
  };
  const onCrop = (_preview) => {
    const formData = new FormData();
    var img = new Image();

    img.src = _preview;
    img.onload = function() {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(function(blob) {
          var formData = new FormData();

          formData.append('image', blob);
          axios.post(URL + '/api/account/UpdateUserAvatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          })
          .then((response) => {
      
          });
      }, 'image/png');
    }
    
  }
  return (
    <>
      <div id="Settings">

        <div className={`Transition_slide ${transitionClass}`}>
          <div className="settings-fab-wrapper">
            <div className="settings-content no-border">
              <div className="settings-edit-profile settings-item">
                
                <div className="AvatarEditable">
                  <label className="filled" role="button" tabIndex="0" title="Edit your profile photo">
                  <input type="file" onChange={handleImageChange}  accept="image/png, image/jpeg" />
                  
                  <MdOutlineAddAPhoto className="icon icon-camera-add" />
                  <img src={`${FILESERVERURL}/getImage?fileHash=${avatarUrl}`} draggable="false"/>
                  </label>
                  
                </div>
                <Avatar
                  width={200}
                  height={200}
                  onCrop={onCrop}
                  // onClose={this.onClose}
                  // onBeforeFileLoad={this.onBeforeFileLoad}
                  img={selectedImage}
                  label='Выберите картинку'
                />
                <div className="input-group touched with-label">
                  <input className="form-control" type="text" placeholder=" " dir="auto" aria-label={translates.placeholderFirstName[language]} value={firstName} onChange={handleFirstNameChange}/>
                  <label>{translates.placeholderFirstName[language]}</label>
                </div>
                <div className="input-group with-label">
                  <input className="form-control" type="text" placeholder=" " dir="auto" aria-label={translates.placeholderLastName[language]} value={lastName} onChange={handleLastNameChange}/>
                  <label>{translates.placeholderLastName[language]}</label>
                </div>
                <div className="input-group with-label">
                  <textarea ref={bioRef} className="form-control" dir="auto" placeholder=" " maxLength={maxBioLength} value={bio} onChange={handleBioChange} aria-label={translates.placeholderBio[language]} style={{ height: "51px" }}></textarea>
                  <label>{translates.placeholderBio[language]}</label>
                  <div className="max-length-indicator">{maxBioLength - bio.length}</div>
                </div>
                <p className="settings-item-description">
                  {translates.interfaceBio[language]}<br/>{translates.interfaceBioExample[language]}
                </p>
              </div>
              <div className="settings-item">
                <h4 className="settings-item-header">{translates.interfaceUserName[language]}</h4>
                <div className={`input-group touched with-label ${userNameValidity}`}>
                  <input className="form-control" placeholder=" " type="text" dir="auto" aria-label={translates.placeholderUserName[language]} value={userName} onChange={handleUserNameChange} onBlur={() => {if(userName.length == 0) setUserNameValidity(null)} }/>
                  <label>{userNameValidity ? translates[userNameValidity][language] : translates.placeholderUserName[language]}</label>
                </div>
                <p className="settings-item-description">
                  {translates.interfaceUsernameDescriptionTop[language]}<br /><br />{translates.interfaceUsernameDescriptionMiddle[language]}
                </p>
                <p className="settings-item-description">
                  {translates.interfaceUsernameDescriptionBottom[language]}<br /><span className="username-link">{`https://вайперр.рф/${defaultUserName}`}</span>
                </p>
              </div>
            </div>
            <button type="button" className={`Button FloatingActionButton ${saveButtonVisibility ? 'revealed' : ''} default primary round`} aria-label="Save" title="Save" tabindex="-1" onClick={saveUserInfo}>
                  <FaCheck className="icon icon-check" />
            </button>
          </div>
        </div>
      </div>
      </>
  );
};

export default AccountDetails;
