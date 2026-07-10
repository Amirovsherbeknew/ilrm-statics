<template>
  <div class="w-full font-sans text-slate-900">
    <el-empty v-if="validStages.length === 0" description="Hozircha bosqichlar mavjud emas" />

    <template v-else>
      <!-- Umumiy statistika -->
      <div class="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div class="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
          <p class="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Icon name="lucide:layers" class="h-3.5 w-3.5" /> Bosqichlar
          </p>
          <p class="mt-1 text-lg font-bold text-slate-900">{{ validStages.length }}</p>
        </div>
        <div class="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
          <p class="flex items-center gap-1.5 text-xs font-medium text-emerald-600/80">
            <Icon name="lucide:banknote" class="h-3.5 w-3.5" /> Jami byudjet
          </p>
          <p class="mt-1 text-lg font-bold text-emerald-700">{{ formatPrice(totalPrice) }} mln</p>
        </div>
        <div class="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
          <p class="flex items-center gap-1.5 text-xs font-medium text-blue-600/80">
            <Icon name="lucide:calendar-range" class="h-3.5 w-3.5" /> Muddat
          </p>
          <p class="mt-1 text-lg font-bold text-blue-700">{{ totalDurationDays }} kun</p>
        </div>
        <div class="rounded-xl border border-violet-100 bg-violet-50/70 px-4 py-3">
          <p class="flex items-center gap-1.5 text-xs font-medium text-violet-600/80">
            <Icon name="lucide:flag" class="h-3.5 w-3.5" /> Yakunlanish
          </p>
          <p class="mt-1 text-lg font-bold text-violet-700">{{ formatDate(rangeEnd) }}</p>
        </div>
      </div>

      <!-- Yuqori panel: yil tablari + yuklab olish -->
      <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
            :class="activeTab === tab
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-500 hover:text-slate-800'"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <button
          class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:from-emerald-600 hover:to-emerald-500"
          @click="downloadCsv"
        >
          <Icon name="lucide:download" class="h-4 w-4" />
          Yuklab olish
        </button>
      </div>

      <!-- Jadval -->
      <div class="w-full overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table class="w-full border-collapse text-xs">
          <thead>
            <!-- 1-qator: sarlavha + reja nomi -->
            <tr class="bg-slate-50 text-slate-700">
              <th rowspan="3" class="sticky left-0 z-10 min-w-[240px] border-b border-r border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold">
                Amalga oshiriladigan tadbirlar/ishlar nomi
              </th>
              <th rowspan="3" class="min-w-[110px] border-b border-r border-slate-200 px-2 py-2 font-semibold text-emerald-700">
                Narx (mln so'm)
              </th>
              <th rowspan="3" class="min-w-[90px] border-b border-r border-slate-200 px-2 py-2 font-semibold">
                Davomiyligi (kun)
              </th>
              <th rowspan="3" class="min-w-[100px] border-b border-r border-slate-200 px-2 py-2 font-semibold">
                Boshlanishi
              </th>
              <th rowspan="3" class="min-w-[100px] border-b border-r border-slate-200 px-2 py-2 font-semibold">
                Yakunlanishi
              </th>
              <th
                :colspan="columns.length"
                class="border-b border-slate-200 px-2 py-2 text-center font-bold"
              >
                {{ planTitle }}
              </th>
            </tr>

            <!-- 2-qator: choraklar (yoki Umumiyda yil + chorak) -->
            <tr class="bg-slate-50 text-slate-600">
              <th
                v-for="group in quarterGroups"
                :key="group.key"
                :colspan="group.span"
                class="border-b border-r border-slate-200 px-2 py-1.5 text-center font-semibold"
              >
                {{ group.label }}
              </th>
            </tr>

            <!-- 3-qator: oylar -->
            <tr class="bg-slate-50 text-slate-500">
              <th
                v-for="col in columns"
                :key="col.key"
                class="h-24 w-9 border-b border-r border-slate-200 px-0 py-1 align-bottom font-medium"
              >
                <span class="mx-auto block rotate-180 text-[10px]" style="writing-mode: vertical-rl;">
                  {{ col.label }}
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            <!-- Umumiy (bosqichlar jami) qatori -->
            <tr class="bg-orange-100/80 font-semibold italic text-slate-800">
              <td class="sticky left-0 z-10 border-b border-r border-slate-200 bg-orange-100 px-3 py-2 text-left">
                {{ summaryLabel }}
              </td>
              <td class="border-b border-r border-slate-200 px-2 py-2 text-center text-emerald-700">
                {{ formatPrice(totalPrice) }}
              </td>
              <td class="border-b border-r border-slate-200 px-2 py-2 text-center">
                {{ totalDurationDays }}
              </td>
              <td class="border-b border-r border-slate-200 px-2 py-2 text-center">
                {{ formatDate(rangeStart) }}
              </td>
              <td class="border-b border-r border-slate-200 px-2 py-2 text-center">
                {{ formatDate(rangeEnd) }}
              </td>
              <td
                v-for="col in columns"
                :key="col.key"
                class="border-b border-r border-slate-100 p-0"
                :class="isAnyStageActive(col) ? 'bg-green-200/70' : ''"
              ></td>
            </tr>

            <!-- Bosqich va mexanizm qatorlari -->
            <template v-for="(row, index) in tableRows" :key="row.rowKey">
              <tr
                class="transition-colors hover:bg-slate-50"
                :class="row.type === 'mechanism' ? 'bg-slate-50/60' : (index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white')"
              >
                <td
                  class="sticky left-0 z-10 max-w-[240px] truncate border-b border-r border-slate-200 bg-inherit px-3 py-2 text-left"
                  :class="row.type === 'stage' ? 'font-medium text-blue-900' : 'pl-6 text-slate-500'"
                  :title="row.name"
                >
                  <span class="mr-1 text-slate-400">{{ row.number }}.</span>
                  <span v-if="row.type === 'mechanism'" class="mr-1 text-slate-300">↳</span>
                  {{ row.name }}
                </td>
                <td class="border-b border-r border-slate-200 px-2 py-2 text-center font-medium text-emerald-700">
                  {{ row.type === 'stage' && row.price !== null && row.price !== undefined ? formatPrice(row.price) : '—' }}
                </td>
                <td class="border-b border-r border-slate-200 px-2 py-2 text-center text-blue-700">
                  {{ rowDuration(row) }}
                </td>
                <td class="border-b border-r border-slate-200 px-2 py-2 text-center text-blue-700">
                  {{ row.type === 'stage' ? row.startDate : row.beforeDate }}
                </td>
                <td class="border-b border-r border-slate-200 px-2 py-2 text-center text-blue-700">
                  {{ row.type === 'stage' ? row.endDate : row.afterDate }}
                </td>
                <td
                  v-for="col in columns"
                  :key="col.key"
                  class="border-b border-r border-slate-100 p-0"
                  :class="isRowActive(row, col) ? (row.type === 'stage' ? 'bg-green-200/70' : 'bg-sky-200/70') : ''"
                  :title="isRowActive(row, col) ? `${row.name}: ${col.title}` : ''"
                ></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Izoh -->
      <div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
        <span class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-sm bg-green-300"></span>
          Bosqich amalga oshiriladigan oylar
        </span>
        <span class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-sm bg-sky-300"></span>
          Mexanizm amalga oshiriladigan oylar
        </span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  stages: {
    type: Array,
    default: () => [],
  },
  mechanisms: {
    type: Array,
    default: () => [],
  },
  // Umumiy (jami) qator nomi — masalan "1-Bosqich. Loyihaning hujjatlarini ishlab chiqish."
  summaryLabel: {
    type: String,
    default: "Bosqichlar jami",
  },
});

