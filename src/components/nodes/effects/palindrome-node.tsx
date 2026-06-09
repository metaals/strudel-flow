import WorkflowNode from '@/components/nodes/workflow-node';
import { WorkflowNodeProps, AppNode } from '../types';

export function PalindromeNode({ id, data }: WorkflowNodeProps) {
  return <WorkflowNode id={id} data={data}></WorkflowNode>;
}

PalindromeNode.strudelOutput = (_: AppNode, strudelString: string) => {
  const palindromeCall = `palindrome()`;
  return strudelString ? `${strudelString}.${palindromeCall}` : palindromeCall;
};

export const palindromeNodeDef = {
  type: 'palindrome-node' as const,
  component: PalindromeNode,
  config: { title: 'Palindrome', category: 'Time Effects' as const, icon: 'CheckCheck' as const },
};
