import type { AppNode } from '@/components/nodes/types';
import { chainEffect } from './utils';

export function gainOutput(node: AppNode, strudelString: string): string {
  const gain = (node.data as any).gain ? parseFloat((node.data as any).gain) : 1;
  return chainEffect(node, strudelString, `gain(${gain})`, gain === 1);
}
export function lpfOutput(node: AppNode, strudelString: string): string {
  const lpf = (node.data as any).lpf ? parseFloat((node.data as any).lpf) : 20000;
  return chainEffect(node, strudelString, `lpf(${lpf})`, lpf === 20000);
}
export function distortOutput(node: AppNode, strudelString: string): string {
  const distort = (node.data as any).distort ? parseFloat((node.data as any).distort) : 0;
  return chainEffect(node, strudelString, `distort(${distort})`, distort === 0);
}
export function panOutput(node: AppNode, strudelString: string): string {
  const pan = (node.data as any).pan ? parseFloat((node.data as any).pan) : 0.5;
  return chainEffect(node, strudelString, `pan(${pan})`, pan === 0.5);
}
export function fastOutput(node: AppNode, strudelString: string): string {
  const fast = (node.data as any).fast ? parseFloat((node.data as any).fast) : 1;
  return chainEffect(node, strudelString, `fast(${fast})`, fast === 1);
}
export function slowOutput(node: AppNode, strudelString: string): string {
  const slow = (node.data as any).slow ? parseFloat((node.data as any).slow) : 1;
  return chainEffect(node, strudelString, `slow(${slow})`, slow === 1);
}
export function crushOutput(node: AppNode, strudelString: string): string {
  const crush = (node.data as any).crush ? parseFloat((node.data as any).crush) : 0;
  return chainEffect(node, strudelString, `crush(${crush})`, crush === 0);
}
export function postgainOutput(node: AppNode, strudelString: string): string {
  const postgain = (node.data as any).postgain ? parseFloat((node.data as any).postgain) : 1;
  return chainEffect(node, strudelString, `postgain(${postgain})`, postgain === 1);
}
export function fmOutput(node: AppNode, strudelString: string): string {
  const fm = (node.data as any).fm ? parseFloat((node.data as any).fm) : 0;
  return chainEffect(node, strudelString, `fm(${fm})`, fm === 0);
}
export function juxOutput(node: AppNode, strudelString: string): string {
  const jux = (node.data as any).jux ? parseFloat((node.data as any).jux) : 0;
  return chainEffect(node, strudelString, `jux(${jux})`, jux === 0);
}
export function revOutput(_node: AppNode, strudelString: string): string {
  return strudelString ? `${strudelString}.rev()` : 'rev()';
}
export function palindromeOutput(_node: AppNode, strudelString: string): string {
  return strudelString ? `${strudelString}.palindrome()` : 'palindrome()';
}
export function phaserOutput(node: AppNode, strudelString: string): string {
  const phaser = (node.data as any).phaser ? parseFloat((node.data as any).phaser) : 0;
  const depth = (node.data as any).phaserdepth ? parseFloat((node.data as any).phaserdepth) : 0.5;
  if (phaser === 0) return strudelString;
  const call = `phaser(${phaser}).phaserdepth(${depth})`;
  return strudelString ? `${strudelString}.${call}` : call;
}
export function roomOutput(node: AppNode, strudelString: string): string {
  const room = (node.data as any).room ? parseFloat((node.data as any).room) : 0;
  if (room === 0) return strudelString;
  const size = (node.data as any).roomsize ? parseFloat((node.data as any).roomsize) : 0.5;
  const fade = (node.data as any).roomfade ? parseFloat((node.data as any).roomfade) : 0.5;
  const lp = (node.data as any).roomlp ? parseFloat((node.data as any).roomlp) : 20000;
  const dim = (node.data as any).roomdim ? parseFloat((node.data as any).roomdim) : 0.5;
  const effects = [`room(${room})`, `roomsize(${size})`, `roomfade(${fade})`, `roomlp(${lp})`, `roomdim(${dim})`];
  const call = effects.join('.');
  return strudelString ? `${strudelString}.${call}` : call;
}
export function adsrOutput(node: AppNode, strudelString: string): string {
  const attack = parseFloat((node.data as any).attack || '0.01');
  const decay = parseFloat((node.data as any).decay || '0.1');
  const sustain = parseFloat((node.data as any).sustain || '0.8');
  const release = parseFloat((node.data as any).release || '0.1');
  if (attack === 0.01 && decay === 0.1 && sustain === 0.8 && release === 0.1) return strudelString;
  const call = `attack(${attack}).decay(${decay}).sustain(${sustain}).release(${release})`;
  return strudelString ? `${strudelString}.${call}` : call;
}
export function maskOutput(node: AppNode, strudelString: string): string {
  const pattern = (node.data as any).maskPattern || 'x';
  const prob = (node.data as any).maskProbability || '0.5';
  const call = `mask("${pattern}").sometimes(${prob})`;
  return strudelString ? `${strudelString}.${call}` : call;
}
export function plyOutput(node: AppNode, strudelString: string): string {
  const mult = (node.data as any).plyMultiplier || '2';
  const prob = (node.data as any).plyProbability || '1';
  const call = prob === '1' ? `ply(${mult})` : `ply(${mult}).sometimes(${prob})`;
  return strudelString ? `${strudelString}.${call}` : call;
}
export function lateOutput(node: AppNode, strudelString: string): string {
  const offset = (node.data as any).lateOffset || '0.1';
  const pattern = (node.data as any).latePattern || 'x';
  const call = `late(${offset}, "${pattern}")`;
  return strudelString ? `${strudelString}.${call}` : call;
}