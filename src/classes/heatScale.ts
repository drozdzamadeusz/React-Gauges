import { Vec2, Math2 } from '../libs';

interface TOptions {
  // Min and max ring radius in pixels
  radius_min: number;
  radius_max: number;

  // Min and max angle in degrees
  angle_min: number;
  angle_max: number;

  // Rotation offset in degrees (start rotation)
  rot_ofst: number;

  // HSL color parameters
  hue_min: number;
  hue_max: number;
  hue_invert: boolean;
  saturation: number;
  lightness: number;
}

class HeatScale {
  ctx: CanvasRenderingContext2D;
  center: Vec2;
  options: TOptions;

  private defaultOptions: TOptions = {
    radius_min: 80,
    radius_max: 100,
    angle_min: 0,
    angle_max: 360,
    rot_ofst: 180,
    hue_min: 0,
    hue_max: 360,
    hue_invert: false,
    saturation: 100,
    lightness: 50
  };

  constructor(ctx: CanvasRenderingContext2D, center: Vec2, options?: Partial<TOptions>) {
    this.ctx = ctx;
    this.center = center;
    this.options = { ...this.defaultOptions, ...options };
  }

  private get_hls_color = (hue_factor: number) => {
    const { hue_min, hue_max, hue_invert, saturation, lightness } = this.options;
    const hue_scale = hue_max - hue_min;
    const hue = (hue_invert ? 1 - hue_factor : hue_factor) * hue_scale + hue_min;
    return `hsl(${hue},${saturation}%,${lightness}%)`;
  };

  draw = (val: number, val_min: number, val_max: number) => {
    const { center, ctx, get_hls_color: hlsColor, options } = this;
    const { radius_min, radius_max, angle_min, angle_max, rot_ofst } = options;

    const val_clamped = Math2.clamp(val, val_min, val_max);
    const val_factor = (val_clamped - val_min) / (val_max - val_min);

    const curr_angle = val_factor * angle_max;

    const p_start = Math2.apply_rotation(center, new Vec2(50, 0), rot_ofst);
    // Hack: Subtracting 0.00001 ensures that the correct color will be drawn in 360 degrees.
    const p_end = Math2.apply_rotation(center, new Vec2(50, 0), curr_angle + rot_ofst - 0.00001);

    let p_mid;
    let angle_start_to_mid;
    if (angle_max - angle_min > 180) {
      p_mid = Math2.apply_rotation(
        center,
        new Vec2(50, 0),
        rot_ofst + (curr_angle - angle_min) / 2
      );
      angle_start_to_mid = Math2.angle_diff(center, p_start, p_mid);
    }

    let num_points_in_ring = 0;

    const render_cube = new Vec2(center.x + radius_max, center.y + radius_max);
    const curr_pixel = new Vec2(0, 0);

    for (let y = center.y - radius_max; y < render_cube.y; y++) {
      for (let x = center.y - radius_max; x < render_cube.x; x++) {
        if (
          Math2.is_inside_ring_pie(
            x,
            y,
            center,
            radius_min,
            radius_max,
            angle_min,
            curr_angle,
            rot_ofst
          )
        ) {
          curr_pixel.set(x, y);
          num_points_in_ring++;

          let angle_to_start = Math2.angle_diff(center, p_start, curr_pixel);

          if (p_mid && angle_start_to_mid) {
            if (angle_to_start > Math2.angle_diff(center, p_end, curr_pixel)) {
              angle_to_start = angle_start_to_mid + Math2.angle_diff(center, p_mid, curr_pixel);
            }
          }

          let hue_factor = angle_to_start / angle_max;
          ctx.fillStyle = hlsColor(hue_factor);
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    console.log(num_points_in_ring);
  };
}

export default HeatScale;
