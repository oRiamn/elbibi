import { composeStories } from '@fazulk/testing-vue3'
import { render } from '@testing-library/vue'

import * as stories from './launch.stories'

const { DefaultState } = composeStories(stories)

describe('Launch', () => {
  it('Displays Launch', async () => {
    expect(DefaultState()).toBeTruthy()

    const wrapper = render(DefaultState())

    const { getByText } = wrapper

    expect(getByText('Launch').textContent).toBeTruthy()
  })
  
  it('Tests interaction from storybook', async () => {
    const { container } = render(DefaultState())
    if (container instanceof HTMLElement)
      await DefaultState.play({ canvasElement: container as HTMLElement })
  })    
})
