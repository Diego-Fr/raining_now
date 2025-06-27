import { useRef, useState } from "react"
import styles from './Modal.module.scss'

const Modal = props =>{
    if (!props.show) return null;


    const [modalState, setModalState] = useState({
        show: false
    })

    const wrapperRef = useRef()


    const outsideClick = () =>{
        setModalState(state=>({
            ...state, show: false
        }))

        if(props.onClose){
            props.onClose()
        }
    }

    return (
        <div onMouseDown={_=>{outsideClick()}} className={`${styles.container} ${props.show ? styles.show : ''}`}>
                    <div onMouseDown={e=>e.stopPropagation()} className={styles.wrapper} ref={wrapperRef}>
                        <div>{props.title}</div>
                        <div>{props.body}</div>
                        <div>{props.footer}</div>
                    </div>
        </div>
    )
}

export default Modal