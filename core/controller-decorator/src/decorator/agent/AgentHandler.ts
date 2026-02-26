import type {
  ThreadObject,
  ThreadObjectWithMessages,
  CreateRunInput,
  RunObject,
  AgentStreamMessage,
} from '../../model/AgentControllerTypes';

// Interface for AgentController classes. The `execRun` method is required —
// the framework uses it to auto-wire thread/run management, store persistence,
// SSE streaming, async execution, and cancellation via smart defaults.
//
// Usage:
//   @AgentController()
//   export class MyAgent implements AgentHandler {
//     async* execRun(input: CreateRunInput): AsyncGenerator<AgentStreamMessage> {
//       yield {
//         type: 'message',
//         message: { role: 'assistant', content: 'Hello!' },
//       };
//       yield {
//         type: 'result',
//         usage: { prompt_tokens: 10, completion_tokens: 5 },
//       };
//     }
//   }
//
// The framework extracts data by field presence:
//   - `message` field present: extracts text content from the message
//   - `usage` field present: extracts usage info (AgentRunUsage)
//   - The `type` field is a free-form string — no constraints on its value
//
// You can optionally override any of the 7 route methods for full control.
// Unoverridden methods get store-backed smart defaults powered by execRun.
export interface AgentHandler {
  // Required: core execution method — yield AgentStreamMessage objects.
  // The framework extracts text content from the `message` field and
  // usage info from the `usage` field automatically.
  execRun(input: CreateRunInput, signal?: AbortSignal): AsyncGenerator<AgentStreamMessage>;

  // Optional: provide a fully custom AgentStore implementation.
  createStore?(): Promise<unknown>;

  // POST /api/v1/threads — Create a new conversation thread
  createThread?(): Promise<ThreadObject>;

  // GET /api/v1/threads/:id — Get thread with full message history
  getThread?(threadId: string): Promise<ThreadObjectWithMessages>;

  // POST /api/v1/runs — Create run (async, returns immediately with queued status)
  asyncRun?(input: CreateRunInput): Promise<RunObject>;

  // POST /api/v1/runs/stream — Create run with SSE streaming output
  // Use ContextHandler.getContext() to access ctx.res for SSE writing
  streamRun?(input: CreateRunInput): Promise<void>;

  // POST /api/v1/runs/wait — Create run (sync, waits for completion)
  syncRun?(input: CreateRunInput): Promise<RunObject>;

  // GET /api/v1/runs/:id — Get run status and result
  getRun?(runId: string): Promise<RunObject>;

  // POST /api/v1/runs/:id/cancel — Cancel a running run
  cancelRun?(runId: string): Promise<RunObject>;
}
