"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tree_1 = require("./tree");
const lexer_1 = require("./lexer");
const utils_1 = require("./utils");
(function () {
    const source = (0, utils_1.readSource)('./test.kekss');
    const lexer = new lexer_1.Lexer(source);
    const tree = new tree_1.Tree();
    tree.generation(lexer.getLexemes());
    tree.parse();
    tree.output('test');
})();
