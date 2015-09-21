var csp = require('js-csp');
var expect = require('chai').expect;
var te3270 = require(__dirname + "/../index");

describe('te3270', () => {
  it('should process streams', function(done) {
    this.timeout(20000);

    var terminal = te3270.connect('mustang.nevada.edu');
    var loginScreen = te3270.screen(terminal, {
      terminal: te3270.screen.text([[3, 72], [3, 79]]),
      username: te3270.screen.field([16, 33])
    });

    csp.go(function*() {
      yield terminal.command("wait()");
      yield loginScreen.username("foo");
      var text = yield loginScreen.terminal();
      yield terminal.command("quit()");

      expect(text).to.match(/TCP[0-9]+/);

      done();
    });
  });
});
