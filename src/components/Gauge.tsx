import React, { useEffect, useRef } from "react";
import "./Gauge.css";
import Vector2 from "./../libs/Vector2";

const HEIHGT = 1000;
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
    fontSize = 40;
  } else if (HEIHGT <= 800) {
    fontSize = 50;
  } else if (HEIHGT <= 1000) {
    fontSize = 55;
  } else {
    fontSize = 70;
  }
  return fontSize;
};

const FONT = `bold ${findFontSize()}px 'Georgia'`;

const MAX_ROTATION = 300;
const ROTARTION_ADJUSTMENT = (360 - MAX_ROTATION) / 2;

const MAX_NUM_LABELS = 20;
const TICKS_LABELS_MULT = 5;
const MAX_NUM_TICKS = TICKS_LABELS_MULT * MAX_NUM_LABELS;

const placeObjectOnCicle = (
  rotation_center_pos: Vector2,
  object_pos: Vector2,
  rotatnion_deg: number
) => {
  // Angle in radians
  const angle_radians = (rotatnion_deg * Math.PI) / 180;

  // Apply rotation
  const rotation_matrix = new Vector2(
    object_pos.x * Math.cos(angle_radians) -
      object_pos.y * Math.sin(angle_radians),
    object_pos.x * Math.sin(angle_radians) +
      object_pos.y * Math.cos(angle_radians)
  );

  return rotation_matrix.add(rotation_center_pos);
};

const rotateObject = (
  ctx: CanvasRenderingContext2D,
  rotation_center_pos: Vector2,
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
  ctx.fillStyle = "#ffffff";

  const center = new Vector2(WIDTH / 2, HEIHGT / 2);
  const lett_pos = new Vector2(0, center.y - center.y * 0.1);
  const num_labels = Math.min(MAX_NUM_LABELS, val_max - val_min);

  for (let i = 0; i <= num_labels; i++) {
    const percentage = i / num_labels;
    const rotation = percentage * MAX_ROTATION + ROTARTION_ADJUSTMENT;

    const label_val = Math.round(percentage * (val_max - val_min) + val_min);

    const lett_rotated = placeObjectOnCicle(center, lett_pos, rotation);

    ctx.save();

    rotateObject(ctx, lett_rotated, rotation + 180);

    ctx.beginPath();
    ctx.fillText(String(label_val), lett_rotated.x, lett_rotated.y);
    ctx.closePath();

    ctx.restore();
  }
};

