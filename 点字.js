#!/usr/bin/env node
"use strict";

// 现在只认一个汉字，并且这个字要带调。词表先放着，整句还没接上。

var 字表 = {
  "你": { 带调: ["1345", "24", "3"], 不带调: ["1345", "24"] },
  "好": { 带调: ["125", "235", "3"], 不带调: ["125", "235"] },
  "中": { 带调: ["34", "256", "1"], 不带调: ["34", "256"] },
  "国": { 带调: ["1245", "135", "2"], 不带调: ["1245", "135"] },
  "人": { 带调: ["245", "356", "2"], 不带调: ["245", "356"] },
  "民": { 带调: ["134", "126", "2"], 不带调: ["134", "126"] },
  "北": { 带调: ["12", "2346", "3"], 不带调: ["12", "2346"] },
  "京": { 带调: ["1245", "16", "1"], 不带调: ["1245", "16"] }
};

var 词表 = ["中国人", "你好", "中国", "人民", "北京"];

var 数号 = "3456";

var 数字点位 = {
  "0": "245",
  "1": "1",
  "2": "12",
  "3": "14",
  "4": "145",
  "5": "15",
  "6": "124",
  "7": "1245",
  "8": "125",
  "9": "24"
};

var 标点点位 = {
  "。": ["5", "23"],
  "，": ["5"],
  "？": ["5", "3"],
  "！": ["56", "2"]
};

function 主程序(参数) {
  if (参数.length !== 1) {
    process.stderr.write("没法点字：认不出\n");
    return 2;
  }
  var 句子 = 参数[0];
  if (句子.length === 0) {
    process.stderr.write("没法点字：认不出\n");
    return 2;
  }

  var 各方 = [];
  var 位置 = 0;
  var 上一个是词 = false;

  while (位置 < 句子.length) {
    var 当前 = 句子.charAt(位置);
    if (数字点位.hasOwnProperty(当前)) {
      var 数字 = [数号];
      while (位置 < 句子.length && 数字点位.hasOwnProperty(句子.charAt(位置))) {
        数字.push(数字点位[句子.charAt(位置)]);
        位置 += 1;
      }
      if (上一个是词) {
        各方.push("");
      }
      各方.push(数字.join(" "));
      上一个是词 = true;
    } else if (标点点位.hasOwnProperty(当前)) {
      if (!上一个是词) {
        process.stderr.write("没法点字：认不出\n");
        return 2;
      }
      各方.push(标点点位[当前].join(" "));
      位置 += 1;
    } else if (字表[当前]) {
      var 词长 = 1;
      for (var i = 0; i < 词表.length; i += 1) {
        var 词 = 词表[i];
        if (词.length > 词长 && 句子.slice(位置, 位置 + 词.length) === 词 && 词.charAt(0) === 当前) {
          词长 = 词.length;
        }
      }
      if (上一个是词) {
        各方.push("");
      }
      if (词长 === 1) {
        各方.push(字表[当前].带调.join(" "));
      } else {
        for (var j = 位置; j < 位置 + 词长; j += 1) {
          var 词里的字 = 句子.charAt(j);
          if (!字表[词里的字]) {
            process.stderr.write("没法点字：认不出\n");
            return 2;
          }
          各方.push(字表[词里的字].不带调.join(" "));
        }
      }
      位置 += 词长;
      上一个是词 = true;
    } else {
      process.stderr.write("没法点字：认不出\n");
      return 2;
    }
  }

  process.stdout.write(各方.join(" ") + "\n");
  return 0;
}

if (require.main === module) {
  process.exit(主程序(process.argv.slice(2)));
}

module.exports = { 主程序: 主程序, 字表: 字表, 词表: 词表 };
