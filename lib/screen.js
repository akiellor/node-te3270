import csp from 'js-csp';

/** @module te3270/screen */

/**
* Extracts text at the provided dimensions from the screen.
*
* @public
* @param dimensions {Array}
*
* @example
* let awesomeScreen = screen(terminal, {
*   awesomeText: text([[5, 10], [5, 20]])
* });
*
* yield awesomeScreen.awesomeText(); // returns 10 characters on line 5
*/
export function text(dimensions) {
  var first = dimensions[0];
  var second = dimensions[1];

  return function(terminal) {
    var resultChan = csp.chan();
    csp.go(function*() {
      var pageText = yield terminal.text();
      var extract = pageText.split('\n').slice(first[0], second[0] + 1).map(function(line) {
        return line.slice(first[1], second[1] + 1);
      });
      yield csp.put(resultChan, extract.join('\n'));
    });
    return resultChan;
  };
}

/**
* Enters text at specified location.
*
* @public
* @param location {Array}
*
* @example
* let awesomeScreen = screen(terminal, {
*   awesomeField: screen.field([5, 10])
* });
*
* yield awesomeScreen.awesomeField("foo"); // prints text 'foo' at line 5 column 10
*/
export function field(location) {
  return function(terminal, text) {
    var resultChan = csp.chan();
    csp.go(function*() {
      yield terminal.command("movecursor(" + location[0] + "," + location[1] + ")");
      yield terminal.command("string(" + text + ")");
      yield csp.put(resultChan, true);
    });
    return resultChan;
  };
}

export const keys = {
  fn: function(number) {
    return function(terminal) {
      return terminal.command(`pf(${number})`);
    };
  }
}

export function screen(terminal, definition) {
  var result = {};
  Object.keys(definition).forEach(function(key) {
    result[key] = definition[key].bind(null, terminal);
  });
  return result;
}
