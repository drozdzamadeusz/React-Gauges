import Vec2 from "./vector2";

export const angle_diff_deg = (c: Vec2, a: Vec2, b: Vec2) => {
  var oa = new Vec2(a.x - c.x, a.y - c.y);
  var ob = new Vec2(b.x - c.x, b.y - c.y);

  var dotProduct = oa.x * ob.x + oa.y * ob.y;

  // Magnitudes of OA and OB
  var magnitudeOA = Math.sqrt(oa.x * oa.x + oa.y * oa.y);
  var magnitudeOB = Math.sqrt(ob.x * ob.x + ob.y * ob.y);

  // Calculate the angle in radians
  var angleRadians = Math.acos(dotProduct / (magnitudeOA * magnitudeOB));

  // Convert to degrees
  var angleDegrees = angleRadians * (180 / Math.PI);

  // Return the angle
  return angleDegrees;
};
