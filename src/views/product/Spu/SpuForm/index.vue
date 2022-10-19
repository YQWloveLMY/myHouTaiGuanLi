<template>
    <div>
        <!-- label-width:这会让所有的item继承这个属性 -->
        <el-form ref="form" label-width="80px" :model="spu">
            <el-form-item label="SPU名称">
                <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>

            </el-form-item>
            <el-form-item label="品牌">
                <el-select placeholder="请选择品牌" v-model="spu.tmId">
                    <el-option :label="tm.tmName" :value="tm.id" v-for="(tm) in tradeMarkList" :key="tm.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input type="textarea" rows="4" placeholder="请输入SPU描述" v-model="spu.description"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片">
                <!-- 
                    list-type:文件列表类型
                    :on-preview="handlePictureCardPreview"  预览事件
                    :on-remove="handleRemove"   删除事件
                    :on-success="handleSuccess" 文件上传成功时的回调
                    file-list:文件列表展示
                 -->
                <el-upload action="dev-api/admin/product/fileUpload" :file-list="spuImageList" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性">
                <!-- 通过计算属性得出还有几个没选择 -->
                <el-select :placeholder="`还有${unSelectSaleAttr.length}项未被选择`" v-model="attrIdAndAttrName">
                    <!-- select收集的是option中value的值 同时收集id与属性名 -->
                    <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect) in unSelectSaleAttr" :key="unselect.id">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" style="margin-left:10px" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
                <!-- 展示的是当前SPU属于自己的销售属性 -->
                <el-table border style="width:100%;margin-top:10px" :data="spu.spuSaleAttrList">
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="200">
                    </el-table-column>
                    <el-table-column prop="prop" label="属性值名称列表" width="width">
                        <!-- row是一个销售属性 -->
                        <template slot-scope="{row,$index}">
                            <!-- 显示已有的销售属性值 -->
                            <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="handleClose(row,index)">
                                {{tag.saleAttrValueName}}
                            </el-tag>
                            <!-- input和button切换展示 -->

                            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm(row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="100">
                        <template slot-scope="{row,$index}">
                            <!-- 删除销售属性 -->
                            <el-button type="danger" size="mini" @click="spu.spuSaleAttrList.splice($index,1)" icon="el-icon-delete"></el-button>

                        </template>
                    </el-table-column>
                </el-table>

            </el-form-item>
            <!-- 最后两个按钮 -->
            <el-form-item>
                <!-- 整理参数发给服务器，且回到0的场景 -->
                <el-button type="primary" size="default" @click="addOrUpdateSpu">保存</el-button>
                <el-button type="info" size="default" @click="cancel">取消</el-button>

            </el-form-item>
        </el-form>

    </div>
</template>

<script>
export default {
    name: "SpuForm",
    data() {
        return {
            dialogImageUrl: "",
            dialogVisible: false,
            // 存储spu信息属性，带给服务器的数据都在这里
            spu: {
                // 由于这里需要收集用户输入的数据，然后传递给服务器用作添加或者修改的数据，所以不能只是一个空对象
                //因为要知道具体是收集的什么
                // 三级分类id
                category3Id: 0,
                // 描述
                description: "",
                // spu名称
                spuName: "",
                // 品牌id
                tmId: 0,
                //spu图片信息，带给服务器的数
                spuImageList: [
                    {
                        id: 0,
                        imgName: "",
                        imgUrl: "",
                        spuId: 0,
                    },
                ],
                // 平台属性与属性值的收集
                spuSaleAttrList: [
                    // {
                    //     baseSaleAttrId: 0,
                    //     id: 0,
                    //     saleAttrName: "string",
                    //     spuId: 0,
                    //     spuSaleAttrValueList: [
                    //         {
                    //             baseSaleAttrId: 0,
                    //             id: 0,
                    //             isChecked: "string",
                    //             saleAttrName: "string",
                    //             saleAttrValueName: "string",
                    //             spuId: 0,
                    //         },
                    //     ],
                    // },
                ],
            },
            // 存储品牌信息
            tradeMarkList: [],
            // 存储spu图片数据，不是带给服务器的，只是储存展示用
            spuImageList: [],
            // 存储销售属性列表
            saleList: [],
            // 收集未被选择销售属性的id
            attrIdAndAttrName: "",

            // 属性值标签需要的数据
            dynamicTags: ["标签一", "标签二", "标签三"],

            inputValue: "",
        };
    },
    methods: {
        // 照片墙在删除图片的时候触发
        handleRemove(file, fileList) {
            // console.log(file, fileList); file 为删除的那个图片，fileList为剩下的图片列表

            // 照片墙在删除图片的时候需要收集数据
            // 注意，对于已有的数据，需要有name和url字段，因为elementUI需要这个字段来展示图片
            // 但是服务器并不需要这个字段，所以在提交给服务器之前需要对其进行处理，去掉这两个字段
            this.spuImageList = fileList;
        },
        // 照片墙显示预览大图的时候触发
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 新增照片墙图片成功的回调
        handleSuccess(response, file, fileList) {
            this.spuImageList = fileList;
        },

        // 初始化spuform数据,由父组件触发
        async initSpuData(spu) {
            // 发请求获取数据，获取spu信息
            let result = await this.$API.spu.reqSpu(spu.id);
            if (result.code == 200) {
                this.spu = result.data;
            }
            // 获取品牌信息
            let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
            if (tradeMarkResult.code == 200) {
                this.tradeMarkList = tradeMarkResult.data;
            }
            // 获取spu图片数据
            let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
            // console.log(spuImageResult);
            if (spuImageResult.code == 200) {
                // this.spuImageList = spuImageResult.data;
                // console.log(spuImageResult.data);
                // // 由于展示多个图片的element组件对格式有要求，所以这里需要先对服务器返回的数据处理一下
                // 由于有些图片服务器中并没有对应的imgName和imgUrl，所以返回的还是显示不了
                let listArr = spuImageResult.data;

                listArr.forEach((element) => {
                    element.name = element.imgName;
                    element.url = element.imgUrl;
                });
                // 将整理好的数据进行替换
                this.spuImageList = listArr;
            }
            // 获取平台销售属性
            let saleResult = await this.$API.spu.reqBaseSaleAttrList();
            if (saleResult.code == 200) {
                this.saleList = saleResult.data;
            }
        },
        // 添加新的销售属性
        addSaleAttr() {
            // 将收集到的销售属性分割
            const [baseSaleAttrId, saleAttrName] =
                this.attrIdAndAttrName.split(":");
            // 向spuSaleAttrList添加新的销售属性:属性id，属性名，属性值
            let newSaleAttr = {
                baseSaleAttrId,
                saleAttrName,
                spuSaleAttrValueList: [],
            };

            this.spu.spuSaleAttrList.push(newSaleAttr);
            // 且清除这个select框
            this.attrIdAndAttrName = "";
        },

        // 删除属性值标签需要的方法
        handleClose(row, index) {
            row.spuSaleAttrValueList.splice(index, 1);
        },
        // 添加属性值按钮回调
        addSaleAttrValue(row) {
            // row.inputVisible = true;注意，这样添加的属性值不是响应式的，需要通过$set这个方法添加
            // 添加控制button与input显示与隐藏
            this.$set(row, "inputVisible", true);
            // 添加用于收集用户输入的信息的东西
            this.$set(row, "inputValue", "");

            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // input失去焦点的时候触发
        handleInputConfirm(row) {
            // 收集用户输入
            const { baseSaleAttrId, inputValue } = row;
            // 放到数组中，且变量名需要是服务器认识的变量名
            let newSaleAttrValue = {
                baseSaleAttrId,
                saleAttrValueName: inputValue,
            };
            //重复返回false，没有重复的返回true
            let ifpanduan = row.spuSaleAttrValueList.some((item) => {
                return item.saleAttrValueName == inputValue;
            });

            // 属性值不能为空
            if (inputValue.trim() == "") {
                this.$message({
                    message: "输入属性值不能为空",
                    type: "warning",
                });
                row.inputVisible = false;

                return;
            } else if (ifpanduan) {
                //属性值不能重复
                this.$message({
                    message: "属性值已经存在",
                    type: "warning",
                });
                row.inputVisible = false;

                return;
            } else {
                // 将输入的数据放到el-tag遍历的那个数组中进行展示
                row.spuSaleAttrValueList.push(newSaleAttrValue);
            }
            // 显示button
            row.inputVisible = false;
            // 清空
        },

        // 保存按钮回调
        async addOrUpdateSpu() {
            // 整理参数---只有照片墙的数据需要整理，其他的都双向绑定的时候收集过了
            // map，返回处理好的数据
            this.spu.spuImageList = this.spuImageList.map((item) => {
                return {
                    imgName: item.name,
                    // 不能带给服务器本地路径，要给上传图片的地址
                    imgUrl: (item.response && item.response.data) || item.url,
                };
            });
            let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
            if (result.code == 200) {
                this.$message({
                    message: "保存成功",
                    type: "success",
                });
                // 回到0的界面
                this.$emit("changeScene", {
                    scene: 0,
                    // 判断是否有id，有就是修改没就是添加
                    flag: this.spu.id ? "修改" : "添加",
                });
            }
            // 清理数据
            Object.assign(this._data, this.$options.data());
        },
        // 取消按钮回调
        cancel() {
            // 通知父亲切换场景
            this.$emit("changeScene", { scene: 0, flag: "修改" });
            // 清理数据
            // Object.assign es6新增方法，合并对象
            // this._data data中的响应式数据
            // this.$options 当前的配置对象
            Object.assign(this._data, this.$options.data());
        },
        // 父组件点击添加spu的时候触发
        async addSpuData(category3Id) {
            // 收集category3Id
            this.spu.category3Id = category3Id;
            // 发两个请求
            // 获取品牌数据
            let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
            if (tradeMarkResult.code == 200) {
                this.tradeMarkList = tradeMarkResult.data;
            }
            // 销售属性数据
            let saleResult = await this.$API.spu.reqBaseSaleAttrList();
            if (saleResult.code == 200) {
                this.saleList = saleResult.data;
            }
        },
    },
    computed: {
        // 还有多少个销售属性未被选择
        unSelectSaleAttr() {
            // 通过过滤实现从三个属性中选择出还没有被选中的属性
            let result = this.saleList.filter((item) => {
                return this.spu.spuSaleAttrList.every((item1) => {
                    return item.name != item1.saleAttrName;
                });
            });
            return result;
        },
    },
};
</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>