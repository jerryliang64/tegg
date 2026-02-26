import { AgentController } from '@eggjs/tegg/agent';
import type { AgentHandler, CreateRunInput, AgentStreamMessage } from '@eggjs/tegg/agent';

@AgentController()
export class BaseAgentController implements AgentHandler {
  async* execRun(input: CreateRunInput): AsyncGenerator<AgentStreamMessage> {
    const messages = input.input.messages;
    yield {
      type: 'assistant',
      message: {
        role: 'assistant',
        content: [{ type: 'text', text: `Processed ${messages.length} messages` }],
      },
    };
    yield {
      type: 'result',
      usage: { prompt_tokens: 10, completion_tokens: 5 },
    };
  }
}
