export abstract class Plugin {
  /**
   * This method is called when the assistant calls a tool provided by the plugin in the manifest.
   * 
   * @param toolName - The name of the tool to call
   * @param args - The arguments to pass to the tool
   */
  abstract toolCall(toolName: string, ...args: Array<any>): Promise<string> | string
}

