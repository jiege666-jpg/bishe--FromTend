<template>
  <div>
    <!-- 面包屑区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
        <el-table :data="rightsList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级" prop="level">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'">标签一</el-tag>
                <el-tag type="success" v-else-if="scope.row.level === '1'">标签二</el-tag>
                <el-tag type="info" v-else-if="scope.row.level === '2'">标签三</el-tag>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    // 获取所有的权限
    this.getRights()
  },
  data() {
    return {
      // 权限列表
      rightsList: [],
    }
  },
  methods: {
    async getRights() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')

      // 赋值于权限列表
      this.rightsList = res.data
      console.log(this.rightsList)
    },
  },
}
</script>

<style >
</style>
