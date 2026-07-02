#!/usr/bin/env node
"use strict";

const { run } = require("../lib/cli");

run(process.argv.slice(2)).then(
  (code) => process.exit(typeof code === "number" ? code : 0),
  (err) => {
    process.stderr.write(`fatal: ${err && err.stack ? err.stack : err}\n`);
    process.exit(1);
  }
);
