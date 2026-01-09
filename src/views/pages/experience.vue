<script setup>
import timeline from '@/views/uikit/TimelineDoc.vue'
import { ref,onMounted } from 'vue';
import api from '../../service/axios'

const edu = ref([]);
const layout = ref('list');

onMounted(async () => {
    const res = await api.get(`${import.meta.env.VITE_API_URL}/api/Education`,{ requireAuth: false });
    edu.value = res.data.reverse();  
});

</script>

<template>
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl">學歷 Academic Background</div>
            <DataView :value="edu" :layout="layout">
                <template #list="slotProps">
                    <div class="flex flex-col">
                        <div v-for="(item, index) in slotProps.items" :key="index" class="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 p-6 border-t border-surface" :class="{ 'border-t-0': index === 0 }">
                            <!-- 左欄 School -->
                            <div class="flex flex-col">
                                <div class="text-lg font-medium mt-2">{{ item.school }}</div>
                                <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.schoolEng }}</span>
                            </div>
                            <!-- 中欄 Department -->
                            <div class="flex flex-col justify-start">
                                <div class="text-lg font-medium mt-2">{{ item.department }}</div>
                                <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.departmentEng }}</span>
                            </div>
                            <!-- 右欄 Period -->
                            <div class="flex flex-col items-start sm:items-end">
                                <div class="text-lg font-medium mt-2">{{ item.periodOfStudytime }}</div>
                                <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.degree }}畢業</span>
                                <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.degreeEng }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </div>
    <timeline>        
    </timeline>

</template>