import csp from 'js-csp';

function text(dimensions) {
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

function field(location) {
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

const keys = {
  fn: function(number) {
    return function(terminal) {
      return terminal.command(`pf(${number})`);
    };
  }
}

function table(rowStart, rowEnd, definition) {
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

table.text = function(textStart, textEnd) {
  return function(row) {
    return row.text.slice(textStart, textEnd);
  };
}

table.selectable = function(location) {
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
    console.log(arguments);
  }
}

function screen(terminal, definition) {
  var result = {};
  Object.keys(definition).forEach(function(key) {
    result[key] = definition[key].bind(null, terminal);
  });
  return result;
}

screen.text = text;
screen.field = field;
screen.table = table;
screen.keys = keys;

export default screen;
