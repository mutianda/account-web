<template>
	<div>
		<el-calendar v-model="monthTime">
			<!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
			<template
					slot="dateCell"
					slot-scope="{date, data}">
				<div :class="{'is-selected' :data.isSelected ,'current-month':data.type!='current-month','current-day':dateFormat((new Date()).getTime(),'日')==data.day}"  class="timeBox">
					<div class="time-str">
						<span class="text" :class="{'current-month':data.type=='current-month',}">
								{{ data.day.split('-').slice(2).join('-')}}
						</span>

					</div>
					<div class="num-box" v-if="tableMap[data.day]">
							<div style="color: #0797d9">
							收入：￥{{tableMap[data.day].get}}
						</div>
						<div style="color: #d7ac0f">
							支出：￥{{tableMap[data.day].use}}
						</div>
						<div :style="{color:tableMap[data.day].all>0?'#0797d9':'#d7ac0f',}">
							盈利：￥{{tableMap[data.day].all}}
						</div>
					</div>
					<div v-else class="num-box">
						暂无统计
					</div>
				</div>

			</template>
		</el-calendar>
	</div>
	
</template>

<script>
	export default {
		name: "data-calendar",
		data(){
			return{
				axios:this.$api,
				tableData:[],
				tableMap:{

				},
				monthTime: '',
				startTime:'',
				endTime:'',


			}
		},
		computed:{
			timeStr(){
				let time = new Date(this.monthTime);
				let year = time.getFullYear();
				let month = parseInt( time.getMonth() + 1 );
				return year+'-'+month
			}
		},
		watch:{
			timeStr(val){
				const times = val.split('-')
				let year = times[0]-0
				let month = times[1]-1
				let start = new Date( year + "-" + month + "-01 00:00:00" ).getTime()
				if( month == 12 ){

					month = 0;
					year += 1;
				}
				let end = new Date( year + "-" + ( month + 3 )  + "-01 00:00:00" ).getTime()-1
					console.log([start, end])
				this.startTime = start
				this.endTime = end
				this.doSearch()
			}
		},
		mounted() {
			this.monthTime = new Date()
			this.computeTime()

		},
		methods:{
			computeTime(){
				let time = new Date(this.monthTime);
				let year = time.getFullYear();
				let month = parseInt( time.getMonth() + 1 );
				let start = new Date( year + "-" + month + "-01 00:00:00" ).getTime()
				if( month == 12 ){

					month = 0;
					year += 1;
				}
				let end = new Date( year + "-" + ( month + 3 )  + "-01 00:00:00" ).getTime()-1
				console.log([start, end])
				this.startTime = start
				this.endTime = end
				this.doSearch()
			},
			dateFormat(timestamp,format=''){
				var time = new Date(timestamp)    //先将时间戳转为Date对象，然后才能使用Date的方法
				var year = time.getFullYear(),
					month = time.getMonth() + 1 ,  //月份是从0开始的
					day = time.getDate(),
					hour = time.getHours(),
					minute = time.getMinutes(),
					second = time.getSeconds()
				//add0()方法在后面定义
				if(format=='日'){
					return  year+'-'+this.add0(month)+'-'+ this.add0(day)
				}
				if(format=='月'){
					return  year+'年'+this.add0(month)+'月'
				}
				if(format=='年'){
					return  year+'年'
				}
				return  year+'年'+this.add0(month)+'月'+ this.add0(day)+'日'+'   '+this.add0(hour)+':'+this.add0(minute)+':'+this.add0(second)
			},
			add0(m){
				return m < 10 ? '0' + m: m
			},
			doSearch(){
				const params = {
					desc:'',
					reason: '',
					startTime:this.startTime,
					endTime :this.endTime
				}

				this.axios.getRecord(params).then((res) => {

					this.tableData= res.data.map(item=>{
						item.account_money -=0
						item.money = item.account_money
						item.reason = item.account_reason
						item.time = item.account_time
						item.desc = item.account_desc
						item.timeStr = this.dateFormat(item.account_time-0)
						item.timeYearStr = this.dateFormat(item.account_time-0,'年')
						item.timeMouthStr = this.dateFormat(item.account_time-0,'月')
						item.timeDayStr = this.dateFormat(item.account_time-0,'日')
						return item
					})
					this.computedData()



				}).catch(e =>{
					console.error(e);
					this.$message.error('查询失败')
				})
			},
			computedData(){
				const obj ={}
				const obj2 = {}
				this.tableData.map(item=>{
					if(!obj[item.account_reason]) {
						obj[item.account_reason] = {
							name:item.reason,
							value:Math.abs(item.money),
						}
					}
					else{
						obj[item.account_reason].value+=Math.abs(item.account_money)
					}
					const str = {
						1:item.timeYearStr,
						2:item.timeMouthStr,
						3:item.timeDayStr
					}
					const key = str[3]
					if(!obj2[key]){
						obj2[key] = {
							get:0,
							use:0,
							all:0
						}
					}
					if(item.money>0){
						obj2[key].get+=item.money
					}else {
						obj2[key].use+=item.money
					}
					obj2[key].all+=item.money
				})
				this.tableMap = obj2
			},
		}
	}
</script>

<style scoped lang="less">
	/deep/ .el-calendar-table .el-calendar-day{
		padding: 2px;
	}
	.is-selected {
		color: #1989FA;
		height: 100%;
		background-color: rgba(7, 151, 217, 0.4);
	}
	.current-month{
		height: 100%;
		background-color: #efefef;
	}
	.current-day{
		height: 100%;
		background-color: rgba(217, 165, 7, 0.4);
	}
	.timeBox{
		font-size: 17px;
		display: flex;
		height: 100%;
		flex-direction: row;
		.time-str{
			padding: 5px;
			width: 100px;
			text-align: left;
			font-size: 26px;
			.text{
				border-radius: 50%;
				padding: 5px;
				color: #fff;
				&.current-month{
					background: rgba(17, 171, 186, 0.97);

				}
			}
		}
		.num-box{
			flex: 1;
			align-self: center;
			text-align: left;
		}
	}
</style>