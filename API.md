# field

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

Presses a function key.

**Parameters**

-   `number`  {Number}

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
