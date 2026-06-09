import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategorySelectItems } from '@/components/category-select-items';
import type { SoundCategory } from '@/data/sounds';

export interface SoundSelectProps {
  value: string;
  onChange: (v: string) => void;
  categories: SoundCategory[];
  placeholder?: string;
  label?: string;
}

export function SoundSelect({ value, onChange, categories, placeholder = 'Select sound', label }: SoundSelectProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <CategorySelectItems categories={categories} />
        </SelectContent>
      </Select>
    </div>
  );
}