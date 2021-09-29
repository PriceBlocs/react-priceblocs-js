
import dotenv from 'dotenv';
import path from "path"
const dotenvPath = path.resolve("./.env");
dotenv.config({ path: dotenvPath });

import replace from '@rollup/plugin-replace';
import sass from 'rollup-plugin-sass'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false
    }
  ],
  plugins: [
    sass({ insert: true }),
    typescript(),
    replace({
      "process.env.API_ROOT": JSON.stringify(process.env.API_ROOT),
      preventAssignment: true
    }),
  ],
  external: ['react', 'react-dom']
}