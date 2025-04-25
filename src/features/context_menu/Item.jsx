import styles from './Item.module.scss'

const Item = options =>{
    const {id, title, onclick} = options

    const clickHandler = () =>{
        onclick(id)
    }

    return (
        <div className={styles.container} onClick={clickHandler}>
            <div className={styles.title}>{title}</div>
        </div>
    )
}

export default Item