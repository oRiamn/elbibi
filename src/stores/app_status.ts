import { defineStore } from 'pinia'

export const useappStatusStore = defineStore({
  id: 'appStatus',
  state: () => ({
    isOnline: navigator.onLine,
    isSynced: false,
  }),
  getters: {
  },
  actions: {
    sync() {
      if (!this.isSynced) {
        window.addEventListener('offline', () => {
          this.$patch((state) => {
            state.isOnline = false;
          })
        });
        window.addEventListener('online', () => {
          this.$patch((state) => {
            state.isOnline = true;
          })
        });
      }
      this.$patch((state) => {
        state.isOnline = navigator.onLine;
        state.isSynced = true;
      })
    }
  }
})
