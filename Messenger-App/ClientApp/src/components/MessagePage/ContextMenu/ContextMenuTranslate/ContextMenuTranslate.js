import React from 'react';

import { IoChevronBack } from "react-icons/io5";

const ContextMenuTranslate = ({ fetchTranslateText, back, language }) => {
    const translates = {
        back: {
            'ru': 'Назад',
            'en': 'Back',
            'tt': 'Артка'
        },
        russian: {
            'ru': 'Русский',
            'en': 'Russian',
            'tt': 'Рус'
        },
        english: {
            'ru': 'Английский',
            'en': 'English',
            'tt': 'Инглиз'
        },
        tatar: {
            'ru': 'Татарский',
            'en': 'Tatar',
            'tt': 'Татар'
        },
        spanish: {
            'ru': 'Испанский',
            'en': 'Spanish',
            'tt': 'Испан'
        },
        chinese: {
            'ru': 'Китайский',
            'en': 'Chinese',
            'tt': 'Кытай'
        },
        deutsch: {
            'ru': 'Немецкий',
            'en': 'Deutsch',
            'tt': 'Немец'
        },
        french: {
            'ru': 'Французский',
            'en': 'French',
            'tt': 'Француз'
        },
      };
    return (
        <div  className='MessageContextMenu_items scrollable-content custom-scroll'>
            <div onClick={back} className='MenuItem compact'>
                <IoChevronBack className='icon' />
                {translates.back[language]}
            </div>
            <div onClick={() => fetchTranslateText('ru')} className='MenuItem compact'>
                <div className='icon text-icon'>
                    RU
                </div>
                {translates.russian[language]}
            </div>
            <div onClick={() => fetchTranslateText('en')} className='MenuItem compact'>
                <div className='icon text-icon'>
                    EN
                </div>
                {translates.english[language]}
            </div>
            <div onClick={() => fetchTranslateText('tt')} className='MenuItem compact'>
                <div className='icon text-icon'>
                    TT
                </div>
                {translates.tatar[language]}
            </div>
            <div onClick={() => fetchTranslateText('es')} className='MenuItem compact'>
                <div className='icon text-icon'>
                    ES
                </div>
                {translates.spanish[language]}
            </div>
            <div onClick={() => fetchTranslateText('zh')} className='MenuItem compact'>
                <div className='icon text-icon'>
                    CH
                </div>
                {translates.chinese[language]}
            </div>
            <div onClick={() => fetchTranslateText('de')} className='MenuItem compact'>
                <div className='icon text-icon'>
                    DE
                </div>
                {translates.deutsch[language]}
            </div>
            <div onClick={() => fetchTranslateText('fr')} className='MenuItem compact'>
                <div className='icon text-icon'>
                    FR
                </div>
                {translates.french[language]}
            </div>
        </div>
    );
}
export default ContextMenuTranslate;