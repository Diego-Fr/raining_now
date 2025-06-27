import styles from './Button.module.scss'
import { IoLogIn } from "react-icons/io5";
import {useDispatch,useSelector} from 'react-redux'
import { setShowLoginScren } from '../../../store/authSlice';
import { useEffect, useState } from 'react';
import Menu from './Menu';
import { isLogged } from '../../../utils/authUtils';

const Button = () =>{

    const dispatch = useDispatch()
    const authOptions = useSelector(state=>state.auth)
    const [showMenu, setShowMenu] = useState(false)

    const clickHandler = () =>{
        if(!isLogged(authOptions)){
            dispatch(setShowLoginScren(true))
        } else {
            setShowMenu(!showMenu)
        }

    }

    useEffect(_=>{
        // console.log(authOptions);
    },[authOptions])

    return (
        <div className={styles.container}>
            {!isLogged(authOptions) ? 
                <div className={styles.button} onClick={clickHandler}><IoLogIn /> Entrar</div>:
                <>
                    <div className={styles.button} onClick={clickHandler}><IoLogIn /> Bem vindo, {authOptions.user.name?.split(' ')[0]}</div>
                    { showMenu &&
                        <Menu></Menu>
                    }
                    
                </>
                
            }
            
        </div>
    )
}

export default Button