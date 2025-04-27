import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import styles from './DatePicker.module.scss'
import "react-day-picker/style.css";
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux'
import { setEndDate, setStartDate } from "../../store/modalChartSlice";
import { formatDateToBrazil } from '@/utils/dateUtils'
import { ptBR } from "react-day-picker/locale";

const DatePicker = () =>{
    // const [startDate, setSD] = useState(useSelector(state=>state.modalchart.start_date))
    // const [endDate, setED] = useState(useSelector(state=>state.modalchart.end_date))

    const startDate = useSelector(state=> state.modalchart.start_date)
    const endDate = useSelector(state=> state.modalchart.end_date)

    const [showStart, setShowStart] = useState(false)
    const [showEnd, setShowEnd] = useState(false)
    
    const inputStartRef = useRef()
    const calendarStartRef = useRef()

    const inputEndRef = useRef()
    const calendarEndRef = useRef()

    const dispatch = useDispatch()

    const handleClickOutside = e =>{        
        if (
            (inputStartRef.current && inputStartRef.current.contains(e.target)) ||
            (calendarStartRef.current && calendarStartRef.current.contains(e.target))
          ) {
            setShowStart(true); 
            setShowEnd(false)
          } else if(
            (inputEndRef.current && inputEndRef.current.contains(e.target)) ||
            (calendarEndRef.current && calendarEndRef.current.contains(e.target))
          ) {
            setShowStart(false); 
            setShowEnd(true)
          }
          
          else {
            setShowEnd(false)
            setShowStart(false)
          }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateChange = (type,date) =>{   
        
        if(date){
            date = moment(date.getTime())
            if(type === 'start'){
                dispatch(setStartDate(date))   
            } else {
                if(!date.isAfter(moment())){
                    dispatch(setEndDate(date))
                }
            }
        }
        
    }
    

    return (
        <div className={styles.container}>
            <div style={{width: 'fit-content'}}>
                <div className={styles.inputsContainer}>
                    <div style={{ position:'relative'}}>
                        <input readOnly={true} className={styles.inputBox} ref={inputStartRef} value={formatDateToBrazil(startDate.clone(), 'DD-MM-YYYY')} type="text" onFocus={_=> setShowStart(true)}></input>
                        
                        { showStart && <div ref={calendarStartRef} className={styles.dateContainer}><DayPicker
                            animate
                            mode="single"
                            selected={formatDateToBrazil(startDate.clone())}
                            onSelect={e=>handleDateChange('start',e)}
                            locale={ptBR}
                            /></div>}
                    </div>
                    <div style={{ position:'relative'}}>
                        <input readOnly={true} className={styles.inputBox} value={formatDateToBrazil(endDate.clone(), 'DD-MM-YYYY')} ref={inputEndRef} type="text" onFocus={_=> setShowEnd(true)}></input>
                        
                        { showEnd && <div ref={calendarEndRef} className={styles.dateContainer}><DayPicker
                            animate
                            mode="single"
                            selected={formatDateToBrazil(endDate.clone())}
                            onSelect={e=>handleDateChange('end',e)}
                            locale={ptBR}
                            /></div>}
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 'smaller'}}><div>Início</div><div>Fim</div></div>
            </div>
        </div>
    )

}

export default DatePicker