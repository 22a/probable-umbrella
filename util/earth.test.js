/* eslint-env jest */
const earthUtils = require('./earth')

describe('orthodromicDistance', () => {
  it('should return zero distance for the same point', () => {
    expect(earthUtils.orthodromicDistance(20, 10, 20, 10))
      .toBe(0)
  })

  it('should return a distance greater than zero for two unique points', () => {
    expect(earthUtils.orthodromicDistance(0, 0, 1, 1))
      .toBeGreaterThan(0)
  })

  it('should return a distance of around 8k km for Dublin to SF', () => {
    const computedDistanceFromDublinToSF = earthUtils.orthodromicDistance(
      53.339428, -6.257664,  // Dublin
      37.788921, -122.400297 // SF
    )

    expect(computedDistanceFromDublinToSF).toBeGreaterThan(8000)
    expect(computedDistanceFromDublinToSF).toBeLessThan(8500)
  })
})
