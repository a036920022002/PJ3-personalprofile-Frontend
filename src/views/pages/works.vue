<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import api from '../../service/axios'

const router = useRouter()  
const works = ref([]);
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
    const res = await api.get('/api/Works',{ requireAuth: false });
    works.value = res.data.map(item=>{
        const imageArray =JSON.parse(item.image||'[]'); 

        return {
        ...item,
        image: imageArray, // 這是原本要求的陣列格式
        // 2. 新增 imageUrl：取陣列第一張，並拼接完整路徑；若無圖片則給空字串或預設圖
        imageUrl: imageArray.length > 0 ? imageArray.map(img =>`${envHost}/public/works/${item.id}/${img}`) : ''
    };
    
    })
});

function goToDetail(id) {
    router.push(`/workdetail/${id}`) 
}
</script>

<template>
    <div class="card border rounded-2xl p-4 shadow-md" v-for="(work, index) in works" :key="work.id">
        <div class="font-semibold text-xl mb-4">Project Name： {{ work.name }}</div>
        <Galleria :value="work.imageUrl.map(img => ({itemImageSrc: img,thumbnailImageSrc: img,}))" :responsiveOptions="galleriaResponsiveOptions" :numVisible="5" containerStyle="max-width: 640px">
            <template #item="slotProps">
                <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%" />
            </template>
            <template #thumbnail="slotProps">
                <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
            </template>
        </Galleria>
        <Button label="View Details" class="mt-4" @click="goToDetail(work.id)"></Button>
    </div>
</template>
