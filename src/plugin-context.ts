export abstract class PluginContext {
  /**
   * Render a URL in the assistant web browser and get the response content
   * 
   * @param url - The URL to render
   * @returns The rendered content (like HTML)
   */
  abstract renderUrl(url: string): Promise<string>
}