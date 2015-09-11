var spawn = require('child_process').spawn;

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

    var cb = callbacks.shift();
    cb(data, state);
  }
}

var callbacks = [];

function command(process, script, cb) {
  cb = cb || function() {}
  process.stdin.write(script + "\n");
  callbacks.push(cb);
}

module.exports = function connect(host, cb) {
  var process = spawn('x3270', ['-script', host]);
  process.stdout.on('data', handle);

  command(process, "wait()");

  var conn = {
    text: function(cb) {
      this.command("ascii()", cb);
    },
    command: function(script, cb) {
      command(process, script, cb);
    }
  };
  cb(null, conn)
};

