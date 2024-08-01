// ******* Runtime Biz Error ******* //
export const AgentRuntimeErrorType = {
  AgentRuntimeError: 'AgentRuntimeError', // Agent Runtime 模块运行时错误
  LocationNotSupportError: 'LocationNotSupportError',

  InvalidProviderAPIKey: 'InvalidProviderAPIKey',
  ProviderBizError: 'ProviderBizError',

  InvalidOllamaArgs: 'InvalidOllamaArgs',
  OllamaBizError: 'OllamaBizError',

  InvalidBedrockCredentials: 'InvalidBedrockCredentials',

  /**
   * @deprecated
   */
  NoOpenAIAPIKey: 'NoOpenAIAPIKey',
  /**
   * @deprecated
   */
  OpenAIBizError: 'OpenAIBizError',
} as const;

export type IGenv0AgentRuntimeErrorType =
  (typeof AgentRuntimeErrorType)[keyof typeof AgentRuntimeErrorType];
