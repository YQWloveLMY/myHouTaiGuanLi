<template>

    <el-row :gutter="10">
        <el-col :span="12" :offset="0">
            <!-- 底部左边带折现图的card -->
            <Search />
        </el-col>
        <el-col :span="12" :offset="0">
            <!-- 底部右边带饼图的card -->
            <Category />
        </el-col>
    </el-row>

</template>

<script>
import Search from "./Search";
import Category from "./Category";
export default {
    name: "Observe",
    components: { Category, Search },
};
</script>

<style scoped>
</style>