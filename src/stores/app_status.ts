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
          console.log('app is on offline mode')
          this.$patch((state) => {
            state.isOnline = false;
          })
        });
        window.addEventListener('online', () => {
          console.log('app is on online mode')
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
