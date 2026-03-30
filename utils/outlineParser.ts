
import { OutlineNode } from '../types';

/**
 * Phân tích chuỗi văn bản đề cương thành cấu trúc cây OutlineNode.
 * Hỗ trợ nhận diện:
 * - Cấp 1: Bắt đầu bằng chữ số La Mã (I. II. III. ...)
 * - Cấp 2: Bắt đầu bằng chữ số tự nhiên (1. 2. 3. ...)
 */
export function parseTemplateToTree(text: string, targetWordCount: number = 2000): OutlineNode[] {
  if (!text) return [];

  // Lọc bỏ các dòng trống và trim nội dung từng dòng
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== "");

  const rootNodes: OutlineNode[] = [];
  let currentParent: OutlineNode | null = null;

  lines.forEach((line) => {
    // Regex nhận diện cấp 1 (La Mã): I. Đặt vấn đề, II. Giải quyết...
    const level1Match = line.match(/^([IVXLCDM]+)\.\s*(.*)/i);
    
    if (level1Match) {
      const romanId = level1Match[1].toUpperCase();
      const title = level1Match[2].trim();
      
      const newNode: OutlineNode = {
        id: `node-${romanId}-${Math.random().toString(36).substr(2, 5)}`,
        title: title,
        targetWordCount: Math.floor(targetWordCount / 3), // Chia đều cho 3 phần lớn
        actualWordCount: 0,
        content: "",
        status: "PENDING",
        userGuidance: "",
        children: []
      };
      
      rootNodes.push(newNode);
      currentParent = newNode;
      return;
    }

    // Regex nhận diện cấp 2 (Số tự nhiên): 1. Thực trạng, 2. Giải pháp...
    const level2Match = line.match(/^(\d+)\.\s*(.*)/);
    
    if (level2Match && currentParent) {
      const numId = level2Match[1];
      const title = level2Match[2].trim();
      
      const newNode: OutlineNode = {
        id: `node-${currentParent.id}-${numId}-${Math.random().toString(36).substr(2, 5)}`,
        title: title,
        targetWordCount: 400,
        actualWordCount: 0,
        content: "",
        status: "PENDING",
        userGuidance: "",
        children: []
      };
      
      if (!currentParent.children) currentParent.children = [];
      currentParent.children.push(newNode);
      return;
    }
  });

  return rootNodes;
}
