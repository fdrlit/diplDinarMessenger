const translates = {
    today: {
        'ru': 'Сегодня',
        'en': 'Today',
        'tt': 'Бүген'
    },
    yesterday: {
        'ru': 'Вчера',
        'en': 'Yesterday',
        'tt': 'Кичә'
    },
};
const formatDate = (date, language) => {
    let daysOfWeek = [
        language == 'ru' ? 'Вс' : language == 'en' ? 'Sun' : 'Якшәмбе',
        language == 'ru' ? 'Пн' : language == 'en' ? 'Mon' : 'Дүшәмбе',
        language == 'ru' ? 'Вт' : language == 'en' ? 'Tue' : 'Сишәмбе',
        language == 'ru' ? 'Ср' : language == 'en' ? 'Wed' : 'Чәршәмбе',
        language == 'ru' ? 'Чт' : language == 'en' ? 'Thu' : 'Пәнҗешәмбе',
        language == 'ru' ? 'Пт' : language == 'en' ? 'Fri' : 'Җомга',
        language == 'ru' ? 'Сб' : language == 'en' ? 'Sat' : 'Шимбә',
    ];
    let currentDate = new Date();
    let daysDifference = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
    if (daysDifference == 0) {
        var hour = date.getHours();
        var minute = date.getMinutes();
        return `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
    } else if (daysDifference == 1) {
        return 'Вчера';
    } else if (daysDifference <= 7) {
        return daysOfWeek[date.getDay()];
    } else {// Получаем компоненты даты (день, месяц, год)
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        
        // Форматируем компоненты даты
        return (day < 10 ? '0' : '') + day + '.' + (month < 10 ? '0' : '') + month + '.' + year;
        
    }
}

const formatDateDay = (date, language) => { 
    const months = [
        language == 'ru' ? 'января' : language == 'en' ? 'january' : 'гыйнвар',
        language == 'ru' ? 'февраля' : language == 'en' ? 'february' : 'февраль',
        language == 'ru' ? 'марта' : language == 'en' ? 'march' : 'март',
        language == 'ru' ? 'апреля' : language == 'en' ? 'april' : 'апрель',
        language == 'ru' ? 'мая' : language == 'en' ? 'may' : 'май',
        language == 'ru' ? 'июня' : language == 'en' ? 'june' : 'июнь',
        language == 'ru' ? 'июля' : language == 'en' ? 'july' : 'июль',
        language == 'ru' ? 'августа' : language == 'en' ? 'august' : 'август',
        language == 'ru' ? 'сентября' : language == 'en' ? 'september' : 'сентябрь',
        language == 'ru' ? 'октября' : language == 'en' ? 'october' : 'октябрь',
        language == 'ru' ? 'ноября' : language == 'en' ? 'november' : 'ноябрь',
        language == 'ru' ? 'декабря' : language == 'en' ? 'december' : 'декабрь',
    ];
    let currentDate = new Date();
    let daysDifference = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
    if (daysDifference == 0) {
        return translates.today[language];
    } else if (daysDifference == 1) {
        return translates.yesterday[language];
    } else if (daysDifference < 365)  {
        
        var day = date.getDate();
        var month = date.getMonth();
        return `${day} ${months[month]}`;
    } else {// Получаем компоненты даты (день, месяц, год)
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        
        // Форматируем компоненты даты
        return (day < 10 ? '0' : '') + day + '.' + (month < 10 ? '0' : '') + month + '.' + year;
        
    }
}

function formatLastOnline(lastOnlineDate, language) {
    // Преобразуем дату последней активности в объект Date
    const lastOnline = new Date(lastOnlineDate);
    const now = new Date();

    // Разница в миллисекундах между текущим временем и временем последней активности
    const diff = now - lastOnline;

    // Преобразуем разницу в минуты
    const minutesDiff = Math.round(diff / (1000 * 60));
    if (minutesDiff == 0) {
        return (
            language == 'ru' ? `был(-а) в сети недавно` : 
            language == 'en' ? 'last seen recently' :
            language == 'tt' ? 'күптән түгел генә интернетта булган' : null
        );
    }
    let additionalSymbol = '';
    if (minutesDiff == 1) {
        additionalSymbol = 'у';
    }
    if (minutesDiff >= 2 && minutesDiff <= 4)
        additionalSymbol = 'ы';
    if (Math.floor(minutesDiff / 10) != 1 && Math.floor(minutesDiff / 10) != 0) {
        if (minutesDiff % 10 == 1) {
            additionalSymbol = 'у';
        }
        if (minutesDiff % 10 >= 2 && minutesDiff % 10 <= 4)
            additionalSymbol = 'ы';
    }
    // Если пользователь был онлайн менее часа назад
    if (minutesDiff < 60) {
        return (
            language == 'ru' ? `был(-а) в сети ${minutesDiff} минут${additionalSymbol} назад` : 
            language == 'en' ? `last seen ${minutesDiff} minute${minutesDiff != '1' ? 's' : ''} ago`:
            language == 'tt' ? ` ${minutesDiff} минут элек булган` : null
        );
    }


    // Если пользователь был онлайн от 1 до 4 часов назад
    if (minutesDiff < 240) {
        const hoursDiff = Math.floor(minutesDiff / 60);
        if (hoursDiff == 1)
            return (
                language == 'ru' ? `был(-а) в сети 1 час назад` : 
                language == 'en' ? `last seen 1 hour ago`:
                language == 'tt' ? `1 сәгать элек булган` : null
            );
        return (
            language == 'ru' ? `был(-а) в сети ${hoursDiff} часа назад` : 
            language == 'en' ? `last seen ${hoursDiff} hours ago`:
            language == 'tt' ? `${hoursDiff} сәгать элек булган` : null
        );
    }

    // Если пользователь был онлайн сегодня
    if (lastOnline.getDate() === now.getDate()) {
        const hours = lastOnline.getHours();
        const minutes = lastOnline.getMinutes();
        return (
            language == 'ru' ? `был(-а) в сети в ${(hours < 10 ? '0' : '')}${hours}:${(minutes < 10 ? '0' : '')}${minutes}` : 
            language == 'en' ? `last seen at ${(hours < 10 ? '0' : '')}${hours}:${(minutes < 10 ? '0' : '')}${minutes}`:
            language == 'tt' ? `${(hours < 10 ? '0' : '')}${hours}:${(minutes < 10 ? '0' : '')}${minutes} сәгатьтә булган` : null
        );
    }

    // Если пользователь был онлайн не сегодня
    const year = lastOnline.getFullYear();
    const month = lastOnline.getMonth() + 1;
    const day = lastOnline.getDate();
    return (
        language == 'ru' ? `был(-а) в сети ${(day < 10 ? '0' : '')}${day}.${(month < 10 ? '0' : '')}${month}.${(year < 10 ? '0' : '')}${year}` : 
        language == 'en' ? `last seen ${(day < 10 ? '0' : '')}${day}.${(month < 10 ? '0' : '')}${month}.${(year < 10 ? '0' : '')}${year}`:
        language == 'tt' ? `${(day < 10 ? '0' : '')}${day}.${(month < 10 ? '0' : '')}${month}.${(year < 10 ? '0' : '')}${year} булган` : null
    );
    
}

const formatDateToHours = (date) => {
    var hour = date.getHours();
    var minute = date.getMinutes();
    return (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute;
}

export { formatDate, formatDateDay, formatLastOnline, formatDateToHours };