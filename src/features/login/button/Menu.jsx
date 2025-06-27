import { logOut } from '../../../store/authSlice'
import styles from './Menu.module.scss'
import {useDispatch, useSelector} from 'react-redux'



const Menu = () =>{
    const dispatch = useDispatch()
    const authOptions = useSelector(state=>state.auth)

    const logout = () =>{
        dispatch(logOut())
    }

    return (
        <div className={styles.container}>
            <div className={styles.itemWrapper}>
                <div className={styles.item} onClick={logout}>Sair</div>
            </div>
        </div>
    )
}

export default Menu