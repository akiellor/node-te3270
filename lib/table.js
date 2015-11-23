import csp from 'js-csp';

export function table(rowStart, rowEnd, definition) {
  return function(terminal) {
    return {
      rows: function() {
        var resultChan = csp.chan();
        csp.go(function*() {
          var text = yield terminal.text();
          var rowTexts = text.split('\n').slice(rowStart, rowEnd);
          var rows = rowTexts.filter(function(rowText) {
            return rowText.trim().length > 0;
          }).map(function(rowText, i) {
            var result = {};
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

export function cell(textStart, textEnd) {
  return function(row) {
    return row.text.slice(textStart, textEnd);
  };
}

export function selectable(location) {
  return function(row, table, terminal) {
    var resultChan = csp.chan();
    csp.go(function*() {
      var yOffset = row.index + table.start;
      yield terminal.command("movecursor(" + yOffset + "," + location + ")");
      yield terminal.command("string(c)");
      yield terminal.command("enter()");
      yield csp.put(resultChan, true);
    });
    return resultChan;
  }
}