const drawBackground = (ctx: CanvasRenderingContext2D) => {
  const center = new Vector2(WIDTH / 2, HEIHGT / 2);
  const point = new Vector2(0, center.y);

  ctx.strokeStyle = "#22082e";
  ctx.beginPath();

  ctx.lineWidth = 1;

  // for (let j = 0; j <= 318; j++) {
  //   const angle_degrees = j + ROTARTION_ADJUSTMENT - 9;

  for (let j = 0; j <= 360; j++) {
    const angle_degrees = j;
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
  const center = new Vector2(WIDTH / 2, HEIHGT / 2);

  const p1 = new Vector2(0, center.y - center.y * 0.3);
  const p2 = new Vector2(0, 0);

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

    const p1_rotated = placeObjectOnCicle(center, p1, rotation);
    const p2_rotated = placeObjectOnCicle(center, p2, rotation);

    ctx.fillStyle = "#a328d9";
    ctx.strokeStyle = "#a328d9";

    ctx.beginPath();
    // ctx.arc(p1_rotated.x, p1_rotated.y, center.x * 0.005, 0, 2 * Math.PI);
    ctx.arc(p2_rotated.x, p2_rotated.y, center.x * 0.005, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    // ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(p1_rotated.x, p1_rotated.y);
    ctx.lineTo(p2_rotated.x, p2_rotated.y);
    ctx.stroke();
    ctx.closePath();
  }
};

const drawPointer = (ctx: CanvasRenderingContext2D, rotation_deg: number) => {
  ctx.save();
  const width = WIDTH / 2;
  const height = HEIHGT / 2;

  //Offsets
  const w_0 = 0.08;
  const w_1 = 0.005;
  const w_2 = 0.018;
  const w_3 = 0.1;

  const h_0 = 0.18;
  const h_1 = 0.14;
  const h_2 = -0.055;
  const h_3 = 0.21;

  const pointer_height_offset = height * 0.292;

  const base_rataion = 180;

  const roration_degrees = base_rataion + rotation_deg;

  rotateObject(ctx, new Vector2(width, height), roration_degrees);

  ctx.fillStyle = "#900a29";
  ctx.strokeStyle = "#a59999";
  ctx.lineWidth = width * 0.03;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(width, 0 + pointer_height_offset);
  ctx.lineTo(width + width * w_0, height * h_0 + pointer_height_offset);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(width + width * w_0, height * h_0 + pointer_height_offset);
  ctx.lineTo(width + width * w_1, height * h_1 + pointer_height_offset);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(width + width * w_1, height * h_1 + pointer_height_offset);
  ctx.lineTo(width + width * w_2, height - height * h_2);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(width + width * w_2, height - height * h_2);
  ctx.lineTo(width + width * w_3, height + height * h_3);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(width + width * w_3, height + height * h_3);
  ctx.lineTo(width - width * w_3, height + height * h_3);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(width - width * w_3, height + height * h_3);
  ctx.lineTo(width - width * w_2, height - height * h_2);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(width - width * w_2, height - height * h_2);
  ctx.lineTo(width - width * w_1, height * h_1 + pointer_height_offset);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(width - width * w_1, height * h_1 + pointer_height_offset);
  ctx.lineTo(width - width * w_0, height * h_0 + pointer_height_offset);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(width - width * w_0, height * h_0 + pointer_height_offset);
  ctx.lineTo(width, 0 + pointer_height_offset);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(width, 0 + pointer_height_offset);

  ctx.lineTo(width + width * w_0, height * h_0 + pointer_height_offset);
  ctx.lineTo(width + width * w_1, height * h_1 + pointer_height_offset);
  ctx.lineTo(width + width * w_2, height - height * h_2);
  ctx.lineTo(width + width * w_3, height + height * h_3);

  ctx.lineTo(width - width * w_3, height + height * h_3);
  ctx.lineTo(width - width * w_2, height - height * h_2);
  ctx.lineTo(width - width * w_1, height * h_1 + pointer_height_offset);
  ctx.lineTo(width - width * w_0, height * h_0 + pointer_height_offset);
  ctx.lineTo(width, 0 + pointer_height_offset);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#726d6d";
  ctx.arc(width, height, width * 0.04, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  ctx.restore();
};

const calculatePointerRotation = (
  val: number,
  val_min: number,
  val_max: number
) => {
  const max_rotation = MAX_ROTATION;
  const rotation_align_adjustment = (360 - max_rotation) / 2;

  const val_in_ranges = Math.min(Math.max(val, val_min), val_max);
  const in_percentage = (val_in_ranges - val_min) / (val_max - val_min);
  const in_degrees = in_percentage * max_rotation + rotation_align_adjustment;

  return in_degrees;
};

const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.font = FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#a328d9";

  ctx.save();

  ctx.fillStyle = "red";
  ctx.strokeStyle = "red";

  ctx.restore();

  const min_val = 0;
  const max_val = 100;
  const value = 45;

  drawBackground(ctx);

  drawTicks(ctx, min_val, max_val);

  // ctx.beginPath();

  // ctx.arc(WIDTH / 2, HEIHGT / 2, 6, 0, 2 * Math.PI);
  // ctx.stroke();
  // ctx.closePath();

  const pointer_rotation = calculatePointerRotation(value, min_val, max_val);
  drawPointer(ctx, pointer_rotation);

  drawScaleLabels(ctx, min_val, max_val);
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
