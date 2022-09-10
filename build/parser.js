"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const constants_1 = require("./constants");
class Parser {
    memory = {};
    tree = {};
    currentVariable = '';
    currentSelector = '';
    currentProperty = '';
    currentValue = '';
    isOpenBrace = false;
    isCloseBrace = false;
    isOpenRound = false;
    isCloseRound = false;
    isColon = false;
    isSemiColon = false;
    parse(lexemes) {
        for (let i = 0; i < lexemes.length; i++) {
            const lexeme = lexemes[i];
            if (!constants_1.KEYWORDS.includes(lexeme) && lexemes[i + 1] === constants_1.SYM.EQUAL) {
                this.currentVariable = lexeme;
            }
            if (lexeme === constants_1.SYM.EQUAL) {
                this.memory[this.currentVariable] = lexemes[i + 1];
                this.currentVariable = '';
            }
            if (!constants_1.KEYWORDS.includes(lexeme) && lexemes[i + 1] === constants_1.SYM.LEFT_BRACE) {
                this.currentSelector = lexeme;
            }
            if (lexeme === constants_1.SYM.LEFT_BRACE) {
                this.isOpenBrace = true;
                this.tree[this.currentSelector] = {};
            }
            if (this.isOpenBrace && lexemes[i + 1] === constants_1.SYM.COLON) {
                this.currentProperty = lexeme;
            }
            if (this.isOpenBrace && this.isColon && lexeme !== constants_1.SYM.SEMI_COLON) {
                this.currentValue += ` ${lexeme}`;
            }
            if (lexeme === constants_1.SYM.COLON && this.currentProperty) {
                this.isColon = true;
            }
            if (lexeme === constants_1.SYM.SEMI_COLON && this.isColon) {
                this.isColon = false;
                this.isSemiColon = false;
            }
            if (this.currentSelector && this.currentProperty && this.currentValue && !this.isColon && !this.isSemiColon) {
                this.tree[this.currentSelector] = {
                    ...this.tree[this.currentSelector],
                    [this.currentProperty]: this.currentValue,
                };
                this.currentValue = '';
            }
            if (lexeme === constants_1.SYM.RIGHT_BRACE) {
                this.isCloseBrace = true;
            }
        }
        console.log(this.tree);
    }
}
exports.Parser = Parser;
