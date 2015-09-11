#!/usr/bin/env node

var connect = require(__dirname + '/..');

connect('mustang.nevada.edu', function(err, conn) {
  conn.command("string(foo)");

  conn.text(function(text) {
    console.log(text);
  });
});
