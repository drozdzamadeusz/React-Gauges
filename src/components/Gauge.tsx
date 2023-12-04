import React, { useEffect, useRef } from "react";
import "./Gauge.css";
import Vector2 from "./../libs/Vector2";

const HEIHGT = 800;
const WIDTH = HEIHGT;
const LETTER_HEIGHT = 50;


const MAX_ROTATION = 300;
const ROTARTION_ADJUSTMENT = (360 - MAX_ROTATION) / 2;

const MAX_NUM_LABELS = 10;
const TICKS_LABELS_MULT = 3;
const MAX_NUM_TICKS = TICKS_LABELS_MULT * MAX_NUM_LABELS;


const rotateObjectOnCicle = (
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

const drawScaleLabels = (
  ctx: CanvasRenderingContext2D,
  val_min: number,
  val_max: number
) => {
  const center = new Vector2(WIDTH / 2, HEIHGT / 2);
  const lett_pos = new Vector2(0, center.y - center.y * 0.07);

  const num_labels = Math.min(MAX_NUM_LABELS, val_max - val_min);

  const lett_height = LETTER_HEIGHT;

  ctx.beginPath();

  for (let i = 0; i <= num_labels; i++) {
    const percentage = i / num_labels;
    const rotation = percentage * MAX_ROTATION + ROTARTION_ADJUSTMENT;
    const angle_radians = (rotation * Math.PI) / 180;

    const lett_rotated = rotateObjectOnCicle(center, lett_pos, rotation);

    ctx.save();

    ctx.translate(lett_rotated.x, lett_rotated.y);
    ctx.rotate(angle_radians - Math.PI);

    ctx.textAlign = "center";

    const label = Math.round(percentage * (val_max - val_min) + val_min);
    ctx.fillText(String(label), 0, lett_height /2);

    ctx.restore();
  }

  ctx.closePath();
};

const drawBackground = (ctx: CanvasRenderingContext2D) => {
  ctx.save();

  const start_x = WIDTH / 2;
  const start_y = HEIHGT / 2;
  const end_x = WIDTH / 2;
  const end_y = HEIHGT;

  //Calculate differences
  const dx = end_x - start_x;
  const dy = end_y - start_y;

  ctx.strokeStyle = "#2e0808";
  ctx.beginPath();

  ctx.lineWidth = 1;

  for (let j = 0; j <= 318; j++) {
    // Angle in degrees and radians
    const angle_degrees = j + ROTARTION_ADJUSTMENT - 9;
    const angle_radians = (angle_degrees * Math.PI) / 180;

    // Apply rotation
    const new_dx = dx * Math.cos(angle_radians) - dy * Math.sin(angle_radians);
    const new_dy = dx * Math.sin(angle_radians) + dy * Math.cos(angle_radians);

    const new_end_x = start_x + new_dx;
    const new_end_y = start_y + new_dy;

    ctx.moveTo(start_x, start_y);
    ctx.lineTo(new_end_x, new_end_y);
  }
  ctx.stroke();

  ctx.restore();
};

const drawTicks = (
  ctx: CanvasRenderingContext2D,
  val_min: number,
  val_max: number
) => {
  const center = new Vector2(WIDTH / 2, HEIHGT / 2);

  const p1 = new Vector2(0, center.y - center.y * 0.31);
  const p2 = new Vector2(0, center.y - center.y * 0.21);

  const num_ticks = Math.min(
    MAX_NUM_TICKS,
    (val_max - val_min) * TICKS_LABELS_MULT
  );

  for (let i = 0; i <= num_ticks; i++) {
    if (i == 0 || i % TICKS_LABELS_MULT == 0) {
      p2.y = center.y - center.y * 0.2;
    } else {
      p2.y = center.y - center.y * 0.26;
    }

    const percentage = i / num_ticks;
    const rotation = percentage * MAX_ROTATION + ROTARTION_ADJUSTMENT;

    const p1_rotated = rotateObjectOnCicle(center, p1, rotation);
    const p2_rotated = rotateObjectOnCicle(center, p2, rotation);

    ctx.fillStyle = "#a328d9";
    ctx.strokeStyle = "#a328d9";

    ctx.beginPath();
    ctx.arc(p1_rotated.x, p1_rotated.y, 2, 0, 2 * Math.PI);
    ctx.arc(p2_rotated.x, p2_rotated.y, 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p1_rotated.x, p1_rotated.y);
    ctx.lineTo(p2_rotated.x, p2_rotated.y);
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
  }

  ctx.stroke();
};

const drawPointer = (ctx: CanvasRenderingContext2D, rotation_deg: number) => {
  ctx.save();
  const width = WIDTH / 2;
  const height = HEIHGT / 2;

  //Offsets
  const w_0 = 0.08;
  const w_1 = 0.004;
  const w_2 = 0.018;
  const w_3 = 0.09;

  const h_0 = 0.18;
  const h_1 = 0.15;
  const h_2 = 0;
  const h_3 = 0.24;

  const pointer_height_offset = height * 0.15;

  var rotation_center_point = { x: width, y: height };

  ctx.translate(rotation_center_point.x, rotation_center_point.y);

  const base_rataion = 180;

  const roration_degrees = base_rataion + rotation_deg;
  const rotatnio_radians = (roration_degrees * Math.PI) / 180;

  ctx.rotate(rotatnio_radians);

  ctx.translate(-rotation_center_point.x, -rotation_center_point.y);

  ctx.fillStyle = "#ff0000";
  ctx.strokeStyle = "#cb7272";
  ctx.lineWidth = 5;
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

  ctx.lineWidth = 1;
  ctx.lineCap = "round";

  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#949494";
  ctx.strokeStyle = "#c77d7d";
  ctx.lineWidth = 15;
  ctx.arc(width, height, 6, 0, 2 * Math.PI);
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

  const val_no_less_than_min = Math.max(val, val_min);
  const in_percentage = (val_no_less_than_min - val_min) / (val_max - val_min);
  const in_degrees = in_percentage * max_rotation + rotation_align_adjustment;

  return in_degrees;
};

const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.font = `bold ${LETTER_HEIGHT}px 'Courier New'`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#a328d9";

  ctx.save();

  ctx.fillStyle = "red";
  ctx.strokeStyle = "red";

  ctx.restore();

  const min_val = 10;
  const max_val = 100;

  drawBackground(ctx);

  drawTicks(ctx, min_val, max_val);

  ctx.beginPath();

  ctx.arc(WIDTH / 2, HEIHGT / 2, 6, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  const pointer_rotation = calculatePointerRotation(64, min_val, max_val);
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
