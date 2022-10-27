import { composeStories } from '@fazulk/testing-vue3'
import { render } from '@testing-library/vue'

import * as stories from './button.stories'

const { DefaultState } = composeStories(stories)

describe('Button', () => {
  it('Displays Button', async () => {
    expect(DefaultState()).toBeTruthy()

    const wrapper = render(DefaultState())

    const { getByText } = wrapper

    expect(getByText('Button').textContent).toBeTruthy()
  })
  
  it('Tests interaction from storybook', async () => {
    const { container } = render(DefaultState())
    if (container instanceof HTMLElement)
      await DefaultState.play({ canvasElement: container as HTMLElement })
  })    
})
