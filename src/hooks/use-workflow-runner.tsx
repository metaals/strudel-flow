import { useEffect, useCallback, useMemo } from 'react';
import { useStrudelStore } from '@/store/strudel-store';
import { useAppStore } from '@/store/app-store';
import { strudelEngine } from '@/lib/strudel-engine';
import { useErrorStore } from '@/store/error-store';
import { toast } from 'sonner';

export function useWorkflowRunner() {
  const pattern = useStrudelStore((s) => s.pattern);
  const setPattern = useStrudelStore((s) => s.setPattern);
  const cpm = useStrudelStore((s) => s.cpm);
  const bpc = useStrudelStore((s) => s.bpc);

  const nodes = useAppStore((s) => s.nodes);
  const edges = useAppStore((s) => s.edges);
  const nodesVersion = useAppStore((s) => s.nodesVersion);
  const pushError = useErrorStore((s) => s.pushError);
  const clearErrors = useErrorStore((s) => s.clearErrors);

  const generated = useMemo(
    () => strudelEngine.generate(nodes, edges, cpm, bpc),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodesVersion, edges, cpm, bpc]
  );

  useEffect(() => {
    setPattern(generated.pattern);
  }, [generated.pattern, setPattern]);

  useEffect(() => {
    if (generated.errors.length > 0) {
      clearErrors();
      generated.errors.forEach((e) => {
        pushError(e);
        toast.error(`Node ${e.type} error: ${e.message}`);
      });
    }
  }, [generated.errors, pushError, clearErrors]);

  useEffect(() => {
    if (!pattern?.trim()) {
      strudelEngine.stop();
      return;
    }
    strudelEngine.debouncedEvaluate(pattern);
  }, [pattern]);

  const forceEvaluate = useCallback(() => {
    const { nodes: currentNodes, edges: currentEdges } = useAppStore.getState();
    const { cpm: currentCpm, bpc: currentBpc } = useStrudelStore.getState();
    strudelEngine.forceEvaluate(currentNodes, currentEdges, currentCpm, currentBpc);
  }, []);

  return {
    runWorkflow: () => strudelEngine.debouncedEvaluate(pattern),
    forceEvaluate,
    stopWorkflow: () => strudelEngine.stop(),
    isRunning: () => strudelEngine.getState().isRunning,
  };
}

export function useWorkflowRunnerDebug() {
  return strudelEngine.getState();
}