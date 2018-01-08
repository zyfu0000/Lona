// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
'use strict';

var $$Set                   = require("bs-platform/lib/js/set.js");
var List                    = require("bs-platform/lib/js/list.js");
var Block                   = require("bs-platform/lib/js/block.js");
var Curry                   = require("bs-platform/lib/js/curry.js");
var Caml_obj                = require("bs-platform/lib/js/caml_obj.js");
var Caml_string             = require("bs-platform/lib/js/caml_string.js");
var Tree$LonaCompilerCore   = require("./tree.bs.js");
var Render$LonaCompilerCore = require("./render.bs.js");

function compare(a, b) {
  return Caml_string.caml_string_compare(Render$LonaCompilerCore.$$String[/* join */0]("", a[1]), Render$LonaCompilerCore.$$String[/* join */0]("", b[1]));
}

var include = $$Set.Make(/* module */[/* compare */compare]);

var empty = include[0];

var add = include[3];

var elements = include[19];

var IdentifierSet_001 = /* is_empty */include[1];

var IdentifierSet_002 = /* mem */include[2];

var IdentifierSet_004 = /* singleton */include[4];

var IdentifierSet_005 = /* remove */include[5];

var IdentifierSet_006 = /* union */include[6];

var IdentifierSet_007 = /* inter */include[7];

var IdentifierSet_008 = /* diff */include[8];

var IdentifierSet_009 = /* compare */include[9];

var IdentifierSet_010 = /* equal */include[10];

var IdentifierSet_011 = /* subset */include[11];

var IdentifierSet_012 = /* iter */include[12];

var IdentifierSet_013 = /* fold */include[13];

var IdentifierSet_014 = /* for_all */include[14];

var IdentifierSet_015 = /* exists */include[15];

var IdentifierSet_016 = /* filter */include[16];

var IdentifierSet_017 = /* partition */include[17];

var IdentifierSet_018 = /* cardinal */include[18];

var IdentifierSet_020 = /* min_elt */include[20];

var IdentifierSet_021 = /* max_elt */include[21];

var IdentifierSet_022 = /* choose */include[22];

var IdentifierSet_023 = /* split */include[23];

var IdentifierSet_024 = /* find */include[24];

var IdentifierSet_025 = /* of_list */include[25];

var IdentifierSet = /* module */[
  /* empty */empty,
  IdentifierSet_001,
  IdentifierSet_002,
  /* add */add,
  IdentifierSet_004,
  IdentifierSet_005,
  IdentifierSet_006,
  IdentifierSet_007,
  IdentifierSet_008,
  IdentifierSet_009,
  IdentifierSet_010,
  IdentifierSet_011,
  IdentifierSet_012,
  IdentifierSet_013,
  IdentifierSet_014,
  IdentifierSet_015,
  IdentifierSet_016,
  IdentifierSet_017,
  IdentifierSet_018,
  /* elements */elements,
  IdentifierSet_020,
  IdentifierSet_021,
  IdentifierSet_022,
  IdentifierSet_023,
  IdentifierSet_024,
  IdentifierSet_025
];

function children(node) {
  if (typeof node === "number") {
    return /* [] */0;
  } else {
    switch (node.tag | 0) {
      case 0 : 
          return /* :: */[
                  node[3],
                  /* [] */0
                ];
      case 1 : 
          return /* :: */[
                  node[1],
                  /* [] */0
                ];
      case 5 : 
          return node[0];
      default:
        return /* [] */0;
    }
  }
}

function restore(node, contents) {
  if (typeof node === "number") {
    return node;
  } else {
    switch (node.tag | 0) {
      case 0 : 
          return /* If */Block.__(0, [
                    node[0],
                    node[1],
                    node[2],
                    List.nth(contents, 0)
                  ]);
      case 1 : 
          return /* IfExists */Block.__(1, [
                    node[0],
                    List.nth(contents, 0)
                  ]);
      case 5 : 
          return /* Block */Block.__(5, [contents]);
      default:
        return node;
    }
  }
}

var LogicTree = Tree$LonaCompilerCore.Make(/* module */[
      /* children */children,
      /* restore */restore
    ]);

