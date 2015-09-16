var csp = require('js-csp');
var expect = require('chai').expect;
var te3270 = require(__dirname + "/../lib/te3270");

describe('te3270', () => {
  it('should process streams', function(done) {
    this.timeout(20000);

    var terminal = te3270.connect('mustang.nevada.edu');

    csp.go(function*() {
      yield terminal.command("wait()");
      yield terminal.command("string(foo)");
      var text = yield terminal.text();

      expect(text).to.contain("foo")
      expect(text).to.contain("S y s t e m   C o m p u t i n g   S e r v i c e s")

      done();
    });
  });
});
