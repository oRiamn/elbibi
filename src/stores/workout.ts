import { defineStore } from 'pinia'

import { usegoogleStore } from '@/stores/google'

function googlesheetsDateToJSDate(serial: number): Date {
  const utc_days = Math.floor(serial - 25569)
  const utc_value = utc_days * 86400
  const date_info = new Date(utc_value * 1000)

  const fractional_day = serial - Math.floor(serial) + 0.0000001

  let total_seconds = Math.floor(86400 * fractional_day)

  const seconds = total_seconds % 60

  total_seconds -= seconds

  const hours = Math.floor(total_seconds / (60 * 60))
  const minutes = Math.floor(total_seconds / 60) % 60

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  )
}

function dateToGooglesheetsDate(inDate: Date): number {
  const returnDateTime = 25569.0 + ((inDate.getTime() - (inDate.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24));
  return returnDateTime
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
    },
    async addWorkout(exerciseName: string, date: Date) {
      try {
        const gstore = usegoogleStore()
        const response =
          await window.gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: gstore.spreadsheetId,
            range: `${sd.i}!${sd.col.exercise.s}`,
            insertDataOption: 'INSERT_ROWS',
            valueInputOption: 'RAW',
            responseValueRenderOption: 'UNFORMATTED_VALUE',
            responseDateTimeRenderOption: 'SERIAL_NUMBER',
            includeValuesInResponse: true,
            resource: {
              values: [[
                dateToGooglesheetsDate(date),
                exerciseName
              ]]
            }
          })

        if (response.result.updates && response.result.updates.updatedRange) {
          const [, cell] = response.result.updates.updatedRange.split(':B')
          const cellnumber = parseInt(cell)
          console.log('workouts updated successfully')
          this.$patch((state) => {
            state.workouts.push({
              id: cellnumber,
              date: googlesheetsDateToJSDate(dateToGooglesheetsDate(date)),
              exercise: exerciseName
            })
          })
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
})
