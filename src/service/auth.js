// src/composables/useAuth.js
import { ref, computed } from 'vue';
import { getToken, setToken, removeToken, tokenvalid, setUser,getUser } from '@/service/token';

const tokenRef = ref(getToken());  // reactive 來源
const userRef = ref(getUser());

export function useAuth() {
    //判斷使用者「是否已登入」，回傳 true 或 false
    const isLogin = computed(() => {
        return !!tokenRef.value && tokenvalid(tokenRef.value);
    });
    
    const token = computed(()=>tokenRef.value)
    const user = computed(()=>userRef.value)

    function login(newToken,user) {
        setToken(newToken);
        setUser(user);
        tokenRef.value = newToken;
        userRef.value = user;
    }

    function logout() {
        removeToken();
        tokenRef.value = null;
        userRef.value =null;
    }

    return {
        isLogin,
        login,
        logout,
        token,
        user
    };
}
