import { useStrudelStore } from '@/store/strudel-store';
import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { setMasterVolume } from '@/lib/strudel-engine';

export function CPM() {
  const { cpm, bpc, masterVolume, setCpm, setBpc, setMasterVolume: setMasterVolumeStore } = useStrudelStore(
    useShallow((s) => ({
      cpm: s.cpm,
      bpc: s.bpc,
      masterVolume: s.masterVolume,
      setCpm: s.setCpm,
      setBpc: s.setBpc,
      setMasterVolume: s.setMasterVolume,
    }))
  );

  const bpm = parseInt(cpm) || 120;
  const beatsPerCycle = parseInt(bpc) || 4;

  useEffect(() => {
    setMasterVolume(masterVolume / 100);
  }, [masterVolume]);

  return (
    <div className="flex flex-col gap-4 p-6 bg-card rounded-lg border min-w-48">
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-base font-medium text-card-foreground">
            BPM: {bpm}
          </label>
          <Slider
            value={[bpm]}
            onValueChange={([v]) => setCpm(v.toString())}
            min={1}
            max={200}
            step={1}
            className="w-full pt-2"
          />
        </div>

        <div>
          <label className="text-base font-medium text-card-foreground pb-2">
            BPC: {beatsPerCycle}
          </label>
          <Slider
            value={[beatsPerCycle]}
            onValueChange={([v]) => setBpc(v.toString())}
            min={1}
            max={10}
            step={1}
            className="w-full pt-2"
          />
        </div>

        <div>
          <label className="text-base font-medium text-card-foreground pb-2">
            Volume: {masterVolume}%
          </label>
          <Slider
            value={[masterVolume]}
            onValueChange={([v]) => setMasterVolumeStore(v)}
            min={0}
            max={100}
            step={1}
            className="w-full pt-2"
          />
        </div>
      </div>
    </div>
  );
}