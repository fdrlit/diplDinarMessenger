import React, { useState, useEffect } from 'react'
import '../../styles/global.scss'
const NotFound = () => {
    return (
        <div className='center-container'>
            <p style={{fontSize: 20 + 'px'}}>Ошибка 404. Страница не найдена. Вернуться на <a href="/im">главную</a></p>
        </div>
    );
}

export default NotFound;