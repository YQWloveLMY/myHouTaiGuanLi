<template>
    <div>
        <el-form ref="form" label-width="80px">
            <!-- SPU名称 -->
            <el-form-item label="SPU名称">
                {{spu.spuName}}
            </el-form-item>
            <el-form-item label="SKU名称" size="normal">
                <el-input placeholder="sku名称" @change="" v-model="skuInfo.skuName"></el-input>
            </el-form-item>
            <!-- 价格 -->
            <el-form-item label="价格(元)" size="normal">
                <el-input placeholder="价格(元)" @change="" type="number" v-model="skuInfo.price"></el-input>
            </el-form-item>
            <!-- 重量 -->
            <el-form-item label="重量(kg)" size="normal">
                <el-input placeholder="重量(kg)" @change="" v-model="skuInfo.weight"></el-input>
            </el-form-item>
            <el-form-item label="规格描述" size="normal">
                <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
            </el-form-item>
            <el-form-item label="平台属性" size="normal">
                <el-form :inline="true" ref="form" label-width="80px">
                    <!-- 遍历平台属性，动态生成下拉框-->
                    <el-form-item :label="attr.attrName" v-for="(attr) in attrInfoList" :key="attr.id">
                        <!-- 将数据收集到attr.attrIdAndValueId -->
                        <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
                            <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue) in attr.attrValueList" :key="attrValue.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性" size="normal">
                <el-form :inline="true" ref="form" label-width="80px">
                    <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
                        <el-select placeholder="请选择" v-model="saleAttr.saleAttrIdAndValueId">
                            <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="图片列表" size="normal">
                <!--  selection-change :选项改变的时候触发 -->
                <el-table border style="width:100%" :data="spuImageList" @selection-change="handleSelectionChange">
                    <!-- 
                        type="selection" :多选框实现 
                    -->
                    <el-table-column prop="prop" width="80" type="selection">
                    </el-table-column>
                    <!-- 显示图片 -->
                    <el-table-column prop="prop" label="图片" width="width">
                        <template slot-scope="{row,$index}">
                            <img :src="row.imgUrl" alt="" style="width:80px;height:80px">
                        </template>
                    </el-table-column>
                    <el-table-column prop="imgName" label="名称" width="width">
                    </el-table-column>
                    <el-table-column label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <!-- 二选一展示 ,排他法-->
                            <el-button v-if="row.isDefault==0" type="primary" size="small" @click="changeDefault(row)">设为默认</el-button>
                            <el-button v-else type="success" size="small" @click="">默认图片</el-button>
                        </template>

                    </el-table-column>
                </el-table>
            </el-form-item>
            <!-- 最后两个按钮 -->
            <el-form-item>
                <el-button type="primary" size="default" @click="save">保存</el-button>
                <el-button type="info" size="default" @click="cancel">取消</el-button>

            </el-form-item>

        </el-form>

    </div>
</template>

