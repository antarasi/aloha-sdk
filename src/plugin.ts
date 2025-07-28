import type { PluginContext } from "./plugin-context";
export abstract class Plugin {
  private readonly context: PluginContext

  constructor(context: PluginContext) {
    this.context = context
  }

  /**
   * Get the context object to interact with the assistant
   * 
   * @returns The context object
   */
  getContext(): PluginContext {
    return this.context
  }

  /**
   * This method is called when the assistant calls a tool provided by the plugin in the manifest.
   * 
   * @param toolName - The name of the tool to call
   * @param args - The arguments to pass to the tool
   */
  abstract toolCall(toolName: string, ...args: Array<any>): Promise<string> | string
}

