import { describe, it, expect, beforeEach, vi } from 'vitest';

// Fake WebAudio nodes/context. superdough/@strudel/web is never imported in tests
// (no real WebAudio in jsdom), so we mock @strudel/web with a fake context that
// exposes just what initAudioMaster touches: createGain(), a destination with
// maxChannelCount/channelCount, and connect() on gain nodes.

interface FakeGain {
  connect: ReturnType<typeof vi.fn>;
  maxChannelCount?: number;
}

let fakeCtx: {
  destination: { maxChannelCount: number; channelCount: number };
  createGain: ReturnType<typeof vi.fn>;
};
let createdGains: FakeGain[];

vi.mock('@strudel/web', () => ({
  // Unused by these tests but imported by the engine module.
  evaluate: vi.fn(),
  hush: vi.fn(),
  getAudioContext: () => fakeCtx,
}));

function makeFakeContext() {
  createdGains = [];
  fakeCtx = {
    destination: { maxChannelCount: 2, channelCount: 2 },
    createGain: vi.fn(() => {
      const gain: FakeGain = { connect: vi.fn() };
      createdGains.push(gain);
      return gain;
    }),
  };
}

async function freshEngine() {
  vi.resetModules();
  makeFakeContext();
  return import('../strudel-engine');
}

describe('audio master tap', () => {
  beforeEach(() => {
    makeFakeContext();
  });

  it('getAudioContext() returns the @strudel/web context', async () => {
    const { getAudioContext } = await freshEngine();
    expect(getAudioContext()).toBe(fakeCtx);
  });

  it('getMasterNode() returns a gain node connected to the original destination', async () => {
    const { getMasterNode } = await freshEngine();
    // Capture the real destination after the fresh context is built but before
    // init shadows it (init reads ctx.destination, then replaces it with master).
    const realDestination = fakeCtx.destination;
    const master = getMasterNode();
    expect(createdGains).toContain(master);
    expect((master as unknown as FakeGain).connect).toHaveBeenCalledWith(realDestination);
  });

  it('shadows ctx.destination so it resolves to the master node', async () => {
    const { getAudioContext, getMasterNode } = await freshEngine();
    const ctx = getAudioContext();
    expect(ctx.destination).toBe(getMasterNode());
  });

  it('mirrors maxChannelCount onto the master node', async () => {
    const { getMasterNode } = await freshEngine();
    expect((getMasterNode() as unknown as FakeGain).maxChannelCount).toBe(2);
  });

  it('is idempotent: repeated calls return the same nodes and create the gain once', async () => {
    const { initAudioMaster, getAudioContext, getMasterNode } = await freshEngine();
    const first = initAudioMaster();
    const second = initAudioMaster();
    expect(second.ctx).toBe(first.ctx);
    expect(second.master).toBe(first.master);
    expect(getAudioContext()).toBe(first.ctx);
    expect(getMasterNode()).toBe(first.master);
    expect(fakeCtx.createGain).toHaveBeenCalledTimes(1);
  });
});
