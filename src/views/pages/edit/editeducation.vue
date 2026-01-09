<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../../service/axios'
import { useToast } from 'primevue/usetoast'  
import Fluid from 'primevue/fluid'

const edu = ref([]);
const toast = useToast();


onMounted(async () => {
    const res = await api.get('/api/Education',{ requireAuth: true });
    edu.value = res.data.reverse()
});

const saveeducation = async () => {
    const payload = edu.value;
    let res;
    console.log('payload', payload)
    try{
        
        for (const item of edu.value) {
            if (item.id) {// 已存在，更新
            res = await api.put(`/api/Education/${item.id}`, item,{ requireAuth: true });
        } else {
        // 新增
            res = await api.post('/api/Education', item,{ requireAuth: true });
            item.id = res.data.id; // 後端回傳的新 id
            console.log(item.id)
        }}
        console.log('儲存成功', res.data)
        toast.add({
        severity: 'success',
        summary: '儲存成功',
        detail: '學歷已成功更新',
        life: 3000
        })

    }catch(err){
        console.error('儲存失敗', err)
        toast.add({
        severity: 'error',
        summary: '儲存失敗',
        detail: '請稍後再試 ❌',
        life: 4000
        })
    }}
const createeducation = () => {
  edu.value.unshift({
    school: '',
    schoolEng: '',
    department: '',
    departmentEng: '',
    degree: '',
    degreeEng: '',
    periodOfStudytime: ''
  });
};

const deleteeducation = async(id) => {
    console.log(id)
    try{
        const res = await api.delete(`/api/Education/${id}`, { data: { id: id } },{ requireAuth: true });
        console.log(id)
        console.log('刪除成功', res.data)
        edu.value = edu.value.filter(item => item.id !== id);
        toast.add({
        severity: 'success',
        summary: '刪除成功',
        detail: '學歷已成功刪除',
        life: 3000
        })

    }catch(err){
        console.error('刪除失敗', err)
        toast.add({
        severity: 'error',
        summary: '刪除失敗',
        detail: '請稍後再試 ❌',
        life: 4000
        })
    }    
    console.log("edu.value after del",edu.value)
}


</script>

<template>
    <div class="p-fluid">
        <Toast/>
        <div class="flex flex-col mt-8"> 
            <div class="card flex flex-col gap-4 w-full">
                <div class="flex justify-center gap-4">
                    <Button icon="pi pi-plus" label="新增" :style="{ width: '8rem' }" raised @click="createeducation"/>
                </div>          
            </div>           
            <div v-for="(item, index) in edu" :key="index" class="card flex flex-col md:flex-row gap-4 w-full">
                <div class="flex flex-col gap-4 flex-1">
                    <div class="font-semibold text-xl">學校名稱</div>
                    <div class="flex flex-col gap-2">
                        <label for="school" class="text-lg">中文</label>
                        <InputText id="school" type="text" v-model="item.school" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="schoolEng" class="text-lg">英文</label>
                        <InputText id="schoolEng" type="text" v-model="item.schoolEng" />
                    </div>
                </div>    
                <div class="flex flex-col gap-4 flex-1">
                    <div class="font-semibold text-xl">科系</div>
                    <div class="flex flex-col gap-2">
                        <label for="department" class="text-lg">中文</label>
                        <InputText id="department" type="text" v-model="item.department" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="department" class="text-lg">英文</label>
                        <InputText id="departmentEng" type="text" v-model="item.departmentEng" />
                    </div>
                </div>
                <div class="flex flex-col gap-4 flex-1">
                    <div class="font-semibold text-xl">學位</div>
                    <div class="flex flex-col gap-2">
                        <label for="degree" class="text-lg">中文</label>
                        <InputText id="degree" type="text" v-model="item.degree" />
                    </div>
                    <div class="flex flex-col gap-2">
                       <label for="degreeEng" class="text-lg">英文</label>
                       <InputText id="degreeEng" type="text" v-model="item.degreeEng"  />
                    </div>
                </div>    
                <div class="flex flex-col gap-4 flex-1">
                    <div class="font-semibold text-xl">時間</div>
                    <div class="flex flex-col gap-2">
                       <label for="periodOfStudytime" class="text-lg">就讀時間</label>
                       <InputText id="periodOfStudytime" type="text" v-model="item.periodOfStudytime" />
                    </div>
                    <div  class="flex flex-col gap-2">
                       <!-- <label for="address" class="text-lg">居住地 Location</label> -->
                       <!-- <InputText id="address" type="text" v-model="aboutme.address" /> -->
                    </div>
                </div>
                <div class="flex items-center">
                <Button icon="pi pi-times" severity="danger" text raised rounded @click="deleteeducation(item.id)"/>
                </div>
            </div>
            <div class="card flex flex-col gap-4 w-full">
                <div class="flex justify-center gap-4">
                    <Button label="儲存" :style="{ width: '8rem' }" raised @click="saveeducation"/>
                    <Button label="返回" :style="{ width: '8rem' }" raised />
                </div>          
            </div>
        </div>
    </div>
</template>