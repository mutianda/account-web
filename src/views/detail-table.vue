<template>
	<el-dialog  :title="title"
	           :visible.sync="showModal"
	           width="50%">
		<div class="total-num" style="padding: 10px">
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
		<div style="height: 500px">
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
			</el-table>
		</div>

	</el-dialog>
</template>

<script>
	export default {
		name: "detail-table",
		data(){
			return {
				axios:this.$api,
				showModal:false,
				tableData:[],
				title:''
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
		methods:{
			openModal(params){
				this.showModal = true
				this.title = this.dateFormat(params.startTime)+'--'+this.dateFormat(params.endTime)
				this.doSearch(params)

			},
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
			doSearch(params){
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

		}
	}
</script>

<style scoped>

</style>