
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  BorderStyle, 
  WidthType, 
  AlignmentType, 
  HeadingLevel,
  Header,
  Footer,
  PageNumber,
  SectionType
} from "docx";
import saveAs from "file-saver";
import { OutlineNode, UserInfo } from "../types";

/**
 * Xử lý văn bản có chứa in đậm (**text**) thành mảng các TextRun
 */
const processBoldText = (text: string, fontSize: number, isHeading: boolean = false): TextRun[] => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map(part => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return new TextRun({
        text: part.slice(2, -2),
        bold: true,
        font: "Times New Roman",
        size: fontSize,
      });
    }
    return new TextRun({
      text: part,
      bold: isHeading,
      font: "Times New Roman",
      size: fontSize,
    });
  });
};

/**
 * Phân tích một khối text bảng (Markdown) thành docx Table
 */
const createWordTable = (tableLines: string[]) => {
  // Lọc bỏ dòng phân cách (ví dụ: |---|---|)
  const rows = tableLines.filter(line => !line.match(/^\|?\s*:?-+:?\s*\|/));
  
  const tableRows = rows.map((row, index) => {
    const cells = row.split('|')
      .filter((_, i, arr) => (i > 0 && i < arr.length - 1) || (arr.length > 1 && row.trim().startsWith('|') ? i > 0 : true))
      .map(c => c.trim())
      .filter(c => c !== "");

    // Nếu dòng bắt đầu/kết thúc bằng | thì cell đầu/cuối có thể bị trống do split, ta cần xử lý chính xác hơn
    const rawCells = row.split('|').map(c => c.trim());
    const finalCells = row.trim().startsWith('|') ? rawCells.slice(1, -1) : rawCells;

    return new TableRow({
      children: finalCells.map(cellText => new TableCell({
        children: [new Paragraph({
          children: processBoldText(cellText, 26), // Size 13pt
          alignment: AlignmentType.CENTER,
        })],
        shading: index === 0 ? { fill: "F2F2F2" } : undefined,
        verticalAlign: AlignmentType.CENTER,
      })),
    });
  });

  return new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 },
    },
  });
};

/**
 * Chuyển đổi nội dung Markdown (Paragraph, Bold, Table) thành mảng các phần tử docx
 */
const parseContentToDocx = (content: string): (Paragraph | Table)[] => {
  if (!content) return [];

  const elements: (Paragraph | Table)[] = [];
  const lines = content.split('\n');
  let currentTableLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Phát hiện bảng
    if (line.startsWith('|') || (line.includes('|') && lines[i+1]?.trim().startsWith('|---'))) {
      currentTableLines.push(lines[i]);
      continue;
    } 

    // Nếu đang có bảng mà gặp dòng không phải bảng -> kết thúc bảng
    if (currentTableLines.length > 0) {
      elements.push(createWordTable(currentTableLines));
      elements.push(new Paragraph({ text: "" })); // Khoảng cách sau bảng
      currentTableLines = [];
    }

    // Xử lý đoạn văn thường
    if (line.length > 0) {
      elements.push(new Paragraph({
        children: processBoldText(line, 26), // 13pt
        alignment: AlignmentType.JUSTIFIED,
        spacing: {
          line: 360, // 1.5 line spacing
          before: 120,
          after: 120,
        },
        indent: {
          firstLine: 708, // 1.25cm
        },
      }));
    }
  }

  // Xử lý bảng cuối cùng nếu còn
  if (currentTableLines.length > 0) {
    elements.push(createWordTable(currentTableLines));
  }

  return elements;
};

/**
 * Đệ quy xử lý các node trong dàn ý
 */
const processOutlineNode = (node: OutlineNode, level: number = 1): any[] => {
  const elements: any[] = [];
  
  // Tiêu đề phần
  elements.push(new Paragraph({
    children: processBoldText(node.title.toUpperCase(), level === 1 ? 32 : 28, true), // 16pt L1, 14pt L2
    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
  }));

  // Nội dung phần
  if (node.content) {
    elements.push(...parseContentToDocx(node.content));
  }

  // Đệ quy mục con
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      elements.push(...processOutlineNode(child, level + 1));
    });
  }

  return elements;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};

/**
 * Hàm xuất Word chính
 */
export const exportToWord = async (outline: OutlineNode[], topic: string, userInfo: UserInfo) => {
  const docElements: any[] = [];

  // --- TRANG BÌA ---
  docElements.push(
    new Paragraph({
      children: [new TextRun({ text: "SỞ GIÁO DỤC VÀ ĐÀO TẠO", font: "Times New Roman", size: 26 })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ 
        text: userInfo.school.toUpperCase() || "TRƯỜNG ...................................................", 
        font: "Times New Roman", 
        size: 26, 
        bold: true 
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 1200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "SÁNG KIẾN KINH NGHIỆM", font: "Times New Roman", size: 56, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400, after: 800 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "ĐỀ TÀI:", font: "Times New Roman", size: 32, bold: true })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: `"${topic.toUpperCase()}"`, font: "Times New Roman", size: 36, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 2400 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Người thực hiện: ${userInfo.name || "................................................"}`, font: "Times New Roman", size: 28 })],
      alignment: AlignmentType.RIGHT,
      indent: { right: 1440 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Năm học: ${userInfo.schoolYear || "2024 - 2025"}`, font: "Times New Roman", size: 28 })],
      alignment: AlignmentType.RIGHT,
      indent: { right: 1440 },
      spacing: { after: 2400 },
    })
  );

  // Ngắt trang sau bìa
  docElements.push(new Paragraph({ text: "", pageBreakBefore: true }));

  // --- NỘI DUNG CHÍNH ---
  outline.forEach(node => {
    docElements.push(...processOutlineNode(node));
  });

  const doc = new Document({
    sections: [
      {
        properties: { type: SectionType.NEXT_PAGE },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: "Times New Roman",
                    size: 24,
                  }),
                ],
              }),
            ],
          }),
        },
        children: docElements,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = topic ? `${topic.substring(0, 50).replace(/[\\/:*?"<>|]/g, "")}.docx` : "SKKN_Document.docx";
  saveAs(blob, fileName);
};
