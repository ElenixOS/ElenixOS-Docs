# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Custom MDX Components

### `<Todo />`

Render a "section under construction" admonition in any `.mdx` file:

```mdx
<Todo />
```

Renders an info admonition with localized title/content:

| Locale  | Title  | Content                                              |
|---------|--------|------------------------------------------------------|
| zh-Hans | 待完善 | 该部分内容正在构建中，请稍后查看。                      |
| en      | TODO  | This section is under construction. Please check back later. |

Override defaults with props:

```mdx
<todo title="Custom Title">Custom message here.</todo>
```

Available globally in all `.mdx` documents — no import needed.

## Common Commands

```bash
# Install dependencies
npm install

# Start local dev server (hot reload)
npm start

# Build for production
npm run build

# Serve the built site locally
npm run serve

# Clear Docusaurus cache
npm run clear

# Write i18n translations
npm run write-translations

# Swizzle a theme component
npm run swizzle
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true npm run deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
