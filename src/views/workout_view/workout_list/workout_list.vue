<script lang="ts">
import { useworkoutStore } from '@/stores/workout'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WorkoutList',
  components: {},
  props: {},
  emits: [],
  setup() {
    const wstore = useworkoutStore()
    wstore.getWorkouts()
    return {
      wstore
    }
  }
})
</script>

<template>
  <div class="workoutlist">
    <ul id="exlist" class="workouts">
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
}
</style>
