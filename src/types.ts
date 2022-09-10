export type SYM_NAME_TYPE =
  | 'LEFT_BRACE'
  | 'RIGHT_BRACE'
  | 'LEFT_ROUND'
  | 'RIGHT_ROUND'
  | 'NEW_LINE'
  | 'TAB'
  | 'COLON'
  | 'SEMI_COLON'
  | 'SPACE'
  | 'COMMA'
  | 'EQUAL'
  | 'UNION'
  // | 'DOT'
  | 'AT'
  | 'VAR'

export type SYM_TYPE = {
  [key in SYM_NAME_TYPE]: string
}


