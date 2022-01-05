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
		<div class="control-box">
			<div class="left-control"></div>
			<div class="right-control">
				<div class="control-btn" :class="{'actived':chooseTimeValue==1}" @click="chooseTime(1)">年</div>
				<div class="control-btn" :class="{'actived':chooseTimeValue==2}" @click="chooseTime(2)">月</div>
				<div class="control-btn" :class="{'actived':chooseTimeValue==3}" @click="chooseTime(3)">日</div>
			</div>
		</div>
		<div class="echarts-box">

			<div class="echart-left" id="echarts-left1">

			</div>
			<div class="echart-right" id="echarts-right1">

			</div>
		</div>
		<detail-table ref="detailTable"></detail-table>

	</div>
</template>

<script>
	const timer=()=>{
		let time = new Date();//当前月 要计算其他时间点自己传入即可
		let year = time.getFullYear();
		let month = parseInt( time.getMonth() + 1 );
		let start = new Date( year + "-" + month + "-01 00:00:00" ).getTime()
		if( month == 12 ){

			month = 0;
			year += 1;
		}
		let end = new Date( year + "-" + ( month + 1 )  + "-01 00:00:00" ).getTime()-1
		return [start,end]
	}
	import addEdit from './add-edit'
	import detailTable from './detail-table'
	export default {
		name: 'Home',
		components:{
			addEdit,
			detailTable
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
					dataTime:timer()
				},
				tableData: [],
				treeData:[],
				leftChart1:null,
				rightChart1:null,
				leftChart2:null,
				rightChart2:null,
				chooseTimeValue:3
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
			},
		},
		mounted() {
			this.doSearch()
			this.doGetReason()
			this.initEcharts()
		},
		methods:{
			initEcharts(){
				this.leftChart1 = this.$echarts.init(document.getElementById("echarts-left1"));
				this.rightChart1 = this.$echarts.init(document.getElementById("echarts-right1"));
				this.leftChart1.on('click', (parma) => {
					const [startTime,endTime] = this.searchForm.dataTime
					const params = {
						desc:'',
						reason:parma.name,
						startTime,
						endTime

					}
					this.$refs.detailTable.openModal(params)

				})
				this.rightChart1.on('click', (parma) => {
					console.log(parma.name);
					// const time = new Date(parma.name)

					const timestr = parma.name.replace('月','-').replace('年','-').replace('日','').split('-')
					let start
					let	end
					let year = timestr[0]-0
					if(this.chooseTimeValue==3){
						const month = timestr[1]
						const day = timestr[2]
						start = new Date( year + "-" + month + "-"+day+" 00:00:00" ).getTime()
						end = start+24*60*60*1000-1
					}
					if(this.chooseTimeValue==2){
						let month=timestr[1]-0
						start = new Date( year + "-" + month + "-01 00:00:00" ).getTime()
						if( month == 12 ){
							month = 0;
							year += 1;
						}
						end = new Date( year + "-" + ( month + 1 )  + "-01 00:00:00" ).getTime()-1

					}
					if(this.chooseTimeValue==1){
						start = new Date( year + "-1-01 00:00:00" ).getTime()
						end = new Date( year + "-12-31 23:59:59" ).getTime()-1

					}
					console.log(start,end);
					const params = {
						desc:'',
						reason:'',
						startTime:start,
						endTime:end

					}
					this.$refs.detailTable.openModal(params)
					console.log(start,end)

				})
				setTimeout(function (){
					window.onresize =  ()=> {
						this.leftChart1.resize();
						this.rightChart1.resize();
					}
				},200)
			},
			getRandom(num){
				const colorList=
					['#FF9999','#FFFF33','#FF0066','#FF6600','#409EFF','#67c23a','#FF3366','#FF9933']
				const random = Math.floor((Math.random()+Math.floor(Math.random()*9+1))*Math.pow(10,num-1));
				return colorList[random]
		   },
			chooseTime(val){
				this.chooseTimeValue = val
				this.computedData()
			},
			computedData(){
				const obj ={}
				const obj2 = {}
				const  colors =['rgb(92,123,217)','rgb(145,204,117)','rgb(255,220,96)','#FF7070','rgb(126,211,244)']
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
					const key = str[this.chooseTimeValue]
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

				const list = Object.values(obj).map((it,index)=>{
					return {...it,itemStyle:{color:index>4?this.getRandom(1):colors[index]}}
				})

				this.leftChart1.setOption(
					{
						title: {
							text: '',
							left: 'center'
						},
						tooltip: {
							trigger: 'item',

						},
						legend: {
							formatter:(params)=>{
								console.log(params);
								const item = obj[params]
								return params+':'+item.value
							}
						},
						label: {
							position: 'inner',
							fontSize: 14,
							formatter: '{b}: {c}元',
							normal: {
								show: false,
								position: 'inner',
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},

						series: [
							{
								name: '种类账单',
								type: 'pie',
								radius: '50%',
								data: list
							}
						]
					})


				const list2 = {
					name:Object.keys(obj2),
					get:Object.values(obj2).map(item=>item.get),
					use:Object.values(obj2).map(item=>item.use),
					all:Object.values(obj2).map(item=>item.all),
				}
				this.rightChart1.setOption(
					{
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								crossStyle: {
									color: '#999'
								}
							}
						},
						toolbox: {
							feature: {
								dataView: {show: true, readOnly: false},
								magicType: {show: true, type: ['line', 'bar']},
								restore: {show: true},
								saveAsImage: {show: true}
							}
						},
						legend: {
							data: ['收入', '支出', '盈利'],
							formatter:(params)=>{
								const keys= {
									'收入':'get',
									'支出':'use',
									'盈利':'all'
								}
								const key = keys[params]
								let value =0
								list2[key].forEach(it=>{
									value+=it
								})

								return params+':'+value
							}
						},
						xAxis: [
							{
								type: 'category',
								data: list2.name,
								axisPointer: {
									type: 'shadow'
								}
							}
						],
						yAxis: [
							{
								type: 'value',
								name: '金额',

								axisLabel: {
									formatter: '{value} 元'
								}
							},
						],
						series: [
							{
								name: '收入',
								type: 'bar',
								stack: 'one',
								barWidth:'5%',
								data: list2.get,
								itemStyle:{
									color:'#0797d9'
								},
								label:{
									show:true
								}
							},

							{
								name: '支出',
								type: 'bar',
								barWidth:'5%',
								stack: 'one',
								data: list2.use,
								itemStyle:{
									color:'#d7ac0f'
								},
								label:{
									show:true
								}
							},
							{
								name: '盈利',
								type: 'line',
								data: list2.all,
								label:{
									show:true,

								}
							}
						]
					})
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
					return  year+'年'+this.add0(month)+'月'+ this.add0(day)+'日'
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
				console.log(this.searchForm);
				const [startTime,endTime] = this.searchForm.dataTime
				const params = {
					desc:this.searchForm.text,
					reason: this.searchForm.reason,
					startTime,
					endTime

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
		.control-box{
			height: 50px;
			display: flex;
			flex-direction: row;
			.left-control{
				width: 500px;
				height: 50px;
			}
			.right-control{
				flex: 1;
				height: 50px;

				color: #999;
				.control-btn{
					float: right;
					width: 100px;
					height: 30px;
					line-height: 30px;
					text-align: center;
					cursor: pointer;
					margin: 10px ;
					background-color: #eee;
					border-radius: 10px;
					&.actived{
						color: #fff;
						background-color: #0797d9;
					}
				}

			}
		}
		.echarts-box{
			flex: 1;
			width: 100%;
			display: flex;
			.echart-left{
				height: 100%;
				width: 500px;
			}
			.echart-right{
				flex: 1;
				height: 400px;
			}

		}

	}
</style>
