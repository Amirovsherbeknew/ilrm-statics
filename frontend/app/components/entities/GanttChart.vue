<template>
  <el-empty v-if="validStages.length === 0" description="Hozircha bosqichlar mavjud emas" />
  <div v-else class="w-full overflow-x-auto">
    <div class="min-w-[680px]">
      <!-- Oy shkalasi -->
      <div class="flex border-b border-slate-200 pb-2 mb-1 pl-[200px]">
        <div
          v-for="month in months"
          :key="month.key"
          class="shrink-0 border-l border-slate-100 pl-2 text-xs font-medium text-slate-400"
          :style="{ width: month.widthPercent + '%' }"
        >
          {{ month.label }}
        </div>
      </div>

      <!-- Qatorlar -->
      <div class="relative flex flex-col">
        <!-- Bugungi kun chizig'i -->
        <div
          v-if="todayPercent !== null"
          class="absolute top-0 bottom-0 z-10 w-px bg-rose-400"
          :style="{ left: `calc(200px + ${todayPercent}%)` }"
        >
          <span
            class="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-medium text-white"
          >
            Bugun
          </span>
        </div>

        <div
          v-for="(stage, index) in validStages"
          :key="stage.id"
          class="group flex items-center gap-0 rounded-lg py-1.5"
          :class="index % 2 === 1 ? 'bg-slate-50' : ''"
        >
          <div class="w-[200px] shrink-0 truncate pr-3 text-sm font-medium text-slate-700" :title="stage.name">
            {{ stage.name }}
          </div>

          <div class="relative h-6 flex-1">
            <div
              class="absolute inset-y-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-sm ring-1 ring-inset ring-blue-700/10 transition-[filter] group-hover:brightness-110"
              :style="barStyle(stage)"
              :title="`${stage.name}\n${stage.startDate} — ${stage.endDate} (${durationDays(stage)} kun)`"
            >
              <span class="flex h-full items-center justify-center px-2 text-[11px] font-medium text-white truncate">
                {{ durationDays(stage) }} kun
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Izoh -->
      <div class="mt-3 flex items-center gap-1.5 pl-[200px] text-xs text-slate-400">
        <span class="h-2 w-2 rounded-full bg-blue-600"></span>
        Bosqich muddati
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  stages: {
    type: Array,
    default: () => [],
  },
});

const MS_PER_DAY = 86400000;

function toDate(value) {
  return new Date(value);
}

const validStages = computed(() =>
  props.stages.filter((stage) => stage.startDate && stage.endDate)
);

const rangeStart = computed(() => {
  const times = validStages.value.map((stage) => toDate(stage.startDate).getTime());
  return new Date(times.length ? Math.min(...times) : Date.now());
});

const rangeEnd = computed(() => {
  const times = validStages.value.map((stage) => toDate(stage.endDate).getTime());
  return new Date(times.length ? Math.max(...times) : Date.now());
});

const totalDays = computed(() => {
  const days = Math.round((rangeEnd.value - rangeStart.value) / MS_PER_DAY);
  return days > 0 ? days : 1;
});

function durationDays(stage) {
  const start = toDate(stage.startDate);
  const end = toDate(stage.endDate);
  return Math.max(1, Math.round((end - start) / MS_PER_DAY));
}

function barStyle(stage) {
  const start = toDate(stage.startDate);
  const offsetDays = Math.max(0, Math.round((start - rangeStart.value) / MS_PER_DAY));
  const durDays = durationDays(stage);

  return {
    left: `${(offsetDays / totalDays.value) * 100}%`,
    width: `${Math.max(3, Math.min(100, (durDays / totalDays.value) * 100))}%`,
  };
}

const todayPercent = computed(() => {
  const today = Date.now();
  if (today < rangeStart.value.getTime() || today > rangeEnd.value.getTime()) return null;
  const offsetDays = Math.round((today - rangeStart.value.getTime()) / MS_PER_DAY);
  return (offsetDays / totalDays.value) * 100;
});

const months = computed(() => {
  const result = [];
  let cursor = new Date(rangeStart.value.getFullYear(), rangeStart.value.getMonth(), 1);

  while (cursor <= rangeEnd.value) {
    const monthStart = cursor < rangeStart.value ? rangeStart.value : cursor;
    const nextMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    const monthEnd = nextMonth > rangeEnd.value ? rangeEnd.value : nextMonth;
    const days = Math.max(1, Math.round((monthEnd - monthStart) / MS_PER_DAY));

    result.push({
      key: `${cursor.getFullYear()}-${cursor.getMonth()}`,
      label: cursor.toLocaleDateString("uz-UZ", { month: "short", year: "numeric" }),
      widthPercent: (days / totalDays.value) * 100,
    });

    cursor = nextMonth;
  }

  return result;
});
</script>
