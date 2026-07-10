const MS_PER_DAY = 86400000

export interface MechanismDeadlineInfo {
  text: string
  class: string
}

export function mechanismDeadlineInfo(row: { status?: string; afterDate?: string }): MechanismDeadlineInfo {
  if (row.status === 'AD') {
    return { text: 'Yakunlangan', class: 'font-medium text-teal-600' }
  }

  if (row.status !== 'IP' || !row.afterDate) {
    return { text: row.afterDate || '', class: 'text-blue-700' }
  }

  const today = new Date(new Date().toDateString())
  const daysLeft = Math.ceil((new Date(row.afterDate).getTime() - today.getTime()) / MS_PER_DAY)

  if (daysLeft < 0) {
    return { text: "Muddati o'tgan", class: 'font-medium text-rose-600' }
  }
  if (daysLeft <= 1) {
    return { text: `${row.afterDate} (${daysLeft} kun qoldi)`, class: 'font-medium text-rose-500' }
  }
  if (daysLeft <= 3) {
    return { text: `${row.afterDate} (${daysLeft} kun qoldi)`, class: 'font-medium text-amber-600' }
  }
  return { text: row.afterDate, class: 'text-blue-700' }
}
