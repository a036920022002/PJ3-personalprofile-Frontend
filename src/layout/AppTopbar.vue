<script setup>
import { ref,computed } from 'vue'
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { useAuth } from '../service/auth'

const router = useRouter();
const { toggleMenu} = useLayout();
const { isLogin, logout,user} = useAuth();
const storeUser = localStorage.getItem('user');
const Name = ref(storeUser);
const userName = computed(() => Name.value || 'Guest');

function goLogin() {
    if(isLogin.value){
        router.push('/homepage');
        return;
    }  
    router.push('/login'); 
}

async function goLogout(){
    logout();
    await router.push('/homepage'); 
}




</script>

<template>
    <div class="layout-topbar">      
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
        </div>
      
        <div class="layout-topbar-actions">
             <p class="flex items-center font-bold text-2xl h-full px-4">Hello!! {{userName}}</p>
            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>
            <div class="layout-topbar-menu hidden lg:block">
                
                <div class="layout-topbar-menu-content">
                    <!-- <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button> -->
                    <button type="button" class="layout-topbar-action" v-if="isLogin" @click="goLogout">
                        <i class="pi pi-sign-out"></i>
                        <span>Logout</span>
                    </button>
                    <button type="button" class="layout-topbar-action"  v-else @click="goLogin">
                        <i class="pi pi-user"></i>
                        <span>Login</span>
                    </button>
                    
                </div>
            </div>
        </div>
    </div>
</template>
