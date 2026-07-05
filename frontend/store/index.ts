export const useMainStore = defineStore('main', {
  state: () => ({
    loading:false,
  }),
  actions: {
    handleLoading(value: boolean) {
      this.loading = value
    }
  },
})
