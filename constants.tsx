
import React from 'react';
import { SKKNTemplate } from './types';

export const APP_TITLE = "VIẾT SÁNG KIẾN KINH NGHIỆM";
export const APP_SUBTITLE = "Một công cụ thuộc sở hữu của Dương Văn Khánh";
export const APP_AUTHOR = "Dương Văn Khánh";

export const EDUCATION_LEVELS = [
  "Mầm non", "Tiểu học", "THCS", "THPT"
];

export const SUBJECTS = [
  "Toán học", "Ngữ văn", "Tiếng Anh", "Vật lý", "Hóa học", "Sinh học", "Lịch sử", "Địa lý", 
  "Giáo dục công dân", "Giáo dục Kinh tế và Pháp luật", "Công nghệ", "Tin học", "Thể dục", "Âm nhạc", "Mỹ thuật", "Giáo dục mầm non", "Tiểu học", "Tự nhiên và Xã hội", "Khoa học"
];

export const getFilteredSubjects = (educationLevel: string) => {
  if (educationLevel === "THPT") {
    return SUBJECTS.filter(s => s !== "Giáo dục công dân");
  } else {
    return SUBJECTS.filter(s => s !== "Giáo dục Kinh tế và Pháp luật");
  }
};

export const GRADE_LEVELS = [
  "Mầm non", "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5", "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12"
];

export const WRITING_STYLES = [
  { value: "analytical", label: "Phân tích khoa học", description: "Ngôn ngữ chuyên môn, logic, chặt chẽ" },
  { value: "heartfelt", label: "Tâm huyết, truyền cảm", description: "Chia sẻ trải nghiệm cá nhân, gần gũi" },
  { value: "factual", label: "Thực tiễn, khách quan", description: "Tập trung vào số liệu và kết quả thực tế" },
  { value: "simple", label: "Đơn giản, dễ hiểu", description: "Ngôn từ phổ thông, súc tích" }
];

export const ICONS = {
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
  ),
  Pen: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  ),
  Loader: () => (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
  )
};
