const data = require("./data.json");
// 模拟主页数据大屏的数据
module.exports = [
  {
    url: "/home/list",
    type: "get",
    response: (config) => {
      const items = data.items;
      return {
        code: 20000,
        data,
      };
    },
  },
];
