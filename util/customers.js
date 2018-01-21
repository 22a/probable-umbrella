const fs = require('fs')
const Ajv = require('ajv')
const earthUtils = require('./earth')

/**
 * JSON schema describing what a customer record should look like.
 */
const customerSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    user_id: { type: 'number' },
    latitude: { type: 'string' },
    longitude: { type: 'string' }
  },
  required: ['name', 'user_id', 'latitude', 'longitude']
}

// Here we configure our "Another JSON Schema Validator" methods with the
// above schema
const ajv = new Ajv({allErrors: true})
const validateCustomer = ajv.compile(customerSchema)

/**
 * Customer type definition
 * @typedef {Object} Customer
 * @property {string} name The customer's full name.
 * @property {number} user_id The user id for the customer.
 * @property {number} latitude The customer's latitude.
 * @property {number} longitude The customer's longitude.
 */

/**
 * Parse and validate a JSON encoded customer record.
 * @param {string} customerJson - A JSON string describing a customer.
 *
 * @returns {Customer} A customer object.
 * @throws {Error} Throws an error if JSON parsing or validation fails.
 */
const parseCustomer = customerJson => {
  const parsedCustomer = JSON.parse(customerJson)
  const valid = validateCustomer(parsedCustomer)
  if (!valid) {
    throw new Error(`Invalid customer: ${customerJson}\n` + ajv.errorsText(validateCustomer.errors))
  }

  const parsedLatitude = parseFloat(parsedCustomer.latitude)
  if (isNaN(parsedLatitude)) {
    throw new Error(`Invalid customer latitude: ${parsedCustomer.latitude}`)
  }
  const parsedLongitude = parseFloat(parsedCustomer.longitude)
  if (isNaN(parsedLongitude)) {
    throw new Error(`Invalid customer longitude: ${parsedCustomer.longitude}`)
  }

  return Object.assign(parsedCustomer, {
    latitude: parsedLatitude,
    longitude: parsedLongitude
  })
}

/**
 * Extract a list of cutsomers from a file.
 * @param {string} filepath - The path to the file on disk.
 *
 * @returns {[Customer]} A list of customer objects.
 * @throws {Error} Throws an error if:
 *                 * the file could not be opened
 *                 * JSON parsing or validation of any line fails
 */
const readCustomersFromFile = filepath => {
  // POSSIBLE_IMPROVEMENT: streams
  const contents = fs.readFileSync(filepath, 'utf8')
  const lines = contents.trim().split('\n')
  const customers = lines.map(parseCustomer)

  return customers
}

/**
 * Compute whether a customer is within N kilometers of a give target.
 * @param {number} n - The comparison distance, in kilometers.
 * @param {Customer} customer - The path to the file on disk.
 * @param {number} customer.latitude - The latitude of the customer, in degrees.
 * @param {number} customer.longitude - The longitude of the customer, in degrees.
 * @param {Object} target - The coordinates of the target.
 * @param {number} target.latitude - The latitude of the target, in degrees.
 * @param {number} target.longitude - The longitude of the target, in degrees.
 *
 * @returns {boolean} True if the distance between the customer and the target
 *                    coordinates is less than N kilometers, false otherwise.
 */
const isWithinNKmOfTarget = (n, customer, target) => {
  return earthUtils.orthodromicDistance(
    customer.latitude,
    customer.longitude,
    target.latitude,
    target.longitude
  ) < n
}

/**
 * Sort a list of customers ordered by the value of a given field.
 * Ideally the type of ths field will be `number`, if it's a string the fields
 * will be sorted by unicode code point comparison.
 * @param {[Customer]} customers - The input list of customers to be sorted.
 * @param {string} fieldName - The name of the field which the customers should
 *                             be sorted by.
 * @param {string} [ordering=desc] - The ordering direction, 'asc' for ascending
 *                                   or 'desc' for descending.
 *
 * @returns {[Customer]} A sorted list of customers.
 */
const sortBy = (customers, fieldName, ordering) => {
  ordering = ordering === 'asc' ? 'asc' : 'desc'
  // POSSIBLE_IMPROVEMENT: a more efficient sort
  return customers.sort((customerA, customerB) =>
    customerA[fieldName] < customerB[fieldName]
      ? (ordering === 'desc' ? 1 : -1)
      : (ordering === 'desc' ? -1 : 1)
  )
}

module.exports = {
  readCustomersFromFile,
  isWithinNKmOfTarget,
  sortBy
}
