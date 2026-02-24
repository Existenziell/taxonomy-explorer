#!/usr/bin/env node
'use strict'
/**
 * Generate CSS custom properties from lib/theme.js (single source of truth).
 * Output: styles/_theme-vars.css
 */
const fs = require('fs')
const path = require('path')
const { colors, mist, light, dark } = require('../lib/theme.js')

const baseVars = {
  '--color-cta': colors.cta,
}

function semanticVars(themeObj, greyDarkValue) {
  return {
    '--color-accent': themeObj[1],
    '--color-accent-dark': themeObj[6],
    '--color-grey': themeObj[4],
    '--color-grey-dark': greyDarkValue,
  }
}

function mistVars(scale) {
  return Object.fromEntries(
    Object.entries(scale).map(([step, value]) => [`--color-mist-${step}`, value])
  )
}

function levelVars(themeObj) {
  return Object.fromEntries(
    [1, 2, 3, 4, 5, 6].map((key) => [`--color-level-${key}`, themeObj[key]])
  )
}

const rootVars = {
  ...baseVars,
  ...semanticVars(light, dark[4]),
  ...levelVars(light),
  ...mistVars(mist),
}
const darkVars = {
  ...baseVars,
  ...semanticVars(dark, dark[4]),
  ...levelVars(dark),
  ...mistVars(mist),
}

const lines = [
  '/* Generated from lib/theme.js – do not edit */',
  ':root {',
  ...Object.entries(rootVars).map(([key, value]) => `  ${key}: ${value};`),
  '}',
  '',
  '.dark {',
  ...Object.entries(darkVars).map(([key, value]) => `  ${key}: ${value};`),
  '}',
  '',
]

const outPath = path.join(__dirname, '..', 'styles', '_theme-vars.css')
fs.writeFileSync(outPath, lines.join('\n'), 'utf8')
console.warn('Generated', outPath)
