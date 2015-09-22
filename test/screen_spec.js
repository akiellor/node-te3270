var csp = require('js-csp');
var expect = require('chai').expect;
var loginText = require('fs').readFileSync(__dirname + '/fixtures/mustang.txt').toString();
var tableText = require('fs').readFileSync(__dirname + '/fixtures/table.txt').toString();
var screen = require(__dirname + "/../lib/screen");
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

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
        terminal: screen.text([[3, 72], [3, 79]])
      });

      csp.go(function*() {
        var value = yield loginPage.terminal();
        expect(value).to.equal('TCP20004');
        done();
      });
    });
  });

  describe('field', () => {
    it('should allow typing to specified location', function(done) {
      var terminal = {
        command: chai.spy()
      };

      var loginPage = screen(terminal, {
        username: screen.field([16, 33])
      });

      csp.go(function*() {
        yield loginPage.username("foo");
        expect(terminal.command.__spy.calls[0]).to.deep.equal(["movecursor(16,33)"]);
        expect(terminal.command.__spy.calls[1]).to.deep.equal(["string(foo)"]);
        done();
      });
    });
  });

  describe('table', () => {
    it('should allow interaction with rows', function(done) {
      var result = csp.chan();
      csp.go(function*(){
        yield csp.put(result, tableText);
      });

      var terminal = {
        command: chai.spy(),
        text: function() {
          return result;
        }
      };

      var tablePage = screen(terminal, {
        table: screen.table(8, 23, {
          foo: screen.table.text(7, 11)
        })
      });

      csp.go(function*() {
        var rows = yield tablePage.table().rows();
        var foos = rows.map(function(row) {
          return row.foo();
        })
        expect(foos).to.deep.equal([
          "foo1",
          "foo2",
          "foo3",
          "foo4",
          "foo5",
          "foo6",
          "foo7",
          "foo9",
          "foo0",
          "foo9",
          "foo8",
          "foo7",
          "foo6",
          "foo5",
          "foo4"
        ]);
        done();
      });
    });
  });
});
