<script setup>

import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import api from '@/service/axios'

const dt = ref();
const auth = ref([]);
const account = ref({});
const toast = useToast();
const submitted = ref(false);
const accountDialog = ref(false);
const deleteAccountDialog = ref(false);
const deleteAccountsDialog = ref(false);
const selectedAccounts = ref([]);
const selectedDelIds = ref([]);

function exportCSV() {
    dt.value.exportCSV();
}

onMounted(async () => {
    const res = await api.get('/api/Auth',{ requireAuth: true });
    auth.value = res.data
    // console.log(" auth.value", auth.value) 
    
});

function openNew(){
    account.value = {};
    submitted.value = false;
    accountDialog.value = true; //代表顯示accountDialog
}

function hideDialog() {
    accountDialog.value = false;
    submitted.value = false;
}

function editAccount(editAuthId){
    console.log("editAuthId",editAuthId)
    const selected = auth.value.find(acc => acc.id === editAuthId);

    if (!selected) {
        console.error("找不到此帳號資料");
        return;
    }

    account.value = { ...selected }; 
    accountDialog.value = true;
}

function confirmDeleteAccount(AuthId) {
    console.log("confirmDeleteAccount AuthId",AuthId)
    const selected = auth.value.find(acc => acc.id === AuthId);
    account.value = { ...selected };
    deleteAccountDialog.value = true;
}

async function saveAccount(){
    console.log(account.value)
    if(!account.value.email||!account.value.password||!account.value.name){
        toast.add({
            severity: 'warn',
            summary: '欄位不完整',
            detail: '請填寫 Email、Password 與 Name',
            life: 10000
        });
        return;
    }
    try{
        let res;
        if(account.value.id){
            res = await api.put(`api/Auth/${account.value.id}`,account.value,{ requireAuth: true })
            const index = auth.value.findIndex(a => a.id === account.value.id);
            if (index !== -1) {
                auth.value[index] = { ...account.value };
            }
            accountDialog.value = false;
            toast.add({ 
                severity: 'success', 
                summary: '更新成功', 
                life: 3000 
            });        
        }else{
            res = await api.post('api/Auth',account.value,{ requireAuth: true })    
            const newId = res.data.id;
            auth.value.push({
                ...account.value,
                id: newId
            });
            accountDialog.value = false;
            toast.add({ 
                severity: 'success', 
                summary: '已新增成功', 
                life: 3000 
            }); 
        }
    }catch(err){
        console.error('新增失敗', err);
        toast.add({ 
            severity: 'error', 
            summary: '新增失敗', 
            life: 3000 
        });
    }
}

async function deleteAccount() {
    try{
        const res = await api.delete(`api/Auth/${account.value.id}`,{ requireAuth: true });
        deleteAccountDialog.value = false;
        auth.value = auth.value.filter(val => val.id !== account.value.id);
        toast.add({ 
            severity: 'success', 
            summary: '已刪除',
            life: 3000 
        });
        account.value={};
    }catch(err){
        console.error("刪除失敗", err);
        // 顯示錯誤通知
        toast.add({
            severity: 'error',
            summary: '刪除失敗',
            detail: err.response?.data?.message || '請稍後再試',
            life: 3000
        });
    }
   
}

function confirmDeleteSelected() {
    selectedDelIds.value = selectedAccounts.value.map(account => account.id)
    deleteAccountsDialog.value = true;
}

async function deleteSelectedAccounts() {
    if(!selectedDelIds.value.length) return;
    const ids = selectedAccounts.value.map(acc => acc.id)
    try{
        for (const id of ids){
            const res = await api.delete(`api/auth/delete/${id}`,{ requireAuth: true });
        }
        auth.value = auth.value.filter(acc => !ids.includes(acc.id));
        toast.add({ 
            severity: 'success', 
            summary: '已刪除',
            life: 3000 
        });
        selectedDelIds.value=[];
        deleteAccountsDialog.value = false;
    }catch(err){
        console.error("刪除失敗", err);

        toast.add({
            severity: 'error',
            summary: '刪除失敗',
            detail: err.response?.data?.message || '請稍後再試',
            life: 3000
        });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});


function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

function createId() {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedAccounts || !selectedAccounts.length" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedAccounts"
                :value="auth"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Accounts"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">使用者編輯</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="ID" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>
                <Column field="email" header="Email" sortable style="min-width: 10rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editAccount(slotProps.data.id)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteAccount(slotProps.data.id)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="accountDialog" :style="{ width: '450px' }" header="Account" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="email" class="block font-bold mb-3">E-mail</label>
                    <InputText id="email" v-model.trim="account.email" required="true" autofocus :invalid="submitted && !account.email" fluid />
                    <small v-if="submitted && !account.email" class="text-red-500">E-mail is required.</small>
                </div>
                <div>
                    <label for="password" class="block font-bold mb-3">password</label>
                    <InputText id="password" required="true" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model="account.name" placeholder="輸入姓名" fluid/>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveAccount" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteAccountDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="account"
                    >Are you sure you want to delete <b>{{ account.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteAccountDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteAccount" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteAccountsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="auth">Are you sure you want to delete the selected Accounts?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteAccountsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedAccounts" />
            </template>
        </Dialog>
    </div>
</template>
