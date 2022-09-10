import {createVariables, parseVariables} from './utils'
import {KEYWORDS, SYM} from './constants'
import * as fs from 'fs'

export class Tree {
  private memory: {[key: string]: string | number} = {}
  private tree: any = {}

  private currentSelector: string = ''
  private currentProperty: string = ''
  private currentValue: string = ''

  private isOpenBrace: boolean = false

  private isColon: boolean = false
  private isSemiColon: boolean = false

  public generation(lexemes: string[]) {
    for (let i = 0; i < lexemes.length; i++) {
      const lexeme = lexemes[i]

      if (lexeme === SYM.EQUAL) {
        this.memory[lexemes[i - 1]] = lexemes[i + 1]
      }

      if (!KEYWORDS.includes(lexeme) && lexemes[i + 1] === SYM.LEFT_BRACE) {
        this.currentSelector = lexeme
      }

      if (lexeme === SYM.LEFT_BRACE) {
        this.isOpenBrace = true
        this.tree[this.currentSelector] = {}
      }

      if (this.isOpenBrace && (lexemes[i + 1] === SYM.COLON || lexeme.startsWith(SYM.AT))) {
        this.currentProperty = lexeme

        if (lexeme.startsWith(SYM.AT)) {
          this.isColon = true
          this.currentValue = ' '
        }
      }

      if (this.isOpenBrace && this.isColon && lexeme !== SYM.SEMI_COLON) {
        this.currentValue += ` ${lexeme}`
      }

      if (lexeme === SYM.COLON && this.currentProperty) {
        this.isColon = true
      }

      if (lexeme === SYM.SEMI_COLON && this.isColon) {
        this.isColon = false
        this.isSemiColon = false
      }

      if (this.currentSelector && this.currentProperty && this.currentValue && !this.isColon && !this.isSemiColon) {
        this.tree[this.currentSelector] = Object.assign(this.tree[this.currentSelector], {
          [this.currentProperty]: this.currentValue,
        })

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
          newTree[key] = Object.assign(newTree[key], parseVariables(this.tree[property]))
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

        output += `${SYM.SPACE}${property}:${value};${SYM.NEW_LINE}`
      }

      output += `}${SYM.NEW_LINE.repeat(2)}`
    }

    fs.writeFileSync(`${filename}.css`, output)
  }
}
