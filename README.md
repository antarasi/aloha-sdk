# aloha-sdk
Aloha Desktop SDK for plugin development

[![npm version](https://img.shields.io/npm/v/aloha-sdk)](https://npmjs.com/package/aloha-sdk)
[![github action](https://github.com/antarasi/aloha-sdk/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/antarasi/aloha-sdk/actions/workflows/npm-publish.yml)

## Plugins with dependencies

To bundle dependencies with your plugin we recommend using a bundler. 

To get started quickly use the official [vite-aloha template](https://github.com/antarasi/vite-aloha)

If you don't need to include dependencies from the NPM registry, you can use a simplified approach with just a single file as entry point.

## Complete Plugin Example (simplified - no bundler)

[![How to prototype an AI app in 15 minutes](.github/assets/yt-thumbnail-play.webp)](https://www.youtube.com/watch?v=HGJzU5n9ook)

### Plugin Project Structure

```
your-plugin/
├── src/
│   └── index.esm.js              # Main plugin entry point
├── public/
│   └── icon.svg                  # Plugin icon
├── tests/
│   └── validate-export.test.mjs  # Tests
└── manifest.json                 # Plugin manifest file
```

### 1. Write Plugin Code 

```js
export default class SayHelloPlugin {
  constructor(context) {
    super(context) // the plugin context allows the plugin to interact with the agent
  }

  async toolCall(toolName, args) {
    if (toolName !== 'sayHello') {
      throw new Error(`This tool is not available in **Concierge Plugin**`)
    }

    return `Hello my dear **${args.personName}!**`
  }
}
```

### 2. Define Plugin Manifest

The `manifest.json` file describe the plugin capabilities to Aloha Desktop agent:

```json
{
  "manifestVersion": 1,
  "name": "Aloha Concierge Plugin",
  "version": "1.0.0",
  "description": "Greets new guests",
  "author": "Your Name",
  "icon": "public/icon.svg",
  "main": "src/index.esm.js",
  "tools": [
    {
      "name": "sayHello",
      "displayName": "Concierge",
      "description": "The agent can use this tool to greet the user",
      "parameters": {
        "type": "object",
        "required": ["personName"],
        "properties": {
          "personName": {
            "type": "string",
            "description": "Person to which say hello"
          }
        }
      }
    }
  ]
}
```

### 3. Install the Plugin

<img src=".github/assets/plugins.png" width="800">

### 4. Aloha Agent can now use the tool when needed

<img src=".github/assets/greeting-tool.png" width="800">

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


## Plugin release

To make your plugin availble as community plugin to download in the Aloha Desktop App, publish a release of your plugin on GitHub and update `plugins.json` on [aloha-releases repository](https://github.com/antarasi/aloha-releases).

The release needs to have 2 assets with exact file names as below:
1. `manifest.json` - the plugin manifest - see example above
2. `plugin.tgz` - tarball archive with all the files your plugin requires at runtime

#### Example plugin.tgz content:
```
plugin.tgz
├── src/
│   └── index.esm.js              
└── public/
    └── icon.svg
```

## Plugin Requirements

1. Max icon size 10kB
2. Supported icon formats:
```
  image/svg+xml
  image/png
  image/jpeg
  image/jpg
  image/gif
  image/webp
  image/ico
  image/x-icon
  image/bmp
  image/tiff
```
3. Use only monochrome icon (#171717) with transparent background, preferably svg from [Lucide](https://lucide.dev/icons/), colors will be inverted automatically for dark mode
4. See [Publishing Requirements](https://github.com/antarasi/aloha-releases?tab=readme-ov-file#publishing-requirements)

## CLI Usage

The aloha-sdk package includes a CLI tool for automatic version management. After installing aloha-sdk as a dev dependency, you can use the CLI to copy the version from your package.json to a manifest file.

You can use it on a plugin `prebuild` script to update the plugin version on every build:

```json
{
  "scripts": {
    "prebuild": "aloha version package.json manifest.json"
  }
}
```

