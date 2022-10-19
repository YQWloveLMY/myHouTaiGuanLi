<template>
    <div>
        <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>
        <!-- 表格组件
            data：表格组件需要展示的数据----数组类型
            el-table-column 为一列
            label :为列标题
            width：对应列宽度
            align:标题对齐方式
            type:展示序号
            prop:对应列内容的字段，为data中的数组的字段名，输入字段名，可以展示对应的值，比如这里就为list[0].tmName中的tmName，所以就展示每一项数据的tmName
            注意：table组件以列为单位展示
            要在elementUI中新增标签，采用作用域插槽的方式！
         -->
        <el-table style="width: 100%;marginTop:20px" border :data="list">
            <el-table-column prop="prop" label="序号" width="80px" align="center" type="index"></el-table-column>
            <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
            <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
                <!-- 这里用作用域插槽的办法展示图片 row为作用域插槽回传的每一条数据 -->
                <template slot-scope="{row,$index}">
                    <img :src="row.logoUrl" style="width:60px;height:60px">
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
                <template slot-scope="{row,$index}">
                    <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 
            分页器
            current-page :当前第几页
            page-sizes：连续页码数
            page-size：每一页展示数据
            total：数据总条数
             layout：调整位置
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" :当前页码改变的时候触发
         -->
        <el-pagination style="margin-top:20px;textAlign:center;" :current-page="page" :page-sizes="[5, 10, 20]" :page-size="limit" layout="prev, pager, next, jumper,->,total, sizes" :total="total" @size-change="handleSizeChange" @current-change="getPageList">
        </el-pagination>
        <!-- 对话框 
            visible.sync：控制对话框的显示与影藏
            :label-width：设置label属性宽度
            收集表单信息需要在el-form中添加:model属性，收集到对应的对象身上,表单验证也需要这个属性
            Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
            并将 Form-Item 的 prop 属性设置为需校验的字段名即可
            表单需要通过验证规则之后才能提交，需要用到submitForm(formName)
        -->
        <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
            <el-form style="width:90%" :model="tmForm" :rules="rules" ref="ruleForm">
                <el-form-item label="品牌名称" label-width="100px" prop='tmName'>
                    <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
                </el-form-item>
                <!-- 上传图片
                action:图片上传地址
                :on-success="handleAvatarSuccess" ：图片上传成功的回调
                :before-upload="beforeAvatarUpload" ：图片上传之前的回调
                完成了样式
                 -->
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <el-upload class="avatar-uploader" action="dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <!-- 上传成功就展示这个图片 -->
                        <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                        <!-- 没就显示加号 -->
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
                    </el-upload>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "tradeMark",
    data() {
        // 自定义校验规则
        var validatetmName = (rule, value, callback) => {
            // rule：校验规则 value：用户输入文本 callback：放行函数
            if (value.length < 2 || value.length > 10) {
                callback(new Error("品牌名称只能为2-10个字符"));
            } else {
                callback();
            }
        };
        return {
            // 当前页码
            page: 1,
            // 每一页展示几条数据
            limit: 5,
            //列表展示数据
            list: [],
            //展示数据总条数
            total: 0,
            // 对话框的显示与隐藏控制属性
            dialogFormVisible: false,
            // 收集品牌信息：对象身上的属性明要根据服务器的要求来确定
            tmForm: {
                tmName: "",
                logoUrl: "",
            },
            //表单验证
            rules: {
                // 品牌名称验证规则
                tmName: [
                    {
                        required: true, //是否必须
                        message: "请输入品牌名称", //提示信息
                        trigger: "blur", //用户行为，什么行为下触发
                    },
                    // 已有校验规则
                    // {
                    //     min: 2, //最小字符
                    //     max: 10, //最多字符
                    //     message: "长度在 2 到 10 个字符",
                    //     trigger: "change",
                    // },
                    //自定义校验规则
                    { validator: validatetmName, trigger: "change" },
                ],
                // 品牌LOGO验证规则
                logoUrl: [
                    {
                        required: true,
                        message: "请上传品牌LOGO",
                    },
                ],
            },
        };
    },
    mounted() {
        // 组件挂载的时候发api请求
        this.getPageList();
    },
    methods: {
        // 获取列表数据的方法
        async getPageList(pager = 1) {
            // 默认为1，当点击的时候就传递点击的参数 :pager为点击的页码数，elementUI默认有这里将点击的回调合并成了一个函数
            this.page = pager;
            const { page, limit } = this;
            let result = await this.$API.trademark.reqTradeMarkList(
                page,
                limit
            );
            if (result.code == 200) {
                this.total = result.data.total;
                this.list = result.data.records;
            }
        },
        //当分页器某一页需要展示数据条数发生变化时触发
        handleSizeChange(limit) {
            this.limit = limit;
            this.getPageList();
        },
        //点击添加品牌按钮，显示对话框
        showDialog() {
            this.dialogFormVisible = true;
            // 清除上一次输入的数据
            this.tmForm = { tmName: "", logoUrl: "" };
        },
        //修改某个品牌,显示对话框
        updateTradeMark(row) {
            // row即为当前用户选择的品牌的信息
            // 显示对话框
            this.dialogFormVisible = true;
            // 将这个品牌的信息赋值给tmForm，但是不能直接操作这个信息，需要用到浅拷贝，否则就是直接操控这个对象了
            this.tmForm = { ...row };
        },
        // 图片上传成功
        handleAvatarSuccess(res, file) {
            // res是上传成功之后返回的数据
            // this.imageUrl = URL.createObjectURL(file.raw);
            this.tmForm.logoUrl = res.data;
        },
        // 图片上传之前
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        //点击确定，修改或添加品牌,因为添加和修改用的是一个对话框
        addOrUpdateTradeMark() {
            // 当全部的验证字段通过，才能去书写验证逻辑
            this.$refs.ruleForm.validate(async (success) => {
                if (success) {
                    // 成功
                    // 点击确定隐藏
                    this.dialogFormVisible = false;
                    let result =
                        await this.$API.trademark.reqAddorUpdateTradeMark(
                            this.tmForm
                        );
                    if (result.code == 200) {
                        // 弹出信息
                        if (this.tmForm.id) {
                            this.$message({
                                message: "修改品牌成功",
                                type: "success",
                            });
                            // 停留在当前修改的页面
                            this.getPageList(this.page);
                        } else {
                            this.$message({
                                message: "添加品牌成功",
                                type: "success",
                            });
                            // 成功以后，再次获取品牌列表展示
                            this.getPageList();
                        }
                    } else {
                        console.log(result);
                        this.$message.error("出错!");
                    }
                } else {
                    this.$message.error("检查元素是否输入正确");
                    return false;
                }
            });
        },
        //删除品牌
        deleteTradeMark(row) {
            this.$confirm("此操作将永久删除该品牌, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                // 点击确定的时候触发
                .then(async () => {
                    // 发请求
                    let result = await this.$API.trademark.reqDeleteTradeMark(
                        row.id
                    );
                    if (result.code == 200) {
                        this.$message({
                            type: "success",
                            message: "删除成功!",
                        });
                        // 判断，如果该品牌是该页的最后一个元素，那么删除之后应该是去到上一页，如果不是，停留当前页
                        if (this.list.length > 1) {
                            this.getPageList(this.page);
                        } else {
                            this.getPageList(this.page - 1);
                        }
                    }
                })
                // 点击取消的时候触发
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
    },
};
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>