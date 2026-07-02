<template>
    <div class="w-full h-svh flex flex-col gap-3 login-view-box">
        <div class="flex items-center justify-start gap-2 border-b-[2px] border-stone-200 h-[85px] flex gap-1 px-3 bg-white/30 backdrop-blur-none">
            <img src="https://btr.iplmr.uz/_nuxt/greb2.C9oZdOx_.png" alt="greb" class="w-[60px] h-[60px]">
            <div class="flex items-center flex-col justify-start my-auto max-md:hidden">
                <h1 class="text-[16px] text-gray-800 text-left font-semibold">O‘zbekiston Respublikasi Kambag‘allikni qisqartirish va bandlik vazirligi</h1>
                <h3 class="text-gray-700 text-[12px] text-left w-full  font-semibold">Vazrilikning intellektual mulki</h3>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4 flex-1 p-3">
            <div class="shadow rounded-[32px] p-3 border-[1px] border-stone-100 bg-white/30 backdrop-blur-sm">
                <div class="w-full flex justify-end h-[45px] border-b-[2px] border-stone-200 py-1">
                    <button class="rounded-lg border border-stone-300 px-2 py-1 w-[70px]" @click="back">Ortga</button>
                </div>
                <div class="w-full flex items-center justify-center flex-1" style="height: calc(100% - 45px);">
                    <template v-if="activeRegion">
                        <Region1 v-if="Number(activeRegion) === 1" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                        <Region2 v-if="Number(activeRegion) === 2" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                        <Region3 v-if="Number(activeRegion) === 3" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                        <Region4 v-if="Number(activeRegion) === 4" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                        <Region5 v-if="Number(activeRegion) === 5" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                        <Region6 v-if="Number(activeRegion) === 6" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                        <Region7 v-if="Number(activeRegion) === 7" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                        <Region8 v-if="Number(activeRegion) === 8" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                        <Region9 v-if="Number(activeRegion) === 9" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                        <Region10 v-if="Number(activeRegion) === 10" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                        <Region11 v-if="Number(activeRegion) === 11" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                        <Region12 v-if="Number(activeRegion) === 12" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                        <Region13 v-if="Number(activeRegion) === 13" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                        <Region14 v-if="Number(activeRegion) === 14" v-model="activeDistrict" v-model:name="activeDistrictName"  @district-click="getStatics"/>
                    </template>
                    <Respublic v-else class="-ml-3" v-model="activeRegion" @change-id="getStatics"/>
                </div>
            </div>
            <div class="shadow rounded-[32px] p-3 border-[1px] border-stone-100 bg-white/30 backdrop-blur-sm">
                <div class="flex justify-end h-[45px] text-[32px] font-semibold text-stone-500">
                    {{ activeDistrictName || useConstants().regionList?.find(resp => resp?.id === Number(activeRegion))?.name_uz || "O'zbekiston Respublikasi" }}
                </div>
                <div class="w-full max-h-[700px] overflow-y-auto">
                    <RegionStatsPanel
                        :selected="selected"
                        :allProjects="useConstants().statics"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const activeRegion = ref()
const activeDistrict = ref()
const activeDistrictName = ref()

function getStatics () {

}

const selected = computed(() => {
    if (activeDistrict.value) {
        const object = useConstants().dictrictList?.find(resp => resp?.id === Number(activeDistrict.value))
        return  { level: 'district', code: object?.id, name: object?.name_uz }
    }
    if (activeRegion.value) {
        const object = useConstants().regionList?.find(resp => resp?.id === Number(activeRegion.value))
        return  { level: 'region', code: object?.id, name: object?.name_uz }
    }
    return null
})

function back () {
    if (activeDistrict.value) {
        activeDistrict.value = undefined
        activeDistrictName.value = undefined
        return
    }
    if (activeRegion.value) activeRegion.value = undefined
}
</script>
<style lang="css" scoped>
.login-view-box {
  background: url('../assets/images/background.png');
  background-size: cover;
  background-repeat: no-repeat
}
</style>