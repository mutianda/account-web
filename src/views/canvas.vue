<template>
	<div class="home">
		<div class="search-bar">
			<div class="search-item">
				<div class="item-label">
					挂账原因
				</div>
				<div class="item-input">
					<el-input size="small" v-model="searchForm.text"></el-input>
				</div>
			</div>
			<div class="search-item">
				<div class="item-label">
					时间
				</div>
				<div class="data-input">
					<el-date-picker
							v-model="searchForm.dataTime"
							size="small"
							type="datetimerange"
							value-format="timestamp"
							range-separator="至"
							:clearable="false"
							start-placeholder="开始日期"
							end-placeholder="结束日期">
					</el-date-picker>
				</div>
			</div>


			<div class="search-item">
				<el-button type="primary" @click="doSearch" size="small" >查询</el-button>
				<el-button type="primary" size="small" @click="doAdd(1)">收入</el-button>
				<el-button type="primary" size="small" @click="doAdd(-1)">支出</el-button>
			</div>
			<div class="total-num">
        <span class="item-label">
             <span :style="{color:'#0797d9',fontSize:'18px'}">收
            </span>{{ cMoney.get}}
        </span>
				<span class="item-label">
             <span :style="{color:'#d7ac0f',fontSize:'18px'}">支
            </span>{{ cMoney.use}}
        </span>
				<span class="item-label">
            <span :style="{color:cMoney.all>0?'#0797d9':'#d7ac0f',fontSize:'18px'}">总计
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
            <span :style="{color:row.account_money>0?'#0797d9':'#d7ac0f',fontSize:'18px'}">{{row.account_money>0?'收':'支'}}
            </span>
              {{row.account_money}}
          </span>
				</template>
			</el-table-column>
			<el-table-column prop="account_reason" label="账单原因" min-width="180" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="{row}">
					<el-button type="primary" size="mini" @click="doEdit(row)">编辑</el-button>
					<el-button type="danger" size="mini" @click="doRemove(row)">删除</el-button>
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
				searchForm:{
					text:'',
					dataTime:[
						(new Date()).getTime()-1000*60*60*24*3,
						(new Date()).getTime(),

					]
				},
				tableData: [],
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
					reason:this.searchForm.text,
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
				const data = {
					accountTime:row.account_time,
					money: Math.abs(row.account_money-0),
					text:row.account_reason,
					type:row.account_money>0?1:-1,
					id:row.id
				}
				this.$refs.addEdit.openModal(data)
			},
			doRemove(row){
				this.axios.delRecord({id:row.id}).then((res) => {
					console.log(res);
					this.doSearch()
					this.$message.success('删除成功')

				}).catch(e =>{
					this.$message.error('删除失败')
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
