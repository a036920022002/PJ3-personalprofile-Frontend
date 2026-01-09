<script setup>
import { onMounted, ref,computed } from 'vue';
import api from '../../../service/axios'
import { useToast } from 'primevue/usetoast'  

// const router = useRouter()  
const works = ref([]);
const toast = useToast();
const multiselectValue = ref(null);
const multiselectValues = ref([
    { name: 'Github'},
    { name: 'Git'},
    { name: 'VS Code'},
    { name: 'AI'},
    { name: 'Postman'},
    { name: 'Zeabur'}
]);
const envHost = import.meta.env.VITE_API_URL;


const galleriaResponsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '960px',
        numVisible: 4
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);

onMounted(async () => {
    try{
        const res = await api.get('/api/Works',{ requireAuth: false });      
        
        function safeparse(data,defaultVal = [] ){
            if (!data) return defaultVal;
            if (typeof data !== 'string') return data;
            try {
                const result = JSON.parse(data);
                return result;
            } 
            catch (e) 
            {
                console.error("格式解析失敗", e);
                return defaultVal;
            }
        } 
        works.value = res.data.map(item=>{
            const imageparse = safeparse(item.image,[])
            const toolArray = safeparse(item.tool,[])
            const functionArray = safeparse(item.function_name,[])

            return {
                ...item,
                image: imageparse, // 這是原本要求的陣列格式
                // // 2. 新增 imageUrl：取陣列第一張，並拼接完整路徑；若無圖片則給空字串或預設圖
                imageUrl: imageparse.length > 0 ? imageparse.map(img =>`${envHost}/public/works/${item.id}/${img}`) : [],
                multiselectValue:toolArray.map(t=>({name:t})),
                functionText: functionArray.join('\n'),
                tool: toolArray,
                function_name: functionArray,
                frontEnd:safeparse(item.frontEnd,{}),
                backEnd:safeparse(item.backEnd,{}),
                gitHub_link:safeparse(item.gitHub_link,{})
            };
        })
    }catch(err){
        console.error('抓取 works 失敗:', err);
    }
});

