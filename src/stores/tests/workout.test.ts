import { createPinia, setActivePinia } from 'pinia'
import { vi } from 'vitest'

import { usegoogleStore } from '../google'
import { useworkoutStore } from '../workout'
import { doGapiMock, gapimock } from './mocks/lib/gapi'

describe('Workout Store', () => {
  const spreadsheetId = 'aspreadsheetid'
  let gapi: gapimock
  beforeEach(() => {
    setActivePinia(createPinia())
    gapi = doGapiMock(window)
    const gstore = usegoogleStore()
    gstore.spreadsheetId = spreadsheetId

    console.log = vi.fn()
    console.error = vi.fn()
  })

  it('should define synced to false by default', () => {
    const wstore = useworkoutStore()
    expect(wstore.synced).toBe(false)
  })

  it('should define workouts to empty array by default', () => {
    const wstore = useworkoutStore()
    expect(wstore.workouts).toStrictEqual([])
  })

  describe('getWorkouts', () => {

    it('should call gapi.client.sheets.spreadsheets.values.get for obtain workout list', async () => {
      gapi.client.sheets.spreadsheets.values.get.mockResolvedValue({
        result: {
          values: []
        }
      })
      const wstore = useworkoutStore()
      await wstore.getWorkouts()
      expect(gapi.client.sheets.spreadsheets.values.get).toBeCalledTimes(1)
      expect(gapi.client.sheets.spreadsheets.values.get).toBeCalledWith({
        spreadsheetId,
        range: 'workout!A2:AB',
        dateTimeRenderOption: 'SERIAL_NUMBER',
        valueRenderOption: 'UNFORMATTED_VALUE'
      })
    })

    it('should patch synced after gapi.client.sheets.spreadsheets.values.get response', async () => {
      gapi.client.sheets.spreadsheets.values.get.mockResolvedValue({
        result: {
          values: []
        }
      })
      const wstore = useworkoutStore()
      await wstore.getWorkouts()
      expect(wstore.synced).toBe(true)
    })

    it('should patch workouts using gapi.client.sheets.spreadsheets.values.get response', async () => {
      gapi.client.sheets.spreadsheets.values.get.mockResolvedValue({
        result: {
          values: [
            [44865.64733796296, 'squat'],
            [44866.65453703704, 'pompe'],
            [44866.667708333334, 'dips'],
            [44868.556296296294, 'squat']
          ]
        }
      })
      const wstore = useworkoutStore()
      await wstore.getWorkouts()


      expect(wstore.workouts).toStrictEqual([
        {
          id: 1,
          date: new Date('2022-10-31T15:32:10.000Z'),
          exercise: 'squat'
        },
        {
          id: 2,
          date: new Date('2022-11-01T15:42:32.000Z'),
          exercise: 'pompe'
        },
        { id: 3, date: new Date('2022-11-01T16:01:30.000Z'), exercise: 'dips' },
        { id: 4, date: new Date('2022-11-03T13:21:04.000Z'), exercise: 'squat' }
      ])
    })

    it('should log synced success', async () => {
      gapi.client.sheets.spreadsheets.values.get.mockResolvedValue({
        result: {
          values: []
        }
      })

      const wstore = useworkoutStore()
      await wstore.getWorkouts()
      expect(console.log).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledWith('workouts synced successfully')
    })

    describe('when gapi.client.sheets.spreadsheets.values.get fail', () => {
      const erromsg = 'an error message'
      beforeEach(() => {
        gapi.client.sheets.spreadsheets.values.get.mockRejectedValue(erromsg)
      })

      it('should log error', async () => {
        const wstore = useworkoutStore()
        await wstore.getWorkouts()
        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(erromsg)
      })

      it('should keep synced to false', async () => {
        const wstore = useworkoutStore()
        await wstore.getWorkouts()
        expect(wstore.synced).toBe(false)
      })

      it('should keep workouts to initial value', async () => {
        const wstore = useworkoutStore()
        await wstore.getWorkouts()

        expect(wstore.workouts).toStrictEqual([])
      })
    })
  })

  describe('addWorkout', () => {
    const newWorkout = {
      id: 5,
      date: new Date('2022-11-22T17:35:20.000Z'),
      exercise: 'curls'
    }
    const oldWorkouts = [
      {
        id: 1,
        date: new Date('2022-10-31T15:32:10.000Z'),
        exercise: 'squat'
      },
      {
        id: 2,
        date: new Date('2022-11-01T15:42:32.000Z'),
        exercise: 'pompe'
      },
      { id: 3, date: new Date('2022-11-01T16:01:30.000Z'), exercise: 'dips' },
      { id: 4, date: new Date('2022-11-03T13:21:04.000Z'), exercise: 'squat' }
    ]
    beforeEach(() => {
      console.log = vi.fn()
      console.error = vi.fn()

      const wstore = useworkoutStore()
      wstore.workouts = [...oldWorkouts]
      wstore.synced = true
    })

    it('should call gapi.client.sheets.spreadsheets.values.append to add workout', async () => {
      gapi.client.sheets.spreadsheets.values.append.mockResolvedValue({
        result: {
          updates: {
            updatedRange: `workout!A${newWorkout.id}:B${newWorkout.id}`
          }
        }
      })
      const wstore = useworkoutStore()
      await wstore.addWorkout(newWorkout.exercise, newWorkout.date)
      expect(gapi.client.sheets.spreadsheets.values.append).toBeCalledTimes(1)
      expect(gapi.client.sheets.spreadsheets.values.append).toBeCalledWith({
        spreadsheetId,
        range: 'workout!B2',
        insertDataOption: 'INSERT_ROWS',
        valueInputOption: 'RAW',
        responseValueRenderOption: 'UNFORMATTED_VALUE',
        responseDateTimeRenderOption: 'SERIAL_NUMBER',
        includeValuesInResponse: true,
        resource: {
          values: [[
            44887.73287037037,
            newWorkout.exercise
          ]]
        }
      })
    })

    it('should append new workout in store', async () => {
      gapi.client.sheets.spreadsheets.values.append.mockResolvedValue({
        result: {
          updates: {
            updatedRange: `workout!A${newWorkout.id}:B${newWorkout.id}`
          }
        }
      })
      const wstore = useworkoutStore()
      await wstore.addWorkout(newWorkout.exercise, newWorkout.date)
      expect(wstore.workouts).toStrictEqual([...oldWorkouts, newWorkout])
    })

    it('should log update success', async () => {
      gapi.client.sheets.spreadsheets.values.append.mockResolvedValue({
        result: {
          updates: {
            updatedRange: `workout!A${newWorkout.id}:B${newWorkout.id}`
          }
        }
      })
      const wstore = useworkoutStore()
      await wstore.addWorkout(newWorkout.exercise, newWorkout.date)
      expect(console.log).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledWith('workouts updated successfully')
    })

    describe('when  gapi.client.sheets.spreadsheets.values.append  fail', () => {
      const erromsg = 'an error message'
      beforeEach(() => {
        gapi.client.sheets.spreadsheets.values.append.mockRejectedValue(erromsg)
      })

      it('should log error', async () => {
        const wstore = useworkoutStore()
        await wstore.addWorkout(newWorkout.exercise, newWorkout.date)
        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(erromsg)
      })

      it('should keep synced to initial value', async () => {
        const wstore = useworkoutStore()
        await wstore.addWorkout(newWorkout.exercise, newWorkout.date)
        expect(wstore.synced).toBe(true)
      })

      it('should keep workouts to initial value', async () => {
        const wstore = useworkoutStore()
        await wstore.addWorkout(newWorkout.exercise, newWorkout.date)
        expect(wstore.workouts).toStrictEqual(oldWorkouts)
      })
    })
  });
})
