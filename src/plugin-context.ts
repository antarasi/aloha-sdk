export abstract class PluginContext {
  /**
   * Render a URL in the assistant web browser and get the HTML content
   * 
   * @param url - The URL to render
   * @returns The rendered HTML string
   */
  abstract renderUrl(url: string): Promise<string>
}