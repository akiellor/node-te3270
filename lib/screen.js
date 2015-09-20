var csp = require('js-csp');

function screen(terminal, definition) {
  var result = {};
  Object.keys(definition).forEach(function(key) {
    var indexes = definition[key];
    var first = indexes[0];
    var second = indexes[1];
    result[key] = function() {
      var resultChan = csp.chan();
      csp.go(function*() {
        var pageText = yield terminal.text();
        var extract = pageText.split('\n').slice(first[0] - 1, second[0]).map(function(line) {
          return line.slice(first[1] - 1, second[1]);
        });
        yield csp.put(resultChan, extract.join('\n'));
      });
      return resultChan;
    }
  });
  return result;
}

module.exports = screen;
