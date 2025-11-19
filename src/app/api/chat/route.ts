import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, message, resourceId, resourceType } = body;

    if (!conversationId || !message || !resourceId || !resourceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: 这里应该调用实际的AI服务
    // 目前返回一个模拟响应
    const mockResponse = generateMockResponse(resourceType, message);

    return NextResponse.json({
      message: mockResponse,
      conversationId,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateMockResponse(resourceType: string, userMessage: string): string {
  const responses: Record<string, string[]> = {
    agent: [
      '我是智能体助手，很高兴为您服务！',
      '我理解您的问题了，让我来帮助您解决。',
      '这是一个很好的问题，让我分析一下...',
    ],
    'multi-agent': [
      '多智能体系统正在协作处理您的请求...',
      '我们的团队正在为您提供最佳解决方案。',
      '让多个专家智能体共同分析这个问题。',
    ],
    group: [
      '群组成员正在讨论您的问题...',
      '我们的智能体团队正在协作处理。',
      '群组智能体已收到您的消息。',
    ],
    workflow: [
      '工作流已启动，正在按步骤处理...',
      '您的请求正在通过工作流处理中。',
      '工作流的各个阶段正在顺序执行。',
    ],
  };

  const typeResponses = responses[resourceType] || responses.agent;
  const randomIndex = Math.floor(Math.random() * typeResponses.length);

  return `${typeResponses[randomIndex]}\n\n您说: "${userMessage}"\n\n这是一个演示响应。实际AI集成将在后续版本中实现。`;
}
