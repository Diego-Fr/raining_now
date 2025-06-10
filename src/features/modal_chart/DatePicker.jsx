import React, { Suspense, useEffect, useRef, useState } from "react";

const DayPicker = React.lazy(() => import('react-day-picker').then(module => ({ default: module.DayPicker })));
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
        console.log(e);
        
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


    const handleDateChange = (type,date) =>{   
        
        if(date){
            date = moment(date.getTime())
            if(type === 'start'){
                dispatch(setStartDate(date))   
                setShowStart(false);
            } else {
                if(!date.isAfter(moment())){
                    dispatch(setEndDate(date))
                    setShowEnd(false);
                }
            }
        }
        
    }

    const handleBlur = (e) =>{
        setTimeout(() => {
            if (!calendarStartRef.current.contains(e.relatedTarget)) {
                setShowStart(false);
            }
          }, 0);
    }

    const handleBlurEnd = (e) =>{  
        
              
        setTimeout(() => {
            if (!calendarEndRef.current.contains(e.relatedTarget)) {
                setShowEnd(false);
            }
          }, 0);
    }

    useEffect(_=>{
        import('react-day-picker')
    },[])
    

    return (
        <div className={styles.container}>
            <div style={{width: 'fit-content'}}>
                <div>Periodo</div>
                <div className={styles.inputsContainer}>
                    <div style={{ position:'relative'}}>
                        <input readOnly className={styles.inputBox} ref={inputStartRef} value={formatDateToBrazil(startDate.clone(), 'DD-MM-YYYY')} type="text" onBlur={e=>handleBlur(e)} onFocus={_=> setShowStart(true)}></input>
                        <Suspense fallback={<div></div>}>
                            { showStart && <div ref={calendarStartRef} className={styles.dateContainer}><DayPicker
                                                animate
                                                mode="single"
                                                selected={formatDateToBrazil(startDate.clone())}
                                                onSelect={e=>handleDateChange('start',e)}
                                                locale={ptBR}
                                            /></div>}
                        </Suspense>
                        
                    </div>
                    <div style={{ position:'relative'}}>
                        <input readOnly={true} className={styles.inputBox} value={formatDateToBrazil(endDate.clone(), 'DD-MM-YYYY')} ref={inputEndRef} type="text" onBlur={e=>handleBlurEnd(e)} onFocus={_=> setShowEnd(true)}></input>
                        <Suspense fallback={<div></div>}>
                        { showEnd && <div ref={calendarEndRef} className={styles.dateContainer}><DayPicker
                            animate
                            mode="single"
                            selected={formatDateToBrazil(endDate.clone())}
                            onSelect={e=>handleDateChange('end',e)}
                            locale={ptBR}
                            /></div>}
                        </Suspense>
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 'smaller'}}><div>Início</div><div>Fim</div></div>
            </div>
        </div>
    )

}

export default DatePicker