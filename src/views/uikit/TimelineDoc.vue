<script setup>
import { ref,onMounted } from 'vue';
import api from '../../service/axios'

const exp = ref([]);

onMounted(async () => {
  
    const res = await api.get(`/api/workexperience`,{ requireAuth: false });
    exp.value = res.data.map(item=>({
        ...item,
        descript:JSON.parse(item.descript),
        descriptEng:JSON.parse(item.descriptEng),
    }));
    exp.value.reverse();

 
});

</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-full">
            <div class="card">
                <div class="font-semibold text-xl mb-4">工作經歷 Work Experience</div>
                <Timeline :value="exp" align="alternate" class="customized-timeline">
                    <template #marker="slotProps">
                        <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" style="background-color: #607D8B;">
                            <i class="pi pi-building"></i>
                        </span>
                    </template>
                    <template #content="slotProps">
                        <Card class="mt-4">
                            <template #title>
                                {{ slotProps.item.company }}  {{ slotProps.item.companyEng }}
                            </template>
                            <template #subtitle>
                                <div>{{ slotProps.item.jobPosition }} / {{ slotProps.item.jobPositionEng }}</div> 
                                <div>{{ slotProps.item.yearInService }} ({{ slotProps.item.tenure }} years)</div>                               
                            </template>
                            <template #content>

                                <!-- <ul class="list-disc pl-5">
                                    <li v-for="(paragraph, index) in slotProps.item.descript" :key="index" class="leading-normal m-0">{{ paragraph }}</li>
                                </ul> -->
                                <p v-for="(paragraph, index) in slotProps.item.descript" :key="index" class="leading-normal m-0">{{ paragraph }}</p>
                                <!-- <Button label="Read more" text></Button> -->
                            </template>
                        </Card>
                    </template>
                </Timeline>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
    ::v-deep(.customized-timeline) {
        .p-timeline-event:nth-child(even) {
            flex-direction: row !important;

            .p-timeline-event-content {
                text-align: left !important;
            }
        }

        .p-timeline-event-opposite {
            flex: 0;
        }

        .p-card {
            margin-top: 1rem;
        }
    }
}
</style>
