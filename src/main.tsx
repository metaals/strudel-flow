import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from '@xyflow/react';
import { initStrudel, samples } from '@strudel/web';
import { setSchedulerNow } from '@/lib/strudel-clock';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/sonner';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import Workflow from '@/components/workflow';

import './index.css';

initStrudel().then((repl) => {
  setSchedulerNow(() => repl.scheduler.now());
});
samples('github:tidalcycles/dirt-samples');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ReactFlowProvider>
        <SidebarLayout>
          <Workflow />
        </SidebarLayout>
      </ReactFlowProvider>
    </ErrorBoundary>
    <Toaster />
  </React.StrictMode>
);
