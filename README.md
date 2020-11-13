Extension is written with JavaScript using React library.
Extension is built using [Create React App](https://github.com/facebook/create-react-app).
Additional extension file are packed using [Rollupjs](https://github.com/rollup/rollup).

### `Using local build`

Clone repo and run `npm install`.
After successful package instalation run `npm run build`.
Extension popup and additional script files will be built.
Navigate to [chrome://extensions/](chrome://extensions/) and Make sure 'Developer mode' is enabled.
Click 'Load unpacked' and select `build` folder in cloned repo file structure.

### `Development`

Clone repo and run `npm install`.
After successful package instalation run `npm start`.
Open [http://localhost:3000](http://localhost:3000) to view extension popup it in the browser.
\**Note: most of extension specific functionality (e.g. messaging between popup window and background) will not work and throw errors. Some functionality is mocked up for easier developement.*
