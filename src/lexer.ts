import {isExcludeSym} from './utils'
import {KEYWORDS, SYM} from './constants'

export class Lexer {
  private lexemes: string[] = []
  private lexeme: string = ''
  public source: string

  constructor(source: string) {
    this.source = source
  }

  public getLexemes(): string[] {
    for (let i = 0; i <= this.source.length; i++) {
      const char: string = this.source[i]

      if (char !== SYM.SPACE && char !== SYM.NEW_LINE) {
        this.lexeme += char
      }

      if (
        this.lexeme &&
        isExcludeSym(char) &&
        isExcludeSym(this.source[i + 1]) &&
        (KEYWORDS.includes(this.source[i + 1]) || KEYWORDS.includes(char))
      ) {
        this.lexemes.push(this.lexeme)
        this.lexeme = ''
      }
    }

    return this.lexemes
  }
}
