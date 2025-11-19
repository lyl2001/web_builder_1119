// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

// 主题类型
export type ThemeType = 'cool' | 'modern' | 'classic' | 'anime';

// 资产可见性
export type Visibility = 'private' | 'public';

// 模型提供商
export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'local';

// 工具类型
export interface MCPServer {
  id: string;
  name: string;
  url: string;
  description?: string;
}

export interface HTTPApi {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  body?: string;
  description?: string;
}

export type Tool = MCPServer | HTTPApi;

// 知识库
export interface KnowledgeBase {
  id: string;
  name: string;
  type: 'file' | 'url' | 'text';
  content: string;
  metadata?: Record<string, any>;
}

// Output Widget
export interface OutputWidget {
  id: string;
  type: 'text' | 'markdown' | 'json' | 'chart' | 'table' | 'custom';
  config?: Record<string, any>;
}

// 单个智能体
export interface Agent {
  id: string;
  name: string;
  description: string;
  prompt: string;
  model: {
    provider: ModelProvider;
    modelName: string;
    temperature?: number;
    maxTokens?: number;
  };
  knowledgeBase?: KnowledgeBase[];
  tools?: Tool[];
  outputWidget?: OutputWidget;
  ownerId: string;
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

// 多智能体配置
export interface MultiAgentConfig {
  autoReply: boolean;
  mentionEnabled: boolean;
  agents: string[]; // Agent IDs
}

// 多智能体
export interface MultiAgent {
  id: string;
  name: string;
  description: string;
  config: MultiAgentConfig;
  ownerId: string;
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

// Workflow 步骤
export interface WorkflowStep {
  id: string;
  name: string;
  agentIds: string[]; // 支持并发多个智能体
  concurrent: boolean;
  condition?: string; // 执行条件
  order: number;
}

// 智能体 Workflow
export interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  ownerId: string;
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

// 群组成员
export interface GroupMember {
  id: string;
  type: 'agent' | 'multiAgent';
  enabled: boolean;
}

// 智能体群组
export interface AgentGroup {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  maxRounds?: number; // 最大对话轮数
  stopConditions?: {
    enabled: boolean;
    minQualityScore?: number; // 最小质量分数
    repetitionThreshold?: number; // 重复内容阈值
  };
  ownerId: string;
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

// 统一资产类型
export type Asset = Agent | MultiAgent | AgentWorkflow | AgentGroup;

export type AssetType = 'agent' | 'multiAgent' | 'workflow' | 'group';

// 消息类型（用于多智能体和群组对话）
export interface Message {
  id: string;
  senderId: string; // Agent ID
  senderName: string;
  content: string;
  timestamp: Date;
  mentions?: string[]; // 提及的智能体 IDs
  metadata?: Record<string, any>;
}

// 对话会话
export interface Conversation {
  id: string;
  assetId: string;
  assetType: AssetType;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
