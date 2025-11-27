# aloha-sdk

Provides TypeScript types for plugin development and lets your plugin access additional capabilities such as logging and browser-based website rendering.

[![npm version](https://img.shields.io/npm/v/aloha-sdk)](https://npmjs.com/package/aloha-sdk)
[![github action](https://github.com/antarasi/aloha-sdk/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/antarasi/aloha-sdk/actions/workflows/npm-publish.yml)

## Plugins with dependencies

To bundle dependencies with your plugin we recommend using a bundler. 

To get started quickly use the official [vite-aloha template](https://github.com/antarasi/vite-aloha)

See: [TypeScript example with dependencies](https://docs.alohadesktop.com/adding-dependencies.html#example-with-dependencies)

If you don't need to include dependencies from the NPM registry, you can use a simplified approach with just a single file as entry point.

## Complete Plugin Example (simplified - no bundler)

[![How to prototype an AI app in 15 minutes](.github/assets/yt-thumbnail-play.webp)](https://www.youtube.com/watch?v=HGJzU5n9ook)

See: [EcmaScript example without dependencies](https://docs.alohadesktop.com/getting-started.html#your-first-plugin)

## SDK API

### `Plugin` class

<!-- automd:file src="src/plugin.ts" code -->

```ts [plugin.ts]
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
  abstract toolCall(toolName: string, args: Record<string, any>): Promise<string> | string
}
```

<!-- /automd -->

### `PluginContext` class

<!-- automd:file src="src/plugin-context.ts" code -->

```ts [plugin-context.ts]
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
```

<!-- /automd -->

## SDK API Usage Example

```ts
import { Plugin } from 'aloha-sdk'
import type { Logger, PluginContext } from 'aloha-sdk'

export default class MyPlugin extends Plugin {
  private logger: Logger;

  constructor(context: PluginContext) {
    super(context);
    this.logger = context.getLogger();
  }

  async toolCall(toolName: string, args: { taskName: string }): Promise<string> {
    if (toolName === "getTaskDate") {
      const url = `https://cool-tasks.com/${args.taskName}`
      const body = await this.getContext().renderUrl(url)
      try {
        const taskDate = ... // use response body to extract date
        return `${args.taskName} due date is ${taskDate}`;
      } catch (exc: any) {
        this.logger.error(`Failed to parse due date of task ${args.taskName}: ${body}`, exc);
        throw new Error(`Sorry, we couldn't find the due date of '${args.taskName}' task.`)
      }
    }

    throw new Error(`This tool is not available`)
  }
}
```

## CLI Usage

See: [CLI Documentation](https://docs.alohadesktop.com/cli.html)