
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, AppStatus, UserInfo, DetailedConfig, SKKNTemplate, OutlineNode, WritingStyle, Language } from '../types';

interface AppContextType {
  state: AppState;
  setTopic: (topic: string) => void;
  setTargetWordCount: (count: number) => void;
  setUserInfo: (info: UserInfo) => void;
  setDetailedConfig: (config: Partial<DetailedConfig>) => void;
  setCustomOutlineText: (text: string) => void;
  setSelectedTemplate: (template: SKKNTemplate | null) => void;
  setOutline: (outline: OutlineNode[]) => void;
  setStatus: (status: AppStatus) => void;
  setWritingStyle: (style: WritingStyle) => void;
  setLanguage: (lang: Language) => void;
  updateOutlineNode: (nodeId: string, updates: Partial<OutlineNode>) => void;
  addOutlineNode: (parentId: string | null, title: string) => void;
  deleteOutlineNode: (nodeId: string) => void;
  setErrorMessage: (msg: string | null) => void;
  setProgressIndex: (index: number | ((prev: number) => number)) => void;
  setEducationLevel: (level: string) => void;
  setSubject: (subject: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    status: "GATHERING_INFO",
    language: "vi",
    userInfo: {
      name: "",
      school: "",
      phone: "",
      email: "",
      schoolYear: new Date().getFullYear().toString() + "-" + (new Date().getFullYear() + 1).toString()
    },
    detailedConfig: {
      schoolType: "Thành thị",
      schoolScale: "",
      facilities: "",
      difficulties: "",
      targetClass: "",
      studentCount: "",
      studentCharacteristics: "",
      problemStatus: "",
      mainSolutions: "",
      tools: "",
      timeRange: "",
      resultBefore: "",
      resultAfter: "",
      evidence: "",
      approvalLevel: "Cấp Trường"
    },
    topic: "",
    targetWordCount: 2000,
    customOutlineText: "",
    selectedTemplate: null,
    outline: [],
    currentSectionId: null,
    progressIndex: 0,
    errorMessage: null,
    writingStyle: "analytical",
    educationLevel: "Tiểu học",
    subject: "Toán học"
  });

  const setTopic = (topic: string) => setState(s => ({ ...s, topic }));
  const setTargetWordCount = (targetWordCount: number) => setState(s => ({ ...s, targetWordCount }));
  const setUserInfo = (userInfo: UserInfo) => setState(s => ({ ...s, userInfo }));
  const setDetailedConfig = (detailedConfig: Partial<DetailedConfig>) => 
    setState(s => ({ ...s, detailedConfig: { ...s.detailedConfig, ...detailedConfig } }));
  const setCustomOutlineText = (customOutlineText: string) => setState(s => ({ ...s, customOutlineText }));
  const setSelectedTemplate = (selectedTemplate: SKKNTemplate | null) => setState(s => ({ ...s, selectedTemplate }));
  const setOutline = (outline: OutlineNode[]) => setState(s => ({ ...s, outline }));
  const setStatus = (status: AppStatus) => setState(s => ({ ...s, status }));
  const setWritingStyle = (writingStyle: WritingStyle) => setState(s => ({ ...s, writingStyle }));
  const setLanguage = (language: Language) => setState(s => ({ ...s, language }));
  const setErrorMessage = (errorMessage: string | null) => setState(s => ({ ...s, errorMessage }));
  const setProgressIndex = (index: number | ((prev: number) => number)) => 
    setState(s => ({ ...s, progressIndex: typeof index === 'function' ? index(s.progressIndex) : index }));
  const setEducationLevel = (educationLevel: string) => setState(s => ({ ...s, educationLevel }));
  const setSubject = (subject: string) => setState(s => ({ ...s, subject }));

  const updateOutlineNode = (nodeId: string, updates: Partial<OutlineNode>) => {
    const updateRecursive = (nodes: OutlineNode[]): OutlineNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, ...updates };
        }
        if (node.children) {
          return { ...node, children: updateRecursive(node.children) };
        }
        return node;
      });
    };
    setState(s => ({ ...s, outline: updateRecursive(s.outline) }));
  };

  const addOutlineNode = (parentId: string | null, title: string) => {
    const newNode: OutlineNode = {
      id: `new-node-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title,
      targetWordCount: 400,
      actualWordCount: 0,
      content: "",
      status: "PENDING",
      userGuidance: "",
      children: []
    };

    const addRecursive = (nodes: OutlineNode[], targetId: string | null): OutlineNode[] => {
      if (targetId === null) {
        return [...nodes, newNode];
      }
      return nodes.map(node => {
        if (node.id === targetId) {
          return {
            ...node,
            children: [...(node.children || []), newNode]
          };
        }
        if (node.children) {
          return {
            ...node,
            children: addRecursive(node.children, targetId)
          };
        }
        return node;
      });
    };

    setState(s => ({
      ...s,
      outline: addRecursive(s.outline, parentId)
    }));
  };

  const deleteOutlineNode = (nodeId: string) => {
    const deleteRecursive = (nodes: OutlineNode[]): OutlineNode[] => {
      return nodes
        .filter(node => node.id !== nodeId)
        .map(node => ({
          ...node,
          children: node.children ? deleteRecursive(node.children) : undefined
        }));
    };
    setState(s => ({ ...s, outline: deleteRecursive(s.outline) }));
  };

  return (
    <AppContext.Provider value={{
      state,
      setTopic,
      setTargetWordCount,
      setUserInfo,
      setDetailedConfig,
      setCustomOutlineText,
      setSelectedTemplate,
      setOutline,
      setStatus,
      setWritingStyle,
      setLanguage,
      updateOutlineNode,
      addOutlineNode,
      deleteOutlineNode,
      setErrorMessage,
      setProgressIndex,
      setEducationLevel,
      setSubject
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
