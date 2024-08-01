import { ListResponse, Ollama as OllamaBrowser, ProgressResponse } from 'ollama/browser';

import { ModelProvider } from '@/lib/agent-runtime/type';
import { getMessageError } from '@/lib/fetch';

import { createErrorResponse } from '@/app/api/errorResponse';
import { getUserSettings } from '@/app/settings/action';

import { ChatErrorType } from '@/types/fetch';

const DEFAULT_BASE_URL = 'http://127.0.0.1:11434';

interface OllamaServiceParams {
  fetch?: typeof fetch;
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

   getOllamaClient = async () => {
    if (await this.getHost() !== this._host) {
      this._host = await this.getHost();
      this._client = new OllamaBrowser({ fetch: this._fetch, host: this._host });
    }
    return this._client;
  };

  abort = () => {
    this._client.abort();
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

  getModels = async (): Promise<ListResponse> => {
    let response: Response | ListResponse;
    try {
      return await (await this.getOllamaClient()).list();
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
}

export const ollamaService = new OllamaService();
