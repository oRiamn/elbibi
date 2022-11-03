<script lang="ts">
import { useexerciseStore } from '@/stores/exercise'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'


export default defineComponent({
  name: 'Exercise',
  components: {},
  props: {},
  emits: [],
  setup() {
    const route = useRoute()
    const exerciseStore = useexerciseStore()
    const exercise_ref = ref()
    onMounted(() => {
      const id = parseInt(route.params.exerciseId as unknown as string)
      const exercise = exerciseStore.exercises.find((e) => e.id === id)
      exercise_ref.value = exercise
    })
    return {
      exercise: exercise_ref
    }
  }
})
</script>

<template>
  <div class="exercise" v-if="exercise">
    <div id="exname">Exercise {{ exercise.name }} </div>
  </div>
</template>
