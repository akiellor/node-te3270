import jsCsp from 'js-csp';
import spawn from './lib/spawn';

function command(commands, script, result) {
  jsCsp.go(function*() {
    yield jsCsp.put(commands, [script, result]);
  });
}

/**
 * Connects to a specified host te3270.
 *
 * @public
 * @param host {String}
 */
export function connect(host) {
  const process = spawn('x3270', ['-script', host]);

  const commands = jsCsp.chan();
  const results = jsCsp.chan();

  jsCsp.go(function*() {
    let buffer = "";

    function handle(data) {
      buffer += data.toString();
      let term;
      while ((term = buffer.indexOf('ok\n')) !== -1) {
        const result = buffer.slice(0, term);
        buffer = buffer.slice(term + 3);

        const lines = result.split('\n');
        const data = lines.slice(0, -2).map(function(line) {
          return line.replace("data: ", "");
        }).join('\n');
        const state = lines[lines.length - 2];
        return {
          data: data
        };
      }
    }

    while (true) {
      let [script, resultChan] = yield jsCsp.take(commands);
      yield jsCsp.put(process.stdin, script);

      let result = undefined;
      while (result === undefined) {
        const chunk = yield jsCsp.take(process.stdout);
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
      const result = jsCsp.chan();
      command(commands, script + '\n', result);
      return result;
    },
    quit: function() {
      return this.command("quit()");
    }
  };
}

export const csp = jsCsp;
