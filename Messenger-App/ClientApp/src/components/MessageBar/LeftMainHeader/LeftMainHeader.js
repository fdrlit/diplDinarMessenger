import React, { useState } from 'react';
import { AiOutlineMenu } from "react-icons/ai";
import MessageBarMenu from '../MessageBarMenu/MessageBarMenu';
import { MdSearch } from "react-icons/md";
import { IoChevronForwardOutline } from "react-icons/io5";

const LeftMainHeader = ({ isDarkTheme, setIsDarkTheme, showSettings, settingsOpened, setSettingsOpened, hideSettings, searchText, setSearchText, selectedItem, setSelectedItem, language }) => {
    const [showMenu, setShowMenu] = useState(false);
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }
    const handleMenuButtonClick = () => {
        if (settingsOpened) {
            hideSettings();
        } else setShowMenu(!showMenu);
    };
    const handleSearchInputChange = (e) => {
        setSearchText(e.target.value);
    }
    const handleSearchInputFocus = () => {
        if (!settingsOpened) {
            showSettings();
        }
    }
    const translates = {
        interfaceLanguage: {
            'ru': 'Язык интерфейса',
            'en': 'Interface Language',
            'tt': 'Интерфейс теле'
        },
        search: {
            'ru': 'Поиск',
            'en': 'Search',
            'tt': 'Эзләү'
        },
        editProfile: {
            'ru': 'Редактировать профиль',
            'en': 'Edit profile',
            'tt': 'Профильне үзгәртү'
        }
      };
    
    return (
        <div className="left-main-header">
            <div id="LeftMainHeader" className="left-header">
                <div className="drop-down-menu main-menu">
                    <button type="button" className={`Button smaller translucent round has-ripple menu-button ${showMenu ? 'is-active' : ''}`} onClick={handleMenuButtonClick}>
                        <div className={`animated-menu-icon ${!!settingsOpened ? ' state-back' : ''}`}>
                            {!settingsOpened ? <AiOutlineMenu style={{marginTop: -0.4 + 'rem'}} /> : <IoChevronForwardOutline style={{marginTop: -0.4 + 'rem'}} />}
                        </div>
                    </button>
                                
                    <MessageBarMenu language={language} showSettings={showSettings} setSelectedItem={setSelectedItem} isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} visible={showMenu}  handleHideMenu={toggleMenu} />
                </div>
                <div className="search-input">
                    {!selectedItem && 
                        <div>
                            <input id="input-search" value={searchText} onFocus={handleSearchInputFocus} onChange={handleSearchInputChange} type="text" dir="auto" placeholder={translates.search[language]} className="form-control" autoComplete='off'/>
                            <div className='Transition icon-container'>
                                <div className='Transition_slide'>
                                    <MdSearch className='icon search-icon'/>
                                </div>
                            </div>
                        </div>}
                    {selectedItem == 'accountDetails' && <div className="interface-language">{translates.editProfile[language]}</div>}
                    {selectedItem == 'changeLanguage' && <div className="interface-language">{translates.interfaceLanguage[language]}</div>}
                </div>
            </div>
        </div>
  );
}
export default LeftMainHeader;