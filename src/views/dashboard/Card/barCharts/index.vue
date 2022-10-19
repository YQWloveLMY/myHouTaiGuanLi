<template>
    <!-- 柱状图 -->
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
    name: "BarCharts",
    mounted() {
        // 初始化echarts实例
        let lineCharts = echarts.init(this.$refs.charts);
        lineCharts.setOption({
            xAxis: {
                show: false,
                type: "category",
            },
            yAxis: {
                show: false,
            },
            series: [
                {
                    type: "bar",
                    data: [10, 30, 47, 19, 48, 89, 15, 75, 44, 55, 12, 59],
                },
            ],
            tooltip: {},
            // 布局
            grid: {
                left: 0,
                top: 5,
                right: 5,
                bottom: 0,
            },
        });
    },
};
</script>

<style scoped>
.charts {
    width: 100%;
    height: 100%;
}
</style>