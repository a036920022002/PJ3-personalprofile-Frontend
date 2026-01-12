<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref,nextTick } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../service/axios';
import { useToast } from 'primevue/usetoast'  
import { useAuth } from '@/service/auth';


const router = useRouter();
const email = ref('');
const password = ref('');
const checked = ref(false);
const errorMessage = ref('');
const toast = useToast() 
const {isLogin, login} = useAuth();

const handleSignIn = async () => {
    errorMessage.value = ''; // 先清空錯誤訊息

    if(isLogin.value){
        router.replace('/homepage');
        return;
    }    
    // console.log("email",email.value)
    // console.log("password",password.value)
    
    if (!email.value || !password.value) {
        errorMessage.value = 'Email 與 Password 都是必填';
        return;
    }
    
    try{
    const res = await api.post(`/api/Login`, {
        email: email.value,
        password: password.value
        },{requireAuth: false});
        
        const { token:token, user } = res.data;
        //console.log("接收到的資料",res)
        //console.log("res.data",res.data.token)
        //console.log("res.data",res.data.user.name)

        login(token,user.name);
        await nextTick();
        router.replace('/homepage');
        
        // console.log("登入後 isLogin:", isLogin.value);
        
        // 登入成功跳轉首頁
        
        // toast.add({
        // severity: 'success',
        // summary: '登入成功',
        // detail: `Hello ${user.name|| user.email}`,
        // life: 3000
        // })
        
        

        }catch(err){
            if (err.response && err.response.status === 401) {
                errorMessage.value = '帳號或密碼錯誤';
            } else {
                errorMessage.value = '伺服器錯誤，請稍後再試';
            }
        }


    }
</script>

<template>
    <Toast /> 
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                    </div>
                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                        </div>
                        <Button label="Sign In" class="w-full" @click="handleSignIn"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
