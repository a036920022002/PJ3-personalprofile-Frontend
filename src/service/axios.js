import axios from 'axios';
import router from '@/router'; // 導入 Vue Router 實例
import {useAuth} from '@/service/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
});

api.interceptors.request.use(config=>{
  const {isLogin,token, logout} =useAuth();
  if(config.requireAuth !== false){
  
    if(!isLogin.value) {
      logout();
      router.push('/login');
      return Promise.reject(new Error('Token 已過期，請重新登入'));
    }
    if(token.value){
      config.headers.Authorization = `Bearer ${token.value}`;
    }
  }
    return config;
},error => Promise.reject(error)
)


// Response 攔截器
api.interceptors.response.use(
  response => response, // 正常回傳
  error => {
    console.error('全域 API 錯誤:', error);

    // 跳轉 Error 頁面並帶訊息
    router.push({
      name: 'notfound',
      query: { message: error.message || '發生未知錯誤' }
    });

    // 回傳 rejected promise 避免原本呼叫繼續執行
    return Promise.reject(error);
  }
);

export default api;