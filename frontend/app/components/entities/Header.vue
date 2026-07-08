<template>
    <div class="flex items-center justify-between gap-2 border-b-[2px] border-stone-200 h-[85px] flex gap-1 px-3 py-1 bg-white/30 backdrop-blur-none">
        <nuxt-link class="flex items-center justify-start gap-2 cursor-pointer" :to="getRole() === 'monitoring' ? '/':'/projects'">
            <img src="https://btr.iplmr.uz/_nuxt/greb2.C9oZdOx_.png" alt="greb" class="w-[60px] h-[60px]">
            <div class="flex items-center flex-col justify-start my-auto max-md:hidden">
                <h1 class="text-[16px] text-gray-800 text-left font-semibold">O‘zbekiston Respublikasi Kambag‘allikni qisqartirish va bandlik vazirligi huzuridagi</h1>
                <h3 class="text-gray-700 text-[12px] text-left w-full  font-semibold">Kambag‘allik va mehnat bozori tadqiqotlari instituti</h3>
            </div>
        </nuxt-link>
        <div class="flex items-center gap-3">
            <el-segmented v-if="getRole() === 'monitoring'" v-model="value" :options="options" block class="w-[220px] shadow border border-stone-100" @change="router.push({name:$event})"/>
            <ActionButton type="exit" @click="handleLogout"/>
        </div>
    </div>
</template>
<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { clearTokens,getRole } = useToken()

const value = ref('index')

function handleLogout() {
    clearTokens()
}

const options = [
  {
    label:'Monitoring',
    value:'index'
  },
  {
    label:'Loyihalar',
    value:'projects'
  }
]
onMounted(() => {
    if (String(route.name || '')?.includes('projects')) {
      value.value = 'projects'
    }
    else value.value = 'index'
})
</script>
