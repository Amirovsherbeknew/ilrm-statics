<template>
  <div
    class="w-full min-w-[174px] max-w-[174px] py-1 flex justify-center gap-1 rounded-lg items-center font-semibold text-sm"
    :class="statusTypes[classType || type]?.class || ''"
  >
    {{ label || statusTypes[type]?.label }}
    <component
      :is="`icon-${icon || statusTypes[type]?.icon}`"
      v-if="iconShow && (icon || statusTypes[type]?.icon)"
    />
  </div>
</template>

<script setup lang="ts">
import type { ITableStatusTypes } from '../../../types/v-table.type'
interface IProp {
  type?:
    | 'registered'
    | 'pending'
    | 'review'
    | 'unpaid'
    | 'paid'
    | 'deadline'
    | 'new'
    | 'in_process'
    | 'rejected'
    | 'rejected'
    | 'approved'
    | 'empty'
    | 'View'
    | 'Search'
    | 'Download'
    | string
  icon?: string
  label?: string
  classType?: string
  iconShow?: boolean
}
withDefaults(defineProps<IProp>(), {
  type: 'empty',
  iconShow: true,
  icon: '',
  label: '',
  classType: '',
})

const statusTypes: ITableStatusTypes = {
  registered: {
    icon: 'check-circle',
    label: 'Ro’yxatga olingan',
    class: 'bg-teal-50 text-teal-600',
  },
  pending: {
    icon: 'reload',
    label: 'To’lov kutilmoqda',
    class: 'bg-blue-50 text-blue-600 min-w-[200px] max-w-[200px]',
  },
  review: {
    icon: 'reload',
    label: 'Ko’rib chiqilmoqda',
    class: 'bg-orange-50 text-amber-600',
  },
  unpaid: {
    icon: 'card-remote',
    label: 'To’lanmagan',
    class: 'bg-rose-50 text-rose-500',
  },
  paid: {
    icon: 'check-circle',
    label: 'To’langan',
    class: 'bg-teal-50 text-teal-600',
  },
  deadline: {
    icon: 'calendar-minus',
    label: 'Muddati o’zgargan',
    class: 'bg-stone-100 text-stone-600',
  },
  new: {
    icon: 'notification-rectangle',
    label: 'Yangi',
    class: 'bg-blue-50 text-blue-600',
  },
  in_process: {
    icon: 'reload',
    label: 'Jarayonda',
    class: 'bg-orange-50 text-amber-600',
  },
  rejected: {
    icon: 'remove-circle',
    label: 'Rad etilgan',
    class: 'bg-rose-50 text-rose-500',
  },
  approved: {
    icon: 'check-circle',
    label: 'Tasdiqlangan',
    class: 'bg-teal-50 text-teal-600',
  },
  empty: {
    icon: '',
    label: "Bo'sh",
    class: 'bg-stone-100 text-stone-600',
  },
  DR: {
    icon: 'reload',
    label: 'Oxirigacha yetmagan',
    class: 'bg-stone-100 text-stone-600',
  },
  BM: {
    icon: '',
    label: 'Boshlanmagan',
    class: 'bg-slate-100 text-slate-500',
  },
  BL: {
    icon: 'card-remote',
    label: 'Bloklangan',
    class: 'bg-red-50 text-red-600',
  },
  IP: {
    icon: 'reload',
    label: 'Bajarilmoqda',
    class: 'bg-orange-50 text-amber-600',
  },
  IR: {
    icon: 'reload',
    label: "Ko'rib chiqilmoqda",
    class: 'bg-blue-50 text-blue-600',
  },
  RD: {
    icon: 'remove-circle',
    label: 'Rad etilgan',
    class: 'bg-rose-50 text-rose-500',
  },
  AD: {
    icon: 'check-circle',
    label: 'Yakunlangan',
    class: 'bg-teal-50 text-teal-600',
  },
  View: {
    icon: 'card',
    label: 'Ko’rib chiqdi',
    class: 'bg-blue-50 text-blue-600',
  },
  Search: {
    icon: 'card',
    label: 'Qidirish',
    class: 'bg-blue-50 text-blue-600',
  },
  Download: {
    icon: 'card',
    label: 'Yuklash',
    class: 'bg-blue-50 text-blue-600',
  },
}
</script>