const MS_PER_DAY = 86400000;
const MONTH_NAMES = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];
const QUARTER_LABELS = ["I Chorak", "II Chorak", "III Chorak", "IV Chorak"];

function toDate(value) {
  return new Date(value);
}

/* ---------- Bosqichlar, mexanizmlar va umumiy oraliq ---------- */
const validStages = computed(() =>
  props.stages.filter((stage) => stage.startDate && stage.endDate)
);

const validMechanisms = computed(() =>
  props.mechanisms.filter((m) => m.beforeDate && m.afterDate)
);

const rangeStart = computed(() => {
  const times = [
    ...validStages.value.map((s) => toDate(s.startDate).getTime()),
    ...validMechanisms.value.map((m) => toDate(m.beforeDate).getTime()),
  ];
  return new Date(times.length ? Math.min(...times) : Date.now());
});

const rangeEnd = computed(() => {
  const times = [
    ...validStages.value.map((s) => toDate(s.endDate).getTime()),
    ...validMechanisms.value.map((m) => toDate(m.afterDate).getTime()),
  ];
  return new Date(times.length ? Math.max(...times) : Date.now());
});

const totalDurationDays = computed(() =>
  Math.max(1, Math.round((rangeEnd.value - rangeStart.value) / MS_PER_DAY))
);

