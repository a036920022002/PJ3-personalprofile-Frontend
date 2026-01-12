<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import api from '../../service/axios'

const aboutme = ref([]);
const cer = ref([])
const myintro = ref([]);
const myintroEng = ref([]);
const envHost = import.meta.env.VITE_API_URL;


onMounted(async () => {
    const res = await api.get('/api/Aboutme',{ requireAuth: false });
    const resCer = await api.get('/api/Certificate',{ requireAuth: false });
    console.log("Aboutme Data:", res.data);
    
    if (Array.isArray(res.data)) {
            aboutme.value = res.data.map(item => ({
                ...item,
                // 2. 修正 JSON.parse 的 fallback，應該是字串 "[]" 而非陣列 []
                intro: JSON.parse(item.intro || "[]"),
                introEng: JSON.parse(item.introEng || "[]"),
                photoUrl : `${envHost}/public/aboutme/${item.photo}`
            }));

            // 3. 確保 index 0 存在才賦值
            if (aboutme.value.length > 0) {
                myintro.value = aboutme.value[0].intro;
                myintroEng.value = aboutme.value[0].introEng;                
            }
        }
    if(Array.isArray(resCer.data)){
       cer.value = resCer.data.map(item=>(
        {
            ...item,
            photoUrl:`${envHost}/public/certificate/${item.photo}`
        }));
    }
});

</script>

<template>
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl mb-4">個人資料 Contact Information </div>   
                <div class="flex h-[300px] mb-8">
                    <!-- 左側 30% -->
                    <div class="flex-[3] flex items-center justify-center border-gray-200">
                    <img :src='aboutme[0]?.photoUrl' alt="about Me Photo" class="w-full h-full object-cover  rounded-xl">
                    </div>
                    <!-- 右側 70% -->
                    <div class="flex-[7] flex flex-col">
                        <!-- 姓名 -->
                        <div class="flex flex-1 border border-gray-200 rounded-xl">
                            <div class="flex-[3] flex flex-col justify-center items-center h-full">
                                <p class="m-0">姓名</p>
                                <p class="m-0">Name</p>
                            </div>
                            <div class="flex-[7] flex flex-col justify-center items-center h-full">
                                <p class="m-0">{{ aboutme[0]?.name || 'Loading...' }}</p>
                                <p class="m-0">{{ aboutme[0]?.englishName || 'Loading...' }}</p>
                            </div>
                        </div>
                        <!-- 性別 -->
                        <div class="flex flex-1 border border-gray-200 rounded-xl">
                            <div class="flex-[3] flex flex-col justify-center items-center h-full">
                                <p class="m-0">性別</p>
                                <p class="m-0">Gender</p>
                            </div>
                            <div class="flex-[7] flex items-center justify-center">{{ aboutme[0]?.gender || 'Loading...' }}</div>
                        </div>
                        <!-- 生日 -->
                        <div class="flex flex-1 border border-gray-200 rounded-xl">
                            <div class="flex-[3] flex items-center justify-center">生日</div>
                            <div class="flex-[7] flex items-center justify-center">{{ aboutme[0]?.birth || 'Loading...' }}</div>
                        </div>
                        <!-- 聯絡資訊 -->
                        <div class="flex flex-1 border border-gray-200 rounded-xl">
                            <div class="flex-[3] flex items-center justify-center">E-mail</div>
                            <div class="flex-[7] flex items-center justify-center">{{ aboutme[0]?.email || 'Loading...' }}</div>
                        </div>
                        <!-- 地址 -->
                        <div class="flex flex-1 border border-gray-200 rounded-xl">
                            <div class="flex-[3] flex items-center justify-center">地址</div>
                            <div class="flex-[7] flex items-center justify-center">{{ aboutme[0]?.address || 'Loading...' }}</div>
                        </div>
                    </div>
                </div>
                <div class="font-semibold text-xl mb-4">社群連結 Social Link </div>
                <div class="flex  items-center">
                    <a :href=aboutme[0]?.fb target="_blank" class="p-2 rounded-xl hover:bg-gray-100 transition flex items-center justify-center">
                        <img src="/icons/facebook.png" alt="my icon" class="w-12 h-12" />
                    </a>
                    <a :href=aboutme[0]?.ig target="_blank" class="p-2 rounded-xl hover:bg-gray-100 transition flex items-center justify-center">
                        <img src="/icons/instagram.png" alt="my icon" class="w-12 h-12" />
                    </a>
                    <a :href=aboutme[0]?.linkedin target="_blank" class="p-2 rounded-xl hover:bg-gray-100 transition flex items-center justify-center">
                        <img src="/icons/linkedin.png" alt="my icon" class="w-12 h-12" />
                    </a> 
                    <a :href=aboutme[0]?.LINE target="_blank" class="p-2 rounded-xl hover:bg-gray-100 transition flex items-center justify-center">
                        <img src="/icons/line.png" alt="my icon" class="w-12 h-12" />
                    </a>
                    <!-- <a href="https://facebook.com" target="_blank" class="p-2 rounded-xl hover:bg-gray-100 transition flex items-center justify-center">
                        <img src="../../../public/icons/google.png" alt="my icon" class="w-12 h-12" />
                    </a>  -->
                </div>
            </div>
        <div class="card space-y-4">
            <div class="font-semibold text-xl mb-4">證照 Certificate</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white shadow-md rounded-lg overflow-hidden" v-for="(item, index) in cer" :key="index">
                    <img :src="item.photoUrl" :alt="item.name" class="w-full object-contain max-h-64 bg-gray-100"/>
                    <div class="p-4 space-y-3">
                        <div class="flex items-center justify-between bg-gray-50 shadow-sm px-3 py-2 rounded-md">
                            <div class="text-center flex-1 font-semibold">{{ item.name }}</div>
                            <div class="text-sm text-gray-500 whitespace-nowrap">{{ item.issuing_authority }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>      
        <div class="card space-y-4">
            <Card>
                <template v-slot:title>
                    <div class="flex items-center justify-between mb-0">
                        <div class="font-semibold text-xl mb-4">自我介紹</div>                       
                    </div>                        
                </template>
                <template v-slot:content>
                    <div class="space-y-4">
                        <p v-for="(paragraph, index) in myintro" :key="index" class="leading-normal m-0">{{ paragraph }}</p>
                    </div>
                </template>
            </Card>
            <Card>
                <template v-slot:title>
                    <div class="flex items-center justify-between mb-0">
                        <div class="font-semibold text-xl mb-4">Introduct myself</div>                       
                    </div>                        
                </template>
                <template v-slot:content>
                    <div class="space-y-4">
                        <p v-for="(paragraphEng, index) in myintroEng" :key="index" class="leading-normal m-0">{{ paragraphEng }}</p>
                    </div>
                </template>
            </Card>
        </div>

    </div>
</template>