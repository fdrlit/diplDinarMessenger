import React, { Component, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MessageBarMenu.scss';
import { IoExitOutline } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { RiContactsBookLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLanguageOutline } from "react-icons/io5";
import { MdOutlineNightsStay, MdOutlineWbSunny } from "react-icons/md";
import Cookies from 'js-cookie';
import ModalDialog from '../../ModalDialog/ModalDialog';

const MessageBarMenu = ({ handleHideMenu, visible, isDarkTheme, setIsDarkTheme, setSelectedItem, showSettings, language }) => {
  const navigate = useNavigate();
  const [darkThemeEnabled, setDarkThemeEnabled] = useState(false);
  const translates = {
      account: {
          'ru': 'Аккаунт',
          'en': 'Account',
          'tt': 'Аккаунт'
      },
      contacts: {
        'ru': 'Контакты',
        'en': 'Contacts',
        'tt': 'Бәйләнеш'
      },
      settings: {
        'ru': 'Настройки',
        'en': 'Settings',
        'tt': 'Көйләнеш'
      },
      dayMode: {
        'ru': 'Дневной режим',
        'en': 'Day mode',
        'tt': 'Көндезге режим'
      },
      nightMode: {
        'ru': 'Ночной режим',
        'en': 'Night mode',
        'tt': 'Төнге режим'
      },
      changeLanguage: {
        'ru': 'Язык',
        'en': 'Language',
        'tt': 'Тел'
      },
      exit: {
        'ru': 'Выход',
        'en': 'Exit',
        'tt': 'Чыгырга'
      },
  };
  useEffect(() => {
    const currentTheme = Cookies.get('theme') === 'dark';
    setDarkThemeEnabled(currentTheme);
    document.body.className = currentTheme ? 'dark-theme' : 'light-theme';
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkThemeEnabled;
    setDarkThemeEnabled(newTheme);
    Cookies.set('theme', newTheme ? 'dark' : 'light');
    document.body.className = newTheme ? 'dark-theme' : 'light-theme';
  };
  const handleContextMenu = (e) => {
    e.preventDefault();
    handleHideMenu();
  }
  const handleLogout = () => {
    Cookies.remove('login-token');
    navigate('/login');
  };
  const handleChangeTheme = () => {
    localStorage.setItem('dark-theme-enabled', !isDarkTheme);
    setIsDarkTheme(!isDarkTheme);
  }
  const handleChangeLanguage = () => {
    setSelectedItem('changeLanguage');
    showSettings();
    handleHideMenu();
  }
  const handleAccountDetails = () => {
    setSelectedItem('accountDetails');
    showSettings();
    handleHideMenu();
  }

  const handleSettings = () => {
    setSelectedItem('settings');
    showSettings();
    handleHideMenu(); 
  }

  return (
    <div className='Menu compact main-menu'>
      {visible && <div className='backdrop' onContextMenu={handleContextMenu} onClick={handleHideMenu}></div>}
      <div className={"bubble menu-container custom-scroll top left with-footer opacity-transition fast " + (visible ? "open shown" : "not-open not-shown")}>
        <div className="MenuItem compact" onClick={handleAccountDetails}> <VscAccount className="icon"/>{translates.account[language]}</div>
        <div className="MenuItem compact" > <RiContactsBookLine className="icon"/>{translates.contacts[language]}</div>
        <div className="MenuItem compact" onClick={handleSettings}> <IoSettingsOutline className="icon"/>{translates.settings[language]}</div>
        {isDarkTheme ? <div onClick={handleChangeTheme} className="MenuItem compact" > <MdOutlineWbSunny className="icon"/>{translates.dayMode[language]}</div>
        : <div onClick={handleChangeTheme} className="MenuItem compact" > <MdOutlineNightsStay className="icon"/>{translates.nightMode[language]}</div>}
        <div className="MenuItem compact" onClick={handleChangeLanguage} > <IoLanguageOutline className="icon"/>{translates.changeLanguage[language]}</div>
        <div className="MenuItem compact" onClick={handleLogout}> <IoExitOutline className="icon"/>{translates.exit[language]}</div>
        <div className='footer'>designed by Dmitry Bushuev</div>
      </div>
      
    </div>
  );
}
export default MessageBarMenu;