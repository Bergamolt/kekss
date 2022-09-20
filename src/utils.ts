import * as fs from 'fs'
import { SYM } from './constants'

export const isExcludeSym = (char: string) => ![SYM.UNION, SYM.AT, SYM.VAR].includes(char)

export const readSource = (path: string) => {
  return fs.readFileSync(path, 'utf8')
}

export const parseVariables = (obj: { [key: string]: string }): object => {
  const newObj = JSON.parse(JSON.stringify(obj))

  for (const key in newObj) {
    let value = newObj[key]
    const variables = value.match(/\$[a-zA-Z0-9\-]*/g)

    if (variables) {
      for (const variable of variables) {
        value = value.replace(variable, `var(--${variable.substring(1)})`)
      }

      newObj[key] = value
      value = ''
    }
  }

  return newObj
}

export const createVariables = (variables: any): string => {
  let root = ':root {'

  for (const variable in variables) {
    const value = variables[variable]
    root += `${SYM.NEW_LINE}\t--${variable.substring(1)}: ${value};`
  }

  return root + `${SYM.NEW_LINE}}${SYM.NEW_LINE.repeat(2)}`
}