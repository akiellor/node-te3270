var csp = require('js-csp');

function text(dimensions) {
  var first = dimensions[0];
  var second = dimensions[1];

  return function(terminal) {
    var resultChan = csp.chan();
    csp.go(function*() {
      var pageText = yield terminal.text();
      var extract = pageText.split('\n').slice(first[0] - 1, second[0]).map(function(line) {
        return line.slice(first[1] - 1, second[1]);
      });
      yield csp.put(resultChan, extract.join('\n'));
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

module.exports = screen;
