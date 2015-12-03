# field

[lib/screen.js:57-67](https://github.com/akiellor/node-te3270/blob/48b92c9d73a9445876552346159d3fcd56f0ab9b/lib/screen.js#L57-L67 "Source code on GitHub")

Enters text at specified location.

**Parameters**

-   `location`  {Array}

**Examples**

```javascript
import { screen, field } from 'te3270/lib/screen';

let awesomeScreen = screen(terminal, {
  awesomeField: field([5, 10])
});

csp.go(function*() {
  yield awesomeScreen.awesomeField("foo"); // prints text 'foo' at line 5 column 10
  yield terminal.quit();
});
```

# fnKey

[lib/screen.js:87-91](https://github.com/akiellor/node-te3270/blob/48b92c9d73a9445876552346159d3fcd56f0ab9b/lib/screen.js#L87-L91 "Source code on GitHub")

Presses a function key.

**Parameters**

-   `fn`  key number {Number}
-   `number`  

**Examples**

```javascript
import { screen, fnKey } from 'te3270/lib/screen';

let awesomeScreen = screen(terminal, {
  back: fnKey(3)
});

csp.go(function*() {
  yield awesomeScreen.back();
  yield terminal.quit();
});
```

# text

[lib/screen.js:22-37](https://github.com/akiellor/node-te3270/blob/48b92c9d73a9445876552346159d3fcd56f0ab9b/lib/screen.js#L22-L37 "Source code on GitHub")

Extracts text at the provided dimensions from the screen.

**Parameters**

-   `dimensions`  {Array}

**Examples**

```javascript
import { screen, text } from 'te3270/lib/screen';

let awesomeScreen = screen(terminal, {
  awesomeText: text([[0, 70], [0, 80]])
});

csp.go(function*() {
  let result = yield awesomeScreen.awesomeText();
  console.log(result);
  yield terminal.quit();
});
```
