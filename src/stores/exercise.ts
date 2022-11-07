import { defineStore } from 'pinia'

import { usegoogleStore } from '@/stores/google'

const sd = {
  i: 'exercise',
  col: {
    name: {
      i: 'A',
      s: 'A2',
      e: 'A'
    }
  }
}

export type ExerciseDefinition = { id: number; name: string }
export const useexerciseStore = defineStore({
  id: 'exercise',
  state: () => ({
    exercises: [] as ExerciseDefinition[],
    synced: false
  }),
  getters: {},
  actions: {
    async getExercises() {
      try {
        const gstore = usegoogleStore()
        const response =
          await window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: gstore.spreadsheetId,
            range: `${sd.i}!${sd.col.name.s}:${sd.col.name.e}`
          })
        let exercises = this.exercises
        if (response.result.values && response.result.values.length > 0) {
          exercises = response.result.values
            .map((v, id) => ({
              id: id + 1,
              name: v[0] as string
            }))
            .filter((e) => e.name !== undefined)
        }

        console.log('exercises synced successfully')
        this.$patch((state) => {
          state.exercises = exercises
          state.synced = true
        })
      } catch (error) {
        console.error(error)
      }
    },
    async addExercise(name: string) {
      try {
        const gstore = usegoogleStore()
        const response =
          await window.gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: gstore.spreadsheetId,
            range: `${sd.i}!${sd.col.name.s}`,
            insertDataOption: 'INSERT_ROWS',
            valueInputOption: 'RAW',
            responseValueRenderOption: 'UNFORMATTED_VALUE',
            responseDateTimeRenderOption: 'SERIAL_NUMBER',
            includeValuesInResponse: true,
            resource: {
              values: [[name]]
            }
          })

        if (response.result.updates && response.result.updates.updatedRange) {
          const [, cell] = response.result.updates.updatedRange.split('!A')
          const cellnumber = parseInt(cell)
          console.log('exercises updated successfully')
          this.$patch((state) => {
            state.exercises.push({ id: cellnumber, name })
          })
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
})
