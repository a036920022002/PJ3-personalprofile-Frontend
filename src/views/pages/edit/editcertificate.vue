<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../../service/axios'
import { useToast } from 'primevue/usetoast'  

const cer = ref([]);
const toast = useToast();
const envHost = import.meta.env.VITE_API_URL;

onMounted(async () => {
    const res = await api.get('/api/Certificate',{ requireAuth: true });
    if(Array.isArray(res.data)){
      cer.value = res.data.map(item=>(
        {
            ...item,
            photoUrl:item.photo ? `${envHost}/public/certificate/${item.photo}` : ''
        }));
    }
})
//設定照片上傳樣式
const fileUploadPt = {
  pcChooseButton: { class: 'mb-2' }, 
  pcUploadButton: { class: 'mb-2' },
  pcCancelButton: { class: '' }
}
//僅照片上傳
const fileUpload = async (event,id) => {
    const sizeMax = 5*1024*1024 //約5MB
    const file = event.files[0]  // ✅ 先定義 file
    console.log('準備上傳的檔案:', {
    name: file.name,
    size: file.size,
    type: file.type
  })
    if (file.size > sizeMax) {
        toast.add({
            severity: 'warn',
            summary: '上傳失敗',
            detail: '檔案大小不能超過 5MB',
            life: 3000
        })
        return; // ❌ 不上傳
    }   
  const formData = new FormData()
    formData.append('file', file)
    formData.append('id',id)
  try {
    const res = await api.post(`/api/Certificate/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      requireAuth: true
    })

    console.log('上傳成功', res.data)
    
    toast.add({
      severity: 'success',
      summary: '儲存成功',
      detail: '已更新照片',
      life: 3000
    })

    // ✅ 若回傳包含圖片 URL，可即時更新畫面：
    if (res.data?.photoUrl) {
    const index = cer.value.findIndex(c => c.id === id);
    if (index !== -1) {
        cer.value[index] = {
            ...cer.value[index],
            photoUrl: res.data.photoUrl
        };
    }
} 

  } catch (err) {
    console.error('上傳失敗', err)
  }
}

const createcertificate = async()=>{
    cer.value.push({
        name:'',
        issuing_authority:'',
        photo:'',
        photoUrl:''
    })
}


//僅上傳其他欄位
const savecertificate = async (item) => {
    console.log('送出的資料 item:', item)
    if (!item.name||!item.issuing_authority){
        toast.add({
            severity: 'warn',
            summary: '請填寫證書名稱及發行機構',
            life: 3000
        })
    }
    
    try {
        let payload = cer.value.find(w => w.id === item.id);       
        let res;
        if(payload.id){
        res = await api.put(`/api/Certificate/${item.id}`,item,{ requireAuth: true });
    }else{
        res = await api.post('/api/Certificate',item,{ requireAuth: true });
        item.id = res.data.id;
    }
    toast.add({
      severity: 'success',
      summary: '儲存成功',
      detail: '證書已成功更新',
      life: 3000
    })
  } catch (err) {
    console.error('儲存失敗', err)
     toast.add({
      severity: 'error',
      summary: '儲存失敗',
      detail: '請稍後再試 ❌',
      life: 4000
    })
  }
}

const deletecertificate = async(id)=>{
    try{
        const res = await api.delete(`/api/Certificate/${id}`, { data: { id: id } },{ requireAuth: true });
        cer.value = cer.value.filter(item => item.id !== id);
        toast.add({
        severity: 'success',
        summary: '刪除成功',
        detail: '證書已成功刪除',
        life: 3000
        })

    }catch(err){
        
        toast.add({
        severity: 'error',
        summary: '刪除失敗',
        detail: '請稍後再試 ❌',
        life: 4000
        })
    }    
}

</script>

<template>
    <Fluid>
        <Toast/>
        <div class="w-full mb-8">
            <div class="bg-white shadow-md rounded-lg h-32 flex items-center justify-center w-full">
                <Button icon="pi pi-plus" label="新增" :style="{ width: '8rem', height: '3rem' }" raised @click="createcertificate"/>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-white shadow-md rounded-lg overflow-hidden" v-for="(item,index) in cer" :key="index">
                <img :src="item.photoUrl" :alt=item.name class="max-w-full max-h-full object-contain"/>
                <div class="p-4 flex flex-col gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                       <label for="name" class="text-lg">證書名稱</label>
                       <InputText id="name" type="text" v-model="item.name" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                       <label for="issuing_authority" class="text-lg">證書發行機構</label>
                       <InputText id="issuing_authority" type="text" v-model="item.issuing_authority" />
                    </div>
                    <FileUpload
                        name="file"
                        @uploader="event => fileUpload(event, item.id)" 
                        :multiple="false"
                        accept="image/*"
                        :maxFileSize="5242880"
                        customUpload
                        chooseLabel="選擇檔案"
                        uploadLabel="上傳"
                        cancelLabel="取消"
                        class="file-upload-no-icon"
                        :pt="fileUploadPt"
                    />
                    <div class="flex flex-col md:flex-row gap-4 w-full items-center justify-center">
                        <Button label="儲存" :style="{ width: '8rem' }" severity="sucess" raised  @click="savecertificate(item)"/>
                        <Button icon="pi pi-times" label="刪除" :style="{ width: '8rem' }" severity="danger" raised  @click="deletecertificate(item.id)"/>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>


