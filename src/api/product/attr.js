//平台售卖属性管理模块接口文件
import request from "@/utils/request";
//获取一级分类数据接口 /admin/product/getCategory1 GET
export const reqCateGory1List = () =>
  request({
    url: `/admin/product/getCategory1`,
    method: "GET",
  });
// 获取二级分类数据接口 /admin/product/getCategory2/{category1Id} GET
export const reqCateGory2List = (category1Id) =>
  request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: "GET",
  });

// 获取三级分类数据接口 /admin/product/getCategory3/{category2Id} GET
export const reqCateGory3List = (category2Id) =>
  request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: "GET",
  });

// 获取平台属性数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} GET
export const reqAttrList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "GET",
  });

// 添加属性与属性值名称 /admin/product/saveAttrInfo   POST  参数：attrName attrValueList categoryId categoryLevel
export const reqAddorUpdateAttr = (data) =>
  request({
    url: "/admin/product/saveAttrInfo",
    method: "POST",
    data,
  });

//删除平台属性 /admin/product/deleteAttr/{attrId} DELETE
export const reqDeleteAttr = (attrId) =>
  request({
    url: `/admin/product/deleteAttr/${attrId}`,
    method: "DELETE",
  });
