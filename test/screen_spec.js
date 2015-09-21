var csp = require('js-csp');
var expect = require('chai').expect;
var loginText = require('fs').readFileSync(__dirname + '/fixtures/mustang.txt').toString();
var screen = require(__dirname + "/../lib/screen");

describe('screen', () => {
  describe('text', () => {
    it('should allow for extraction of field data', function(done) {
      var result = csp.chan();
      csp.go(function*(){
        yield csp.put(result, loginText);
      });

      var terminal = {
        text: function() {
          return result;
        }
      };

      var loginPage = screen(terminal, {
        terminal: screen.text([[4, 73], [4, 80]])
      });

      csp.go(function*() {
        var value = yield loginPage.terminal();
        expect(value).to.equal('TCP20004');
        done();
      });
    });
  });
});
