<template>
    <!-- 底部右边带饼图的card -->
    <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header" class="header">
            <div class="category-head">
                <span>销售额类别占比</span>
                <el-radio-group v-model="value" size="medium">
                    <el-radio-button label="全部渠道"></el-radio-button>
                    <el-radio-button label="线上"></el-radio-button>
                    <el-radio-button label="门店"></el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div>
            <div class="charts" ref="charts"></div>
        </div>
    </el-card>

</template>

<script>
import * as echarts from "echarts";
export default {
    name: "Category",
    data() {
        return {
            value: "全部渠道",
        };
    },
    mounted() {
        let mycharts = echarts.init(this.$refs.charts);
        mycharts.setOption({
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true },
                },
            },
            series: [
                {
                    name: "Nightingale Chart",
                    type: "pie",
                    radius: [25, 125],
                    center: ["50%", "50%"],
                    roseType: "area",
                    itemStyle: {
                        borderRadius: 8,
                    },
                    data: [
                        { value: 40, name: "第一阶段" },
                        { value: 38, name: "第二阶段" },
                        { value: 32, name: "第三阶段" },
                        { value: 30, name: "第四阶段" },
                        { value: 28, name: "第五阶段" },
                        { value: 26, name: "第六阶段" },
                        { value: 22, name: "第七阶段" },
                        { value: 18, name: "第八阶段" },
                    ],
                },
            ],
        });
    },
};
</script>

<style scoped>
.category-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}
.charts {
    width: 100%;
    height: 284px;
}
</style>