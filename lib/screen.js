var csp = require('js-csp');

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

function screen(terminal, definition) {
  var result = {};
  Object.keys(definition).forEach(function(key) {
    result[key] = definition[key].bind(null, terminal);
  });
  return result;
}

screen.text = text;
screen.field = field;

module.exports = screen;
