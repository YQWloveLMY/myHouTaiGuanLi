<template>
    <!-- SPU模块    理解为一个商品的类 -->
    <div>
        <el-card shadow="always" style="margin:20px 0">
            <!-- 当不是0场景的时候就不允许使用 -->
            <Category @getCategoryId="getCategoryId" :show="scene!=0" />
        </el-card>
        <el-card shadow="always" style="margin:20px 0">
            <!-- 三个部分进行切换显示 -->
            <div v-show="scene==0">
                <el-button type="primary" size="default" @click="addSpu" icon="el-icon-plus" :disabled="!category3Id">添加Spu</el-button>
                <!-- 展示spu列表结构 -->
                <el-table border stripe style="width:100%;margin-top:20px" :data="records">
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="spuName" label="Spu名称" width="width">
                    </el-table-column>
                    <el-table-column prop="description" label="Spu描述" width="width">
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <!-- 这里为了有title提示可以用自己封装的HintButton或hint-button，但是elementUI也有已经定义好的 -->
                            <el-button type="success" size="mini" icon="el-icon-plus" title="添加spu" @click="addSku(row)"></el-button>
                            <el-button @click="updateSpu(row)" type="warning" size="mini" icon="el-icon-edit" title="修改spu"></el-button>
                            <el-button type="info" size="mini" icon="el-icon-info" title="查看当前spu的sku列表" @click="handler(row)"></el-button>
                            <el-popconfirm style="margin-left:10px" title="确定删除当前spu吗" @onConfirm="deleteSpu(row)">
                                <el-button type="danger" size="mini" icon="el-icon-delete" title="删除spu" slot="reference"></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 
                    分页器
                   @size-change="handleSizeChange" 每一页展示多少的数据
                   @current-change="handleCurrentChange" 点击第几页触发
                 -->
                <el-pagination @size-change="handleSizeChange" @current-change="getSpuList" :current-page="page" :page-size="limit" :page-sizes="[5,10,20]" layout=" prev, pager, next,jumper,->,sizes,total" :total="total" style="text-align:center">
                </el-pagination>
            </div>
            <!-- 添加或修改spu -->
            <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu"></SpuForm>
            <!-- 添加sku -->
            <SkuForm v-show="scene==2" ref="sku" @changeScenes="changeScenes"></SkuForm>
        </el-card>
        <!-- 显示sku信息的对话框 -->
        <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
            <el-table :data="skuList" style="width:100%" v-loading="loading">
                <el-table-column prop="skuName" label="名称" width="300" align="center"></el-table-column>
                <el-table-column prop="price" label="价格" width="width" align="center"></el-table-column>
                <el-table-column prop="weight" label="重量" width="width" align="center"></el-table-column>
                <el-table-column label="默认图" width="width">
                    <template slot-scope="{row,$index}">
                        <img :src="row.skuDefaultImg" alt="" style="width:60px;height:60px">
                    </template>
                </el-table-column>

            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
    data() {
        return {
            category1Id: "",
            category2Id: "",
            category3Id: "",
            // 控制三级联动是否可以操作

            // 初始化参数
            page: 1,
            limit: 5,
            records: [], //spu列表数据
            total: 0, //分页器一共要展示的数据条数
            scene: 0, //0代表展示列表数据，1代表展示添加或修改spu，2代表添加sku
            // 控制对话框的显示与隐藏
            dialogTableVisible: false,

            spu: {},
            // 存储sku列表数据
            skuList: [],
            // 加载效果
            loading: true,
        };
    },
    name: "Spu",
    components: { SpuForm, SkuForm },
    methods: {
        // 获取spu列表数据
        async getSpuList(pages = 1) {
            this.page = pages;
            const { page, limit, category3Id } = this;
            // 需要携带三个参数：page：当前第几页 limit：某一页中展示多少数据 category3Id
            let result = await this.$API.spu.reqSpuList(
                page,
                limit,
                category3Id
            );
            if (result.code == 200) {
                this.total = result.data.total;
                this.records = result.data.records;
            }
        },
        // 三级联动组件回调,可以传递相应子组件id给父组件
        getCategoryId({ categoryId, level }) {
            //categoryId:获取123级id，level：区分是第几级
            if (level == 1) {
                this.category1Id = categoryId;
                // 每一次选中第一级分类，后面二级三级分类都要置空
                this.category2Id = "";
                this.category3Id = "";
            } else if (level == 2) {
                this.category2Id = categoryId;
                this.category3Id = "";
            } else {
                this.category3Id = categoryId;
                // 获取spu列表进行展示，发请求
                this.getSpuList();
            }
        },
        // 分页器每一页展示的数据变化的回调
        handleSizeChange(limit) {
            this.limit = limit;
            this.getSpuList();
        },
        // 添加spu按钮的回调
        addSpu() {
            this.scene = 1;
            // 通知子组件spuForm发请求，请求品牌信息和销售属性
            this.$refs.spu.addSpuData(this.category3Id);
        },
        // 修改spu的回调
        updateSpu(row) {
            this.scene = 1;
            // 通过refs获取子组件，以及子组件的数据和方法，然后可以在父组件中调用
            // 这样就可以达到在父组件中点击修改或添加按钮，触发子组件中的发请求方法
            this.$refs.spu.initSpuData(row);
        },
        // 自定义事件SpuForm回调
        changeScene(huidiao) {
            // scene是判断在0、1、2，flag是为了区分在第一页还是当前页
            this.scene = huidiao.scene;
            // 还需要重新获取数据，刷新页面
            if (huidiao.flag == "修改") {
                this.getSpuList(this.page);
            } else {
                this.getSpuList();
            }
        },
        // 删除spu按钮的回调
        async deleteSpu(row) {
            let result = await this.$API.spu.reqDeleteSpu(row.id);
            if (result.code == 200) {
                this.$message({
                    message: "删除成功",
                    type: "success",
                });
                if (this.records.length > 1) {
                    this.getSpuList(this.page);
                } else {
                    // 回到上一页
                    this.getSpuList(this.page - 1);
                }
            } else {
                this.$message({
                    message: "删除失败",
                    type: "danger",
                });
                console.log(result);
            }
        },
        // 添加sku按钮回调
        addSku(row) {
            this.scene = 2;
            // 父组件调用子组件，让在跳转到子组件的时候发请求，获取数据
            this.$refs.sku.getData(this.category1Id, this.category2Id, row);
        },
        // sku子组件自定义事件取消按钮回调
        changeScenes(scene) {
            this.scene = scene;
        },
        // 查看sku信息按钮的回调
        async handler(row) {
            // 显示对话框
            this.dialogTableVisible = true;
            // 保存是点击的哪一个spu对应的信息
            this.spu = row;
            // 获取sku列表展示
            let result = await this.$API.spu.reqSkuList(row.id);
            if (result.code == 200) {
                this.skuList = result.data;
                // 等待效果消失
                this.loading = false;
            }
        },
        // 关闭对话框的回调
        close(done) {
            // 清除服务器数据
            this.skuList = [];
            this.loading = true;
            // 关闭对话框
            done();
        },
    },
};
</script>

<style scoped>
</style>