<script>
export default {
    name: "SkuForm",
    data() {
        return {
            // 存储图片信息
            spuImageList: [],
            // 存储销售属性数据
            spuSaleAttrList: [],
            // 存储平台属性
            attrInfoList: [],

            spu: {},
            // 收集勾选图片信息的字段
            imageList: [],
            // 收集发给服务器的数据
            skuInfo: {
                // 需要手动收集的数据——父组件给的数据
                category3Id: 0,
                spuId: 0,
                tmId: 0,
                // 需要通过数据双向绑定收集
                skuName: "",
                price: 0,
                weight: "", //重量
                skuDesc: "", //规格描述
                skuDefaultImg: "", //默认图片
                // 图片
                skuImageList: [
                    {
                        // id: 0,
                        // imgName: "string",
                        // imgUrl: "string",
                        // isDefault: "string",
                        // skuId: 0,
                        // spuImgId: 0,
                    },
                ],
                // 销售属性
                skuSaleAttrValueList: [
                    {
                        // id: 0,
                        // saleAttrId: 0,
                        // saleAttrName: "string",
                        // saleAttrValueId: 0,
                        // saleAttrValueName: "string",
                        // skuId: 0,
                        // spuId: 0,
                    },
                ],
                // 平台属性
                skuAttrValueList: [
                    {
                        // attrId: 0,
                        // valueId: 0,
                        // attrName: "string",
                        // id: 0,
                        // skuId: 0,
                        // valueName: "string",
                    },
                ],
            },
        };
    },
    methods: {
        // 父组件调用方法发请求
        async getData(category1Id, category2Id, spu) {
            // 收集父组件给的数据到子组件中
            this.skuInfo.category3Id = spu.category3Id;
            this.skuInfo.spuId = spu.id;
            this.skuInfo.tmId = spu.tmId;
            this.spu = spu;
            // 获取skuForm数据
            // 获取图片数据
            let result = await this.$API.spu.spuImageList(spu.id);
            if (result.code == 200) {
                // this.spuImageList = result.data;
                // 将服务器返回的图片的数据，每一条都要加上一个是否为默认的这样的一个参数再保存
                let list = result.data;
                list.forEach((item) => {
                    item.isDefault = 0;
                });
                this.spuImageList = list;
            }
            // 获取销售属性数据
            let result1 = await this.$API.spu.reqspuSaleAttrList(spu.id);
            if (result1.code == 200) {
                this.spuSaleAttrList = result1.data;
            }
            // 获取平台属性数据
            let result2 = await this.$API.spu.reqAttrInfoList(
                category1Id,
                category2Id,
                spu.category3Id
            );

            if (result2.code == 200) {
                this.attrInfoList = result2.data;
            }
        },
        // table表格复选框按钮实现
        handleSelectionChange(params) {
            // 获取勾选图片的信息，缺少isDefault字段,需要在获取服务器参数的时候加上
            this.imageList = params;
        },
        // 设为默认回调
        changeDefault(row) {
            this.spuImageList.forEach((item) => {
                item.isDefault = 0;
            });
            row.isDefault = 1;
            // 收集默认图片的地址到发送给服务器的数据中
            this.skuInfo.skuDefaultImg = row.imgUrl;
        },
        // 取消按钮回调
        cancel() {
            this.$emit("changeScenes", 0);
            // 清除数据
            Object.assign(this._data, this.$options.data());
        },
        // 保存按钮回调
        async save() {
            // 整理数据skuInfo，发送给服务器
            const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
            let arr = [];
            // 将attrInfoList中的数据整理一下放入skuInfo中-平台属性
            attrInfoList.forEach((item) => {
                if (item.attrIdAndValueId) {
                    const [attrId, valueId] = item.attrIdAndValueId.split(":");
                    let obj = { attrId, valueId };
                    arr.push(obj);
                }
            });
            // 赋值
            skuInfo.skuAttrValueList = arr;
            // 将spuSaleAttrList中的数据整理一下放入skuInfo中-销售属性
            let arr2 = [];
            spuSaleAttrList.forEach((item) => {
                if (item.saleAttrIdAndValueId) {
                    const [saleAttrId, saleAttrValueId] =
                        item.saleAttrIdAndValueId.split(":");
                    let obj2 = { saleAttrId, saleAttrValueId };
                    arr2.push(obj2);
                }
            });
            // 赋值
            skuInfo.skuSaleAttrValueList = arr2;
            // 将ImageList中的数据整理一下放入skuInfo中-选中的图片属性
            skuInfo.skuImageList = imageList.map((item) => {
                return {
                    imageName: item.imageName,
                    imageUrl: item.imgUrl,
                    isDefault: item.isDefault,
                    spuImageId: item.id,
                };
            });

            //发请求
            let result = await this.$API.spu.reqAddSku(skuInfo);
            if (result.code == 200) {
                this.$emit("changeScenes", 0);
                this.$message({
                    message: "添加sku成功",
                    type: "success",
                });
            }
        },
    },
};
</script>

<style scoped>
</style>