import { createVariables, parseVariables } from './utils'
import { SYM } from './constants'
import * as fs from 'fs'

const checkNeedAddSpace = (lexeme: string): boolean =>
  lexeme === SYM.COMMA || lexeme === SYM.RIGHT_ROUND || lexeme === SYM.LEFT_ROUND || lexeme === SYM.SEMI_COLON

export class Tree {
  private memory: { [key: string]: string | number } = {}
  private tree: any = {}
  private selectors: string[] = []

  private currentProperty: string = ''
  private currentValue: string = ''

  private isAttribute: boolean = false
  private isValue: boolean = false

  private prevLexeme: string = ''
  private nextLexeme: string = ''

  private idString: string = ''
  private lastProperty: string = ''

  public generation(lexemes: string[]) {
    for (let i = 0; i < lexemes.length; i++) {
      const selector = this.selectors?.join(' ')
      const lexeme = lexemes[i]
      this.prevLexeme = lexemes[i - 1] ?? ''
      this.nextLexeme = lexemes[i + 1] ?? ''

      if (lexeme === SYM.LEFT_BRACE) {
        this.selectors.push(this.idString.trim())
        this.isAttribute = true
        continue
      }

      if (lexeme === SYM.RIGHT_BRACE) {
        this.isAttribute = false
        this.selectors.pop()
        continue
      }

      if (lexeme === SYM.COLON) {
        this.isAttribute = false
        this.isValue = true
        continue
      }

      if (lexeme === SYM.SEMI_COLON) {
        this.isValue = false
        this.isAttribute = true
        this.idString = ''
        continue
      }

      if (lexeme == SYM.EQUAL) {
        this.memory[this.prevLexeme] = this.nextLexeme
        continue
      }

      if (this.nextLexeme === SYM.EQUAL || this.prevLexeme === SYM.EQUAL) {
        continue
      }

      this.idString += lexeme === SYM.DOT ? lexeme : lexeme + SYM.SPACE

      if (this.isAttribute && this.nextLexeme !== SYM.LEFT_BRACE) {
        this.currentProperty = lexeme
      }

      if (this.isValue) {
        this.currentValue = lexeme
      }

      if (this.currentProperty && selector) {
        this.tree[selector] = this.tree[selector]
          ? { ...this.tree[selector], [this.currentProperty]: '' }
          : { [this.currentProperty]: '' }

        this.lastProperty = this.currentProperty
        this.currentProperty = ''
      }

      if (this.currentValue && selector) {
        const property = checkNeedAddSpace(this.nextLexeme) ? this.currentValue : this.currentValue + ' '

        this.tree[selector][this.lastProperty] += property
        this.currentValue = ''
      }
    }
  }

  public parse() {
    const newTree = JSON.parse(JSON.stringify(this.tree))

    for (const key in newTree) {
      for (const property in newTree[key]) {
        if (property.includes(SYM.AT)) {
          delete newTree[key][property]
          newTree[key] = { ...newTree[key], ...parseVariables(this.tree[property]) }
          continue
        }

        newTree[key] = parseVariables(newTree[key])
      }
    }

    this.tree = newTree
  }

  public output(filename: string) {
    let output = createVariables(this.memory)

    for (const key in this.tree) {
      if (key.startsWith(SYM.AT)) {
        continue
      }

      output += `${key} {${SYM.NEW_LINE}`

      for (const property in this.tree[key]) {
        const value = this.tree[key][property]

        output += `\t${property}: ${value};${SYM.NEW_LINE}`
      }

      output += `}${SYM.NEW_LINE.repeat(2)}`
    }

    fs.writeFileSync(`${filename}.css`, output)
  }
}
