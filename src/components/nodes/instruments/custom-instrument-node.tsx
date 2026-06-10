import { useMemo } from 'react';

import WorkflowNode from '@/components/nodes/workflow-node';
import { WorkflowNodeProps } from '../types';
import { graphApi } from '@/lib/graph-api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ParamSlider } from '@/components/nodes/fields/param-slider';
import {
  parseCustomInstrument,
  type CustomParam,
  type CustomParamValue,
} from '@/lib/custom-instrument';
import { SaveNodeDialog } from '@/components/save-node-dialog';

const STARTER_CODE = 'sound("bd sd hh sd")';

function ParamControl({
  param,
  value,
  onChange,
}: {
  param: CustomParam;
  value: CustomParamValue | undefined;
  onChange: (v: CustomParamValue) => void;
}) {
  const current = value ?? param.default;

  switch (param.control) {
    case 'dial':
      return (
        <ParamSlider
          label={param.name}
          value={Number(current)}
          onChange={onChange}
          min={param.min ?? 0}
          max={param.max ?? 1}
          step={param.step ?? 0.01}
        />
      );
    case 'stepper':
      return (
        <ParamSlider
          label={param.name}
          value={Number(current)}
          onChange={(v) => onChange(Math.round(v))}
          min={param.min ?? 0}
          max={param.max ?? 10}
          step={1}
        />
      );
    case 'dropdown':
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">{param.name}</label>
          <Select value={String(current)} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(param.options ?? []).map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case 'toggle':
      return (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{param.name}</label>
          <Switch checked={Boolean(current)} onCheckedChange={onChange} />
        </div>
      );
    case 'text':
    default:
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">{param.name}</label>
          <Input
            value={String(current)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
  }
}

export function CustomInstrumentNode({ id, data, type }: WorkflowNodeProps) {
  const code = data.code ?? STARTER_CODE;
  const { params } = useMemo(() => parseCustomInstrument(code), [code]);
  const values = data.paramValues ?? {};

  const setValue = (name: string, v: CustomParamValue) => {
    graphApi.setParam(id, 'paramValues', { ...values, [name]: v });
  };

  return (
    <WorkflowNode id={id} data={data} type={type}>
      <div className="flex flex-col gap-3 p-3 bg-card text-card-foreground rounded-md w-80">
        {params.length > 0 ? (
          <div className="flex flex-col gap-3">
            {params.map((param) => (
              <ParamControl
                key={param.name}
                param={param}
                value={values[param.name]}
                onChange={(v) => setValue(param.name, v)}
              />
            ))}
          </div>
        ) : (
          <div className="text-xs font-mono text-muted-foreground">
            No parameters. Declare <code>@param</code> lines above a{' '}
            <code>---</code> separator to add controls.
          </div>
        )}

        <Accordion type="single" collapsible>
          <AccordionItem value="code">
            <AccordionTrigger className="text-xs font-mono py-2">
              Edit code
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden">
              <div className="flex flex-col gap-3">
                <Textarea
                  value={code}
                  onChange={(e) => graphApi.setParam(id, 'code', e.target.value)}
                  placeholder={
                    '@param GAIN: dial(0..1) = 0.5\n---\nsound("bd sd").gain($GAIN)'
                  }
                  className="font-mono text-sm min-h-32 resize-none border rounded-md px-3 py-2 bg-transparent border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                  spellCheck={false}
                />
                <div className="flex flex-col gap-2 text-xs font-mono text-muted-foreground">
                  <div className="font-semibold text-foreground">
                    Param syntax:
                  </div>
                  <div>
                    • <code>@param NAME: dial(0..1) = 0.5</code>
                  </div>
                  <div>
                    • <code>@param NAME: stepper(1..8) = 2</code>
                  </div>
                  <div>
                    • <code>@param NAME: dropdown(bd, sd, hh) = bd</code>
                  </div>
                  <div>
                    • <code>@param NAME: toggle = true</code>
                  </div>
                  <div>
                    • <code>@param NAME: text = hello</code>
                  </div>
                  <div className="mt-1">
                    Reference params in the body with <code>$NAME</code>. A body
                    starting with <code>.</code> appends to the incoming chain.
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <SaveNodeDialog code={code}>
          <Button variant="outline" size="sm" className="w-full">
            Save as Node
          </Button>
        </SaveNodeDialog>
      </div>
    </WorkflowNode>
  );
}

export const customInstrumentNodeDef = {
  type: 'custom-instrument-node' as const,
  component: CustomInstrumentNode,
  config: {
    title: 'Custom Code',
    category: 'Instruments' as const,
    icon: 'Code' as const,
  },
};
