import { EggPrototype, EggPrototypeLifecycleContext } from '@eggjs/tegg-metadata';
import {
  ControllerMetaBuilderFactory,
  ControllerMetadataUtil,
  LifecycleHook,
} from '@eggjs/tegg';

export class EggControllerPrototypeHook implements LifecycleHook<EggPrototypeLifecycleContext, EggPrototype> {
  async postCreate(ctx: EggPrototypeLifecycleContext): Promise<void> {
    // Enhance @AgentController classes with smart defaults before metadata build.
    // Lazy import to avoid loading agent-runtime when no agent controllers exist.
    if ((ctx.clazz as any)[Symbol.for('AGENT_CONTROLLER')]) {
      const { enhanceAgentController } = await import('@eggjs/tegg-agent-runtime');
      enhanceAgentController(ctx.clazz);
    }

    const metadata = ControllerMetaBuilderFactory.build(ctx.clazz);
    if (metadata) {
      ControllerMetadataUtil.setControllerMetadata(ctx.clazz, metadata);
    }
  }
}
