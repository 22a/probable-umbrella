const angleUtils = require('./angles')

// All of this domain knowledge comes from:
// https://en.wikipedia.org/wiki/Great-circle_distance

/**
 * @constant An approximation for the average radius of the earth, in kilometers.
 * @type {number}
 */
const APPROXIMATE_AVERAGE_EARTH_RADIUS = 6371

/**
 * A number representing the latitude of a point on the surface of a sphere.
 * Regardless of orientation, values range from -90 to 90, inclusive.
 * @typedef {number} Latitude
 */

/**
 * A number representing the longitude of a point on the surface of a sphere.
 * Regardless of orientation, values range from -180 to 180, inclusive.
 * @typedef {number} Longitude
 */

/**
 * Calculates the shortest distance between two points on the surface of the
 * earth.
 * @param {Latitude} latitude0 - The latitude of the first point, in degrees.
 * @param {Longitude} longitude0 - The longitude of the first point, in degrees.
 * @param {Latitude} latitude1 - The latitude of the second point, in degrees.
 * @param {Longitude} longitude1 - The longitude of the second point, in degrees.
 *
 * @returns {number} The orthodromic distance between the two points.
 */
const orthodromicDistance = (latitude0, longitude0, latitude1, longitude1) => {
  const latitude0Rad = angleUtils.degreesToRadians(latitude0)
  const longitude0Rad = angleUtils.degreesToRadians(longitude0)
  const latitude1Rad = angleUtils.degreesToRadians(latitude1)
  const longitude1Rad = angleUtils.degreesToRadians(longitude1)

  return angleUtils.arcLength(
    APPROXIMATE_AVERAGE_EARTH_RADIUS,
    latitude0Rad,
    longitude0Rad,
    latitude1Rad,
    longitude1Rad
  )
}

module.exports = {
  orthodromicDistance
}
