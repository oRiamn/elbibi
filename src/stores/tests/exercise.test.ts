import { createPinia, setActivePinia } from 'pinia'
import { vi } from 'vitest'

import { useexerciseStore } from '../exercise'
import { usegoogleStore } from '../google'
import { doGapiMock, gapimock } from './mocks/lib/gapi'

describe('Exercise Store', () => {
  const spreadsheetId = 'aspreadsheetid'
  let gapi: gapimock
  beforeEach(() => {
    setActivePinia(createPinia())
    gapi = doGapiMock(window)
    const gstore = usegoogleStore()
    gstore.spreadsheetId = spreadsheetId
  })

  it('should define synced to false by default', () => {
    const estore = useexerciseStore()
    expect(estore.synced).toBe(false)
  })

  it('should define exercises to empty array by default', () => {
    const estore = useexerciseStore()
    expect(estore.exercises).toStrictEqual([])
  })

  describe('getExercises', () => {
    beforeEach(() => {
      console.log = vi.fn()
      console.error = vi.fn()
    })

    it('should call gapi.client.sheets.spreadsheets.values.get for obtain exercise list', async () => {
      gapi.client.sheets.spreadsheets.values.get.mockResolvedValue({
        result: {
          values: []
        }
      })
      const estore = useexerciseStore()
      await estore.getExercises()
      expect(gapi.client.sheets.spreadsheets.values.get).toBeCalledTimes(1)
      expect(gapi.client.sheets.spreadsheets.values.get).toBeCalledWith({
        spreadsheetId,
        range: 'exercise!A2:A'
      })
    })

    it('should patch synced after gapi.client.sheets.spreadsheets.values.get response', async () => {
      gapi.client.sheets.spreadsheets.values.get.mockResolvedValue({
        result: {
          values: []
        }
      })
      const estore = useexerciseStore()
      await estore.getExercises()
      expect(estore.synced).toBe(true)
    })

    it('should patch exercises using gapi.client.sheets.spreadsheets.values.get response', async () => {
      gapi.client.sheets.spreadsheets.values.get.mockResolvedValue({
        result: {
          values: [['curls'], ['squat'], ['deadlift']]
        }
      })
      const estore = useexerciseStore()
      await estore.getExercises()

      expect(estore.exercises).toStrictEqual([
        { id: 1, name: 'curls' },
        { id: 2, name: 'squat' },
        { id: 3, name: 'deadlift' }
      ])
    })

    it('should log synced success', async () => {
      gapi.client.sheets.spreadsheets.values.get.mockResolvedValue({
        result: {
          values: []
        }
      })

      const estore = useexerciseStore()
      await estore.getExercises()
      expect(console.log).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledWith('exercises synced successfully')
    })

    describe('when gapi.client.sheets.spreadsheets.values.get fail', () => {
      const erromsg = 'an error message'
      beforeEach(() => {
        gapi.client.sheets.spreadsheets.values.get.mockRejectedValue(erromsg)
      })

      it('should log error', async () => {
        const estore = useexerciseStore()
        await estore.getExercises()
        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(erromsg)
      })

      it('should keep synced to false', async () => {
        const estore = useexerciseStore()
        await estore.getExercises()
        expect(estore.synced).toBe(false)
      })

      it('should keep exercises to initial value', async () => {
        const estore = useexerciseStore()
        await estore.getExercises()

        expect(estore.exercises).toStrictEqual([])
      })
    })
  })

  describe('addExercise', () => {
    const newExercise = {
      id: 4,
      name: 'anewexercise'
    }
    const oldExercises = [
      { id: 1, name: 'curls' },
      { id: 2, name: 'squat' },
      { id: 3, name: 'deadlift' }
    ]
    beforeEach(() => {
      console.log = vi.fn()
      console.error = vi.fn()

      const estore = useexerciseStore()
      estore.exercises = [...oldExercises]
      estore.synced = true
    })

    it('should call gapi.client.sheets.spreadsheets.values.append to add exercise', async () => {
      gapi.client.sheets.spreadsheets.values.append.mockResolvedValue({
        result: {
          updates: {
            updatedRange: `exercise!A${newExercise.id}`
          }
        }
      })
      const estore = useexerciseStore()
      await estore.addExercise(newExercise.name)
      expect(gapi.client.sheets.spreadsheets.values.append).toBeCalledTimes(1)
      expect(gapi.client.sheets.spreadsheets.values.append).toBeCalledWith({
        spreadsheetId,
        range: 'exercise!A2',
        insertDataOption: 'INSERT_ROWS',
        valueInputOption: 'RAW',
        responseValueRenderOption: 'UNFORMATTED_VALUE',
        responseDateTimeRenderOption: 'SERIAL_NUMBER',
        includeValuesInResponse: true,
        resource: {
          values: [[newExercise.name]]
        }
      })
    })

    it('should append new exercise in store', async () => {
      gapi.client.sheets.spreadsheets.values.append.mockResolvedValue({
        result: {
          updates: {
            updatedRange: `exercise!A${newExercise.id}`
          }
        }
      })
      const estore = useexerciseStore()
      await estore.addExercise(newExercise.name)
      expect(estore.exercises).toStrictEqual([...oldExercises, newExercise])
    })

    it('should log update success', async () => {
      gapi.client.sheets.spreadsheets.values.append.mockResolvedValue({
        result: {
          updates: {
            updatedRange: `exercise!A${newExercise.id}`
          }
        }
      })
      const estore = useexerciseStore()
      await estore.addExercise(newExercise.name)
      expect(console.log).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledWith('exercises updated successfully')
    })

    describe('when  gapi.client.sheets.spreadsheets.values.append  fail', () => {
      const erromsg = 'an error message'
      beforeEach(() => {
        gapi.client.sheets.spreadsheets.values.append.mockRejectedValue(erromsg)
      })

      it('should log error', async () => {
        const estore = useexerciseStore()
        await estore.addExercise(newExercise.name)
        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(erromsg)
      })

      it('should keep synced to initial value', async () => {
        const estore = useexerciseStore()
        await estore.addExercise(newExercise.name)
        expect(estore.synced).toBe(true)
      })

      it('should keep exercises to initial value', async () => {
        const estore = useexerciseStore()
        await estore.addExercise(newExercise.name)

        expect(estore.exercises).toStrictEqual(oldExercises)
      })
    })
  })
})
