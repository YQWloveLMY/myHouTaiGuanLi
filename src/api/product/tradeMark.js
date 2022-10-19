// 获取品牌管理数据模块
import request from "@/utils/request";
// 获取品牌列表接口 /admin/product/baseTrademark/{page}/{limit}  GET
export const reqTradeMarkList = (page, limit) =>
  request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "GET",
  });

//添加品牌操作 /admin/product/baseTrademark/save POST   携带参数：品牌名称、品牌LOGO
// 修改品牌操作 /admin/product/baseTrademark/update PUT     携带参数：id、修改后名字、logo
// 将这两个封装到一个函数中
export const reqAddorUpdateTradeMark=(tradeMark)=>{
    if (tradeMark.id) {
        // 如果数据中有ID参数，则为修改
        return request({url:'/admin/product/baseTrademark/update',method:'PUT',data:tradeMark})
    }else{
        //没有ID则为新增
        return request({url:'/admin/product/baseTrademark/save',method:'POST',data:tradeMark})
    }
}

//删除品牌接口 /admin/product/baseTrademark/remove/{id} DELETE
export const reqDeleteTradeMark=(id)=>request({
    url:`/admin/product/baseTrademark/remove/${id}`,
    method:'DELETE'
})