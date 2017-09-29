# F# Data Visualisation test using Fable and Behaviors with Pixi.js

![Wip Demo](https://raw.githubusercontent.com/whitetigle/fable-behaviors/master/out/wip.gif)

- `npm install` to install dependencies.
- `npm run build` to compile the F# code to JS.
- `npm run build -- --watch` to compile the F# code to JS. + watch
- `npm start` to fire up a local server and open the sample web page.
- `npm run sync` to launch browser sync.

Live version: https://whitetigle.github.io/fable-behaviors/

[Note]: if nothing happens after loading: 
Open the debug console and remove the data from Local Storage under *https://whitetigle.github.io/fable-behaviors/* then refresh the page  
That's because Github needs to cache your results first after the first request. So the second request always works.

## Fable 0.7.x
This project uses an old version of Fable (<1.2.4) and Pixi (3.0.9) and may not build at all. Just ping me if you want me to update the sample with new Fable (>=1.2.x) and new pixi (4.x)

## Credits
- Base F# code & project architecture derived from https://github.com/alfonsogarciacaro/fable-pixi-sample1 (@alfonsogarciacaro)
- Space background made with http://wwwtyro.github.io/space-2d/ (@wwwtyro)
- Josefin Font from Google Fonts https://fonts.google.com/specimen/Josefin+Sans
- GitHub logo from https://github.com/logos
- loading bar from http://loading.io/

Made with :heart: Code by @whitetigle 
Powered by @fable-compiler :rocket: and @pixijs :sparkles:
