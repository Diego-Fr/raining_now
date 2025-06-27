import moment from 'moment';

const formatDateToBrazil = (utcDate, format) => {
    if (!utcDate) return '';

    if(typeof utcDate === 'object'){ //esperasse moment
        utcDate = utcDate.subtract(3, 'hours')        
    
        if(format){
            utcDate = utcDate.format(format)
        }
    } else { //string
        utcDate = moment(utcDate, format || 'YYY-MM-DD HH:mm')
        
        utcDate = utcDate.subtract(3, 'hours')
    
        if(format){
            utcDate = utcDate.format(format)    
        }
    }
    
    return utcDate
}

export {
    formatDateToBrazil
}