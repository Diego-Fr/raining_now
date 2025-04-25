import styles from './ContextMenu.module.scss'
import Item from './Item'
import {useDispatch} from 'react-redux'
import {setContext} from '../../store/contextSlice'


const ContextMenu = () =>{

    const dispatch = useDispatch()

    const items = [
        {id: 'rain', title: 'chuva', icon:''},
        {id: 'level', title: 'nível', icon:''}
    ]

    const itemClickHandler = id =>{        
        dispatch(setContext(id))
    }

    return (
        <div className={styles.container}>
            <div className={styles.item}>
                {items.map((item, index)=>  
                    (<Item key={index} id={item.id} title={item.title} onclick={itemClickHandler} />)
                )}
                
            </div>
        </div>
    )
}

export default ContextMenu