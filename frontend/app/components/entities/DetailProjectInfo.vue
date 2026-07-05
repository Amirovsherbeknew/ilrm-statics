<template>
    <div class="flex flex-col gap-3">
        <div class="w-full flex items-center justify-between border-b-[2px] border-stone-200 h-[45px]">
            <p class="font-semibold text-[22px] flex-1">
                {{ useConstants()?.statics?.find(resp => resp?.id === Number(isActive))?.['Loyiha nomi'] }}
            </p>
            <el-select v-model="choiseProject" placeholder="Tanlang" class="max-w-[220px]">
                <el-option v-for="(option,idx) in options" :key="idx" :value="option?.value" :label="option.label"></el-option>
            </el-select>
            
        </div>
        <div>
            <template v-if="choiseProject">
                <Formula1 v-if="choiseProject === 'Formula1'"/>
                <Formula2 v-if="choiseProject === 'Formula2'"/>
                <Formula3 v-if="choiseProject === 'Formula3'"/>
                <Formula4 v-if="choiseProject === 'Formula4'"/>
            </template>
            <EmptyState v-else
                title="Formulani tanlang"
                description=""
            />
        </div>
    </div>
</template>
<script setup lang="ts">

const isActive = defineModel()
const choiseProject = ref()

const options = [
    {
        label:'Formula 1',
        value:'Formula1'
    },
    {
        label:'Formula 2',
        value:'Formula2'
    },
    {
        label:'Formula 3',
        value:'Formula3'
    },
    {
        label:'Formula 4',
        value:'Formula4'
    }
]
</script>