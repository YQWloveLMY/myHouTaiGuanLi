<template>
    <div>
        <el-card style="margin:20px 0px">
            <Category @getCategoryId="getCategoryId" :show="!isShowTable" />
        </el-card>
        <el-card>
            <!-- 展示属性页面结构 -->
            <div v-show="isShowTable">
                <!-- 当没有选择三级分类的时候是禁用的 -->
                <el-button type="primary" size="default" icon="el-icon-plus" :disabled="!cate3Id" @click="addAttr">添加属性</el-button>
                <!-- 展示平台属性表格 -->
                <el-table border stripe style="width:100%;margin-top:20px" :data="attrList">
                    <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
                    <el-table-column prop="attrName" label="属性名称" width="150px"></el-table-column>
                    <el-table-column prop="prop" label="属性值列表" width="width">
                        <template slot-scope="{row,$index}">
                            <el-tag style="margin:0px 10px" type="success" v-for="(attrValue) in row.attrValueList" :key="attrValue.id">{{attrValue.valueName}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="150px">
                        <!-- 添加了修改和删除按钮 -->
                        <template slot-scope="{row,$index}">
                            <el-button type="warning" size="mini" @click="updateAttr(row)" icon="el-icon-edit"></el-button>
                            <el-button type="danger" size="mini" @click="deleteAttr(row)" icon="el-icon-delete"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 添加或修改属性 -->
            <div v-show="!isShowTable">
                <el-form ref="form" label-width="80px" :inline="true" :model="attrInfo">
                    <el-form-item label="属性名">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 添加属性值 -->
                <el-button type="primary" @click="addAttrValue" icon="el-icon-plus" :disabled="!attrInfo.attrName">添加属性值</el-button>
                <el-button @click="isShowTable=true">取消</el-button>
                <!-- 
                    table:
                    stripe:是否为斑马纹-一浅一深
                    prop:对应列内容的字段名，也可以使用 property 属性
                    label:标题
                 -->
                <el-table border style="width:100%;margin-top:10px" :data="attrInfo.attrValueList">
                    <el-table-column type="index" align="center" width="80" label="序号">
                    </el-table-column>
                    <el-table-column width="width" prop="prop" label="属性值名称">
                        <template slot-scope="{row,$index}">
                            <!-- 输入属性值的名称，当失去焦点和获取焦点的时候要在span和input之间切换 -->
                            <!-- 同时当input框显示的时候要自动获取焦点,且不能输入空或者空格 -->
                            <el-input ref="valueRef" v-if="row.flag" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
                            <span v-else @click="toEdit(row)" style="display:block">{{row.valueName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="width" prop="prop" label="操作">
                        <!-- 删除以及气泡确认框 -->
                        <template slot-scope="{row,$index}">
                            <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                                <el-button type="danger" size="mini" icon="el-icon-delete" slot="reference">删除</el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 保存按钮当没有数据的时候是不能使用的 -->
                <el-button type="primary" style="margin-top:10px" @click="addOrUpdate" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
                <el-button @click="isShowTable=true">取消</el-button>

            </div>
        </el-card>
    </div>
</template>

<script>
// 按需引入lodash中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
    name: "Attr",
    data() {
        return {
            cate1Id: "",
            cate2Id: "",
            cate3Id: "",
            // 接收平台属性字段
            attrList: [],
            //控制tabale表格的显示与隐藏
            isShowTable: true,
            // 收集新增、修改属性相关信息   数据格式：一个属性名中，可以对应多个属性值
            attrInfo: {
                attrName: "", //属性名
                attrValueList: [],
                // 这里不能直接在对象中收集三级分类id，即this.cate3Id
                categoryId: 0, //三级分类id
                categoryLevel: 3, //代表三级分类
            },
            //input与span的交替显示,但是不能放在这里，一个变量没办法标记多个任务,当点击添加属性值的时候，给每一个属性都添加一个flag
            // flag: true,
        };
    },
    methods: {
        // 自定义事件回调,根据不同的几级组件赋值
        getCategoryId({ categoryId, level }) {
            if (level == 1) {
                this.cate1Id = categoryId;
                this.cate2Id = "";
                this.cate3Id = "";
            } else if (level == 2) {
                this.cate2Id = categoryId;
                this.cate3Id = "";
            } else {
                // 这里代表三个id都有了
                this.cate3Id = categoryId;
                // 发请求获取平台属性
                this.getAttrList();
            }
        },
        // 获取平台属性数据
        async getAttrList() {
            const { cate1Id, cate2Id, cate3Id } = this;
            let result = await this.$API.attr.reqAttrList(
                cate1Id,
                cate2Id,
                cate3Id
            );
            if (result.code == 200) {
                this.attrList = result.data;
            }
        },
        //添加属性值
        addAttrValue() {
            this.attrInfo.attrValueList.push({
                //属性值，每一个属性值都是一个对象
                //相应属性名的id,在添加的时候，服务器中没有该属性名，所以为undefined，只有当修改的时候才有属性名的ID
                attrId: this.attrInfo.id,
                valueName: "",
                flag: true,
            });
            // 当添加一个属性值的时候自动获取焦点
            this.$nextTick(() => {
                this.$refs.valueRef.focus();
            });
        },
        // 添加属性按钮回调
        addAttr() {
            // 切换table的显示和隐藏
            this.isShowTable = false;
            //清空上一次新增或修改属性的时候input输入的数据
            this.attrInfo = {
                attrName: "",
                attrValueList: [],
                // 收集三级分类id
                categoryId: this.cate3Id,
                categoryLevel: 3,
            };
        },
        // 修改某一个属性的回调
        updateAttr(row) {
            this.isShowTable = false;
            // 将选中的属性赋值给attrInfo,只能为深拷贝，否则为引用地址赋值，会影响原数据，因为对象内部还有对象，所以不能为浅拷贝
            this.attrInfo = cloneDeep(row);
            // 在修改某一个属性的时候，将相应的属性值元素加上flag这个标记
            this.attrInfo.attrValueList.forEach((value) => {
                // 默认为查看模式，但是这样添加视图不会发生变化，因为flag不是响应式数据
                // value.flag = false;
                // 要用$set
                this.$set(value, "flag", false);
            });
        },
        // 切换span或input的回调
        toLook(row) {
            // 判断用户输入是否正确
            // 要去除首尾空格.trim()
            if (row.valueName.trim() == "") {
                this.$message({
                    message: "属性值不可以为空哦",
                    type: "warning",
                });
                return;
            } else if (
                this.attrInfo.attrValueList.some((value) => {
                    // 需要将自己从循环中去除，否则永远都为true
                    if (row !== value) {
                        // row就为当前新增的这个元素
                        return row.valueName.trim() == value.valueName;
                    }
                })
            ) {
                this.$message({
                    message: "已经有该属性值了",
                    type: "warning",
                });
            } else {
                // 且新增的属性值不可以重复
                row.flag = false;
            }
        },
        // 点击span自动获取input焦点
        toEdit(row) {
            row.flag = true;
            // 自动获取焦点
            this.$nextTick(() => {
                this.$refs.valueRef.focus();
            });
        },
        // 确认删除属性值回调
        deleteAttrValue(index) {
            // 根据index删除数据
            this.attrInfo.attrValueList.splice(index, 1);
        },
        // 保存修改或添加，给服务器
        async addOrUpdate() {
            // 先整理数据，去掉flag，去掉空属性值
            this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
                (value) => {
                    // 过滤属性值不为空的
                    if (value.valueName != "") {
                        // 删除flag属性
                        delete value.flag;
                        return true;
                    }
                }
            );
            let result = await this.$API.attr.reqAddorUpdateAttr(this.attrInfo);
            // 这个地方好像只能对自定义的数据使用，系统原有的数据好像是不允许修改
            if (result.code == 200) {
                this.$message({
                    message: "保存成功",
                    type: "success",
                });
                // 保存成功之后再次获取信息展示
                this.getAttrList();
                this.isShowTable = true;
            }
        },
        // 删除平台属性
        // 返回删除成功，但是服务器里面并不会删除
        async deleteAttr(row) {
            let result = await this.$API.attr.reqDeleteAttr(row.categoryId);
            console.log(row);
            if (result.code == 200) {
                this.$message({
                    message: "删除成功",
                    type: "success",
                });
                this.getAttrList();
            } else {
                this.$message({
                    // 不可以删除系统数据，会显示失败
                    message: "删除失败，系统数据不能删除",
                    type: result,
                });
            }
        },
    },
};
</script>

<style scoped>
</style>