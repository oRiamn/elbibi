import { expect } from '@storybook/jest'
import { within } from '@storybook/testing-library'
import { Story } from '@storybook/vue3'

import Button from './button.vue'

export default {
  title: 'components/Button',
  component: Button
}

const Template: Story = (args) => ({
  components: { Button },
  setup() {
    return { args }
  },  
  template: '<button v-bind="args" />'
})

export const DefaultState = Template.bind({})
DefaultState.args = {}
DefaultState.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getAllByText('Button')[0]).toBeTruthy()
}

