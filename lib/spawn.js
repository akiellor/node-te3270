import csp from 'js-csp';
import {spawn} from 'child_process';

function spawnChan() {
  const args = Array.prototype.slice.call(arguments);
  const stdin = csp.chan();
  const stdout = csp.chan();

  const process = spawn.apply(null, args);

  csp.go(function*() {
    while (true) {
      const data = yield csp.take(stdin);
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

  return {
    stdin: stdin,
    stdout: stdout
  };
}

export default spawnChan;
