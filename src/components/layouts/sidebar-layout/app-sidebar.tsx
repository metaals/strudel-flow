import {
  useState,
  useCallback,
  ComponentProps,
  useRef,
  ChangeEvent,
} from 'react';
import { Command, GripVertical, Plus, Save, Upload, X } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { SettingsDialog } from '@/components/settings-dialog';
import { SaveProjectDialog } from '@/components/save-project-dialog';
import {
  nodesConfig,
  AppNode,
  type AppNodeType,
  createNodeByType,
} from '@/components/nodes';
import { type NodeConfigEntry } from '@/components/nodes/registry';
import { cn } from '@/lib/utils';
import { graphApi } from '@/lib/graph-api';
import { iconMapping } from '@/data/icon-mapping';
import { useAppStore } from '@/store/app-store';
import { useShallow } from 'zustand/react/shallow';
import { downloadState, stateFromJson } from '@/lib/project-state';
import { useStrudelStore } from '@/store/strudel-store';
import {
  useSavedNodesStore,
  type SavedNode,
} from '@/store/saved-nodes-store';
import { NODE_DEFAULTS } from '@/components/nodes/data';
import type { WorkflowNodeData } from '@/components/nodes/types';

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    nodes,
    edges,
    theme,
    colorMode,
    setNodes,
    setEdges,
    setTheme,
    setColorMode,
  } = useAppStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      theme: state.theme,
      colorMode: state.colorMode,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
      setTheme: state.setTheme,
      setColorMode: state.setColorMode,
    }))
  );
  const { cpm, bpc, setCpm, setBpc } = useStrudelStore(
    useShallow((state) => ({
      cpm: state.cpm,
      bpc: state.bpc,
      setCpm: state.setCpm,
      setBpc: state.setBpc,
    }))
  );

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveFilename, setSaveFilename] = useState('strudel-flow-project.json');

  const handleSave = () => {
    downloadState({ nodes, edges, theme, colorMode, cpm, bpc }, saveFilename);
    setIsSaveDialogOpen(false);
  };

  const handleLoad = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const state = stateFromJson(content);
        if (state) {
          const nodes = (state.nodes as AppNode[]).map((node) => ({
            ...node,
            data: {
              ...node.data,
              state: 'paused' as const,
            },
          }));
          setNodes(nodes);
          setEdges(state.edges);
          setTheme(state.theme);
          setColorMode(state.colorMode);
          setCpm(state.cpm);
          if (state.bpc) {
            setBpc(state.bpc);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Group nodes by category
  const nodesByCategory = Object.values(nodesConfig).reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, NodeConfigEntry[]>);

  const savedNodes = useSavedNodesStore((s) => s.savedNodes);
  const removeSavedNode = useSavedNodesStore((s) => s.remove);
  const savedInstruments = savedNodes.filter((n) => n.kind === 'instrument');
  const savedEffects = savedNodes.filter((n) => n.kind === 'effect');

  const renderSavedItem = (saved: SavedNode) => (
    <DraggableItem
      key={saved.id}
      id={'custom-instrument-node'}
      title={saved.label}
      category={saved.kind === 'effect' ? 'Audio Effects' : 'Instruments'}
      icon={saved.icon ?? 'Code'}
      dragData={{
        ...NODE_DEFAULTS['custom-instrument-node'],
        code: saved.code,
        templateId: saved.id,
        title: saved.label,
        icon: saved.icon ?? 'Code',
        paramValues: {},
        role: saved.kind,
        state: 'running',
      }}
      onRemove={() => removeSavedNode(saved.id)}
    />
  );

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="py-0">
        <div className="flex gap-2 px-1 h-14 items-center ">
          <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Command className="size-3" />
          </div>
          <span className="truncate font-semibold">Strudel Flow</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(nodesByCategory).map(([category, nodes]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground capitalize">
              {category}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nodes.map((item) => (
                  <DraggableItem key={item.title} {...item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {savedInstruments.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground capitalize">
              My Instruments
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {savedInstruments.map(renderSavedItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {savedEffects.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground capitalize">
              My Effects
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{savedEffects.map(renderSavedItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SaveProjectDialog
                  isOpen={isSaveDialogOpen}
                  onOpenChange={setIsSaveDialogOpen}
                  filename={saveFilename}
                  onFilenameChange={setSaveFilename}
                  onSave={handleSave}
                >
                  <SidebarMenuButton className="bg-card cursor-pointer">
                    <Save />
                    <span>Save</span>
                  </SidebarMenuButton>
                </SaveProjectDialog>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={triggerFileInput}
                  className="bg-card cursor-pointer"
                >
                  <Upload />
                  <span>Load</span>
                </SidebarMenuButton>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLoad}
                  className="hidden"
                  accept=".json"
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <SettingsDialog />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function DraggableItem(
  props: NodeConfigEntry & {
    dragData?: WorkflowNodeData;
    onRemove?: () => void;
  }
) {
  const { dragData, onRemove, ...nodeProps } = props;
  const { screenToFlowPosition } = useReactFlow();
  const [isDragging, setIsDragging] = useState(false);

  const onClick = useCallback(() => {
    const newNode: AppNode = createNodeByType({
      type: nodeProps.id as AppNodeType,
      position: screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }),
      data: dragData,
    });

    graphApi.addNode(newNode);
  }, [nodeProps, dragData, screenToFlowPosition]);

  const onDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData(
        'application/reactflow',
        JSON.stringify({ ...nodeProps, data: dragData })
      );
      setIsDragging(true);
    },
    [nodeProps, dragData]
  );

  const lastDragPos = useRef({ x: 0, y: 0 });

  function onDrag(e: React.DragEvent) {
    const lastPos = lastDragPos.current;
    if (lastPos.x === e.clientX && lastPos.y === e.clientY) {
      return;
    }
    lastDragPos.current = { x: e.clientX, y: e.clientY };
  }

  function onDragEnd() {
    setIsDragging(false);
  }

  const IconComponent = nodeProps?.icon ? iconMapping[nodeProps.icon] : undefined;

  return (
    <SidebarMenuItem
      className={cn(
        'relative border-2 active:scale-[.99] rounded-md',
        isDragging ? 'border-green-500' : 'border'
      )}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onClick={onClick}
      draggable
      key={nodeProps.title}
    >
      {isDragging && (
        <span
          role="presentation"
          className="absolute -top-3 -right-3 rounded-md border-2 border-green-500 bg-card"
        >
          <Plus className="size-4" />
        </span>
      )}
      <SidebarMenuButton className="bg-card cursor-grab active:cursor-grabbing">
        {IconComponent ? <IconComponent aria-label={nodeProps?.icon} /> : null}
        <span>{nodeProps.title}</span>
        {onRemove ? (
          <button
            type="button"
            aria-label="Remove instrument"
            className="ml-auto rounded-sm p-0.5 hover:bg-accent"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="size-4" />
          </button>
        ) : (
          <GripVertical className="ml-auto" />
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
