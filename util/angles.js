/**
 * Converts the passed angle value from degrees to radians.
 * @param {number} angle - An angle, measured in degrees.
 *
 * @returns {number} The input angle, converted to radians.
 */
const degreesToRadians = angle => {
  return angle * Math.PI / 180
}

/**
 * Calculates the length of the shortest path between two points on a sphere,
 * measured along the surface of the sphere (as opposed to a straight line
 * through the sphere's interior) by computing the length of the arc connecting
 * the two points.
 * @param {number} radius - The radius of the sphere.
 * @param {number} phi0 - The latitude of the first point, in radians.
 * @param {number} lambda0 - The longitude of the first point, in radians.
 * @param {number} phi1 - The latitude of the second point, in radians.
 * @param {number} lambda1 - The longitude of the second point, in radians.
 *
 * @returns {number} The length of the shortest path.
 */
const arcLength = (radius, phi0, lambda0, phi1, lambda1) => {
  const deltaLambda = Math.abs(lambda0 - lambda1)
  const deltaSigma = Math.acos(
    Math.sin(phi0) * Math.sin(phi1) +
    Math.cos(phi0) * Math.cos(phi1) * Math.cos(deltaLambda)
  )
  return radius * deltaSigma
}

module.exports = {
  degreesToRadians,
  arcLength
}
