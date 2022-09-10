"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const fs = __importStar(require("fs"));
class Tree {
    memory = {};
    tree = {};
    currentSelector = '';
    currentProperty = '';
    currentValue = '';
    isOpenBrace = false;
    isColon = false;
    isSemiColon = false;
    generation(lexemes) {
        for (let i = 0; i < lexemes.length; i++) {
            const lexeme = lexemes[i];
            if (lexeme === constants_1.SYM.EQUAL) {
                this.memory[lexemes[i - 1]] = lexemes[i + 1];
            }
            if (!constants_1.KEYWORDS.includes(lexeme) && lexemes[i + 1] === constants_1.SYM.LEFT_BRACE) {
                this.currentSelector = lexeme;
            }
            if (lexeme === constants_1.SYM.LEFT_BRACE) {
                this.isOpenBrace = true;
                this.tree[this.currentSelector] = {};
            }
            if (this.isOpenBrace && (lexemes[i + 1] === constants_1.SYM.COLON || lexeme.startsWith(constants_1.SYM.AT))) {
                this.currentProperty = lexeme;
                if (lexeme.startsWith(constants_1.SYM.AT)) {
                    this.isColon = true;
                    this.currentValue = ' ';
                }
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
                this.tree[this.currentSelector] = Object.assign(this.tree[this.currentSelector], {
                    [this.currentProperty]: this.currentValue,
                });
                this.currentValue = '';
            }
        }
    }
    parse() {
        const newTree = JSON.parse(JSON.stringify(this.tree));
        for (const key in newTree) {
            for (const property in newTree[key]) {
                if (property.includes(constants_1.SYM.AT)) {
                    delete newTree[key][property];
                    newTree[key] = Object.assign(newTree[key], (0, utils_1.parseVariables)(this.tree[property]));
                    continue;
                }
                newTree[key] = (0, utils_1.parseVariables)(newTree[key]);
            }
        }
        this.tree = newTree;
    }
    output(filename) {
        let output = (0, utils_1.createVariables)(this.memory);
        for (const key in this.tree) {
            if (key.startsWith(constants_1.SYM.AT)) {
                continue;
            }
            output += `${key} {${constants_1.SYM.NEW_LINE}`;
            for (const property in this.tree[key]) {
                const value = this.tree[key][property];
                output += `${constants_1.SYM.SPACE}${property}:${value};${constants_1.SYM.NEW_LINE}`;
            }
            output += `}${constants_1.SYM.NEW_LINE.repeat(2)}`;
        }
        fs.writeFileSync(`${filename}.css`, output);
    }
}
exports.Tree = Tree;
