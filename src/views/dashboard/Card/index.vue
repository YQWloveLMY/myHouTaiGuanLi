<template>
    <div>
        <el-row :gutter="20">
            <!-- 第一个card -->
            <el-col :span="6" :offset="0">
                <el-card>
                    <Detail title="总销售额" cont="￥12360">
                        <!-- 图表 -->
                        <template slot="charts">
                            <span>周同比&nbsp;&nbsp;&nbsp;&nbsp;56.7%
                                <svg t="1665733450907" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4725" width="16" height="16">
                                    <path d="M960 704L512 256l-448 448z" fill="#1afa29" p-id="4726"></path>
                                </svg>
                            </span>
                            <span>日同比&nbsp;&nbsp;&nbsp;&nbsp;19.16%
                                <svg t="1665733527212" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5721" width="16" height="16">
                                    <path d="M64 320l448 448 448-448z" fill="#d81e06" p-id="5722"></path>
                                </svg>
                            </span>
                        </template>
                        <!-- 底部 -->
                        <template slot="footer">
                            <span>日销售额￥564</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <!-- 第二个card -->
            <el-col :span="6" :offset="0">
                <el-card>
                    <Detail title="访问量" cont="88460">
                        <!-- 图表 -->
                        <template slot="charts">
                            <LineChart />
                        </template>
                        <!-- 底部 -->
                        <template slot="footer">
                            <span>日访问量1234</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <!-- 第三个card -->
            <el-col :span="6" :offset="0">
                <el-card>
                    <Detail title="支付笔数" cont="88460">
                        <!-- 图表 -->
                        <template slot="charts">
                            <BarCharts />
                        </template>
                        <!-- 底部 -->
                        <template slot="footer">
                            <span>转换率64%</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <!-- 第四个card -->
            <el-col :span="6" :offset="0">
                <el-card>
                    <Detail title="运营活动效果" cont="78%">
                        <!-- 图表 -->
                        <template slot="charts">
                            <ProgressCharts />
                        </template>
                        <!-- 底部 -->
                        <template slot="footer">
                            <span>周同比&nbsp;&nbsp;&nbsp;&nbsp;56.7%
                                <svg t="1665733450907" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4725" width="16" height="16">
                                    <path d="M960 704L512 256l-448 448z" fill="#1afa29" p-id="4726"></path>
                                </svg>
                            </span>
                            <span>日同比&nbsp;&nbsp;&nbsp;&nbsp;19.16%
                                <svg t="1665733527212" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5721" width="16" height="16">
                                    <path d="M64 320l448 448 448-448z" fill="#d81e06" p-id="5722"></path>
                                </svg>
                            </span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import Detail from "./Detail";
import LineChart from "./lineChart";
import BarCharts from "./barCharts";
import ProgressCharts from "./progressCharts";

export default {
    name: "Card",
    components: { Detail, LineChart, BarCharts, ProgressCharts },
};
</script>

<style scoped>
</style>