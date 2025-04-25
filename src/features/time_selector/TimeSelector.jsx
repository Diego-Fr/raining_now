import styles from './TimeSelector.module.scss'

const TimeSelector = _=>{

    let timeoptions = {plu: [1,2,3,6,12,24,48,72]}

    const clickHandler = time =>{
        console.log(time);
        
    }

    return (
        <div className={styles.container}>
            {timeoptions.plu.map((time, index)=> <div className={styles.item} onClick={_=>clickHandler(time)}>{time}</div> )}
        </div>
    )
}

export default TimeSelector