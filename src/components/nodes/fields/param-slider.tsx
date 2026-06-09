import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface ParamSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  formatValue?: (v: number) => string;
  unit?: string;
  className?: string;
  showMinMax?: boolean;
}

export function ParamSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  formatValue,
  unit,
  className,
  showMinMax = true,
}: ParamSliderProps) {
  const display = formatValue ? formatValue(value) : unit ? `${value}${unit}` : String(value);
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground">{display}</span>
      </div>
      <Slider value={[value]} onValueChange={(v) => onChange(v[0])} min={min} max={max} step={step} className="w-full" />
      {showMinMax && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}