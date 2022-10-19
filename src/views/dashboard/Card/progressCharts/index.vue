<template>
    <!-- 柱状图 -->
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
    name: "ProgressCharts",
    mounted() {
        // 初始化echarts实例
        let lineCharts = echarts.init(this.$refs.charts);
        lineCharts.setOption({
            xAxis: {
                show: false,
                // 最小值与最大值设置
                min: 0,
                max: 100,
            },
            yAxis: {
                show: false,
                // y轴均分，可以实现横向排列
                type: "category",
            },
            series: [
                {
                    type: "bar",
                    data: [78],
                    // 柱状图宽度
                    barWidth: 10,
                    color: "pink",
                    // 柱状图背景颜色
                    showBackground: true,
                    backgroundStyle: {
                        color: "#eee",
                    },
                    // 文本标签
                    label: {
                        show: true,
                        formatter: "|",
                        position: "right",
                    },
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

    /* 
    10.14柱状图业务完成，四个图还差最后一个进度条
    
    */
};
</script>

<style scoped>
.charts {
    width: 100%;
    height: 100%;
}
</style>