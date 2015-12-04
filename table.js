import csp from 'js-csp';

/**
* Defines a table on the specified rows.
*
* @public
* @param rowStart {Number}
* @param rowEnd {Number}
* @param definition {Object}
*/
export function table(rowStart, rowEnd, definition) {
  return function(terminal) {
    return {
      rows: function() {
        const resultChan = csp.chan();
        csp.go(function*() {
          const text = yield terminal.text();
          const rowTexts = text.split('\n').slice(rowStart, rowEnd);
          const rows = rowTexts.filter(function(rowText) {
            return rowText.trim().length > 0;
          }).map(function(rowText, i) {
            const result = {};
            Object.keys(definition).forEach(function(key) {
              result[key] = definition[key].bind(null, {
                text: rowText,
                index: i
              }, {
                start: rowStart,
                end: rowEnd
              }, terminal);
            });
            return result;
          });
          yield csp.put(resultChan, rows);
        });
        return resultChan;
      }
    };
  };
}

/**
* Allows for extraction of text from a cell.
*
* @public
* @param textStart {Number}
* @param textEnd {Number}
*/
export function cell(textStart, textEnd) {
  return function(row) {
    return row.text.slice(textStart, textEnd);
  };
}

/**
* Allows for selecting a given row, where a row may have an input field.
*
* @public
* @param location {Array}
*/
export function selectable(location) {
  return function(row, table, terminal) {
    const resultChan = csp.chan();
    csp.go(function*() {
      const yOffset = row.index + table.start;
      yield terminal.command("movecursor(" + yOffset + "," + location + ")");
      yield terminal.command("string(c)");
      yield terminal.command("enter()");
      yield csp.put(resultChan, true);
    });
    return resultChan;
  }
}
