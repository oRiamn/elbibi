<script lang="ts">
import { defineComponent } from 'vue'

import Button from '@/components/button/button.vue'
import { useworkoutStore } from '@/stores/workout'
import { ExerciseDefinition, useexerciseStore } from '@/stores/exercise'

export default defineComponent({
  name: 'WorkoutList',
  components: {
    Button
  },
  props: {},
  emits: [],
  setup() {
    const wstore = useworkoutStore()
    wstore.getWorkouts()

    const estore = useexerciseStore()
    estore.getExercises()
    return {
      wstore,
      newWorkout: null as ExerciseDefinition | null,
      estore
    }
  },
  methods: {
    addWorkout() {
        if (this.newWorkout) {
          const today = new Date()
          this.wstore.addWorkout(this.newWorkout.name, today)
          this.newWorkout = null
        }
    }
  }
})
</script>

<template>
  <div v-if="wstore.synced" class="workoutlist">
     <div id="addworkout" class="add">
      <select v-model="newWorkout">
        <option disabled value="null">New workout</option>
        <option 
          v-for="item in estore.exercises"
          :key="item.id"
          v-bind:value="item">
          {{ item.name }}
        </option>
      </select>
      <Button :text="'Add'" v-on:click="addWorkout"></Button>
    </div>
    <ul id="worklist" class="workouts">
      <li
        v-for="item in wstore.workouts"
        :key="item.id"
      >
        {{ item.exercise }}
        <span>{{ item.date.toLocaleDateString("fr") }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.workoutlist {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  > * {
    display: flex;
  }

  ul {
    display: flex;
    flex: 1;
    flex-direction: column;
    font-family: arial;
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: scroll;

    li {
      background: #285b97;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 5px 10px 5px 5px;
      margin: 5px;
    }
    span {
      display: flex;
      padding: 3px 6px;
      justify-content: flex-start;
      font-size: 10px;
      align-self: flex-start;
      text-transform: uppercase;
      background: #acd2ff;
      border-radius: 2px;
      letter-spacing: 1px;
    }
  }

  .add {
    flex: 0;
    select {
      display: flex;
      flex: 1;
    }
  }
}
</style>
