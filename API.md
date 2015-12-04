# cell

Allows for extraction of text from a cell.

**Parameters**

-   `textStart`  {Number}
-   `textEnd`  {Number}

# connect

Connects to a specified host te3270.

**Parameters**

-   `host`  {String}

# field

Enters text at specified location.

**Parameters**

-   `location`  {Array}

**Examples**

```javascript
import { screen, field } from 'te3270/screen';

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
import { screen, fnKey } from 'te3270/screen';

let awesomeScreen = screen(terminal, {
  back: fnKey(3)
});

csp.go(function*() {
  yield awesomeScreen.back();
  yield terminal.quit();
});
```

# screen

Defines a screen.

**Parameters**

-   `terminal`  {Object}
-   `definition`  {Object}

# selectable

Allows for selecting a given row, where a row may have an input field.

**Parameters**

-   `location`  {Array}

# table

Defines a table on the specified rows.

**Parameters**

-   `rowStart`  {Number}
-   `rowEnd`  {Number}
-   `definition`  {Object}

# text

Extracts text at the provided dimensions from the screen.

**Parameters**

-   `dimensions`  {Array}

**Examples**

```javascript
import { screen, text } from 'te3270/screen';

let awesomeScreen = screen(terminal, {
  awesomeText: text([[0, 70], [0, 80]])
});

csp.go(function*() {
  let result = yield awesomeScreen.awesomeText();
  console.log(result);
  yield terminal.quit();
});
```
