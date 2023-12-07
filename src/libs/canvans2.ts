import Vec2 from "./vector2";

const rotateCanvans = (
  ctx: CanvasRenderingContext2D,
  rotation_center_pos: Vec2,
  rotatnion_deg: number
) => {
  const angle_radians = (rotatnion_deg * Math.PI) / 180;
  ctx.translate(rotation_center_pos.x, rotation_center_pos.y);
  ctx.rotate(angle_radians);
  ctx.translate(-rotation_center_pos.x, -rotation_center_pos.y);
};

const Canvans2 = {
  rotateCanvans,
};
export default Canvans2;
