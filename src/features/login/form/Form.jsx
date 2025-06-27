import Modal from "@components/modal/Modal"
import styles from './Form.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import { getMeData, setExpires, setRoles, setShowLoginScren, setToken, updateMe, updateToken } from "../../../store/authSlice"
import { useState } from "react"
import axios from "axios"
import {  toast } from 'react-toastify'
import {isValidEmail} from '@utils/formUtils.js'



const Form = _ =>{
    const modalOptions = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [formValues, setFormValues] = useState({
        email: '', password: ''
    })

    const onClose = () =>{
        dispatch(setShowLoginScren(false))
    }

    const title = (
        <div className={styles.titleContainer}>
            <div className={styles.title}>
                Fazer login
            </div>
            <div className={styles.subtitle}>
                Use sua conta e aproveite todas as funcionalidades do Chuva Agora do SIBH
            </div>
        </div>
    )

    const onChange = e =>{
        setFormValues(state=>({
            ...state, [e.target.name]: e.target.value
        }))
    }

    const handleKeyDown = e =>{
         if (e.key === "Enter") {
            submit()
        } else {
            
        }
    }

    const body = (
        <div className={styles.bodyContainer}>
            <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" name={'email'} value={formValues.email} onChange={onChange} onKeyDown={handleKeyDown}></input>
            </div>
            <div className={styles.formGroup}>
                <label>Senha</label>
                <input type="password" name={'password'} value={formValues.password} onChange={onChange} onKeyDown={handleKeyDown} required></input>
            </div>

            <div className={styles.formGroup}>
                <button type="submit" onClick={_=>submit()}>Entrar</button>
            </div>
        </div>
    )

    const submit = () =>{
        if(formValues.password && isValidEmail(formValues.email)){
            axios.request({
                url: import.meta.env.VITE_API_BASE_URL + 'auth/login',
                data:{
                    email: formValues.email, 
                    password: formValues.password
                },
                method: 'POST'
            }).then(({data})=>{
                dispatch(setShowLoginScren(false))
                dispatch(updateToken({token:data.token, roles: data.roles}))

            }).catch(e=>{
                console.log(e);
                
                if(e.status === 401){
                    toast.error('Email ou Senha inválidos')
                } else {
                    toast.error('Erro ao logar')
                }
            })
        } else {
            toast.error('Email inválido')
        }
        
    }

    return (
        <>
            <Modal 
                title={title}
                body={body}
                show={modalOptions.showLoginScreen}
                onClose={onClose}
            />
        </>
    )
}

export default Form
