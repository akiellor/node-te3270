#!/usr/bin/env node --harmony

var csp = require('js-csp');
var connect = require(__dirname + '/..').connect;

var terminal = connect('mustang.nevada.edu');

csp.go(function*() {
  yield terminal.command("wait()");
  yield terminal.command("string(foo)");
  var text = yield terminal.text();

  console.log(text);

  yield terminal.command("quit()");
});
