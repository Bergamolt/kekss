import { Tree } from './tree'
import { Lexer } from './lexer'
import { readSource } from './utils'

function main() {
  const source: string = readSource('./style.kekss')
  const lexer = new Lexer(source)
  const tree = new Tree()

  tree.generation(lexer.getLexemes())
  tree.parse()
  tree.output('style')
}

main()
