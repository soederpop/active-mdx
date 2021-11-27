#!/usr/bin/env node

import cli from "../src/cli/index.mjs"

cli()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error.message)
    console.error(error.stack)
    process.exit(1)
  })
