import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import styles from './DatePicker.module.scss'
import "react-day-picker/style.css";
import moment from "moment";
import { useSelector } from 'react-redux'

const DatePicker = () =>{
    const [startDate, setStartDate] = useState(useSelector(state=>state.modalchart.start_date))
    const [endDate, setEndDate] = useState(useSelector(state=>state.modalchart.end_date))
    const [showStart, setShowStart] = useState(false)
    const [showEnd, setShowEnd] = useState(false)
    
    const inputStartRef = useRef()
    const calendarStartRef = useRef()

    const inputEndRef = useRef()
    const calendarEndRef = useRef()

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

    useEffect(_=>{
        console.log(endDate);
        
    }, [endDate])


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateChange = (type,date) =>{        
        if(type === 'start'){
            setStartDate(moment(date.getTime()).format('DD/MM/YYYY'))            
        } else {
            setEndDate(moment(date.getTime()).format('DD/MM/YYYY'))
        }
    }

    return (
        <div className={styles.container}>
            <div style={{width: 'fit-content'}}>
                <div className={styles.inputsContainer}>
                    <div style={{ position:'relative'}}>
                        <input readOnly={true} className={styles.inputBox} ref={inputStartRef} value={startDate} type="text" onFocus={_=> setShowStart(true)}></input>
                        
                        { showStart && <div ref={calendarStartRef} className={styles.dateContainer}><DayPicker
                            animate
                            mode="single"
                            selected={startDate}
                            onSelect={e=>handleDateChange('start',e)}
                            /></div>}
                    </div>
                    <div style={{ position:'relative'}}>
                        <input readOnly={true} className={styles.inputBox} value={endDate} ref={inputEndRef} type="text" onFocus={_=> setShowEnd(true)}></input>
                        
                        { showEnd && <div ref={calendarEndRef} className={styles.dateContainer}><DayPicker
                            animate
                            mode="single"
                            selected={endDate}
                            onSelect={e=>handleDateChange('end',e)}
                            /></div>}
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 'smaller'}}><div>Início</div><div>Fim</div></div>
            </div>
        </div>
    )

}

export default DatePicker