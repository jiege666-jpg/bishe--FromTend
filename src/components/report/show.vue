<template>
  <div id="myChart"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'DynamicLineChart',
  data() {
    return {
      // 实时数据数组
      date: [],
      // 保存时间
      time: [],
      temperature: [],
      humidity: [],
      CO2: [],
      // 折线图echarts初始化选项
      echartsOption: {
        legend: {
          data: ['温度', '湿度', '二氧化碳'],
        },
        xAxis: {
          name: '时间',
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18,
          },
          type: 'category',
          boundaryGap: false,
          data: this.date, // 绑定实时数据数组
        },
        yAxis: {
          name: '数据',
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18,
          },
          type: 'value',
          scale: true,
          boundaryGap: ['15%', '15%'],
          axisLabel: {
            interval: 'auto',
            formatter: '{value}℃',
          },
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>{a0}:{c0}℃,<br/>{a1}:{c1}℃',
        },
        series: [
          {
            name: '温度',
            type: 'line',
            smooth: true,
            data: this.temperature, // 绑定实时数据数组
          },
          {
            name: '湿度',
            type: 'line',
            smooth: true,
            data: this.humidity, // 绑定实时数据数组
          },
        ],
      },
    }
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById('myChart'), 'light') // 初始化echarts, theme为light
    this.myChart.setOption(this.echartsOption) // echarts设置初始化选项
    setInterval(this.addData, 3000) // 每三秒更新实时数据到折线图
  },
  methods: {
    // 获取当前时间
    getTime: function () {
      var ts = arguments[0] || 0
      var t, h, i, s
      t = ts ? new Date(ts * 1000) : new Date()
      h = t.getHours()
      i = t.getMinutes()
      s = t.getSeconds()
      // 定义时间格式
      return (h < 10 ? '0' + h : h) + ':' + (i < 10 ? '0' + i : i) + ':' + (s < 10 ? '0' + s : s)
    },
    // 添加实时数据
    addData: async function () {
      // 从接口获取数据并添加到数组
      const { data: res } = await this.$http.get('/goods/show')
      this.time.push(new Date().getMinutes())
      this.date.push(this.getTime(Math.round(new Date().getTime() / 1000)))
      console.log(this.time)
      console.log(this.time[this.time.length - 1], this.time[0])
      if (this.time[this.time.length - 1] - this.time[0] > 0) {
        console.log('ok')
        // 清空date数组
        this.time.shift()
        this.date.shift()
      }
      res.data.forEach((item) => {
        this.temperature.push(item.temperature)
        this.humidity.push(item.humidity)
      })
      // 重新将数组赋值给echarts选项
      this.echartsOption.xAxis.data = this.date
      this.echartsOption.series[0].data = this.temperature
      this.echartsOption.series[1].data = this.humidity
      this.myChart.setOption(this.echartsOption)
    },
  },
}
</script>

<style>
#myChart {
  width: 100%;
  height: 500px;
  margin: 0 auto;
}
</style>
