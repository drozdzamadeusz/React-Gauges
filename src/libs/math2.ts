import Vec2 from "./vector2";

/**
* Calculates the angle difference between two vectors relative to a common point.
*/
const angle_diff = (c: Vec2, a: Vec2, b: Vec2) => {
  const oa = new Vec2(a.x - c.x, a.y - c.y);
  const ob = new Vec2(b.x - c.x, b.y - c.y);

  const dotProduct = oa.x * ob.x + oa.y * ob.y;

  const magnitudeOA = Math.sqrt(oa.x * oa.x + oa.y * oa.y);
  const magnitudeOB = Math.sqrt(ob.x * ob.x + ob.y * ob.y);

  // Calculate the angle in radians
  const angleRadians = Math.acos(dotProduct / (magnitudeOA * magnitudeOB));

  // Convert to degrees
  const angleDegrees = angleRadians * (180 / Math.PI);

  // Return the angle
  return angleDegrees;
};

const cord_to_polar = (cord: Vec2) => {
  let r = Math.sqrt(cord.x * cord.x + cord.y * cord.y);
  let phi = Math.atan2(cord.y, cord.x);
  return [r, phi];
};


const apply_rotation_matrix = (center: Vec2, obj: Vec2, rotatnion_deg: number) => {
  const angle_radians = (rotatnion_deg * Math.PI) / 180;

  const rotation_matrix = new Vec2(
    obj.x * Math.cos(angle_radians) - obj.y * Math.sin(angle_radians),
    obj.x * Math.sin(angle_radians) + obj.y * Math.cos(angle_radians)
  );

  return rotation_matrix.add(center);
};



const isInsideRing = (x: number, y: number, center: Vec2, min_radius: number, max_radius: number, startAngle: number, endAngle: number, rotation: number) => {
  // Calculate the polar coordinates of (x, y) relative to (h, k)
  const polar_cord = new Vec2(x - center.x, y - center.y)

  // Calculate the polar coordinates
  let [r, phi] = cord_to_polar(polar_cord);

  // Ensure phi is between 0 and 2π (full circle)
  if (phi < 0) {
    phi += 2 * Math.PI;
  }

  // Convert angles to radians and add rotation
  let start_angle = ((startAngle + rotation) * Math.PI) / 180;
  let end_angle = ((endAngle + rotation) * Math.PI) / 180;



  // Normalize angles to 0 to 2π
  start_angle = (start_angle + 2 * Math.PI) % (2 * Math.PI);
  end_angle = (end_angle + 2 * Math.PI) % (2 * Math.PI);


  /* 	if(Math.abs(endAngle - startAngle) == 360ž){
  	    end_angle = start_angle + 2 * Math.PI
  	  } */


  if (Math.abs(end_angle - start_angle) < 0.0001) {
    end_angle -= 0.0001
  }

  // Check if r is within the radius range
  if (r < min_radius || r > max_radius) {
    return false;
  }

  // Check if phi is within the angle range
  if (start_angle <= end_angle) {
    return phi >= start_angle && phi <= end_angle;
  } else {
    return phi >= start_angle || phi <= end_angle;
  }
}


const Math2 = {
  angle_diff,
  cord_to_polar,
  apply_rotation_matrix
};

export default Math2;
