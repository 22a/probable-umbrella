/* eslint-env jest */
const angleUtils = require('./angles')

describe('degreesToRadians', () => {
  it('should return the correct conversion for 0 deg', () => {
    expect(angleUtils.degreesToRadians(0))
      .toBe(0)
  })

  it('should return the correct conversion for 90 deg', () => {
    expect(angleUtils.degreesToRadians(90))
      .toBe(Math.PI / 2)
  })

  it('should return the correct conversion for 180 deg', () => {
    expect(angleUtils.degreesToRadians(180))
      .toBe(Math.PI)
  })

  it('should return the correct conversion for negative 90 deg', () => {
    expect(angleUtils.degreesToRadians(-90))
      .toBe(-(Math.PI / 2))
  })

  it('should return the correct conversion for negative 180 deg', () => {
    expect(angleUtils.degreesToRadians(-180))
      .toBe(-(Math.PI))
  })

  it('should not throw if passed an angle larger than 360 degrees', () => {
    expect(() => angleUtils.degreesToRadians(73920))
      .not.toThrow()
  })
})

describe('arcLength', () => {
  it('should return zero distance for the same point', () => {
    expect(angleUtils.arcLength(10, 0, 0, 0, 0))
      .toBe(0)
  })

  it('should return a distance greater than zero for two unique points', () => {
    expect(angleUtils.arcLength(10, 0, 0, 1, 1))
      .toBeGreaterThan(0)
  })

  it('should return a distance', () => {
    expect(angleUtils.arcLength(1, 0, 0, Math.PI / 2, Math.PI / 2))
      .toBe(Math.PI / 2)
  })
})
