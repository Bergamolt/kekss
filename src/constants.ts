import {SYM_TYPE} from './types'

export const SYM: SYM_TYPE = {
  LEFT_BRACE: '{',
  RIGHT_BRACE: '}',
  LEFT_ROUND: '(',
  RIGHT_ROUND: ')',
  NEW_LINE: '\n',
  TAB: '\t',
  COLON: ':',
  SEMI_COLON: ';',
  SPACE: ' ',
  COMMA: ',',
  EQUAL: '=',
  UNION: '-',
  // DOT: '.',
  AT: '@',
  VAR: '$',
}

export const KEYWORDS: string[] = Object.values(SYM)