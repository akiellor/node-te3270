import jsCsp from 'js-csp';
import spawn from './spawn';

function command(commands, script, result) {
  jsCsp.go(function*() {
    yield jsCsp.put(commands, [script, result]);
  });
}

export function connect(host) {
  var process = spawn('x3270', ['-script', host]);

  var commands = jsCsp.chan();
  var results = jsCsp.chan();

  jsCsp.go(function*() {
    var buffer = "";

    function handle(data) {
      buffer += data.toString();
      var term;
      while ((term = buffer.indexOf('ok\n')) !== -1) {
        var result = buffer.slice(0, term);
        buffer = buffer.slice(term + 3);

        var lines = result.split('\n');
        var data = lines.slice(0, -2).map(function(line) {
          return line.replace("data: ", "");
        }).join('\n');
        var state = lines[lines.length - 2];
        return {
          data: data
        };
      }
    }

    while (true) {
      let [script, resultChan] = yield jsCsp.take(commands);
      yield jsCsp.put(process.stdin, script);

      var result = undefined;
      while (result === undefined) {
        var chunk = yield jsCsp.take(process.stdout);
        if (chunk === jsCsp.CLOSED) {
          resultChan.close();
          return;
        } else {
          result = handle(chunk.toString());
        }
      }

      yield jsCsp.put(resultChan, result.data);
      resultChan.close();
    }
  });

  return {
    text: function() {
      return this.command("ascii()");
    },
    command: function(script) {
      var result = jsCsp.chan();
      command(commands, script + '\n', result);
      return result;
    },
    quit: function() {
      return this.command("quit()");
    }
  };
}

export const csp = jsCsp;
