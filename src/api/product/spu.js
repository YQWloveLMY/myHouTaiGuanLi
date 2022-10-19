import request from "@/utils/request";
// 获取spu数据 /admin/product/{page}/{limit} GET page：当前第几页 limit：某一页中展示多少数据 category3Id
export const reqSpuList = (page, limit, category3Id) =>
  request({
    url: `/admin/product/${page}/${limit}`,
    method: "GET",
    params: { category3Id },
  });

//获取spu信息接口 /admin/product/getSpuById/{spuId} GET
export const reqSpu = (spuId) =>
  request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: "GET",
  });

// 获取品牌信息 /admin/product/baseTrademark/getTrademarkList GET
export const reqTradeMarkList = () =>
  request({
    url: "/admin/product/baseTrademark/getTrademarkList",
    method: "GET",
  });

// 获取spu图片接口 /admin/product/spuImageList/{spuId} GET
export const reqSpuImageList = (spuId) =>
  request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "GET",
  });

// 获取平台销售属性 /admin/product/baseSaleAttrList GET
export const reqBaseSaleAttrList = () =>
  request({
    url: "/admin/product/baseSaleAttrList",
    method: "GET",
  });

//修改||添加spu /admin/product/saveSpuInfo /admin/product/updateSpuInfo POST ，带给服务器的参数大致是一样的，只是是否有id
export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    // 如果有id，那就是修改
    return request({
      url: "/admin/product/updateSpuInfo",
      method: "POST",
      data: spuInfo,
    });
  } else {
    // 没有id就是添加
    return request({
      url: "/admin/product/saveSpuInfo",
      method: "POST",
      data: spuInfo,
    });
  }
};

// 删除spu /admin/product/deleteSpu/{spuId} DELETE
export const reqDeleteSpu = (spuId) =>
  request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: "DELETE",
  });

// 获取图片接口 /admin/product/spuImageList/{spuId} GET
export const spuImageList = (spuId) =>
  request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "GET",
  });

// 获取销售属性数据 /admin/product/spuSaleAttrList/{spuId} GET
export const reqspuSaleAttrList = (spuId) =>
  request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: "GET",
  });

// 获取属性信息 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} GET
export const reqAttrInfoList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "GET",
  });

// 添加sku /admin/product/saveSkuInfo POST
export const reqAddSku = (skuInfo) =>
  request({
    url: "/admin/product/saveSkuInfo",
    method: "POST",
    data: skuInfo,
  });

// 查看sku实例信息 /admin/product/findBySpuId/{spuId} GET
export const reqSkuList = (spuId) =>
  request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: "GET",
  });
