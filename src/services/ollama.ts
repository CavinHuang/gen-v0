import { ListResponse, Ollama as OllamaBrowser, ProgressResponse } from 'ollama/browser';

import { ChatCompetitionOptions, ChatStreamPayload, OpenAIChatMessage } from '@/lib/agent-runtime/chat';
import { AgentRuntimeError } from '@/lib/agent-runtime/createError';
import { AgentRuntimeErrorType } from '@/lib/agent-runtime/error';
import { ModelProvider } from '@/lib/agent-runtime/type';
import { getMessageError } from '@/lib/fetch';
import { OllamaStream } from '@/lib/ollama';
import { StreamingResponse } from '@/lib/response';
import { parseDataUri } from '@/lib/uriParser';

import { createErrorResponse } from '@/app/api/errorResponse';
import { getUserSettings } from '@/app/settings/action';

import { ChatErrorType } from '@/types/fetch';
import { ChatModelCard } from '@/types/llm';

const DEFAULT_BASE_URL = 'http://127.0.0.1:11434';

interface OllamaServiceParams {
  fetch?: typeof fetch;
}

export interface OllamaMessage {
  content: string;
  images?: string[];
  role: string;
}


export class OllamaService {
  private _host: string;
  private _client: OllamaBrowser;
  private _fetch?: typeof fetch;

  constructor(params: OllamaServiceParams = {}) {
    this.getHost().then((host) => {
      this._host = host;
    })
    this._host = DEFAULT_BASE_URL;
    this._fetch = params.fetch;
    this._client = new OllamaBrowser({ fetch: params?.fetch, host: this._host });
  }

   getHost = async () => {
    const config = await this.getConfig();

    return config?.ollamaHost || DEFAULT_BASE_URL;
  };

  getConfig = async () => {
    const response = await getUserSettings();
    return response
  };

   getOllamaClient = async (host?: string) => {
    if (host) {
      if (host !== this._host) {
        this._host = host;
        this._client = new OllamaBrowser({ fetch: this._fetch, host });
      }
    } else {
      if (await this.getHost() !== this._host) {
        this._host = await this.getHost();
        this._client = new OllamaBrowser({ fetch: this._fetch, host: this._host });
      }
    }
    return this._client;
  };

  abort = () => {
    this._client.abort();
  };

  async chat(payload: ChatStreamPayload, options?: ChatCompetitionOptions) {
    try {
      const abort = () => {
        this._client.abort();
        options?.signal?.removeEventListener('abort', abort);
      };

      options?.signal?.addEventListener('abort', abort);

      const response = await this._client.chat({
        messages: this.buildOllamaMessages(payload.messages),
        model: payload.model,
        options: {
          frequency_penalty: payload.frequency_penalty,
          presence_penalty: payload.presence_penalty,
          temperature: payload.temperature,
          top_p: payload.top_p,
        },
        stream: true,
      });

      return StreamingResponse(OllamaStream(response, options?.callback), {
        headers: options?.headers,
      });
    } catch (error) {
      const e = error as { message: string; name: string; status_code: number };

      throw AgentRuntimeError.chat({
        error: { message: e.message, name: e.name, status_code: e.status_code },
        errorType: AgentRuntimeErrorType.OllamaBizError,
        provider: ModelProvider.Ollama,
      });
    }
  }

  private buildOllamaMessages(messages: OpenAIChatMessage[]) {
    return messages.map((message) => this.convertContentToOllamaMessage(message));
  }

  private convertContentToOllamaMessage = (message: OpenAIChatMessage): OllamaMessage => {
    if (typeof message.content === 'string') {
      return { content: message.content, role: message.role };
    }

    const ollamaMessage: OllamaMessage = {
      content: '',
      role: message.role,
    };

    for (const content of message.content) {
      switch (content.type) {
        case 'text': {
          // keep latest text input
          ollamaMessage.content = content.text;
          break;
        }
        case 'image_url': {
          const { base64 } = parseDataUri(content.image_url.url);
          if (base64) {
            ollamaMessage.images ??= [];
            ollamaMessage.images.push(base64);
          }
          break;
        }
      }
    }

    return ollamaMessage;
  };

  pullModel = async (model: string): Promise<AsyncIterable<ProgressResponse>> => {
    let response: Response | AsyncIterable<ProgressResponse>;
    try {
      response = await (await this.getOllamaClient()).pull({ insecure: true, model, stream: true });
      return response as AsyncIterable<ProgressResponse>;
    } catch {
      response = createErrorResponse(ChatErrorType.OllamaServiceUnavailable, {
        host: this.getHost(),
        message: 'please check whether your ollama service is available or set the CORS rules',
        provider: ModelProvider.Ollama,
      });
    }

    if (!response.ok) {
      throw await getMessageError(response);
    }
    return response.json();
  };

  getModels = async (host?: string): Promise<ListResponse> => {
    let response: Response | ListResponse;
    try {
      return await (await this.getOllamaClient(host)).list();
    } catch {
      response = createErrorResponse(ChatErrorType.OllamaServiceUnavailable, {
        host: host ? host: await this.getHost(),
        message: 'please check whether your ollama service is available or set the CORS rules',
        provider: ModelProvider.Ollama,
      });
    }

    if (!response.ok) {
      throw await getMessageError(response);
    }
    return response.json();
  };

  async models(): Promise<ChatModelCard[]> {
    const list = await this._client.list();
    return list.models.map((model) => ({
      id: model.name,
    }));
  }
}

export const ollamaService = new OllamaService();
