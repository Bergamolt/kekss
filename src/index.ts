import {Tree} from './tree'
import {Lexer} from './lexer'
import {readSource} from './utils'

;(function () {
  const source: string = readSource('./test.kekss')
  const lexer = new Lexer(source)
  const tree = new Tree()

  tree.generation(lexer.getLexemes())
  tree.parse()
  tree.output('test')
})()
