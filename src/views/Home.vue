<template>
  <div class="home">
    <div class="search-bar">
      <div class="search-item">
        <div class="item-label">
          账单原因
        </div>
        <div class="item-input">
          <el-input  v-model="searchForm.text"></el-input>
        </div>
      </div>
      <div class="search-item">
        <div class="item-label">
          账单类型
        </div>
        <div class="item-input">
          <el-select v-model="searchForm.reason" placeholder="请选择">
            <el-option
                    v-for="item in treeData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="search-item">
        <div class="item-label">
          时间
        </div>
        <div class="data-input">
          <el-date-picker
                  v-model="searchForm.dataTime"

                  type="datetimerange"
                  value-format="timestamp"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  :clearable="false"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>


      <div class="search-item">
        <el-button type="primary" @click="doSearch"  >查询</el-button>
        <el-button type="primary"  @click="doAdd(1)">收入</el-button>
        <el-button type="warning"  @click="doAdd(-1)">支出</el-button>
      </div>
      <div class="total-num">
        <span class="item-label">
             <span :style="{color:'#0797d9',fontSize:'20px'}">收
            </span>{{ cMoney.get}}
        </span>
        <span class="item-label">
             <span :style="{color:'#d7ac0f',fontSize:'20px'}">支
            </span>{{ cMoney.use}}
        </span>
        <span class="item-label">
            <span :style="{color:cMoney.all>0?'#0797d9':'#d7ac0f',fontSize:'20px'}">总计
            </span>{{ cMoney.all}}
        </span>

      </div>
    </div>

    <el-table :data="tableData"
              stripe
              class="custom-table"
              height="100%"
              :border="true"
    >
      <el-table-column prop="timeStr" label="账单时间" min-width="180" align="center">
      </el-table-column>
      <el-table-column prop="account_money" label="账单金额" min-width="80" align="center">
        <template slot-scope="{row}">
          <span >
            <span :style="{color:row.account_money>0?'#0797d9':'#d7ac0f',fontSize:'23px'}">{{row.account_money>0?'收':'支'}}
            </span>
              {{row.account_money}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="account_reason" label="账单类型" min-width="180" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.account_money>0?'success':'warning'">{{row.account_reason}}</el-tag>
        </template>
      </el-table-column>
        <el-table-column prop="account_desc" label="账单原因" min-width="180" align="center">

        </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="doEdit(row)" icon="el-icon-s-tools" circle plain></el-button>
          <el-button type="danger" size="small" @click="doRemove(row)" icon="el-icon-delete" circle plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-edit ref="addEdit" @doSearch="doSearch"></add-edit>
  </div>
</template>

<script>
import addEdit from './add-edit'
export default {
  name: 'Home',
  components:{
    addEdit
  },

  data(){
    return {
      axios:this.$api,
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end =  new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1;
              const start =  new Date(new Date().toLocaleDateString()).getTime();
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '当前周',
            onClick(picker) {
              var date = new Date(new Date().toLocaleDateString());

              //今天是这周的第几天
              var today = date.getDay();

              //上周日距离今天的天数（负数表示）
              var stepSunDay = -today + 1;

              // 如果今天是周日
              if (today == 0) {

                stepSunDay = -7;
              }

              // 周一距离今天的天数（负数表示）
              var stepMonday = 7 - today;

              var time = date.getTime();

              var start = time + stepSunDay * 24 * 3600 * 1000;
              var end = time + stepMonday * 24 * 3600 * 1000+24*60*60*1000-1;
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '当前月',
            onClick(picker) {
              let time = new Date();//当前月 要计算其他时间点自己传入即可
              let year = time.getFullYear();
              let month = parseInt( time.getMonth() + 1 );
              let start = new Date( year + "-" + month + "-01 00:00:00" ).getTime()
              if( month == 12 ){

                month = 0;
                year += 1;
              }
              let end = new Date( year + "-" + ( month + 1 )  + "-01 00:00:00" ).getTime()-1
              picker.$emit('pick', [start, end]);
            }
          },
                {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      searchForm:{
        text:'',
        reason:'',
        dataTime:[
          (new Date()).getTime()-1000*60*60*24*3,
          new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1,

        ]
      },
      tableData: [],
      treeData:[]
    }
  },
  computed:{
    cMoney(){
     const all = {
       get:0,
       use:0,
       all:0
     }
      this.tableData.map(item=>{
        if(item.account_money>0){
          all.get+=item.account_money
        }else {
          all.use+=item.account_money
        }
        all.all +=item.account_money
      })
      return all
    }
  },
  mounted() {
    this.doSearch()
    this.doGetReason()
  },
  methods:{

    dateFormat(timestamp){
      var time = new Date(timestamp)    //先将时间戳转为Date对象，然后才能使用Date的方法
      var year = time.getFullYear(),
              month = time.getMonth() + 1 ,  //月份是从0开始的
              day = time.getDate(),
              hour = time.getHours(),
              minute = time.getMinutes(),
              second = time.getSeconds()
      //add0()方法在后面定义
      return  year+'年'+this.add0(month)+'月'+ this.add0(day)+'日'+'   '+this.add0(hour)+':'+this.add0(minute)+':'+this.add0(second)
    },
    add0(m){
      return m < 10 ? '0' + m: m
    },
    doSearch(){
      console.log(this.searchForm);
      const [startTime,endTime] = this.searchForm.dataTime
      const params = {
        desc:this.searchForm.text,
        reason: this.searchForm.reason,
        startTime,
        endTime

      }

      this.axios.getRecord(params).then((res) => {
        console.log(res);
        this.tableData= res.data.map(item=>{
          item.account_money -=0
          item.timeStr = this.dateFormat(item.account_time-0)
          return item
        })



      }).catch(e =>{
        this.$message.error('查询失败')
      })
    },
    doAdd(type){
      this.$refs.addEdit.openModal({type})
    },
    doEdit(row){
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType:'password'
      }).then(({ value }) => {
        if(value=='admin'){
          const data = {
            accountTime:row.account_time,
            money: Math.abs(row.account_money-0),
            text:row.account_desc,
            reason:row.account_reason,
            type:row.account_money>0?1:-1,
            id:row.id
          }
          this.$refs.addEdit.openModal(data)
        }else {
          this.$message({
            type: 'error',
            message: '密码错误'
          });
        }

      }).catch(() => {

      });

    },
    doRemove(row){
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType:'password'
      }).then(({ value }) => {
        if(value=='admin'){
          this.axios.delRecord({id:row.id}).then((res) => {
            console.log(res);
            this.doSearch()
            this.$message.success('删除成功')

          }).catch(e =>{
            this.$message.error('删除失败')
          })
        }else {
          this.$message({
            type: 'error',
            message: '密码错误'
          });
        }

      }).catch(() => {

      });

    },
    doGetReason(){
      this.axios.getReason({}).then(res=>{
        if(res){
          this.treeData = res.data.map(item=>{return{label:item.reason,value:item.reason}})
          this.treeData.unshift({label:'全部',value:''})

        }

      })
    }
  }
}
</script>
<style scoped lang="less">
.home{
  display: flex;
  flex-direction: column;
  .search-bar{
    padding: 15px 14px;
    background-color: #eee;
    margin-bottom: 14px;
    .search-item{
      float: left;
      padding-right: 14px;;
      & > * {
        display: inline-block;
        vertical-align: middle;
      }
      .item-label{
        padding:0 14px;

      }
      .item-input{
        width: 200px;
      }
      .el-button + .el-button {
        margin-left: 14px;
      }
    }
    .total-num{
      float: right;
      .item-label{
        padding: 0 14px;
      }
    }


  }
  .custom-table{
    flex-grow: 1;
  }

}
</style>
