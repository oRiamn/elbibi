import { defineStore } from 'pinia'
import { usegoogleStore } from '@/stores/google'

function googlesheetsDateToJSDate(serial: number): Date {
  var utc_days = Math.floor(serial - 25569)
  var utc_value = utc_days * 86400
  var date_info = new Date(utc_value * 1000)

  var fractional_day = serial - Math.floor(serial) + 0.0000001

  var total_seconds = Math.floor(86400 * fractional_day)

  var seconds = total_seconds % 60

  total_seconds -= seconds

  var hours = Math.floor(total_seconds / (60 * 60))
  var minutes = Math.floor(total_seconds / 60) % 60

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  )
}

const sd = {
  i: 'workout',
  col: {
    date: {
      i: 'A',
      s: 'A2',
      e: 'A'
    },
    exercise: {
      i: 'B',
      s: 'B2',
      e: 'B'
    }
  }
}

export type WorkoutDefinition = { id: number; date: Date; exercise: string }
export const useworkoutStore = defineStore({
  id: 'workout',
  state: () => ({
    workouts: [] as WorkoutDefinition[],
    synced: false
  }),
  getters: {},
  actions: {
    async getWorkouts() {
      try {
        const gstore = usegoogleStore()
        const response =
          await window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: gstore.spreadsheetId,
            range: `${sd.i}!${sd.col.date.s}:${sd.col.date.i}${sd.col.exercise.i}`,
            dateTimeRenderOption: 'SERIAL_NUMBER',
            valueRenderOption: 'UNFORMATTED_VALUE'
          })

        let workouts = this.workouts
        if (response.result.values && response.result.values.length > 0) {
          workouts = response.result.values?.map((v, id) => ({
            id: id + 1,
            date: googlesheetsDateToJSDate(v[0]),
            exercise: v[1]
          }))
        }

        console.log('workouts synced successfully')
        this.$patch((state) => {
          state.synced = true
          state.workouts = workouts
        })
      } catch (error) {
        console.error(error)
      }
    }
  }
})
