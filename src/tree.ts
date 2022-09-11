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
  private isVariable = false

  private prevLexeme: string = ''
  private nextLexeme: string = ''

  public generation(lexemes: string[]) {
    for (let i = 0; i < lexemes.length; i++) {
      const lexeme = lexemes[i]

      this.prevLexeme = lexemes[i - 1] ?? ''
      this.nextLexeme = lexemes[i + 1] ?? ''

      if (this.isVariable && lexeme !== SYM.SEMI_COLON) {
        continue
      }

      if (lexeme === SYM.EQUAL) {
        this.memory[this.prevLexeme] = this.nextLexeme
        this.isVariable = true
        continue
      }

      if (lexeme === SYM.LEFT_BRACE) {
        this.isOpenBrace = true
        this.tree[this.currentSelector.trim()] = {}
        continue
      }

      if (this.isVariable && lexeme === SYM.SEMI_COLON) {
        this.isVariable = false
        continue
      }

      if (!this.isVariable && lexeme !== SYM.LEFT_BRACE && !this.isOpenBrace && !lexeme.startsWith(SYM.VAR)) {
        this.currentSelector += lexeme + ' '
        continue
      }

      // if (lexeme.startsWith(SYM.AT) && this.isOpenBrace) { 
      //   this.currentProperty = lexeme
      //   this.currentValue = ' '
      // }

      if (this.isOpenBrace && (this.nextLexeme === SYM.COLON || lexeme.startsWith(SYM.AT))) {
        this.isColon = true
        this.currentProperty = lexeme

        // if (lexeme.startsWith(SYM.AT)) {
        //   this.currentValue = ' '
        // }

        continue
      }

      if (lexeme === SYM.COLON) {
        this.isColon = true
        continue
      }

      if (this.isOpenBrace && this.isColon && lexeme !== SYM.SEMI_COLON) {
        this.currentValue += ' ' + lexeme
      }

      if (lexeme === SYM.SEMI_COLON && this.isColon) {
        this.isColon = false
        this.isSemiColon = false
      }

      if (this.currentSelector && this.currentProperty && this.currentValue && !this.isColon && !this.isSemiColon) {
        const selector = this.currentSelector.trim()
        const property = this.currentProperty
        const value = this.currentValue.trim()

        this.tree[selector] = {...this.tree[selector], [property]: value}

        this.currentProperty = ''
        this.currentValue = ''
      }

      if (lexeme === SYM.RIGHT_BRACE) {
        this.isOpenBrace = false
        this.currentSelector = ''
        this.currentValue = ''
        this.currentProperty = ''
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
