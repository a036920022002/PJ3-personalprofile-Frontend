<script setup>
import { useRouter,useRoute } from 'vue-router';
import { onMounted, ref,computed  } from 'vue';
import api from '@/service/axios'

// 範例資料，可用路由參數 fetch 實際資料
const router = useRouter()
const route = useRoute()
const id = route.params.id
const pj = ref();
const envHost = import.meta.env.VITE_API_URL;

const descriptParagraphs = computed(() => {
  if (!pj.value || !pj.value.descript) return []
  return pj.value.descript
    .split(/(?<=。|,)/)  // 以句號或逗號切割
    .map(str => str.trim())
    .filter(Boolean)
  });

onMounted(async () => {
    try{
    const res = await api.get(`/api/works/${id}`,{ requireAuth: false });
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
    const imageparse = safeparse(res.data.image,[])
    pj.value = {
        ...res.data,        
        descript: res.data.descript || '',
        image: imageparse,
        tool: safeparse(res.data.tool,[]),
        function_name: safeparse(res.data.function_name,[]),
        frontEnd:safeparse(res.data.frontEnd,{}),
        backEnd:safeparse(res.data.backEnd,{}),
        imageUrl: imageparse.map(imgName =>`${envHost}/public/works/${res.data.id}/${imgName}`),
        gitHub_link:safeparse(res.data.gitHub_link,{}),
    };
    }catch(err){
      console.error('取得作品失敗', err);
    }
})



const goBack = () =>{
  router.push('/works')
}

const openDemo = () => {
   if (pj?.value.page_link) {
    window.open(pj?.value.page_link, '_blank')  
  } else {
    alert('目前沒有 Demo 連結')
  }
}



</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <!-- 作品標題 -->
    <header class="text-center mb-8">
      <h1 class="text-3xl md:text-5xl font-bold">{{pj?.name}}</h1>
      <!-- <p class="text-gray-600 mt-2">subtitle</p> -->
    </header>

    <!-- 作品圖片 -->
    <section class="flex flex-col md:flex-row gap-6 mb-8">
      <img
        v-for="(img, index) in (pj?.imageUrl || []).slice(0, 3)" :key="index" :src="img" :alt="pj?.name + ' 圖片 ' + (index + 1)"
        class="w-full md:w-1/3 h-64 object-cover rounded-2xl shadow-md"
      />
    </section>

    <!-- 作品描述 -->
    <section class="bg-white p-6 rounded-2xl shadow-md mb-8">
      <h2 class="text-2xl font-semibold mb-4">作品介紹</h2>
      <div class="text-gray-700 leading-relaxed space-y-2">
      <p v-for="(para, idx) in descriptParagraphs" :key="idx">{{ para }}</p>
    </div>
      <!-- <p class="text-gray-700 leading-relaxed">{{pj?.descript}}</p> -->
    </section>

    <!-- 功能細節 / 分類 -->
    <section class="bg-white p-6 rounded-2xl shadow-md mb-8">
      <h2 class="text-2xl font-semibold mb-4">功能介紹</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-1">
        <li v-for="(tech, idx) in pj?.function_name" :key="idx">{{ tech }}</li>
      </ul>
    </section>

    <!-- 技術細節 / 分類 -->
    <section class="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 class="text-2xl font-semibold mb-6">技術細節</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-gray-700">
            <div class="p-4 border rounded-xl shadow-sm">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center">
                        <h3 class="text-lg font-semibold text-gray-800">前端開發</h3>
                    </div>
                    <a :href=pj?.gitHub_link?.FrontEnd target="_blank">
                      <Button  icon="pi pi-github"  severity="secondary" text raised rounded />
                    </a>
                </div>
                <ul class="list-disc list-inside leading-relaxed">
                    <li v-for="(value, key) in pj?.frontEnd" :key="key">{{ key }}：{{ value }}</li>
                </ul>
            </div>

            <div class="p-4 border rounded-xl shadow-sm">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center">
                        <h3 class="text-lg font-semibold text-gray-800">後端開發</h3>
                    </div>
                    <a :href=pj?.gitHub_link?.BackEnd target="_blank">
                      <Button  icon="pi pi-github"  severity="secondary" text raised rounded />
                    </a>
                  </div>
                <ul class="list-disc list-inside leading-relaxed">
                    <li v-for="(value, key) in pj?.backEnd" :key="key">{{ key }}：{{ value }}</li>
                </ul>
            </div>          
            
            <div class="p-4 border rounded-xl shadow-sm">
                <h3 class="text-lg font-semibold mb-3 text-gray-800">資料庫型態</h3>
                <ul class="list-disc list-inside space-y-1">
                    <li >{{  pj?.database_name }}</li>
                </ul>
            </div>

            <div class="p-4 border rounded-xl shadow-sm">
                <h3 class="text-lg font-semibold mb-3 text-gray-800">其他工具</h3>
                <ul class="list-disc list-inside space-y-1">
                    <li v-for="(tech, idx) in pj?.tool" :key="idx">{{ tech }}</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- 外部連結 -->
    <section class="flex items-center px-4 py-6 relative">
      
        <Button label="返回" icon="pi pi-arrow-left" severity="secondary" @click="goBack" raised  />
        <div class="absolute left-1/2 transform -translate-x-1/2">
          <Button label="查看專案 / Demo" severity="secondary" @click="openDemo" raised />
        </div>
    </section>
  </div>
</template>