import OpenAI, { ClientOptions } from 'openai';

import { getUserSettings } from '@/app/settings/action';
import { GENV0_DEFAULT_MODEL_LIST } from '@/constant/provide';

import { ChatModelCard } from '@/types/llm';
const CHAT_MODELS_BLOCK_LIST = [
  'embedding',
  'davinci',
  'curie',
  'moderation',
  'ada',
  'babbage',
  'tts',
  'whisper',
  'dall-e',
];
export class GenV0OpenAi {
  _options: ClientOptions
  client: OpenAI

  constructor(options: ClientOptions & Record<string, any> = {}) {
    this._options = {
      ...options,
      baseURL: options.baseURL?.trim() || ''
    }
    this.client = new OpenAI(this._options)
  }

  async getChatModels() {
    const list = await this.client.models.list()

    return list.data
    .filter((model) => {
      return CHAT_MODELS_BLOCK_LIST.every(
        (keyword) => !model.id.toLowerCase().includes(keyword),
      );
    })
    .map((item) => {

      const knownModel = GENV0_DEFAULT_MODEL_LIST.find((model) => model.id === item.id);

      if (knownModel) return knownModel;

      return { id: item.id };
    })

    .filter(Boolean) as ChatModelCard[];
  }
}
let genV0OpenAiInstance: GenV0OpenAi | null = null
export const genV0OpenAi = async () => {
  if (genV0OpenAiInstance) return genV0OpenAiInstance
  const userSettings = await getUserSettings()
  if (userSettings) {
    const { openAiHostProxy, openAiApiKey } = userSettings
    genV0OpenAiInstance = new GenV0OpenAi({
      apiKey: openAiApiKey || '',
      baseURL: openAiHostProxy
    })
  }
  return genV0OpenAiInstance
}

export const genv0OpenAiGetChatModels = async (apiKey: string, baseURL?: string) => {
  console.log('🚀 ~ genv0OpenAiGetChatModels ~ baseURL:', baseURL)
  console.log('🚀 ~ genv0OpenAiGetChatModels ~ apiKey:', apiKey)
  const genV0OpenAiInstance = new GenV0OpenAi({
    apiKey,
    baseURL,
    dangerouslyAllowBrowser: true
  })
  return genV0OpenAiInstance.getChatModels()
}