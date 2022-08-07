# Status Command

A status command with charts for Discord Bots created using [Discord.js](https://discord.js.org).

![Status Command](https://user-images.githubusercontent.com/94821119/183292604-8d4c1a5d-a9d3-4bb5-b5f1-7b7b2e4d0b2a.png)

## Install

```
npm install
```

## Usage

Replace the following to [config.ts](src/config.ts):
- `'YOUR_TOKEN_HERE'` with your Bot's Token
- `'MONGODB_URI_HERE'` with your MongoDB database URI
- Your Guild's Info
```typescript
DevGuilds: [
    {
        name: 'Vape Support', // Name of the Guild
        id: '952168682937798656', // ID of the Guild

    },
],
```

## NOTE!

The [chartjs-node-canvas](https://github.com/SeanSobey/ChartjsNodeCanvas#node-js-version) does not yet support Node.js v18.x. You can go through the issue [here](https://github.com/SeanSobey/ChartjsNodeCanvas/issues/107#issuecomment-1140344190).

**Solution**: Use Node.js v16.x.

## License

Status-Command is available under the [MIT License](./LICENSE)
