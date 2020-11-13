<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scoped">
            <el-tag type="danger" v-if="scoped.row.pay_status">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scoped">{{scoped.row.create_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog title="修改地址" :visible.sync="editdialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editrules" ref="editFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="Citydata" v-model="editForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressdialogVisible" width="50%">
      <el-form :model="editForm" :rules="editrules" ref="editFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="Citydata" v-model="editForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Citydata from '@/components/order/citydata'

export default {
  data() {
    return {
      orderList: [],
      // 查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 总条数
      total: 0,
      // 是否显示编辑对话框
      editdialogVisible: false,
      // 表单数据对象
      editForm: {
        address1: [],
        address2: '',
      },
      // 表单数据验证规则
      editrules: {
        address1: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      Citydata,
      // 是否显示物流进度的对话框
      progressdialogVisible: false,
      // 物流数据列表
      progressInfo: [],
    }
  },
  created() {
    this.getOrderlist()
  },
  methods: {
    async getOrderlist() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }

      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
    // 每页的条数改变时，触发事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderlist()
    },
    // 页数发生改变时，触发事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderlist()
    },
    // 点击编辑按钮，触发事件
    showBox() {
      this.editdialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }

      console.log(res)

      this.progressdialogVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
