import { expect } from '@storybook/jest'
import { within } from '@storybook/testing-library'
import { Story } from '@storybook/vue3'

import Launch from './launch.vue'

export default {
  title: 'components/Launch',
  component: Launch
}

const Template: Story = (args) => ({
  components: { Launch },
  setup() {
    return { args }
  },  
  template: '<launch v-bind="args" />'
})

export const DefaultState = Template.bind({})
DefaultState.args = {}
DefaultState.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getAllByText('Launch')[0]).toBeTruthy()
}

