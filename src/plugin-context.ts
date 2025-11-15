import type { Logger } from './logger'
export abstract class PluginContext {
  /**
   * Render a URL in the assistant web browser and get the response content
   * 
   * @param url - The URL to render
   * @returns The rendered content (like HTML)
   */
  abstract renderUrl(url: string): Promise<string>

  /** Get Aloha default logger instance 
   *  You can use it to log messages from your plugin
   * 
   * @returns The logger instance
  */
  abstract getLogger(): Logger
}