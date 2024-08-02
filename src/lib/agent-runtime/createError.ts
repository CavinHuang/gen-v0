import { IGenv0AgentRuntimeErrorType } from '@/lib/agent-runtime/error';
import { AgentInitErrorPayload, ChatCompletionErrorPayload } from '@/lib/agent-runtime/type';

export const AgentRuntimeError = {
  chat: (error: ChatCompletionErrorPayload): ChatCompletionErrorPayload => error,
  createError: (
    errorType: IGenv0AgentRuntimeErrorType | string | number,
    error?: any,
  ): AgentInitErrorPayload => ({ error, errorType }),
  textToImage: (error: any): any => error,
};
