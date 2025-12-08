import style from './ContextSelector.module.scss'
import { FaTable, FaChartColumn } from "react-icons/fa6";


const ContextSelector = ({modalOptions, setModalOptions}) =>{
    const clickHandler = type =>{
        console.log(type);
        
        setModalOptions(state=>({
            ...state,
            type
        }))
    }
    
    return (
        <div className={style.container}>
            <div className={`${style.button} ${modalOptions.type === 'chart' ? style.active : ''}`} onClick={_=>clickHandler('chart')}><FaChartColumn /> Gráfico</div>
            <div className={`${style.button} ${modalOptions.type === 'table' ? style.active : ''}`} onClick={_=>clickHandler('table')}><FaTable /> Tabela</div>
        </div>
    )
}

export default ContextSelector