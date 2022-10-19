<template>
    <!-- 折线图 -->
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
    name: "LineChart",
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
                    type: "line",
                    data: [10, 30, 47, 19, 48, 89, 15, 75, 44, 55, 12, 59],
                    // 设置拐点样式
                    itemStyle: {
                        opacity: 0,
                    },
                    // 线条颜色
                    lineStyle: {
                        color: "purple",
                    },
                    // 填充颜色
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: "purple", // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: "white", // 100% 处的颜色
                                },
                            ],
                            global: false, // 缺省为 false
                        },
                    },
                    smooth: true,
                },
            ],

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