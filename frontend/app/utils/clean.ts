import type { LocationQueryValueRaw } from 'vue-router'

export function normalizeQueryParams(query: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = {}

  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      const value = query[key]

      if (!isNaN(Number(value))) {
        normalized[key] = Number(value)
      } else if (['true', 'false'].includes(value as any)) {
        normalized[key] = value === 'true'
      } else {
        normalized[key] = value
      }
    }
  }

  return normalized
}

export function getDiffKeys(obj1: Record<string, unknown>, obj2: Record<string, unknown>) {
  return Object.keys({ ...obj1, ...obj2 }).filter((key) => obj1[key] !== obj2[key])
}

export const removeKeys = (
  obj: Record<string, LocationQueryValueRaw | LocationQueryValueRaw[]>,
  keysToRemove: object
) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !Object.keys(keysToRemove).includes(key))
  )
}

export function clean(
  obj: Record<string, unknown>
): Record<string, LocationQueryValueRaw | LocationQueryValueRaw[]> {
  const cleanedObj: Record<string, LocationQueryValueRaw | LocationQueryValueRaw[]> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '')
      cleanedObj[key] = value as LocationQueryValueRaw | LocationQueryValueRaw[]
  }
  return cleanedObj
}
export function formatPrice(price: number, locale = 'fr-FR') {
  return new Intl.NumberFormat(locale).format(price)
}
export function formatNumber(num: number) {
  return num.toLocaleString('en-US').replace(/,/g, ' ')
}
export const convertToFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData()
  for (const key in data) {
    if (
      data[key] !== null &&
      data[key] !== undefined &&
      data[key] !== '' &&
      (!Array.isArray(data[key]) || data[key].length > 0)
    ) {
      if (Array.isArray(data[key]) && data[key].length > 0 && data[key][0] instanceof File) {
        console.log('1')
        data[key].forEach((file: File) => {
          formData.append('files', file)
        })
      } else if (data[key] instanceof Blob || data[key] instanceof File) {
        console.log('2')
        formData.append(key, data[key] as Blob)
      } else {
        console.log('3')
        formData.append(key, String(data[key]))
      }
    }
  }
  return formData
}

export const dateReverseFormat = (date: string | undefined | null): string => {
  return date ? date.split('-').reverse().join('-') : '----'
}

export function round2(num: number): number {
  return Math.round(num * 100) / 100
}
