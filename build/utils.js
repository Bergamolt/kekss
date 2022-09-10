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
exports.createVariables = exports.parseVariables = exports.readSource = exports.isExcludeSym = void 0;
const fs = __importStar(require("fs"));
const constants_1 = require("./constants");
const isExcludeSym = (char) => ![constants_1.SYM.UNION, constants_1.SYM.AT, constants_1.SYM.VAR].includes(char);
exports.isExcludeSym = isExcludeSym;
const readSource = (path) => {
    return fs.readFileSync(path, 'utf8');
};
exports.readSource = readSource;
const parseVariables = (obj) => {
    const newObj = JSON.parse(JSON.stringify(obj));
    for (const key in newObj) {
        let value = newObj[key];
        const variables = value.match(/\$[a-zA-Z0-9\-]*/g);
        if (variables) {
            for (const variable of variables) {
                value = value.replace(variable, `var(--${variable.substring(1)})`);
            }
            newObj[key] = value;
            value = '';
        }
    }
    return newObj;
};
exports.parseVariables = parseVariables;
const createVariables = (variables) => {
    let root = ':root {';
    for (const variable in variables) {
        const value = variables[variable];
        root += `${constants_1.SYM.NEW_LINE}  --${variable.substring(1)}: ${value};`;
    }
    return root + `${constants_1.SYM.NEW_LINE}}${constants_1.SYM.NEW_LINE.repeat(2)}`;
};
exports.createVariables = createVariables;
