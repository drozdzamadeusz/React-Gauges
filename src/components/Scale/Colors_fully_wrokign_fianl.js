class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(x, y) {
    if (x instanceof Vec2) {
      this.x += x.x;
      this.y += x.y;
    }
    return this;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }
}


let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

const dim = new Vec2(400, 400);
const center = new Vec2(dim.x / 2, dim.y / 2);


ctx.fillStyle = "#666666";
ctx.fillRect(0, 0, dim.x, dim.y);
ctx.fill();
ctx.fillStyle = "SpringGreen";
ctx.arc(center.x, center.y, 3, 0, 2 * Math.PI);
ctx.fill();




function xy2polar(cord) {
  let r = Math.sqrt(cord.x * cord.x + cord.y * cord.y);
  let phi = Math.atan2(cord.y, cord.x);
  return [r, phi];
}



const angle_diff = (c, a, b) => {
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



const placeObjectOnCicle = (center, obj, rotatnion_deg = 0) => {
  const angle_radians = (rotatnion_deg * Math.PI) / 180;

  const rotation_matrix = new Vec2(
    obj.x * Math.cos(angle_radians) - obj.y * Math.sin(angle_radians),
    obj.x * Math.sin(angle_radians) + obj.y * Math.cos(angle_radians)
  );

  return rotation_matrix.add(center);
};


const distance = (p1, p2) => {
  const deltaX = Math.abs(p2.x - p1.x);
  const deltaY = Math.abs(p2.y - p1.y);
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}








const isInsideRing = (x, y, center, min_radius, max_radius, startAngle, endAngle, rotation) => {
  // Calculate the polar coordinates of (x, y) relative to (h, k)
  const polar_cord = new Vec2(x - center.x, y - center.y)

  // Calculate the polar coordinates
  let [r, phi] = xy2polar(polar_cord);

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



const hlsColor = (intensity) => {
  const hue = (1 - intensity) * 80;
  return `hsl(${hue},100%,40%)`
}

const drawProgress = (val, val_min, val_max) => {
  const rot_ofst = 120;

  const min_radius = 110;
  const max_radius = 190;

  const ang_start = 0;
  const max_angle = 300;


  const percenage = (val - val_min) / (val_max - val_min);

  const ang_end = percenage * max_angle

  const ringCube = new Vec2(center.x + max_radius, center.y + max_radius)
  //const ringCube = new Vec2(center.x + max_radius, center.y)

  const p_start = placeObjectOnCicle(center, new Vec2(40, 0), rot_ofst);
  const p_end = placeObjectOnCicle(center, new Vec2(40, 0), ang_end + rot_ofst - 1);

  /* const full_circle = ang_end == 360 */

  /*   let p_three_quarters;
    if (full_circle) {
      p_three_quarters = placeObjectOnCicle(center, new Vec2(30, 0), ang_end + rot_ofst + (1 / 4 * ang_end));
    
      ctx.beginPath();
      ctx.fillStyle = "Pink";
      ctx.arc(p_three_quarters.x, p_three_quarters.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    } */

  let p_mid;
  let p_start_min_deg;
  //if (max_angle - ang_start >= 180) {
    p_mid = placeObjectOnCicle(center, new Vec2(50, 0), rot_ofst + ((ang_end - ang_start) / 2));
    ctx.arc(p_mid.x, p_mid.y, 3, 0, 2 * Math.PI);
    p_start_min_deg = angle_diff(center, p_start, p_mid);
  //}

  /* 
    ctx.beginPath();
    ctx.fillStyle = "Pink";
    ctx.arc(p_start.x, p_start.y, 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "Green";
    ctx.arc(ang_end.x, ang_end.y, 3, 0, 2 * Math.PI);
    ctx.fill(); */




  let numPoints = 0;
  let numPointsInside = 0;

  const tempV = new Vec2(0, 0);

  for (let y = center.y - max_radius; y < ringCube.y; y++) {
    for (let x = center.y - max_radius; x < ringCube.x; x++) {

      tempV.set(x, y);

      if (distance(center, tempV) < min_radius || distance(center, tempV) > max_radius) {
        continue;
      }

      numPoints++

      if (isInsideRing(x, y, center, min_radius, max_radius, ang_start, ang_end, rot_ofst)) {
        numPointsInside++


        let diffToStart = angle_diff(center, p_start, tempV);

        if (angle_diff(center, p_start, tempV) >= angle_diff(center, p_end, tempV)) {
          diffToStart = p_start_min_deg + angle_diff(center, p_mid, tempV);
        }

        let hue = (diffToStart) / ang_end

        ctx.fillStyle = hlsColor(hue);

        ctx.beginPath();

        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
       //ctx.fillRect(x, y, 1, 1);
      }
    }
  }


  console.log(numPoints, numPointsInside)
}


drawProgress(100, 0, 100)

console.log(distance(new Vec2(-5, 0), new Vec2(10, 0)))
