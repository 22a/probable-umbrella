const customerUtils = require('./util/customers')

const TARGET_COORDINATES = {
  latitude: 53.339428,
  longitude: -6.257664
}

// load a list of customers from a file
const customers = customerUtils.readCustomersFromFile('./customers.json')

// filter the input customers to only those with locations within 100km of the target
const targetCustomers = customers.filter(customer =>
  customerUtils.isWithinNKmOfTarget(100, customer, TARGET_COORDINATES)
)

// sort the customers within 100km of the target by `user_id` ascending
const sortedTargetCustomers = customerUtils.sortBy(targetCustomers, 'user_id', 'asc')

// discard the other customer properties
const filteredTargetCustomers = sortedTargetCustomers.map(({name, user_id}) =>
  ({name, user_id})
)

// output format wasn't specified so we'll just log the resultant customers here
// this can easily be changed to something more pretty later if needs be
console.log(filteredTargetCustomers)
