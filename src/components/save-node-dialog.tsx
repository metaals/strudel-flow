import { useState } from 'react';
import { Save } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useSavedNodesStore,
  type SavedNodeKind,
} from '@/store/saved-nodes-store';
import { iconMapping } from '@/data/icon-mapping';
import { isCustomInstrumentEffect } from '@/lib/custom-instrument';

interface SaveNodeDialogProps {
  code: string;
  children: React.ReactNode;
}

export function SaveNodeDialog({ code, children }: SaveNodeDialogProps) {
  const add = useSavedNodesStore((s) => s.add);
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState('');
  const [kind, setKind] = useState<SavedNodeKind>(
    isCustomInstrumentEffect(code) ? 'effect' : 'instrument'
  );

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setKind(isCustomInstrumentEffect(code) ? 'effect' : 'instrument');
    }
    setIsOpen(open);
  };

  const handleSave = () => {
    if (!label.trim()) return;
    const iconKey =
      icon.trim() && icon.trim() in iconMapping
        ? (icon.trim() as keyof typeof iconMapping)
        : undefined;
    add({ label: label.trim(), icon: iconKey, code, kind });
    setIsOpen(false);
    setLabel('');
    setIcon('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Node</DialogTitle>
          <DialogDescription>
            Give your node a label so you can reuse it later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="node-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="My Node"
          />
          <Input
            id="node-icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Icon (optional, e.g. Music)"
          />
          <Select
            value={kind}
            onValueChange={(v) => setKind(v as SavedNodeKind)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instrument">Instrument</SelectItem>
              <SelectItem value="effect">Effect</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!label.trim()}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
