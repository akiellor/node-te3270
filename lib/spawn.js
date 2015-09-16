var csp = require('js-csp');
var spawn = require('child_process').spawn;

module.exports = function() {
  var args = Array.prototype.slice.call(arguments)
  var stdin = csp.chan();
  var stdout = csp.chan();

  var process = spawn.apply(null, args);

  csp.go(function*() {
    while (true) {
      var data = yield csp.take(stdin);
      if (data === csp.CLOSED) {
        process.stdin.end();
        return;
      } else {
        process.stdin.write(data);
      }
    }
  });

  process.stdout.on('data', function(data) {
    csp.go(function*() {
      yield csp.put(stdout, data);
    });
  });

  process.on('exit', function() {
    stdout.close();
  });

  return {stdin: stdin, stdout: stdout};
};
