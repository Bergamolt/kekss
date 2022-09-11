import {createVariables, parseVariables} from './utils'
import {SYM} from './constants'
import * as fs from 'fs'

export class Tree {
  private memory: {[key: string]: string | number} = {}
  private tree: any = {}

  private currentSelector: string = ''
  private currentProperty: string = ''
  private currentValue: string = ''

  private isOpenBrace: boolean = false
  private isAttribute: boolean = false
  private isValue: boolean = false

  private prevLexeme: string = ''
  private nextLexeme: string = ''

  private idString: string = ''
  private lastIdString: string = ''
  private lastProperty: string = ''

  public generation(lexemes: string[]) {
    for (let i = 0; i < lexemes.length; i++) {
      const lexeme = lexemes[i]
      this.prevLexeme = lexemes[i - 1] ?? ''
      this.nextLexeme = lexemes[i + 1] ?? ''

      if (lexeme === SYM.LEFT_BRACE) {
        this.isOpenBrace = true
        this.isAttribute = true
        continue
      }

      if (lexeme === SYM.RIGHT_BRACE) {
        this.isOpenBrace = false
        this.isAttribute = false
        this.lastIdString = ''
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
        continue
      }

      if (lexeme == SYM.EQUAL) {
        this.memory[this.prevLexeme] = this.nextLexeme
        continue
      }

      if (this.nextLexeme === SYM.EQUAL || this.prevLexeme === SYM.EQUAL) {
        continue
      }

      if (!this.isOpenBrace) {
        this.idString += lexeme + ' '
      }

      if (this.isOpenBrace && !this.lastIdString) {
        this.lastIdString = this.idString.trim()
        this.idString = ''
      }

      if (this.isAttribute) {
        this.currentProperty = lexeme
      }

      if (this.isValue) {
        this.currentValue = lexeme
      }

      if (this.currentProperty) {
        this.tree[this.lastIdString] = this.tree[this.lastIdString]
          ? {...this.tree[this.lastIdString], [this.currentProperty]: ''}
          : {[this.currentProperty]: ''}

        this.lastProperty = this.currentProperty
        this.currentProperty = ''
      }

      if (this.currentValue) {
        this.tree[this.lastIdString][this.lastProperty] += this.currentValue + ' '
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
          newTree[key] = {...newTree[key], ...parseVariables(this.tree[property])}
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