function undeclaredIdentifiers(node) {
  var inner = function (node, identifiers) {
    if (typeof node === "number") {
      return identifiers;
    } else if (node.tag === 2) {
      var match = node[1];
      if (typeof match === "number" || match.tag) {
        return identifiers;
      } else {
        return Curry._2(add, /* tuple */[
                    match[0],
                    match[1]
                  ], identifiers);
      }
    } else {
      return identifiers;
    }
  };
  return Curry._3(LogicTree[/* reduce */0], inner, empty, node);
}

function addVariableDeclarations(node) {
  var identifiers = undeclaredIdentifiers(node);
  return List.fold_left((function (acc, declaration) {
                return Curry._2(LogicTree[/* insert_child */8], (function (item) {
                              var match = Caml_obj.caml_equal(item, acc);
                              if (match !== 0) {
                                return /* Some */[declaration];
                              } else {
                                return /* None */0;
                              }
                            }), acc);
              }), node, List.map((function (param) {
                    return /* Let */Block.__(4, [/* Identifier */Block.__(0, [
                                  param[0],
                                  param[1]
                                ])]);
                  }), Curry._1(elements, identifiers)));
}

function logicValueToJavaScriptAST(x) {
  if (typeof x === "number") {
    return /* Unknown */0;
  } else if (x.tag) {
    return /* Literal */Block.__(1, [x[0]]);
  } else {
    return /* Identifier */Block.__(2, [x[1]]);
  }
}

function toJavaScriptAST(node) {
  var fromCmp = function (x) {
    switch (x) {
      case 0 : 
          return /* Eq */0;
      case 1 : 
          return /* Neq */1;
      case 2 : 
          return /* Gt */2;
      case 3 : 
          return /* Gte */3;
      case 4 : 
          return /* Lt */4;
      case 5 : 
          return /* Lte */5;
      case 6 : 
          return /* Noop */7;
      
    }
  };
  if (typeof node === "number") {
    return /* Unknown */0;
  } else {
    switch (node.tag | 0) {
      case 0 : 
          var condition_000 = logicValueToJavaScriptAST(node[0]);
          var condition_001 = fromCmp(node[1]);
          var condition_002 = logicValueToJavaScriptAST(node[2]);
          var condition = /* BooleanExpression */Block.__(10, [
              condition_000,
              condition_001,
              condition_002
            ]);
          return /* ConditionalStatement */Block.__(11, [
                    condition,
                    /* :: */[
                      toJavaScriptAST(node[3]),
                      /* [] */0
                    ]
                  ]);
      case 1 : 
          return /* ConditionalStatement */Block.__(11, [
                    logicValueToJavaScriptAST(node[0]),
                    /* :: */[
                      toJavaScriptAST(node[1]),
                      /* [] */0
                    ]
                  ]);
      case 2 : 
          return /* AssignmentExpression */Block.__(9, [
                    logicValueToJavaScriptAST(node[1]),
                    logicValueToJavaScriptAST(node[0])
                  ]);
      case 3 : 
          var addition_000 = logicValueToJavaScriptAST(node[0]);
          var addition_002 = logicValueToJavaScriptAST(node[1]);
          var addition = /* BooleanExpression */Block.__(10, [
              addition_000,
              /* Plus */6,
              addition_002
            ]);
          return /* AssignmentExpression */Block.__(9, [
                    logicValueToJavaScriptAST(node[2]),
                    addition
                  ]);
      case 4 : 
          var value = node[0];
          if (typeof value === "number" || value.tag) {
            return /* Unknown */0;
          } else {
            return /* VariableDeclaration */Block.__(8, [/* Identifier */Block.__(2, [value[1]])]);
          }
          break;
      case 5 : 
          return /* Block */Block.__(15, [List.map(toJavaScriptAST, node[0])]);
      
    }
  }
}

exports.IdentifierSet             = IdentifierSet;
exports.LogicTree                 = LogicTree;
exports.undeclaredIdentifiers     = undeclaredIdentifiers;
exports.addVariableDeclarations   = addVariableDeclarations;
exports.logicValueToJavaScriptAST = logicValueToJavaScriptAST;
exports.toJavaScriptAST           = toJavaScriptAST;
/* include Not a pure module */
