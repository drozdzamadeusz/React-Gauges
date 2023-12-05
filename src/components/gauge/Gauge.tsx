import React, { useEffect, useRef } from "react";
import "./Gauge.css";
import Vec2 from "../../libs/vector2";

const HEIHGT = 800;
const WIDTH = HEIHGT;

const findFontSize = () => {
  let fontSize;
  if (HEIHGT <= 250) {
    fontSize = 16;
  } else if (HEIHGT <= 300) {
    fontSize = 20;
  } else if (HEIHGT <= 400) {
    fontSize = 30;
  } else if (HEIHGT <= 600) {
    fontSize = 35;
  } else if (HEIHGT <= 800) {
    fontSize = 50;
  } else if (HEIHGT <= 1000) {
    fontSize = 55;
  } else {
    fontSize = 60;
  }
  return fontSize;
};

const FONT = `${findFontSize()}px 'Georgia'`;

const MAX_ROTATION = 300;
const ROTARTION_ADJUSTMENT = (360 - MAX_ROTATION) / 2;

const MAX_NUM_LABELS = 20;
const TICKS_LABELS_MULT = 5;
const MAX_NUM_TICKS = TICKS_LABELS_MULT * MAX_NUM_LABELS;

const placeObjectOnCicle = (center: Vec2, obj: Vec2, rotatnion_deg: number) => {
  const angle_radians = (rotatnion_deg * Math.PI) / 180;

  const rotation_matrix = new Vec2(
    obj.x * Math.cos(angle_radians) - obj.y * Math.sin(angle_radians),
    obj.x * Math.sin(angle_radians) + obj.y * Math.cos(angle_radians)
  );

  return rotation_matrix.add(center);
};

const rotateObject = (
  ctx: CanvasRenderingContext2D,
  rotation_center_pos: Vec2,
  rotatnion_deg: number
) => {
  const angle_radians = (rotatnion_deg * Math.PI) / 180;
  ctx.translate(rotation_center_pos.x, rotation_center_pos.y);
  ctx.rotate(angle_radians);
  ctx.translate(-rotation_center_pos.x, -rotation_center_pos.y);
};

const drawScaleLabels = (
  ctx: CanvasRenderingContext2D,
  val_min: number,
  val_max: number
) => {
  ctx.fillStyle = "#d2d2d2";

  const center = new Vec2(WIDTH / 2, HEIHGT / 2);
  const lett_pos = new Vec2(0, center.y - center.y * 0.11);
  const num_labels = Math.min(MAX_NUM_LABELS, val_max - val_min);

  for (let i = 0; i <= num_labels; i++) {
    const percentage = i / num_labels;
    const rotation = percentage * MAX_ROTATION + ROTARTION_ADJUSTMENT;

    const label_val = Math.round(percentage * (val_max - val_min) + val_min);

    const lett_on_circle_pos = placeObjectOnCicle(center, lett_pos, rotation);

    ctx.save();

    rotateObject(ctx, lett_on_circle_pos, rotation + 180);
    ctx.fillText(String(label_val), lett_on_circle_pos.x, lett_on_circle_pos.y);

    ctx.restore();
  }
};

const drawBackground = (ctx: CanvasRenderingContext2D) => {
  const center = new Vec2(WIDTH / 2, HEIHGT / 2);
  const point = new Vec2(0, center.y);

  ctx.strokeStyle = "#190828";

  ctx.lineWidth = center.x * 0.003;

  // for (let j = 0; j <= 318; j++) {
  //   const angle_degrees = j + ROTARTION_ADJUSTMENT - 9;

  ctx.beginPath();
  for (let j = 0; j < 720; j++) {
    const angle_degrees = j / 2;
    const point_rotated = placeObjectOnCicle(center, point, angle_degrees);
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(point_rotated.x, point_rotated.y);
  }
  ctx.closePath();

  ctx.stroke();
};

const drawTicks = (
  ctx: CanvasRenderingContext2D,
  val_min: number,
  val_max: number
) => {
  const center = new Vec2(WIDTH / 2, HEIHGT / 2);

  const p1 = new Vec2(0, center.y - center.y * 0.3);
  const p2 = new Vec2(0, 0);

  const num_ticks = Math.min(
    MAX_NUM_TICKS,
    (val_max - val_min) * TICKS_LABELS_MULT
  );

  for (let i = 0; i <= num_ticks; i++) {
    if (i == 0 || i % TICKS_LABELS_MULT == 0) {
      p2.y = center.y - center.y * 0.21;
      ctx.lineWidth = center.x * 0.014;
    } else {
      p2.y = center.y - center.y * 0.26;
      ctx.lineWidth = center.x * 0.01;
    }

    const percentage = i / num_ticks;
    const rotation = percentage * MAX_ROTATION + ROTARTION_ADJUSTMENT;

    const p1_on_circle = placeObjectOnCicle(center, p1, rotation);
    const p2_on_circle = placeObjectOnCicle(center, p2, rotation);

    // ctx.fillStyle = "#a328d9";
    ctx.strokeStyle = "#8156be";

    // ctx.beginPath();
    // ctx.arc(p1_on_circle.x, p1_on_circle.y, center.x * 0.005, 0, 2 * Math.PI);
    // ctx.arc(p2_on_circle.x, p2_on_circle.y, center.x * 0.005, 0, 2 * Math.PI);
    // ctx.closePath();
    // ctx.fill();

    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(p1_on_circle.x, p1_on_circle.y);
    ctx.lineTo(p2_on_circle.x, p2_on_circle.y);
    ctx.stroke();
  }
};

