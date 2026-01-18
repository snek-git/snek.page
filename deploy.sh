#!/bin/bash
node build.js
npx wrangler pages deploy . --project-name=snek-page
