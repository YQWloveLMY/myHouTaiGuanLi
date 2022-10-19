<template>
    <div>
        <el-table border stripe :data="records">
            <el-table-column type="index" label="序号" width="80" align="center">
            </el-table-column>
            <el-table-column prop="skuName" label="名称" width="width">
            </el-table-column>
            <el-table-column prop="skuDesc" label="描述" width="width">
            </el-table-column>
            <el-table-column label="默认图片" width="110">
                <template slot-scope="{row,$index}">
                    <img :src="row.skuDefaultImg" alt="" style="width:70px;height:70px">
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量" width="80">
            </el-table-column>
            <el-table-column prop="price" label="价格" width="80">
            </el-table-column>
            <el-table-column label="操作" width="width">
                <template slot-scope="{row,$index}">
                    <!-- 上架和下架操作只能二选一 -->
                    <el-button v-if="row.isSale==0" type="success" size="small" @click="sale(row)" icon="el-icon-caret-top"></el-button>
                    <el-button v-else type="success" size="small" @click="cancel(row)" icon="el-icon-caret-bottom"></el-button>
                    <el-button type="primary" size="small" @click="edit" icon="el-icon-edit"></el-button>
                    <el-button type="info" size="small" @click="skuInfo(row)" icon="el-icon-info"></el-button>
                    <el-button type="danger" size="small" @click="" icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination style="text-align:center;margin-top:20px" @size-change="sizeChange" @current-change="getSkuList" :page-sizes="[5, 10, 20]" :page-size="limit" layout=" prev, pager, next, jumper,->,total, sizes" :total="total" background>
        </el-pagination>
        <!-- 抽屉显示 
        :visible.sync="drawer" 显示与隐藏
        -->
        <el-drawer :visible.sync="drawer" size="50%" :show-close="false" :title="`${skuMessage.skuName}的详细信息`">
            <!-- elementUI的布局显示
                el-row为一行，一行分为24分
                el-col为当前行内显示的内容
             -->
            <el-row>
                <el-col :span="5">名称</el-col>
                <el-col :span="16">{{skuMessage.skuName}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="5">描述</el-col>
                <el-col :span="16">{{skuMessage.skuDesc}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="5">价格</el-col>
                <el-col :span="16">{{skuMessage.price}}元</el-col>
            </el-row>
            <el-row>
                <el-col :span="5">平台属性</el-col>
                <el-col :span="16">
                    <template>
                        <el-tag style="margin-right:10px" type="success" size="mini" v-for="(attr) in skuMessage.skuAttrValueList" :key="attr.id">{{attr.attrId}}-{{attr.attrValueId}}</el-tag>
                    </template>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">商品图片</el-col>
                <el-col :span="16">
                    <!-- 轮播图 -->
                    <el-carousel height="400px" trigger="click">
                        <el-carousel-item v-for="item in skuMessage.skuImageList" :key="item.id">
                            <img :src="item.imgUrl" alt="" style="width:100%">
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </el-drawer>
    </div>
</template>

<script>
export default {
    name: "Sku",
    data() {
        return {
            page: 1, //代表当前页码
            limit: 5, //代表当页有几条数据
            records: [], //存储列表的数据
            total: 0, //一共有多少数据
            skuMessage: {}, //存储sku详细信息
            drawer: false, //抽屉的显示与隐藏
        };
    },
    mounted() {
        this.getSkuList();
    },
    methods: {
        // 获取sku列表方法
        async getSkuList(pages = 1) {
            this.page = pages;
            const { page, limit } = this;
            let result = await this.$API.sku.reqSkuList(page, limit);
            if (result.code == 200) {
                this.records = result.data.records;
                this.total = result.data.total;
            }
        },
        // 分页器的回调
        sizeChange(limit) {
            this.limit = limit;
            this.getSkuList();
        },
        // 上架
        async sale(row) {
            let result = await this.$API.sku.reqSale(row.id);
            if (result.code == 200) {
                // 切换为下架按钮显示
                row.isSale = 1;
                this.$message({
                    message: "上架成功",
                    type: "success",
                });
            }
        },
        // 下架
        async cancel(row) {
            let result = await this.$API.sku.reqCancel(row.id);
            if (result.code == 200) {
                // 切换为下架按钮显示
                row.isSale = 0;
                this.$message({
                    message: "下架成功",
                    type: "success",
                });
            }
        },
        // 弹出信息
        edit() {
            this.$message({
                message:
                    "我知道你很急但是你先别急，这个还在开发中~~~~（主要是后端不给接口）",
            });
        },
        // 获取sku详情的方法
        async skuInfo(row) {
            let result = await this.$API.sku.reqSkuById(row.id);
            if (result.code == 200) {
                this.skuMessage = result.data;
            }
            // 展示抽屉
            this.drawer = true;
        },
    },
};
</script>

<style>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
.el-carousel__button {
    width: 10px;
    height: 10px;
    background: pink;
    border-radius: 50%;
}
.el-drawer__header > :first-child {
    text-align: center;
}
</style>

<style scoped>
.el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
}
.el-col {
    margin: 10px 10px;
}
</style>