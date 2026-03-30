
import { OutlineNode } from '../types';

export const formatTitle = (index: number, level: number): string => {
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  if (level === 0) return roman[index] || (index + 1).toString();
  return `${index + 1}.`;
};

export const getAllLeafNodes = (nodes: OutlineNode[]): OutlineNode[] => {
  let leaves: OutlineNode[] = [];
  nodes.forEach(node => {
    if (!node.children || node.children.length === 0) {
      leaves.push(node);
    } else {
      leaves = [...leaves, ...getAllLeafNodes(node.children)];
    }
  });
  return leaves;
};

export const flattenOutline = (nodes: OutlineNode[]): OutlineNode[] => {
  let flat: OutlineNode[] = [];
  nodes.forEach(node => {
    flat.push(node);
    if (node.children) {
      flat = [...flat, ...flattenOutline(node.children)];
    }
  });
  return flat;
};
