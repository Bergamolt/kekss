"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const utils_1 = require("./utils");
const constants_1 = require("./constants");
class Lexer {
    lexemes = [];
    lexeme = '';
    source;
    constructor(source) {
        this.source = source;
    }
    getLexemes() {
        for (let i = 0; i <= this.source.length; i++) {
            const char = this.source[i];
            if (char !== constants_1.SYM.SPACE && char !== constants_1.SYM.NEW_LINE) {
                this.lexeme += char;
            }
            if (this.lexeme &&
                (0, utils_1.isExcludeSym)(char) &&
                (0, utils_1.isExcludeSym)(this.source[i + 1]) &&
                (constants_1.KEYWORDS.includes(this.source[i + 1]) || constants_1.KEYWORDS.includes(char))) {
                this.lexemes.push(this.lexeme);
                this.lexeme = '';
            }
        }
        return this.lexemes;
    }
}
exports.Lexer = Lexer;
