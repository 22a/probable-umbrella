/* eslint-env jest */
const fs = require('fs')
const sinon = require('sinon')
const customerUtils = require('./customers')

const sandbox = sinon.createSandbox()

describe('readCustomersFromFile', () => {
  const validCustomerJson = '{"latitude": "52.986375", "user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"}'
  const validCustomer = {
    latitude: 52.986375,
    user_id: 12,
    name: 'Christina McArdle',
    longitude: -6.043701
  }
  const invalidCustomerJson = '{"user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"}'
  const customerWithInvalidLatitudeJson = '{"latitude": "nowhere near a number", "user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"}'
  const customerWithInvalidLongitudeJson = '{"latitude": "52.986375", "user_id": 12, "name": "Christina McArdle", "longitude": "not a number either"}'

  let fsStub

  beforeEach(() => {
    fsStub = sandbox.stub(fs, 'readFileSync')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should successfully parse a file with one valid customer', () => {
    fsStub.returns(validCustomerJson)
    expect(customerUtils.readCustomersFromFile('some/path'))
      .toEqual([validCustomer])
  })

  it('should successfully parse a file with two valid customers', () => {
    fsStub.returns(validCustomerJson + '\n' + validCustomerJson)
    expect(customerUtils.readCustomersFromFile('some/path'))
      .toEqual([validCustomer, validCustomer])
  })

  it('should throw when the file contains invalid json', () => {
    fsStub.returns('{"key": illegal_unquoted_value}')
    expect(() => customerUtils.readCustomersFromFile('some/path'))
      .toThrow()
  })

  it('should throw when the file contains invalid customer records', () => {
    fsStub.returns(invalidCustomerJson)
    expect(() => customerUtils.readCustomersFromFile('some/path'))
      .toThrow()
  })

  it('should throw when the file contains a customer with invalid latitude', () => {
    fsStub.returns(customerWithInvalidLatitudeJson)
    expect(() => customerUtils.readCustomersFromFile('some/path'))
      .toThrow()
  })

  it('should throw when the file contains a customer with invalid longitude', () => {
    fsStub.returns(customerWithInvalidLongitudeJson)
    expect(() => customerUtils.readCustomersFromFile('some/path'))
      .toThrow()
  })

  it('should throw when the file is empty', () => {
    fsStub.returns('')
    expect(() => customerUtils.readCustomersFromFile('some/path'))
      .toThrow()
  })

  it('should throw when the file contains garbage', () => {
    fsStub.returns('sponge ice water')
    expect(() => customerUtils.readCustomersFromFile('some/path'))
      .toThrow()
  })
})

describe('isWithinNKmOfTarget', () => {
  it('should return true for even the smallest N value when passed the same ' +
     'point for both target and customer', () => {
    const point = {
      latitude: -22,
      longitude: 22
    }
    expect(customerUtils.isWithinNKmOfTarget(Number.MIN_VALUE, point, point))
      .toBe(true)
  })

  it('should return true when N is very large, regardless of where the points are', () => {
    const customer = {
      latitude: 25,
      longitude: -90
    }
    const target = {
      latitude: -25,
      longitude: 90
    }
    expect(customerUtils.isWithinNKmOfTarget(25000, customer, target))
      .toBe(true)
  })

  it('should return false when N=10 for points that are at opposite ends of the globe', () => {
    const customer = {
      latitude: 0,
      longitude: 0
    }
    const target = {
      latitude: 0,
      longitude: -180
    }
    expect(customerUtils.isWithinNKmOfTarget(10, customer, target))
      .toBe(false)
  })
})

describe('sortBy', () => {
  const exampleCustomer0 = {
    name: 'Linus Sebastian',
    user_id: 90210,
    latitude: 49.103901,
    longitude: -122.799676
  }
  const exampleCustomer1 = {
    name: 'Sue Jones',
    user_id: 99,
    latitude: 51.530665,
    longitude: -0.028347
  }
  const exampleCustomer2 = {
    name: 'Brad Jolie',
    user_id: 256,
    latitude: 0,
    longitude: 0
  }

  it('should return an empty list when passed an empty list', () => {
    expect(customerUtils.sortBy([], 'doesn\'t matter'))
      .toEqual([])
  })

  it('should return an untouched list when passed a list of length 1', () => {
    expect(customerUtils.sortBy([exampleCustomer0], 'dosen\'t matter'))
      .toEqual([exampleCustomer0])
  })

  it('should return a list of customers sorted by descending user_id by default', () => {
    expect(customerUtils.sortBy([exampleCustomer0, exampleCustomer1, exampleCustomer2], 'user_id'))
      .toEqual([exampleCustomer0, exampleCustomer2, exampleCustomer1])
  })

  it('should return a list of customers sorted by ascending user_id', () => {
    expect(customerUtils.sortBy([exampleCustomer0, exampleCustomer1, exampleCustomer2], 'user_id', 'asc'))
      .toEqual([exampleCustomer1, exampleCustomer2, exampleCustomer0])
  })
})
