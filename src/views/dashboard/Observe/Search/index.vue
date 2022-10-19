<template>
    <!-- 底部左边带折现图的card -->
    <el-card shadow="always">
        <!-- 头部 -->
        <div slot="header" class="header">
            <div class="search-header">
                <span>线上热门搜索</span>
                <!-- 下拉框 -->
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>火锅</el-dropdown-item>
                        <el-dropdown-item>串串</el-dropdown-item>
                        <el-dropdown-item>炸串</el-dropdown-item>
                        <el-dropdown-item>烧烤</el-dropdown-item>
                        <el-dropdown-item>辣子鸡</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!-- 身体 -->
        <div>
            <el-row :gutter="10">
                <el-col :span="12" :offset="0">
                    <lineCharts />
                </el-col>
                <el-col :span="12" :offset="0">
                    <lineCharts />
                </el-col>
            </el-row>
        </div>
        <!-- table -->
        <el-table :data="tableData" style="width: 100%" border size="small">
            <el-table-column type="index" label="排名" width="80">
            </el-table-column>
            <el-table-column label="搜索关键字" width="width">
            </el-table-column>
            <el-table-column label="用户数" sortable width="width">
            </el-table-column>
            <el-table-column label="周涨幅" sortable width="width">
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination class="pagination" layout="prev, pager, next" :total="1000">
        </el-pagination>
    </el-card>
</template>

<script>
import lineCharts from "./lineCharts";
export default {
    name: "Search",
    data() {
        return {
            tableData: [],
        };
    },
    components: { lineCharts },
};
</script>

<style scoped>
.search-header {
    display: flex;
    /* 左右对齐 */
    justify-content: space-between;
}
.header {
    padding: 10px 0;
    border-bottom: 2px solid #eee;
}
.pagination {
    text-align: center;
}
</style>