<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'
import AppMenuItem from './AppMenuItem.vue';
import { useAuth } from '@/service/auth'

const { isLogin} = useAuth();
const model = ref([
    {
        label: 'List',
        items: [
            { label: 'Home', icon: 'pi pi-fw pi-home', to: '/homepage' },
            { label: 'About Me', icon: 'pi pi-fw pi-user', to: '/aboutme' },
            { label: 'Experience', icon: 'pi pi-fw pi-home', to: '/experience' },
            { label: 'Works', 
            icon: 'pi pi-fw pi-list', 
            class: 'rotated-icon',
            to:'/works',
            items:[],
            }         
        ]
    },
   
]);

const authedit = ref([
    {
        label: '會員編輯(Only Login)',
        items: [
            {label:'Edit About Me',icon:'pi pi-pencil',to:'/editaboutme'},
            {label:'Edit Education',icon:'pi pi-pencil',to:'/editeducation'},
            {label:'Edit Experience',icon:'pi pi-pencil',to:'/editexperience'},
            {label:'Edit Works',icon:'pi pi-pencil',to:'/editworks'},
            {label:'Edit Account',icon:'pi pi-pencil',to:'/editaccount'},
            {label:'Edit certificate',icon:'pi pi-pencil',to:'/editcertificate'},
        ]
    },
   
]);


onMounted(async () => {
  try {
    // 向後端取資料（假設返回 JSON 陣列）
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/works`)
    const works = res.data    
    const worksItem = model.value[0].items.find(item => item.label === 'Works')

    worksItem.items = works.map(w => ({
        label : w.item_label || '未命名作品', 
        icon : 'pi pi-fw pi-file',
        to : `/workdetail/${w.id}`
    }))

  } catch (err) {
    console.error('取得作品資料失敗', err)
  }
})
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <!-- <li v-if="item.separator" class="menu-separator"></li> -->
        </template>
        <template v-if="isLogin" v-for="(item, i) in authedit" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <!-- <li v-if="item.separator" class="menu-separator"></li> -->
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
