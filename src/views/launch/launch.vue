<script lang="ts">
import { defineComponent } from 'vue'
import Button from '@/components/button/button.vue'
import { usegoogleStore } from '@/stores/google'

export default defineComponent({
  name: 'Launch',
  components: {
    Button
  },
  props: {},
  emits: [],
  setup() {
    const gstore = usegoogleStore()
    gstore.loadGoogleApi()
    return {
      gstore
    }
  },
  methods: {
    launchApp: async function () {
      await this.gstore.authenticate()
      await this.gstore.loadSpreadsheet()
      this.$router.push({ name: 'home' })
    }
  }
})
</script>

<template>
  <div class="launch">
    <Button
      id="authentbtn"
      v-if="gstore.isReady"
      :text="'Launch app'"
      v-on:click="launchApp"
    />
  </div>
</template>

<style lang="scss">
.launch {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  align-content: space-around;
}
</style>
