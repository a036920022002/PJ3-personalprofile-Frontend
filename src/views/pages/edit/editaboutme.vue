<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../../service/axios'
import { useToast } from 'primevue/usetoast'  

const aboutme = ref({});
const introText = ref('');
const introTextEng = ref([]);
const toast = useToast() 
const envHost = import.meta.env.VITE_API_URL;

onMounted(async () => {
    const res = await api.get('/api/Aboutme',{ requireAuth: true });
    var firstItem = res.data[0]; // 取第一筆資料
    //先嘗試將資料轉換為物件或矩陣
    //將中文自介轉換為JSON
    aboutme.value = {
      ...firstItem,
      photoUrl : `${envHost}/public/aboutme/${firstItem.photo}` 

    }

    try {
    const parsed = JSON.parse(aboutme.value.intro) //嘗試把 intro 解析成 JavaScript 物件或陣列。
    introText.value = Array.isArray(parsed) ? parsed.join('\n\n') : aboutme.value.intro
        //當如果是陣列格式，用換行符號連接文字
    } catch {
    introText.value = aboutme.value.intro
        //如果不是字串，就直接顯示原本的內容
    }

  // 英文自我介紹
  try {
    const parsedEng = JSON.parse(aboutme.value.introEng)
    introTextEng.value = Array.isArray(parsedEng) ? parsedEng.join('\n\n') : aboutme.value.introEng
  } catch {
    introTextEng.value = aboutme.value.introEng
  }
});
//設定照片上傳樣式
const fileUploadPt = {
  pcChooseButton: { class: 'mb-2' }, 
  pcUploadButton: { class: 'mb-2' },
  pcCancelButton: { class: '' }
}
//僅照片上傳
const fileUpload = async (event) => {
    const file = event.files[0]  // ✅ 先定義 file
    console.log('準備上傳的檔案:', {
    name: file.name,
    size: file.size,
    type: file.type
  })
  const formData = new FormData()
    formData.append('file', event.files[0])
  try {
    const res = await api.post('/api/aboutme', formData, {
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
    if (res.data?.url) {
      aboutme.value.photoUrl = `${res.data.url}?t=${Date.now()}`
    }

  } catch (err) {
    console.error('上傳失敗', err)
  }
}

//僅上傳其他欄位
const saveAboutMe = async () => {
  try {
    // 將 intro 文字（多段）轉為 JSON 儲存格式
    const introArray = introText.value.split('\n').filter(line => line.trim() !== '')
    const introEngArray = introTextEng.value.split('\n').filter(line => line.trim() !== '')

    const payload = {
      ...aboutme.value,
      intro: JSON.stringify(introArray),
      introEng: JSON.stringify(introEngArray)
    }
    console.log('送出的資料 payload:', payload)

    const res = await api.put('/api/aboutme', payload,{ requireAuth: true })
    console.log('儲存成功', res.data)
    toast.add({
      severity: 'success',
      summary: '儲存成功',
      detail: '個人資料已成功更新',
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


</script>

<template>
    <Fluid>
        <Toast/>
        <div class="flex flex-col mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">個人資訊 Personal Profile</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="name" class="text-lg">姓名 Name </label>
                        <InputText id="name" type="text" v-model="aboutme.name" :disabled="true"/>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                       <label for="englishName" class="text-lg">英文名 English Name</label>
                       <InputText id="englishName" type="text" v-model="aboutme.englishName" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="gender" class="text-lg">性別 Gender </label>
                        <InputText id="gender" type="text" v-model="aboutme.gender" :disabled="true"/>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="birth" class="text-lg">生日 Birthday</label>
                        <InputText id="birth" type="text" v-model="aboutme.birth" :disabled="true"/>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                       <label for="phone" class="text-lg">連絡電話 Phone Number</label>
                       <InputText id="phone" type="text" v-model="aboutme.phone" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                       <label for="email" class="text-lg">郵件地址 Email</label>
                       <InputText id="email" type="text" v-model="aboutme.email"  />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                       <label for="address" class="text-lg">居住地 Location</label>
                       <InputText id="address" type="text" v-model="aboutme.address" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                       <!-- <label for="address" class="text-lg">居住地 Location</label>
                       <InputText id="address" type="text" v-model="aboutme.address" /> -->
                    </div>
                </div>
            </div>
            <div class="card flex flex-col gap-4 w-full">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                       <label for="fb" class="text-lg">臉書帳號 FB</label>
                       <InputText id="fb" type="text" v-model="aboutme.fb" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                       <label for="ig_link" class="text-lg">Instergram 帳號 IG</label>
                       <InputText id="ig" type="text" v-model="aboutme.ig" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                       <label for="linkin" class="text-lg">LinkIn</label>
                       <InputText id="linkin" type="text" v-model="aboutme.linkedin" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                       <label for="LINE" class="text-lg">LINE</label>
                       <InputText id="LINE" type="text" v-model="aboutme.line" />
                    </div>
                </div>
            </div>

            <div class="card flex flex-col gap-4 w-full">
                <div class="flex flex-wrap">
                    <label for="intro" class="text-lg">中文自我介紹 Introduct</label>
                    <Textarea id="intro" rows="10" v-model="introText" />
                </div> 
                <div class="flex flex-wrap">
                    <label for="introEng" class="text-lg">英文自我介紹 English Introduct</label>
                    <Textarea id="introEng" rows="10" v-model="introTextEng" />
                </div>
            </div>

            <div class="card flex flex-col gap-4 w-full">
                <div class="flex flex-col lg:flex-row gap-4">
                    <div class="flex-1 flex justify-center items-center">
                        <img :src="aboutme.photoUrl"  alt="about Me Photo" class="max-w-full max-h-80 object-contain rounded-xl"/>
                    </div>
                    <div class="flex-1 flex flex-col justify-between h-full gap-4">
                        <FileUpload name="demo[]" @uploader="fileUpload" :multiple="false" accept="image/*" :maxFileSize="1000000" customUpload chooseLabel="選擇檔案" uploadLabel="上傳" cancelLabel="取消" class="flex flex-col gap-2 file-upload-no-icon" :pt="fileUploadPt" />
                    </div>
                </div>
            </div>

            <div class="card flex flex-col gap-4 w-full">
                <div class="flex justify-center gap-4">
                    <Button label="儲存" :style="{ width: '8rem' }" raised @click="saveAboutMe"/>
                    <Button label="返回" :style="{ width: '8rem' }" raised />
                </div>          
            </div>
        </div>
    </Fluid>
</template>


