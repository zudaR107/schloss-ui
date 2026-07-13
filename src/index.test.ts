import { describe, expect, it } from 'vitest'
import * as schlossUi from './index'

describe('package entry point', () => {
  it('loads without throwing', () => {
    expect(schlossUi).toBeDefined()
  })
})
