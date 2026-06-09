import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface PresetOption<T = string> {
  id: string;
  label: string;
  value: T;
  sublabel?: string;
}

export interface PresetGridProps<T> {
  options: PresetOption<T>[];
  value: T;
  onChange: (v: T, id: string) => void;
  columns?: number;
  className?: string;
}

export function PresetGrid<T extends string | number>({ options, value, onChange, columns = 3, className }: PresetGridProps<T>) {
  return (
    <div className={cn('grid gap-2', className)} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {options.map((opt) => (
        <Button
          key={opt.id}
          variant={value === opt.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(opt.value, opt.id)}
          className="h-auto py-2 flex flex-col"
        >
          <span className="font-medium">{opt.label}</span>
          {opt.sublabel && <span className="text-xs opacity-70">{opt.sublabel}</span>}
        </Button>
      ))}
    </div>
  );
}