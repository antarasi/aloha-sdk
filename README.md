# aloha-sdk
Aloha Desktop SDK for building plugins

## CLI Usage

The aloha-sdk package includes a CLI tool for automatic version management. After installing aloha-sdk as a dev dependency, you can use the CLI to copy the version from your package.json to a manifest file.

You can use it on a plugin `prebuild` script to update the plugin version on every build:

```json
{
  "scripts": {
    "prebuild": "aloha version package.json public/manifest.json"
  }
}
```
