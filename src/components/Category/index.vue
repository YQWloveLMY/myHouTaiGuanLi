<template>
    <div>
        <!-- 三级联动全局组件 -->
        <el-form :inline="true" class="demo-form-inline" :model="cForm">
            <el-form-item label="一级分类">
                <!-- 因为二级数据的分类是根据选择的一级分类的id获取的，所以需要收集一级分类的id -->
                <!-- lable:展示的东西 value：获取的值 v-model：赋值给属性 -->
                <el-select placeholder="请选择" v-model="cForm.cate1Id" @change="handler1" :disabled="show">
                    <el-option :label="c1.name" :value="c1.id" v-for="(c1) in list1" :key="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select placeholder="请选择" v-model="cForm.cate2Id" @change="handler2" :disabled="show">
                    <el-option :label="c2.name" :value="c2.id" v-for="(c2) in list2" :key="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select placeholder="请选择" v-model="cForm.cate3Id" @change="handler3" :disabled="show">
                    <el-option :label="c3.name" :value="c3.id" v-for="(c3) in list3" :key="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "Category",
    data() {
        return {
            //一级分类数据
            list1: [],
            //二级分类数据
            list2: [],
            //三级分类数据
            list3: [],
            //收集一级分类id
            cForm: {
                cate1Id: "",
                cate2Id: "",
                cate3Id: "",
            },
        };
    },
    // 当在添加或修改的时候三级联动是不可以操作的
    props: ["show"],
    mounted() {
        //获取一级分类数据
        this.getCateGory1();
    },
    methods: {
        //获取一级分类数据的方法
        async getCateGory1() {
            let result = await this.$API.attr.reqCateGory1List();
            if (result.code == 200) {
                this.list1 = result.data;
            }
        },
        //一级分类改变的时候触发
        async handler1() {
            //首先清空分类的数据
            this.list2 = [];
            this.list3 = [];
            this.cForm.cate2Id = "";
            this.cForm.cate3Id = "";
            //获取二级数据
            const { cate1Id } = this.cForm;
            // 给父组件传递当前选中的分类的id   为了父组件能够区分是几级组件，需要传递一个level来完成
            this.$emit("getCategoryId", { categoryId: cate1Id, level: 1 });
            // 发请求
            let result = await this.$API.attr.reqCateGory2List(cate1Id);
            if (result.code == 200) {
                this.list2 = result.data;
            }
        },
        //二级分类改变的时候触发
        async handler2() {
            //首先清空分类的数据
            this.list3 = [];
            this.cForm.cate3Id = "";
            const { cate2Id } = this.cForm;
            // 给父组件传递当前选中的分类的id
            this.$emit("getCategoryId", { categoryId: cate2Id, level: 2 });
            // 发请求
            let result = await this.$API.attr.reqCateGory3List(cate2Id);
            if (result.code == 200) {
                this.list3 = result.data;
            }
        },
        // 三级分类事件改变的时候触发
        handler3() {
            const { cate3Id } = this.cForm;
            // 给父组件传递当前选中的分类的id
            this.$emit("getCategoryId", { categoryId: cate3Id, level: 3 });
        },
    },
};
</script>

<style>
</style>