const fileUpload = async (event,id) => {
    if(!id){
        toast.add({
        severity: 'warn',
        summary: '尚未建立作品',
        detail: '請先建立/儲存作品，再上傳圖片',
        life: 5000
        })
        return
    }
    console.log("event.files",event.files)
    console.log("id",id)
    const files = event.files  
    
    const formData = new FormData()
    for (const file of files) {
        formData.append('files', file)
        }
        formData.append('id', id)
        
    try {
        const res = await api.post(`/api/Works/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            requireAuth: true
            });

        console.log('上傳成功', res.data)
        toast.add({
        severity: 'success',
        summary: '儲存成功',
        detail: '已更新照片',
        life: 3000
        })

    // ✅ 若回傳包含圖片 URL，可即時更新畫面：
        if (res.data?.imageUrls) {
            const work = works.value.find(w => w.id === id)
            if (work) {
                work.imageUrl = [...(work.imageUrl || []), ...res.data.imageUrls]
            }
        }

  } catch (err) {
    console.error('上傳失敗', err)
  }
}

const saveworks = async(item)=>{
    try{
        let payload = {...item};

        const toolArray = payload.multiselectValue ?payload.multiselectValue.map(item => item.name) : [];     
        const functionArray = payload.functionText ? payload.functionText.split('\n').map(line => line.trim()).filter(line => line) : [];
        const finalData = {
            id:payload.id,
            name:payload.name,
            descript:payload.descript,
            frontEnd: JSON.stringify(payload.frontEnd),
            backEnd: JSON.stringify(payload.backEnd),
            database_name:payload.database_name,
            tool:JSON.stringify(toolArray),
            function_name:JSON.stringify(functionArray),
            gitHub_link:JSON.stringify(payload.gitHub_link),
            page_link:payload.page_link,
            item_label:payload.item_label
            };            
        let res;
            if(finalData.id){
                res = await api.put(`/api/Works/${finalData.id}`,finalData,{ requireAuth: true });
                console.log("update:",finalData)
            }else{
                delete finalData.id;
                res = await api.post('/api/Works',finalData,{ requireAuth: true });
                finalData.id = res.data.id;
                console.log("create new id",finalData.id)
            }
            console.log('儲存成功', res.data)
            toast.add({
            severity: 'success',
            summary: '儲存成功',
            detail: `${payload.name}作品已成功更新`,
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


const createworks = async()=>{
    works.value.push({
        id: null, // 尚未存檔前 ID 為空
        name: '',
        descript: '',
        image: [],
        imageUrl: [], // 預覽用陣列
        frontEnd: { framework: '', programming_language: '' },
        backEnd: { framework: '', programming_language: '' },
        database_name: '',
        tool: [],
        multiselectValue: [], // 重要：給 MultiSelect 用的空陣列
        function_name: [],
        functionText: '',     // 重要：給 Textarea 用的空字串
        gitHub_link: { BackEnd: '', FrontEnd: '' },
        page_link: '',
        item_label: '',
    });
}

const deleteworks = async(id)=>{
    console.log(id)
    try{
        const res = await api.delete(`/api/Works/${id}`, { data: { id: id } },{ requireAuth: true });
        console.log(id)
        console.log('刪除成功', res.data)
        works.value = works.value.filter(item => item.id !== id);
        toast.add({
        severity: 'success',
        summary: '刪除成功',
        detail: '作品已成功刪除',
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
    console.log("works.value after del",works.value)

}


</script>

<template>
    <Toast/>
        <div class="card flex flex-col gap-4 w-full">
            <div class="flex justify-center gap-4">
                <Button icon="pi pi-plus" label="新增" :style="{ width: '8rem' }" raised @click="createworks"/>
            </div>          
        </div>
        <div class="card flex flex-col gap-8 p-6 min-w-[320px] max-w-[1280px] mx-auto" v-for="(work, index) in works" :key="work.id">
            <div class="flex flex-col md:flex-row gap-6 w-full">
                <div class="flex flex-col w-full md:w-2/3 gap-4">
                    <div >
                        <Galleria
                            :value="work.imageUrl.map(img => ({ itemImageSrc: img, thumbnailImageSrc: img }))"
                            :responsiveOptions="galleriaResponsiveOptions"
                            :numVisible="5"
                            containerStyle="max-width: 100%">
                            <template #item="slotProps">
                            <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" class="w-full rounded-lg object-cover" />
                            </template>
                            <template #thumbnail="slotProps">
                            <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" class="rounded-md" />
                            </template>
                        </Galleria>
                    </div>
                    <div class="flex justify-center mt-2 w-full ">
                        <FileUpload
                            name="demo[]"
                            @uploader="event => fileUpload(event, work.id)"                
                            accept="image/*"
                            :multiple="true"
                            :maxFileSize="1000000"
                            customUpload
                            chooseLabel="選擇檔案"
                            uploadLabel="上傳"
                            cancelLabel="取消">
                        </FileUpload>
                    </div>
                </div>            
                <div class="flex-1 card p-4 h-fit md:h-auto">
                    <div class="flex items-center mb-4">
                        <div class="w-32 font-semibold text-xl">專案名稱</div>
                        <InputText class="flex-1" id="name" type="text" v-model="work.name"  />
                    </div>
                    <div class="mb-6">
                        <div class="font-semibold text-xl mb-2">前端</div>
                        <div class="flex items-center mb-2">
                            <p class="w-32 text-muted-color font-medium">框架</p>
                            <InputText id="frontframework" type="text" v-model="work.frontEnd.framework" class="flex-1" />
                        </div>
                        <div class="flex items-center">
                            <p class="w-32 text-muted-color font-medium">程式語言</p>
                            <InputText id="frontlanguage" type="text" v-model="work.frontEnd.programming_language" class="flex-1" />
                        </div>
                    </div>
                    <div class="mb-6">
                        <div class="font-semibold text-xl mb-2">後端</div>
                        <div class="flex items-center mb-2">
                            <p class="w-32 text-muted-color font-medium">框架</p>
                            <InputText id="backframework" type="text" v-model="work.backEnd.framework" class="flex-1" />
                        </div>
                        <div class="flex items-center">
                            <p class="w-32 text-muted-color font-medium">程式語言</p>
                            <InputText id="backlanguage" type="text" v-model="work.backEnd.programming_language" class="flex-1" />
                        </div>
                    </div>
                    <div class="flex items-center mb-4">
                        <div class="w-32 font-semibold text-xl ">資料庫</div>
                        <InputText class="flex-1" id="database" type="text" v-model="work.database_name"  />
                    </div>
                    <div class="flex items-center mb-4">
                        <div class="w-32 font-semibold text-xl ">Sidebar 名稱
                            <span class="block text-muted-color text-sm mb-4">首頁側邊文字</span>
                        </div>
                        <InputText class="flex-1" id="siderbar" type="text" v-model="work.item_label"  />
                    </div>
                    <div class="flex items-center mb-4">
                        <div class="w-32 font-semibold text-xl ">工具介紹</div>
                        <MultiSelect v-model="work.multiselectValue" :options="multiselectValues" optionLabel="name" placeholder="Select Tools" :filter="true" class="flex-1" >
                            <template #value="slotProps">
                                <div class="inline-flex items-center py-1 px-2 bg-primary text-primary-contrast rounded-border mr-2" v-for="option of slotProps.value" :key="option.name">
                                    <div>{{ option.name }}</div>
                                </div>
                                <template v-if="!slotProps.value || slotProps.value.length === 0">
                                    <div class="p-1">Select Tools</div>
                                </template>
                            </template>
                            <template #option="slotProps">
                                <div class="flex items-center py-1 px-2 hover:bg-gray-100 rounded">
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </MultiSelect>
                    </div>
                    <div class="flex items-center mb-4">
                        <div class="w-32 font-semibold text-xl ">功能介紹
                            <span class="block text-muted-color text-sm mb-4">一行為一段落</span>
                        </div>
                        <Textarea class="flex-1 border rounded p-2" id="function" rows="4" v-model="work.functionText" />
                    </div>
                </div>
            </div>
            <div class="w-full">
                <label for="intro" class="text-lg block mb-2">專案介紹 Project Intro</label>
                <Textarea id="intro" rows="8" v-model="work.descript" class="w-full" />
            </div>
            <div class="flex flex-col md:flex-row gap-4 w-full">
                <div class="flex flex-col flex-1">
                    <label for="github" class="text-lg">前端 GitHub 連結</label>
                    <InputText id="github_front" type="text" v-model="work.gitHub_link.FrontEnd" />
                </div>
                <div class="flex flex-col flex-1">
                    <label for="github" class="text-lg">後端 GitHub 連結</label>
                    <InputText id="github_back" type="text" v-model="work.gitHub_link.BackEnd" />
                </div>
                <div class="flex flex-col flex-1">
                    <label for="page" class="text-lg">頁面Demo 網址</label>
                    <InputText id="page" type="text" v-model="work.page_link" />
                </div>
            </div>
            <div class="flex flex-col md:flex-row gap-4 w-full items-center justify-center">
                <Button label="儲存" :style="{ width: '8rem' }" severity="sucess" raised  @click="saveworks(work)"/>
                <Button icon="pi pi-times" label="刪除" :style="{ width: '8rem' }" severity="danger" raised  @click="deleteworks(work.id)"/>
            </div>
        </div>
</template>

<style scoped>


/* 響應式微調 */
@media (max-width: 768px) {
  .card {
    @apply p-4;
  }
  img {
    @apply object-contain;
  }
}
</style>