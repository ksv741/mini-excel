# Mini excel app
## _Small application covering the basic functionality of Excel_

The application is a SPA consisting of two screens
- Dashboard (Create new table or open saved)
- Excel (Excel table editing page)


Technologies used in this project:
- Typescript
- ES6+
- SCSS
- Redux
- Webpack 5
- Jest


## Implemented functionality
- Resize table rows/columns
- Navigation and selection of cells using the function keys (Ctrl, Shift, Arrows), or using the mouse
- Mathematical calculations in a formula
- Ability to add/remove columns via context menu (right mouse button)
- Changing cell style: size, font, alignment
- Saving to LocalStorage, also implemented the ability to delete certain tables

## Installation

Requires [Node.js](https://nodejs.org/) v16+ to run.

Install the dependencies and devDependencies and start the server.

```sh
npm install
```

For development run the command to create local webpack dev server

```sh
npm run start
```

For build use  
```sh
npm run build
```

For deploy edit deploy config file `configs/deploy/sftp-configs.js`
```sh
module.exports = {
  config: {
    host: 'host',
    port: 'port',
    username: 'username',
    password: 'password',
  },
  directory: 'path to directory'
};
```
and run 
```sh
npm run deploy
```

Testing

Run jest test by
```sh
npm run test
```
or
```sh
npm run test-watch
```
## License

MIT
