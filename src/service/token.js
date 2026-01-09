import { jwtDecode } from 'jwt-decode'; 

const TOKEN_KEY = 'token'
const USER_KEY = 'user'


export function getToken(){
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token){
    return localStorage.setItem(TOKEN_KEY,token)
}

export function removeToken(){
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
}

export function setUser(user){
    return localStorage.setItem(USER_KEY,JSON.stringify(user))
}

export function getUser(){
    return localStorage.getItem(USER_KEY)
}

//解析token ->for 驗證Token 是否過期，就不用一值傳送至後端確認
//token 分為header,payload, signature

export function decodeToken(token){
    if(!token){
        console.log("無token")
        return  null
    }
    try{
        const decode = jwtDecode(token)
        return decode;
    }catch(err){
        console.error("Token 無法解碼：", err);
        return null;
    }
   
}

//驗證Token 是否過期
export function tokenvalid(token){
    const payload = decodeToken(token)
    const now = Math.floor(Date.now()/1000);
    if(!token){
        return false
    }
    if(!payload || !payload.exp){
        return false
    }
    return payload.exp > now
//false 為過期
}

