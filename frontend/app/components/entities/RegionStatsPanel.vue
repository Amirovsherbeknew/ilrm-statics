<template>
  <!-- Right panel: reflects whatever is currently selected on the map.
       selected === null            -> whole republic (no drill-down yet)
       selected.level === 'region'  -> viloyat/shahar tanlangan
       selected.level === 'district'-> tuman tanlangan -->
  <div class="h-full w-full bg-[#FAF8F3] font-['Inter',sans-serif] text-[#2B2A28]">
    <div class="flex h-full flex-col">
      <!-- Ledger header -->
      <div class="relative border-b border-[#E4DFD2] bg-white px-8 pb-6 pt-8">
        <div class="absolute left-0 top-0 h-full w-1 bg-[#7A2E2E]"></div>
        <p class="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B08A1E]">
          {{ eyebrow }}
        </p>
        <h2 class="font-['Georgia',serif] text-3xl leading-tight text-[#3A1616]">
          {{ title }}
        </h2>

        <!-- Summary row -->
        <div class="mt-6 grid grid-cols-4 gap-3">
          <div>
            <AnimatedStatistic :value="projects.length" :value-style="summaryValueStyle('#3A1616')" />
            <p class="text-[11px] uppercase tracking-wide text-[#8A8578]">Jami loyiha</p>
          </div>
          <div>
            <AnimatedStatistic :value="projects?.filter(resp => resp?.status === 'IP')?.length || 0" :value-style="summaryValueStyle('#2F6B4F')" />
            <p class="text-[11px] uppercase tracking-wide text-[#8A8578]">Bajarilmoqda</p>
          </div>
          <div>
            <AnimatedStatistic :value="projects?.filter(resp => resp?.status === 'RD')?.length || 0" :value-style="summaryValueStyle('#A13B3B')" />
            <p class="text-[11px] uppercase tracking-wide text-[#8A8578]">Bajarilmagan</p>
          </div>
          <div>
            <AnimatedStatistic :value="projects?.filter(resp => resp?.status === 'AD')?.length || 0" :value-style="summaryValueStyle('#A13B3B')" />
            <p class="text-[11px] uppercase tracking-wide text-[#8A8578]">Bajarilgan</p>
          </div>
        </div>

        <!-- Progress ledger bar -->
        <div class="mt-4 flex h-1.5 w-full overflow-hidden rounded-full bg-[#EFEAE0]">
          <div
            class="h-full bg-[#2F6B4F] transition-all duration-500"
            :style="{ width: donePercent + '%' }"
          ></div>
          <div
            class="h-full bg-[#C1544D] transition-all duration-500"
            :style="{ width: (100 - donePercent) + '%' }"
          ></div>
        </div>
      </div>

      <!-- Project entries -->
      <div v-if="projects.length === 0" class="flex flex-1 items-center justify-center px-10 py-16 text-center">
        <div>
          <div class="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-dashed border-[#C9A227]/50"></div>
          <p class="text-sm text-[#8A8578]">Ushbu hudud bo'yicha loyihalar reyestrda topilmadi</p>
        </div>
      </div>
      <ul v-else class="flex-1 divide-y divide-[#ECE7DA] px-8">
        <li
          v-for="p in projects"
          :key="p.num"
          class="group relative py-5 pl-6 cursor-pointer transition-colors hover:bg-[#F3EFE4]/60"
          @click="$router.push(`/projects/${p?.num}`)"
        >
          <!-- timeline dot -->
          <span
            class="absolute left-0 top-6 h-2.5 w-2.5 rounded-full ring-4 ring-[#FAF8F3]"
            :class="p.done ? 'bg-[#2F6B4F]' : 'bg-[#C1544D]'"
          ></span>
          <span class="absolute left-[4.5px] top-8 h-full w-px bg-[#ECE7DA] last:hidden"></span>

          <div class="flex items-start justify-between gap-3">
            <h3 class="text-[15px] font-medium leading-snug text-[#2B2A28]">
              {{ p.name }}
            </h3>
            <span
              class="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              :class="p.done
                ? 'bg-[#E4F1EA] text-[#2F6B4F]'
                : 'bg-[#FBEAE8] text-[#A13B3B]'"
            >
              {{ p.status }}
            </span>
          </div>

          <dl class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[13px] text-[#6E6A5D]">
            <div class="flex gap-1.5">
              <dt class="text-[#B0AA98]">Davlat:</dt>
              <dd>{{ p.country }}</dd>
            </div>
            <div class="flex gap-1.5">
              <dt class="text-[#B0AA98]">Yili:</dt>
              <dd>{{ p.year }}</dd>
            </div>
            <div class="flex gap-1.5">
              <dt class="text-[#B0AA98]">Kafil bank:</dt>
              <dd>{{ p.bank }}</dd>
            </div>
            <div class="flex gap-1.5">
              <dt class="text-[#B0AA98]">Sug'urta:</dt>
              <dd>{{ p.insurance }}</dd>
            </div>
          </dl>

          <!-- Moliyaviy ko'rsatkichlar -->
          <div
            v-if="p.npv !== null && p.npv !== undefined"
            class="mt-3 grid grid-cols-4 gap-2 rounded-lg border border-[#ECE7DA] bg-white/60 px-3 py-2"
          >
            <div class="text-center">
              <p class="text-[10px] uppercase tracking-wide text-[#B0AA98]">NPV</p>
              <AnimatedStatistic
                :value="p.npv"
                :prefix="p.npv >= 0 ? '+' : ''"
                suffix=" mln"
                :value-style="statValueStyle(p.npv >= 0 ? '#2F6B4F' : '#A13B3B')"
              />
            </div>
            <div class="text-center border-l border-[#ECE7DA]">
              <p class="text-[10px] uppercase tracking-wide text-[#B0AA98]">DPP</p>
              <AnimatedStatistic
                :value="p.dpp"
                :precision="1"
                suffix=" y"
                :value-style="statValueStyle('#3A1616')"
              />
            </div>
            <div class="text-center border-l border-[#ECE7DA]">
              <p class="text-[10px] uppercase tracking-wide text-[#B0AA98]">BCR</p>
              <AnimatedStatistic
                :value="p.bcr"
                :precision="2"
                :value-style="statValueStyle(p.bcr >= 1 ? '#2F6B4F' : '#A13B3B')"
              />
            </div>
            <div class="text-center border-l border-[#ECE7DA]">
              <p class="text-[10px] uppercase tracking-wide text-[#B0AA98]">EIRR</p>
              <AnimatedStatistic
                :value="p.eirr"
                :precision="1"
                suffix="%"
                :value-style="statValueStyle('#3A1616')"
              />
            </div>
          </div>
          <p v-else class="mt-3 text-xs italic text-[#B0AA98]">
            Moliyaviy hisob-kitob hali amalga oshirilmagan
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const isActive = defineModel()

/**
 * selected: null | { level: 'region' | 'district', code: Number, name: String }
 *   - null            -> hech narsa tanlanmagan: butun respublika kesimida ko'rsatiladi
 *   - level: 'region'   -> viloyat/shahar (project.regions ichida qidiriladi)
 *   - level: 'district' -> tuman (project.districts ichida qidiriladi)
 */
const props = defineProps({
  selected: { type: Object, default: null },
})

const allProjects = ref([])

async function fetchProjects() {
  const { data } = await useFetchApi.get('/api/projects')
  allProjects.value = data.value?.length > 0 ? data.value?.filter(resp => resp?.status !== 'DR'):[]
}

onMounted(fetchProjects)

const eyebrow = computed(() => {
  if (!props.selected) return "Respublika bo'yicha · reyestr"
  const label = props.selected.level === 'district' ? 'tuman' : 'hudud'
  return `${String(props.selected.code).padStart(2, '0')}-${label} · reyestr`
})

const title = computed(() => props.selected?.name ?? "O'zbekiston Respublikasi")

function summaryValueStyle(color) {
  return { color, fontSize: '24px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }
}

function statValueStyle(color) {
  return { color, fontSize: '14px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }
}

const projects = computed(() => {
  const items = allProjects.value

  if (!props.selected) {
    // hech qanday hudud/tuman tanlanmagan -> respublika bo'yicha jami
    return mapItems(items)
  }

  if (props.selected.level === 'district') {
    return mapItems(
      items.filter((item) => (item.districts ?? []).includes(props.selected.code))
    )
  }

  // default: region
  return mapItems(items.filter((item) => (item.regions ?? []).includes(props.selected.code)))
})

function mapItems(items) {
  return items.map((item) => ({
    num: item.id,
    name: item.name,
    country: item.country,
    bank: item.guarantorBank,
    insurance: item.insuranceCompany,
    year: item.year,
    status: item.status === 'IP' ? 'Bajarilmoqda' : 'Qoralama',
    done: item.status === 'IP',
    npv: item.npv,
    dpp: item.dpp,
    bcr: item.bcr,
    eirr: item.eirr,
  }))
}

const doneCount = computed(() => projects.value.filter((p) => p.done).length)
const pendingCount = computed(() => projects.value.length - doneCount.value)
const donePercent = computed(() =>
  projects.value.length ? Math.round((doneCount.value / projects.value.length) * 100) : 0
)
</script>
