import axios from "axios"

const isLogged = (authOptions={}) =>{    
    if(authOptions.expires && new Date(authOptions.expires*1000) > new Date() && authOptions.token){
        return true
    } 
    return false
}

const getUserData = async (token) =>{
    let res = await axios.request({
        method:'POST',
        url: import.meta.env.VITE_API_BASE_URL + 'auth/me',
        headers:{
            Authorization: `Bearer ${token}`
        }
    })

    return res.data
}

const hasAnyOfRoles = ({roles: authRoles=[]}, roles=[]) =>{
    return roles.some(x=> authRoles.includes(x))
}

export {
    isLogged,
    getUserData,
    hasAnyOfRoles
}