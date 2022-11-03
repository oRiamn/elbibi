<script lang="ts">
import { useexerciseStore } from '@/stores/exercise'
import { defineComponent } from 'vue'
import Button from '@/components/button/button.vue'

export default defineComponent({
  name: 'ExerciseList',
  components: {
    Button
  },
  props: {},
  emits: [],
  methods: {
    addExercise() {
      if (this.newExercise) {
        this.exerciseStore.addExercise(this.newExercise)
        this.newExercise = ''
      }
    }
  },
  setup() {
    const exerciseStore = useexerciseStore()
    exerciseStore.getExercises()
    return {
      exerciseStore,
      newExercise: ''
    }
  }
})
</script>

<template>
  <div v-if="exerciseStore.synced" class="exerciselist">
    <div id="addexdiv" class="add">
      <input
        type="text"
        v-model="newExercise"
        @keyup.enter="addExercise"
        placeholder="New exercise"
      />
      <Button :text="'Add'" v-on:click="addExercise"></Button>
    </div>
    <ul id="exlist" class="exercises">
      <li v-for="item in exerciseStore.exercises" :key="item.id">
        {{ item.name }}
        <span>></span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.exerciselist {
  display: flex;
  flex-direction: column;
  height: 100%;
  .exercises,
  .add {
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
    input {
      display: flex;
      flex: 1;
    }
  }
}
</style>
