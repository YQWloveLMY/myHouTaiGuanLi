<template>
    <!-- 底部左边的中间的折线图 -->
    <div>
        <div class="header">
            <span class="search-header">搜索用户数</span>
            <svg t="1665823670668" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3323" width="22" height="22">
                <path d="M512 179.2a332.8 332.8 0 1 1 0 665.6 332.8 332.8 0 0 1 0-665.6z m0 51.2a281.6 281.6 0 1 0 0 563.2 281.6 281.6 0 0 0 0-563.2z" p-id="3324" fill="#8a8a8a"></path>
                <path d="M512.768 339.968a38.7072 38.7072 0 1 1 0 77.3632 38.7072 38.7072 0 0 1 0-77.3632zM546.4576 678.6048h-27.2384c-14.2848 0-29.0304-12.3904-29.0304-23.7056V498.0224h-9.728a25.8048 25.8048 0 1 1 0-51.6096s31.488-0.1024 32.3072 0c13.1072 0.9728 22.5792 6.656 22.5792 17.3568v163.2768h11.1104a25.8048 25.8048 0 1 1 0 51.5584z" p-id="3325" fill="#8a8a8a"></path>
            </svg>
        </div>
        <div class="main">
            <span class="main-title">12321</span>
            <span class="main-content">17.1</span>
            <svg t="1665823943494" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4798" width="16" height="16">
                <path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="4799"></path>
            </svg>
            <svg t="1665823966337" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5856" width="16" height="16">
                <path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="5857"></path>
            </svg>
        </div>
        <div class="footer">
            <div class="charts" ref="charts"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from "echarts";
export default {
    name: "lineCharts",
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
                        color: "skyblue",
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
                                    color: "skyblue", // 0% 处的颜色
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
        });
    },
};
</script>

<style scoped>
.header {
    display: flex;
    /* 垂直居中 */
    align-items: center;
}
.search-header {
    margin-right: 15px;
}
.main {
    margin: 10px 0px;
}
.main-title {
    margin-right: 30px;
}
.main-content {
    margin-right: 10px;
}
.charts {
    width: 300px;
    height: 100px;
}
</style>