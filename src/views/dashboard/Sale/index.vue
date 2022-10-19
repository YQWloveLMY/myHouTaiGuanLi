<template>
    <el-card class="box-card" style="margin:10px 0;">
        <!-- 头部区域 -->
        <div slot="header" class="clearfix">
            <!-- 头部左侧内容  @tab-click=""-->
            <span>
                <el-tabs class="tab" v-model="activeName">
                    <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                    <el-tab-pane label="访问量" name="visite"></el-tab-pane>
                </el-tabs>
            </span>
            <!-- 头部右侧内容 -->
            <div class="right">
                <span @click="setDay">今日</span>
                <span @click="setWeek">本周</span>
                <span @click="setMonth">本月</span>
                <span @click="setYear">本年</span>
                <!-- 日历 -->
                <el-date-picker style="cursor:pointer" value-format="yyyy-MM-dd" v-model="data" class="data" size="small" type="daterange" range-separator="—" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </div>
        </div>
        <!-- 内容区域 -->
        <div>
            <el-row :gutter="20">
                <!-- 折线图 -->
                <el-col :span="17">
                    <div class="charts" ref="charts"></div>
                </el-col>
                <!-- 数据列表 -->
                <el-col :span="7">
                    <h3>门店{{title}}排名</h3>
                    <div class="chartsPie" ref="chartsPie"></div>
                </el-col>
            </el-row>

        </div>
    </el-card>
</template>

<script>
// 引入echarts
import dayjs from "dayjs";
import * as echarts from "echarts";
import { mapState } from "vuex";
export default {
    name: "Sale",
    data() {
        return {
            activeName: "sale",
            mycharts: null,
            mychartsPie: null,
            // 收集时间
            data: "",
            dataPie1: [64, 45, 51, 10, 50, 19, 20],
            dataPie2: [50, 70, 100, 130, 150, 160, 200],
        };
    },
    mounted() {
        // 初始化折现图
        this.mycharts = echarts.init(this.$refs.charts);
        this.mycharts.setOption({
            title: {
                text: `${this.title}趋势`,
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                },
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {},
                },
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                // prettier-ignore
                data: [],
            },
            yAxis: {
                type: "value",
                axisLabel: {
                    formatter: "{value} W",
                },
                axisPointer: {
                    snap: true,
                },
            },
            visualMap: {
                show: false,
                dimension: 0,
                pieces: [
                    {
                        lte: 2,
                        color: "green",
                    },
                    {
                        gt: 2,
                        lte: 6,
                        color: "red",
                    },
                    {
                        gt: 6,
                        lte: 9,
                        color: "green",
                    },
                    {
                        gt: 9,
                        lte: 12,
                        color: "red",
                    },
                ],
            },
            series: [
                {
                    type: "line",
                    smooth: true,
                    // prettier-ignore
                    data: [],
                },
            ],
        });
        // 初始化柱状图
        this.mychartsPie = echarts.init(this.$refs.chartsPie);
        this.mychartsPie.setOption({
            xAxis: {
                type: "value",
            },
            yAxis: {
                type: "category",
                data: [
                    "艾欧尼亚",
                    "诺克萨斯",
                    "德玛西亚",
                    "钢铁烈阳",
                    "黑色玫瑰",
                    "恕瑞玛",
                    "暗影岛",
                ],
            },
            series: [
                {
                    data: [],
                    type: "bar",
                    color: "rgb(239, 102, 103)",
                },
            ],
            grid: {
                left: 60,
                top: 10,
                right: 20,
                bottom: 40,
            },
        });
    },
    computed: {
        // 计算属性标题
        title() {
            return this.activeName == "sale" ? "销售额" : "访问量";
        },
        // 数据
        ...mapState({
            ListState: (state) => state.home.list,
        }),
    },
    watch: {
        // 监听当title值变化的时候
        title() {
            // 重新修改折线图的数据---是从moke文件中取出
            this.mycharts.setOption({
                title: {
                    text: `${this.title}趋势`,
                },
                xAxis: {
                    data:
                        this.title == "销售额"
                            ? this.ListState.orderFullYearAxis
                            : this.ListState.userFullYearAxis,
                },
                series: [
                    {
                        type: "line",
                        smooth: true,
                        // prettier-ignore
                        data: this.title == "销售额"
                            ? this.ListState.orderFullYear
                            : this.ListState.userFullYear,
                    },
                ],
            });
            // 重新修改柱形图的数据
            this.mychartsPie.setOption({
                series: [
                    {
                        data:
                            this.title == "销售额"
                                ? this.dataPie1
                                : this.dataPie2,
                        type: "bar",
                        color: "rgb(239, 102, 103)",
                    },
                ],
            });
        },
        // 刚刚来到页面的时候，监听服务器返回数据，如果返回数据有了立马展示
        ListState() {
            // 折线图数据
            this.mycharts.setOption({
                title: {
                    text: `${this.title}趋势`,
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                    },
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {},
                    },
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    // prettier-ignore
                    data: this.ListState.orderFullYearAxis,
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        formatter: "{value} W",
                    },
                    axisPointer: {
                        snap: true,
                    },
                },
                visualMap: {
                    show: false,
                    dimension: 0,
                    pieces: [
                        {
                            lte: 2,
                            color: "green",
                        },
                        {
                            gt: 2,
                            lte: 6,
                            color: "red",
                        },
                        {
                            gt: 6,
                            lte: 9,
                            color: "green",
                        },
                        {
                            gt: 9,
                            lte: 12,
                            color: "red",
                        },
                    ],
                },
                series: [
                    {
                        type: "line",
                        smooth: true,
                        // prettier-ignore
                        data: this.ListState.orderFullYear,
                    },
                ],
            });
            // 柱形图数据
            this.mychartsPie.setOption({
                series: [
                    {
                        data:
                            this.title == "销售额"
                                ? this.dataPie1
                                : this.dataPie2,
                        type: "bar",
                        color: "rgb(239, 102, 103)",
                    },
                ],
            });
        },
    },
    methods: {
        // 当日
        setDay() {
            // 获取当前时间---通过dayjs插件
            const day = dayjs().format("YYYY-MM-DD");
            this.data = [day, day];
        },
        // 本周
        setWeek() {
            // 获取当前时间---通过dayjs插件
            const start = dayjs().day(1).format("YYYY-MM-DD"); //周一
            const end = dayjs().day(7).format("YYYY-MM-DD"); //周日
            this.data = [start, end];
        },
        // 本月
        setMonth() {
            const start = dayjs().startOf("month").format("YYYY-MM-DD"); //本月第一天
            const end = dayjs().endOf("month").format("YYYY-MM-DD"); //本月最后一天
            this.data = [start, end];
        },
        // 本年
        setYear() {
            const start = dayjs().startOf("year").format("YYYY-MM-DD"); //本月第一天
            const end = dayjs().endOf("year").format("YYYY-MM-DD"); //本月最后一天
            this.data = [start, end];
        },
    },
};
</script>

<style scoped>
.chartsPie {
    width: 100%;
    height: 300px;
}
.clearfix {
    position: relative;
    display: flex;
    justify-content: space-between;
}
.tab {
    width: 100%;
}
.right {
    position: absolute;
    right: 0;
}
.right span {
    margin: 0 10px;
    cursor: pointer;
}
.data {
    width: 230px;
}
.charts {
    width: 100%;
    height: 300px;
}
.el-col-7 {
    height: 40px;
    line-height: 0px;
}
ul {
    list-style: none;
    width: 100%;
    height: 300px;
}
ul li {
    height: 8%;
}
</style>