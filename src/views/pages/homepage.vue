<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/service/auth'


const router = useRouter()  
const { isLogin} = useAuth();

function gotoaboutme() {
  router.push('/aboutme') 
}
function gotoexp() {
  router.push('/experience') 
}
function gotoworks() {
  router.push('/works') 
}
function gotoeditaboutme() {
  router.push('/editaboutme') 
}
function gotoediteducation() {
  router.push('/editeducation') 
}
function gotoeditexperience() {
  router.push('/editexperience') 
}
function gotoeditworks() {
  router.push('/editworks') 
}
function gotoeditcertificate(){
  router.push('/editcertificate')
}

</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    <div class="bg-white border rounded-xl p-6 shadow-lg hover:shadow-xl transition flex flex-col justify-center items-center min-h-[220px]"  @click="gotoaboutme">
      <header class="text-center">
        <h3 class="text-3xl md:text-5xl font-bold">About Me</h3>
        <p class="text-gray-600 mt-2">自我簡介 / 個人資料</p>
      </header>
    </div>

    <div class="bg-white border rounded-xl p-6 shadow-lg hover:shadow-xl transition flex flex-col justify-center items-center min-h-[220px]" @click="gotoexp">
      <header class="text-center">
        <h3 class="text-3xl md:text-5xl font-bold">Experience</h3>
        <p class="text-gray-600 mt-2">學歷 / 工作經歷</p>
      </header>
    </div>

    <div class="bg-white border rounded-xl p-6 shadow-lg hover:shadow-xl transition flex flex-col justify-center items-center min-h-[220px]" @click="gotoworks">
      <header class="text-center">
        <h3 class="text-3xl md:text-5xl font-bold">Works</h3>
        <p class="text-gray-600 mt-2">作品集</p>
      </header>
    </div>
  </div>


  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6" v-if="isLogin">
    <div class="bg-blue-50 border rounded-xl p-6 shadow-lg hover:shadow-xl transition flex flex-col justify-center items-center min-h-[220px]"  @click="gotoeditaboutme">
      <header class="text-center">
        <h3 class="text-3xl md:text-5xl font-bold">Edit AboutMe</h3>
        <p class="text-gray-600 mt-2">編輯個人資料</p>
      </header>
    </div>

    <div class="bg-blue-50 border rounded-xl p-6 shadow-lg hover:shadow-xl transition flex flex-col justify-center items-center min-h-[220px]" @click="gotoediteducation">
      <header class="text-center">
        <h3 class="text-3xl md:text-5xl font-bold">Edit Education</h3>
        <p class="text-gray-600 mt-2">編輯學歷</p>
      </header>
    </div>

    <div class="bg-blue-50 border rounded-xl p-6 shadow-lg hover:shadow-xl transition flex flex-col justify-center items-center min-h-[220px]" @click="gotoeditexperience">
      <header class="text-center">
        <h3 class="text-3xl md:text-5xl font-bold">Edit Experience</h3>
        <p class="text-gray-600 mt-2">編輯工作經歷</p>
      </header>
    </div>
    <div class="bg-blue-50 border rounded-xl p-6 shadow-lg hover:shadow-xl transition flex flex-col justify-center items-center min-h-[220px]" @click="gotoeditworks">
      <header class="text-center">
        <h3 class="text-3xl md:text-5xl font-bold">Edit Works</h3>
        <p class="text-gray-600 mt-2">編輯作品集</p>
      </header>
    </div>
    <div class="bg-blue-50 border rounded-xl p-6 shadow-lg hover:shadow-xl transition flex flex-col justify-center items-center min-h-[220px]" @click="gotoeditcertificate">
      <header class="text-center">
        <h3 class="text-3xl md:text-5xl font-bold">Edit Certificate</h3>
        <p class="text-gray-600 mt-2">編輯證書
        </p>
      </header>
    </div>
  </div>
  
</template>
