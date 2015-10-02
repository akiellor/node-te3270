import tap from 'tap';
import chai from 'chai';
import spies from 'chai-spies';
chai.use(spies);
const expect = chai.expect;

import csp from 'js-csp';
import {readFileSync} from 'fs';
import screen from './../lib/screen';

var loginText = readFileSync(__dirname + '/fixtures/mustang.txt').toString();
var tableText = readFileSync(__dirname + '/fixtures/table.txt').toString();
var tableMissingRowsText = readFileSync(__dirname + '/fixtures/table-missing-rows.txt').toString();

tap.test('screen', (t) => {
  function createTerminal(text) {
    text = text || "";
    var result = csp.chan();
    csp.go(function*(){
      yield csp.put(result, text);
    });

    return {
      command: chai.spy(),
      text: function() {
        return result;
      }
    };
  }

  t.test('text', (tt) => {
    tt.test('should allow for extraction of field data', function(ttt) {
      var terminal = createTerminal(loginText);

      var loginPage = screen(terminal, {
        terminal: screen.text([[3, 72], [3, 79]])
      });

      csp.go(function*() {
        var value = yield loginPage.terminal();
        expect(value).to.equal('TCP20004');
        ttt.done();
      });
    });

    tt.done();
  });

  t.test('keys', (tt) => {
    for (let i = 1; i <= 12; i++) {
      tt.test(`fn${i}`, (ttt) => {
        var terminal = createTerminal();

        var loginPage = screen(terminal, {
          functionKey: screen.keys.fn(i)
        });

        csp.go(function*() {
          yield loginPage.functionKey();
          expect(terminal.command.__spy.calls[0]).to.deep.equal([`pf(${i})`]);
          ttt.done();
        });
      });
    }
    tt.done();
  });

  t.test('field', (tt) => {
    tt.test('should allow typing to specified location', function(ttt) {
      var terminal = createTerminal();

      var loginPage = screen(terminal, {
        username: screen.field([16, 33])
      });

      csp.go(function*() {
        yield loginPage.username("foo");
        expect(terminal.command.__spy.calls[0]).to.deep.equal(["movecursor(16,33)"]);
        expect(terminal.command.__spy.calls[1]).to.deep.equal(["string(foo)"]);
        ttt.done();
      });
    });

    tt.done();
  });

  t.test('table', (tt) => {
    tt.test('should allow selection of rows', function(ttt) {
      var terminal = createTerminal(tableText);

      var tablePage = screen(terminal, {
        table: screen.table(8, 23, {
          sel: screen.table.selectable(3)
        })
      });

      csp.go(function*() {
        var rows = yield tablePage.table().rows();
        yield rows[1].sel();

        expect(terminal.command.__spy.calls[0]).to.deep.equal(["movecursor(9,3)"]);
        expect(terminal.command.__spy.calls[1]).to.deep.equal(["string(c)"]);
        expect(terminal.command.__spy.calls[2]).to.deep.equal(["enter()"]);

        ttt.done();
      });
    });

    tt.test('should not create rows where there is no content', function(ttt) {
      var terminal = createTerminal(tableMissingRowsText);

      var tablePage = screen(terminal, {
        table: screen.table(8, 23, {
          foo: screen.table.text(7, 11)
        })
      });

      csp.go(function*() {
        var rows = yield tablePage.table().rows();
        expect(rows.length).to.equal(4);
        ttt.done();
      });
    });

    tt.test('should allow text extraction of columns', function(ttt) {
      var terminal = createTerminal(tableText);

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

        ttt.done();
      });
    });

    tt.done();
  });

  t.done();
});
