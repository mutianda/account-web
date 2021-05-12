<template>
  <div class="home">
    <el-table :data="tableData"
              stripe
              class="custom-table"
              height="100%"
              :border="true"
    >
      <el-table-column prop="account_reason" label="账单原因" min-width="180" align="center">
      </el-table-column>
      <el-table-column prop="account_time" label="账单时间" width="180" align="center">
      </el-table-column>
      <el-table-column prop="account_money" label="账单金额" width="180" align="center">
      </el-table-column>
    </el-table>

  </div>
</template>

<script>


export default {
  name: 'Home',
  data(){
    return {
      axios:this.$api,
      tableData:[]
    }
  },
  mounted() {
    this.getReason()
  },
  methods:{
    getReason(){
      this.axios.getRecord({}).then((res) => {
        console.log(res);
        this.tableData= res.data

      }).catch(e =>{
        console.log(e);
      })
    }
  }
}
</script>
