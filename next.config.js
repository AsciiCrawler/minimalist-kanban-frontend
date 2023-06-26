/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();
const nextConfig = {
  reactStrictMode: true,
  output: 'export'
}

module.exports = removeImports(nextConfig)
