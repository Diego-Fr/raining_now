import { createSlice } from "@reduxjs/toolkit"
import { getUserData } from "../utils/authUtils"

const initialState = {
    name: '',
    token: '',
    roles: [],
    showLoginScreen: false,
    expires: undefined,
    user: {}
}

export const updateToken = ({token, roles, expires}) => async (dispatch) => {

    dispatch(setToken(token))
    dispatch(setExpires(expires))

    localStorage.setItem('sibh_user_token', token)
}

export const updateMe = ({email, name, roles,exp}) => async (dispatch) =>{
    
    dispatch(setRoles(roles))
    dispatch(setUser({email, name, exp}))
}

export const logOut = _ => async (dispatch) =>{    
    dispatch(setUser({}))
    dispatch(setToken(undefined))
    dispatch(setRoles([]))

    localStorage.removeItem('sibh_user_token')
    localStorage.removeItem('sibh_user_expires')
}

export const getMeData = (token) => async (dispatch) =>{
    let response
    try{
        response = await getUserData(token)
    } catch(e){
        console.log('Erro ao buscar informações do usuário');
        dispatch(logOut())
        return
    }
    
    const {email, name, roles,exp} = response
    dispatch(updateMe({email, name, roles,exp}))
    dispatch(setExpires(exp))
    
    localStorage.setItem('sibh_user_expires', exp)
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setShowLoginScren(state, action){
            state.showLoginScreen = action.payload
        },
        setToken(state, action){
            state.token = action.payload
        },
        setRoles(state, action){
            state.roles = action.payload
        },
        setUser(state, action){
            const {name, email, exp} = action.payload
            state.user.name = name
            state.user.email = email
            state.expires = exp
        },
        setExpires(state, action){
            state.expires = action.payload
        }
    }
})

export const {setShowLoginScren,setToken,setRoles,setUser,setExpires} =  authSlice.actions

export default authSlice.reducer