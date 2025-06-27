const colorByMeasurementClassification = value =>{
    switch(value.toString()){
        case '1':
            return 'rgba(20, 167, 224, 0.9)';
        case '2':
            return 'rgba(20, 167, 224, 0.9)';
        case '3':
            return 'rgba(20, 167, 224, 0.9)';
        case '4':
            return 'red'
    }
}

export {
    colorByMeasurementClassification
}