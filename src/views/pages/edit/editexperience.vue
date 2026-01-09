<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../../service/axios'
import { useToast } from 'primevue/usetoast'  

const workexp = ref([]);
const descript = ref('');
const descriptEng = ref([]);
const toast = useToast() 

// const reversedWorkexp=computed(()=>[...workexp.value].reverse())

onMounted(async () => {
    
    try{
        const res = await api.get('/api/WorkExperience',{ requireAuth: true });
        workexp.value = res.data.map(item=>({
        ...item,
        descript:JSON.parse(item.descript).join('\n'),
        descriptEng:JSON.parse(item.descriptEng).join('\n'),
        
    }))
    .reverse()
    // console.log("workexp.value ",workexp.value )

}catch(err){
    console.error('讀取失敗', err)
}
});


const saveworkexperience = async(item)=>{
    try{
        //const payload = workexp.value.find(w => w.id === id);
        const processItem = {
            ...item,
            descript:item.descript? JSON.stringify(item.descript.split('\n').map(s => s.trim()).filter(s => s !== ''))
                : "[]",
            descriptEng:item.descriptEng? JSON.stringify(item.descriptEng.split('\n').map(s => s.trim()).filter(s => s !== ''))
                : "[]",
        }
        console.log("對應資料:", processItem);
        let res;
            if(processItem.id){
                res = await api.put(`/api/WorkExperience/${processItem.id}`,processItem,{ requireAuth: true });
                console.log("update:",processItem)
            }else{
                res = await api.post('/api/WorkExperience',processItem,{ requireAuth: true });
                processItem.id = res.data.id;
                console.log("create new id",processItem.id)
            }
            console.log('儲存成功', res.data)
            toast.add({
            severity: 'success',
            summary: '儲存成功',
            detail: '工作經驗已成功更新',
            life: 3000})
    }catch(err){
        console.error('儲存失敗', err)
        toast.add({
        severity: 'error',
        summary: '儲存失敗',
        detail: '請稍後再試 ❌',
        life: 4000
        })

    }}

const createworkexperience = async()=>{
    workexp.value.unshift({
        company:'',
        companyEng:'',
        companyType:'',
        location:'',
        yearInService:'',
        tenure:'',
        jobPosition:'',
        jobPositionEng:'',
        descript:'',
        descriptEng:''    
    });
};

const deleteworkexperience = async(id) => {
    console.log(id)
    try{
        const res = await api.delete(`/api/WorkExperience/${id}`, { data: { id: id } },{ requireAuth: true });
        console.log(id)
        console.log('刪除成功', res.data)
        workexp.value = workexp.value.filter(item => item.id !== id);
        toast.add({
        severity: 'success',
        summary: '刪除成功',
        detail: '工作經歷已成功刪除',
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
    <Fluid>
        <Toast/>
        <div class="card flex flex-col gap-4 w-full">
            <div class="flex justify-center gap-4">
                <Button icon="pi pi-plus" label="新增" :style="{ width: '8rem' }" raised @click="createworkexperience"/>
            </div>          
        </div>

        <div class="flex flex-col mt-8 gap-4">
            <div v-for="(item, index) in workexp" :key="index" class="flex flex-col gap-1 w-full">
                <div class="card flex flex-col gap-1 w-full">
                    <div class="card flex flex-wrap gap-4 w-full">
                        <div class="flex flex-col gap-4 flex-1">
                            <div class="font-semibold text-xl">公司名稱</div>
                            <div class="flex flex-col gap-2">
                                <label for="school" class="text-lg">中文</label>
                                <InputText id="school" type="text" v-model="item.company" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="schoolEng" class="text-lg">英文</label>
                                <InputText id="schoolEng" type="text" v-model="item.companyEng" />
                            </div>
                        </div>    
                        <div class="flex flex-col gap-4 flex-1">
                            <div class="font-semibold text-xl">公司資料</div>
                            <div class="flex flex-col gap-2">
                                <label for="department" class="text-lg">類別</label>
                                <InputText id="department" type="text" v-model="item.companyType" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="department" class="text-lg">所在地</label>
                                <InputText id="departmentEng" type="text" v-model="item.location" />
                            </div>
                        </div>
                        <div class="flex flex-col gap-4 flex-1">
                            <div class="font-semibold text-xl">在職</div>
                            <div class="flex flex-col gap-2">
                                <label for="degree" class="text-lg">年分</label>
                                <InputText id="degree" type="text" v-model="item.yearInService" />
                            </div>
                            <div class="flex flex-col gap-2">
                            <label for="degreeEng" class="text-lg">期間 (Years)</label>
                            <InputText id="degreeEng" type="text" v-model="item.tenure"  />
                            </div>
                        </div>    
                        <div class="flex flex-col gap-4 flex-1">
                            <div class="font-semibold text-xl">職稱</div>
                            <div class="flex flex-col gap-2">
                            <label for="periodOfStudytime" class="text-lg">中文</label>
                            <InputText id="periodOfStudytime" type="text" v-model="item.jobPosition" />
                            </div>
                            <div class="flex flex-col gap-2">
                            <label for="periodOfStudytime" class="text-lg">英文</label>
                            <InputText id="periodOfStudytime" type="text" v-model="item.jobPositionEng" />
                            </div>
                        </div>
                        
                    </div>
                    <div class="card w-full flex flex-col gap-1">
                        <label for="intro" class="text-lg">工作內容 Descript</label>
                        <Textarea id="intro" rows="6" v-model="item.descript" />
                    </div> 
                    <div class="card w-full flex flex-col gap-1">
                        <label for="introEng" class="text-lg">英文工作內容 English Descript</label>
                        <Textarea id="introEng" rows="6" v-model="item.descriptEng" />
                            
                    </div>
                    <div class="flex justify-center gap-6 mt-2">
                        <Button label="儲存" :style="{ width: '8rem' }" severity="sucess" raised  @click="saveworkexperience(item)"/>
                        <Button icon="pi pi-times" label="刪除" :style="{ width: '8rem' }" severity="danger" raised  @click="deleteworkexperience(item.id)"/>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>