const drawPointer = (ctx: CanvasRenderingContext2D, rotation_deg: number) => {
  const c_x = WIDTH / 2;
  const c_y = HEIHGT / 2;

  const rot_offset = 180;
  rotation_deg += rot_offset;

  // Height offset
  const h_offset = c_y * 0.292;

  // Points offsets
  const m_1 = new Vec2(0.08, 0.18);
  const m_2 = new Vec2(0.005, 0.14);
  const m_3 = new Vec2(0.018, -0.055);
  const m_4 = new Vec2(0.1, 0.21);

  // Points offsets mirros
  const m_m_4 = m_4.copy().mult(-1, 1);
  const m_m_3 = m_3.copy().mult(-1, 1);
  const m_m_2 = m_2.copy().mult(-1, 1);
  const m_m_1 = m_1.copy().mult(-1, 1);

  // Points
  const p_0 = new Vec2(c_x, 0 + h_offset);
  const p_1 = new Vec2(c_x + c_x * m_1.x, c_y * m_1.y + h_offset);
  const p_2 = new Vec2(c_x + c_x * m_2.x, c_y * m_2.y + h_offset);
  const p_3 = new Vec2(c_x + c_x * m_3.x, c_y - c_y * m_3.y);
  const p_4 = new Vec2(c_x + c_x * m_4.x, c_y + c_y * m_4.y);

  // Points mirrors
  const p_m_4 = new Vec2(c_x + c_x * m_m_4.x, c_y + c_y * m_m_4.y);
  const p_m_3 = new Vec2(c_x + c_x * m_m_3.x, c_y - c_y * m_m_3.y);
  const p_m_2 = new Vec2(c_x + c_x * m_m_2.x, c_y * m_m_2.y + h_offset);
  const p_m_1 = new Vec2(c_x + c_x * m_m_1.x, c_y * m_m_1.y + h_offset);
  const p_m_0 = p_0;

  const points = [p_0, p_1, p_2, p_3, p_4, p_m_4, p_m_3, p_m_2, p_m_1, p_m_0];

  // Store current context before rotation
  ctx.save();

  ctx.fillStyle = "#af0c32";
  ctx.strokeStyle = "#852d2d";
  ctx.lineWidth = c_x * 0.024;
  ctx.lineCap = "round";

  // Rotate pointer
  rotateObject(ctx, new Vec2(c_x, c_y), rotation_deg);

  // Draw awrrow outline
  ctx.beginPath();

  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
  }

  ctx.stroke();

  // Draw arrow's sharp end
  ctx.beginPath();
  ctx.moveTo(p_1.x, p_1.y);
  ctx.lineTo(p_0.x, p_0.y);
  ctx.lineTo(p_m_1.x, p_m_1.y);
  ctx.stroke();
  ctx.closePath();

  // // Draw arrow's even sharper end
  // ctx.beginPath();
  // ctx.moveTo(p_1.x, p_1.y);
  // ctx.lineTo(p_0.x, p_0.y);
  // ctx.lineTo(p_m_1.x, p_m_1.y);
  // ctx.lineTo(p_m_2.x, p_m_2.y);
  // ctx.lineTo(p_1.x, p_1.y);
  // ctx.closePath();
  // ctx.fill();
  // ctx.stroke();

  // Draw arrow background
  ctx.beginPath();

  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    ctx.lineTo(p.x, p.y);
  }
  ctx.fill();

  // Draw the nail that rotates arrow
  ctx.beginPath();
  ctx.fillStyle = "#767676";
  ctx.arc(c_x, c_y, c_x * 0.04, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  // Restoring context after rotation
  ctx.restore();
};

const calculatePointerRotation = (
  val: number,
  val_min: number,
  val_max: number
) => {
  const max_rotation = MAX_ROTATION;
  const rotation_align_adjustment = ROTARTION_ADJUSTMENT;

  const val_in_ranges = Math.min(Math.max(val, val_min), val_max);
  const in_percentage = (val_in_ranges - val_min) / (val_max - val_min);
  const in_degrees = in_percentage * max_rotation + rotation_align_adjustment;

  return in_degrees;
};

const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.font = FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#130417";
  ctx.arc(WIDTH / 2, HEIHGT / 2, WIDTH / 2, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#a328d9";

  ctx.save();

  const min_val = 0;
  const max_val = 100;
  const value = 88;

  drawBackground(ctx);
  drawTicks(ctx, min_val, max_val);
  drawScaleLabels(ctx, min_val, max_val);

  const pointer_rotation = calculatePointerRotation(value, min_val, max_val);
  drawPointer(ctx, pointer_rotation);
};

const Gauge = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext("2d");
      const ctx = canvasCtxRef.current;
      if (ctx) draw(ctx);
    }
  }, []);

  return (
    <div className="gauge">
      <canvas ref={canvasRef} height={HEIHGT} width={WIDTH}></canvas>
    </div>
  );
};

export default Gauge;
