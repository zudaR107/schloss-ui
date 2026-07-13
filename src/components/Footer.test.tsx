import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { Footer } from './Footer'

afterEach(() => {
  cleanup()
})

describe('Footer', () => {
  it('renders the exact open-source/self-hosted text for "Schloss"', () => {
    render(<Footer serviceName="Schloss" />)
    expect(
      screen.getByText('Schloss — открытый код, свой хостинг'),
    ).toBeInTheDocument()
  })

  it('renders the exact open-source/self-hosted text for "Kuvert"', () => {
    render(<Footer serviceName="Kuvert" />)
    expect(
      screen.getByText('Kuvert — открытый код, свой хостинг'),
    ).toBeInTheDocument()
  })

  it('renders a GitHub link pointing to the org, opening in a new tab, without a referrer', () => {
    render(<Footer serviceName="Schloss" />)

    const githubLink = screen.getByRole('link', { name: 'GitHub' })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/zudaR107')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink.getAttribute('rel')).toEqual(
      expect.stringContaining('noreferrer'),
    )
  })
})