const totalPrice = computed(() =>
  validStages.value.reduce((sum, stage) => sum + (Number(stage.price) || 0), 0)
);

function durationDays(start, end) {
  return Math.max(1, Math.round((toDate(end) - toDate(start)) / MS_PER_DAY));
}

// Qator (bosqich yoki mexanizm) uchun davomiylik
function rowDuration(row) {
  return row.type === "stage"
    ? durationDays(row.startDate, row.endDate)
    : durationDays(row.beforeDate, row.afterDate);
}

/* ---------- Yil tablari ---------- */
const years = computed(() => {
  const set = new Set();
  validStages.value.forEach((s) => {
    const y1 = toDate(s.startDate).getFullYear();
    const y2 = toDate(s.endDate).getFullYear();
    for (let y = y1; y <= y2; y++) set.add(y);
  });
  validMechanisms.value.forEach((m) => {
    const y1 = toDate(m.beforeDate).getFullYear();
    const y2 = toDate(m.afterDate).getFullYear();
    for (let y = y1; y <= y2; y++) set.add(y);
  });
  return [...set].sort((a, b) => a - b);
});

const tabs = computed(() => [...years.value.map(String), "Umumiy"]);

const activeTab = ref(null);
watch(
  tabs,
  (val) => {
    if (!activeTab.value || !val.includes(activeTab.value)) {
      activeTab.value = val[0] ?? null;
    }
  },
  { immediate: true }
);

/* ---------- Ustunlar (oylar) ---------- */
// Har bir ustun: { key, label, title, year, month }
const columns = computed(() => {
  const result = [];
  const targetYears =
    activeTab.value === "Umumiy" ? years.value : [Number(activeTab.value)];

  targetYears.forEach((year) => {
    for (let month = 0; month < 12; month++) {
      result.push({
        key: `${year}-${month}`,
        label: MONTH_NAMES[month],
        title: `${MONTH_NAMES[month]} ${year}`,
        year,
        month,
      });
    }
  });
  return result;
});

// Chorak sarlavhalari: har 3 oy bitta guruh. Umumiyda yil ham qo'shiladi.
const quarterGroups = computed(() => {
  const groups = [];
  const targetYears =
    activeTab.value === "Umumiy" ? years.value : [Number(activeTab.value)];

  targetYears.forEach((year) => {
    for (let q = 0; q < 4; q++) {
      groups.push({
        key: `${year}-q${q}`,
        label:
          activeTab.value === "Umumiy"
            ? `${year} · ${QUARTER_LABELS[q]}`
            : QUARTER_LABELS[q],
        span: 3,
      });
    }
  });
  return groups;
});

const planTitle = computed(() =>
  activeTab.value === "Umumiy"
    ? "Umumiy o'zlashtirish rejasi"
    : `${activeTab.value} yilda o'zlashtirish rejasi`
);

