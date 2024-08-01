import OpenAIProvider from "./openai";

import { ChatModelCard } from "@/types/llm";
export const GENV0_DEFAULT_MODEL_LIST: ChatModelCard[] = [
  OpenAIProvider.chatModels,
].flat();