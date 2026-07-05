<template>
  <el-statistic
    :value="displayValue"
    :precision="precision"
    :prefix="prefix"
    :suffix="suffix"
    :value-style="valueStyle"
  />
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useTransition, TransitionPresets } from "@vueuse/core";

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  precision: {
    type: Number,
    default: 0,
  },
  prefix: {
    type: String,
    default: "",
  },
  suffix: {
    type: String,
    default: "",
  },
  valueStyle: {
    type: [Object, String],
    default: undefined,
  },
  duration: {
    type: Number,
    default: 900,
  },
});

const source = ref(0);

const displayValue = useTransition(source, {
  duration: props.duration,
  transition: TransitionPresets.easeOutExpo,
});

function sync() {
  source.value = props.value;
}

onMounted(sync);
watch(() => props.value, sync);
</script>