/* ---------- Tanlangan yil bo'yicha filtrlangan bosqich/mexanizmlar ---------- */
const displayedStages = computed(() => {
  if (!activeTab.value || activeTab.value === "Umumiy") return validStages.value;
  const year = Number(activeTab.value);
  return validStages.value.filter((stage) => {
    const y1 = toDate(stage.startDate).getFullYear();
    const y2 = toDate(stage.endDate).getFullYear();
    return year >= y1 && year <= y2;
  });
});

const displayedMechanisms = computed(() => {
  if (!activeTab.value || activeTab.value === "Umumiy") return validMechanisms.value;
  const year = Number(activeTab.value);
  return validMechanisms.value.filter((m) => {
    const y1 = toDate(m.beforeDate).getFullYear();
    const y2 = toDate(m.afterDate).getFullYear();
    return year >= y1 && year <= y2;
  });
});

// Bosqich qatori, ostida shu bosqichga tegishli mexanizm qatorlari (1, 1.1, 1.2, 2, ...)
const tableRows = computed(() => {
  const rows = [];
  displayedStages.value.forEach((stage, sIndex) => {
    rows.push({
      ...stage,
      type: "stage",
      rowKey: `stage-${stage.id}`,
      number: `${sIndex + 1}`,
    });

    const stageMechanisms = displayedMechanisms.value.filter(
      (m) => String(m.stageId) === String(stage.id)
    );

    stageMechanisms.forEach((mechanism, mIndex) => {
      rows.push({
        ...mechanism,
        type: "mechanism",
        rowKey: `mechanism-${mechanism.id}`,
        number: `${sIndex + 1}.${mIndex + 1}`,
      });
    });
  });
  return rows;
});

/* ---------- Katak faolligi ---------- */
// Qator (bosqich yoki mexanizm) shu oy bilan kesishsa true
function isRowActive(row, col) {
  const monthStart = new Date(col.year, col.month, 1).getTime();
  const monthEnd = new Date(col.year, col.month + 1, 0, 23, 59, 59).getTime();
  const start = toDate(row.type === "stage" ? row.startDate : row.beforeDate).getTime();
  const end = toDate(row.type === "stage" ? row.endDate : row.afterDate).getTime();
  return start <= monthEnd && end >= monthStart;
}

function isAnyStageActive(col) {
  return (
    validStages.value.some((stage) => isRowActive({ ...stage, type: "stage" }, col)) ||
    validMechanisms.value.some((m) => isRowActive({ ...m, type: "mechanism" }, col))
  );
}

/* ---------- Yordamchi ---------- */
function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatPrice(n) {
  return Number(n).toLocaleString("ru-RU", { maximumFractionDigits: 2 });
}

/* ---------- CSV yuklab olish ---------- */
function downloadCsv() {
  const header = [
    "Tadbir/ish nomi",
    "Narx (mln so'm)",
    "Davomiyligi (kun)",
    "Boshlanishi",
    "Yakunlanishi",
    ...columns.value.map((c) => c.title),
  ];

  const summaryRow = [
    props.summaryLabel,
    formatPrice(totalPrice.value),
    totalDurationDays.value,
    formatDate(rangeStart.value),
    formatDate(rangeEnd.value),
    ...columns.value.map((c) => (isAnyStageActive(c) ? "✓" : "")),
  ];

  const rows = tableRows.value.map((row) => [
    `${row.number}. ${row.name}`,
    row.type === "stage" && row.price !== null && row.price !== undefined ? formatPrice(row.price) : "",
    rowDuration(row),
    row.type === "stage" ? row.startDate : row.beforeDate,
    row.type === "stage" ? row.endDate : row.afterDate,
    ...columns.value.map((c) => (isRowActive(row, c) ? "✓" : "")),
  ]);

  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [header, summaryRow, ...rows]
    .map((row) => row.map(escape).join(","))
    .join("\n");

  // Excel kirillcha/lotincha belgilarni to'g'ri ochishi uchun BOM qo'shamiz
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ozlashtirish-rejasi-${activeTab.value}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
</script>