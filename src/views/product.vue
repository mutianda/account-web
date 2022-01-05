<template>
	<div class="home" >
		<div class="search-bar">
			<div class="search-item">
				<div class="item-label">
					关键字
				</div>
				<div class="item-input">
					<el-input  v-model="searchForm.keyword" clearable></el-input>
				</div>
			</div>
			<div class="search-item">
				<div class="item-label">
					最大值
				</div>
				<div class="item-input">
					<el-input-number v-model="searchForm.num"  :min="0" :max="99" label="描述文字"></el-input-number>
				</div>
			</div>
			<div class="search-item">
				<div class="item-label">
					类型
				</div>
				<div class="item-input">
					<el-select v-model="searchForm.type" placeholder="请选择" filterable clearable>
						<el-option
								v-for="item in typesList"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							<span style="float: left">{{ item.label }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px" @click.stop="addOrDel(item,'type')"><i :class="item.value?'el-icon-delete':'el-icon-plus'
	" v-if=""></i> </span>
						</el-option>
					</el-select>
				</div>
			</div>


			<div class="search-item">
				<el-button type="primary" @click="doSearch"  >查询</el-button>
			</div>

		</div>
		<div class="main-view">
			<div class="left-view">
				<div class="pro-box">
					<div class="pro-item" v-for="item in rackList">
						<el-card class="box-card">

							<div  @click.stop="chooseRack(item)" :style="{background:currentRack.id==item.id?'#3ab9ea':currentBox.includes(item.id)?'#e08819':'#fff'}" class="rack-box">
								<i class="el-icon-delete-solid"  @click.stop="delRack(item)" style="padding: 0 10px;color: red;"></i>

								<i class="el-icon-edit"  @click.stop="editRack(item)" style="padding: 0 10px;color: #167b9a"></i>

								<i class="el-icon-circle-plus"  @click.stop="doAdd(item)" style="padding: 0 10px;color: green"></i>
								<span style="color: #888">

										{{item.name}}


								</span>
							</div>

						</el-card>

					</div>

				</div>
				<div class="add-btn" >

					<el-button plain type="success" class="add" @click="addRack">
						<i class="el-icon-plus"></i>	新增
					</el-button>


				</div>

			</div>

			<div class="custom-table">
				<el-table :data="tableData"
				          stripe
				          ref="elTable"
				          @row-click="rowChange"
				          highlight-current-row

				          height="100%"
				          :border="true"
				>
					<el-table-column prop="rack_name" label="货架" min-width="100" align="center">
						<template slot-scope="{row}">
							<div>{{row.rack_name}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="pro_name" label="品牌" min-width="100" align="center">
					</el-table-column>
					<el-table-column prop="pro_type" label="类型" min-width="80" align="center">
					</el-table-column>

					<el-table-column prop="pro_num" label="数量" min-width="150" align="center">
						<template slot-scope="{row,$index}">
							<div @click.stop="currentRow = row" v-if="currentRow.id!==row.id">{{row.pro_num}}个</div>
							<div class="" v-else >
								<el-button  size="mini"  @click.stop="closeEdit" style="margin-right: 10px">取消</el-button>
								<span @click.stop="currentRow = row">
								<el-input-number   size="mini"  v-model="row.pro_num" :min="0" :max="1000" label="数量" ></el-input-number>
							</span>
								<el-button   size="mini" type="success" @click.stop="editNum(row)" style="margin-left: 10px">提交</el-button>

							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" min-width="100">
						<template slot-scope="{row}">
							<el-button type="primary" size="small" @click="doEdit(row)" icon="el-icon-s-tools" circle plain></el-button>
							<el-button type="danger" size="small" @click="doRemove(row)" icon="el-icon-delete" circle plain></el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>



		<add-edit ref="addEdit" @doSearch="doSearch" @doGetRack="doGetRack"></add-edit>
	</div>
</template>

<script>
	import PinyinMatch from 'pinyin-match';  // es
	import addEdit from './add-edit-product'
	export default {
		name: 'Home',
		components:{
			addEdit
		},

		data(){
			return {
				axios:this.$api,

				searchForm:{
					name:'',
					type:'',
					num:99,
					keyword:''
				},
				tableData: [],
				rackList:[],
				filterText:'',
				typeList:[],
				currentRow:{},
				defaultProps:{
					children: 'children',
					label: 'name'
				},
				currentRack:{}
			}
		},
		computed:{

			typesList(){
				this.typeList.unshift({label:'全部',value:'',show:true})
				return this.typeList
			},
			currentBox(){
				const arr =[]
				this.tableData.forEach(it=>{
					arr.push(it.rack_id)
				})
				return arr
			}

		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		mounted() {
			this.doGetRack()
			this.doGetProductType()

		},
		methods:{
			rowChange(val){
				if(this.currentRow.id==val.id){
					this.closeEdit()
					this.$refs.elTable.setCurrentRow()
				}else {
					this.currentRow = val
					this.$refs.elTable.setCurrentRow(val)



				}

			},

			closeEdit(){
				this.currentRow = {}
				this.doSearch()
			},
			filterMethod(val,data){
				if(!val) return true
				else {
					const match = PinyinMatch.match(data.name,val)
					console.log(val,data.name,match);
					return match
				}

			},
			editNum(row){
				console.log(row);
				const {id,pro_price:price,pro_name:name,pro_num:num,pro_type:type,rack_id:pid} = row
				const params = {price,name,num,type,id,pid}
				this.axios['editAccountProduct'](params).then(res=>{
					if(res.code==200){
						this.$message.success('编辑成功')
						this.currentRow = {}
						this.doSearch()
					}else {
						this.$message.error(res.data)

					}
				})
			},
			addRack(){
				this.$refs.addEdit.openModal({pid:0,},false)
			},
			delRack(item){
				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios['delRack']({id: item.id}).then(res => {
						if (res.code == 200) {
							this.$message.success('删除成功')
							this.doGetRack()

						} else {
							this.$message.error(res.data)
						}
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				})
			},

			addOrDel(item,type){
				console.log(item,type);
				const str = type=='type'?'类型':'品牌'
				if(!item.value){
					this.$prompt('请输入新增'+str, '新增', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({ value }) => {
						this.axios[type=='type'?'addProductType':'addRack']({name:value}).then(res=>{
							if(res.code==200){
								this.$message.success('新增成功')
								type!='type'?this.doGetRack():this.doGetProductType()
							}else {
								this.$message.error(res.data)

							}
						})
					}).catch(() => {

					});
				}else {
					this.$confirm('确认删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.axios[type=='type'?'delProductType':'delRack']({id:item.id}).then(res=>{
							if(res.code==200){
								this.$message.success('删除成功')
								type!='type'?this.doGetRack():this.doGetProductType()

							}else {
								this.$message.error(res.data)

							}
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				})
				}
			},
			doSearch(){
				if (this.searchForm.num&&parseFloat(this.searchForm.num).toString() == 'NaN') {
					//alert(“请输入数字……”);
					this.$message.error('最大值只能输入数字')
					return
				}
				const params = {
					keyword:this.searchForm.keyword,
					pid:this.currentRack.id,
					type: this.searchForm.type,
					num:this.searchForm.num,
				}
				this.axios.getAccountProduct(params).then((res) => {
					console.log(res);
					this.tableData= res.data.map(item=>{
						return item
					})

				}).catch(e =>{
					this.$message.error('查询失败')
				})
			},
			doAdd(item){
				this.$refs.addEdit.openModal({pid:item.id,pname:item.name},true,this.rackList)
			},
			editRack(row){
				const {id,name,sort} = row
				this.$refs.addEdit.openModal({id,name,sort},false)
			},
			doEdit(row){
				const {id,pro_price:price,pro_name:name,pro_num:num,pro_type:type,rack_id:pid,rack_name:pname} = row
				this.$refs.addEdit.openModal({price,name,num,type,id,pid,pname},true,this.rackList)
			},
			doRemove(row){
				this.$prompt('请输入密码', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputType:'password'
				}).then(({ value }) => {
					if(value=='admin'){
						this.axios.delAccountProduct({id:row.id}).then((res) => {
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
			doGetRack(){
				this.axios.getRack({}).then(res=>{
					if(res){
						this.rackList = res.data.children.sort((a,b)=>a.sort-b.sort)
						this.chooseRack(this.rackList[0])
					}

				})
			},
			chooseRack(rack){

				if(rack.id==this.currentRack.id){
					this.currentRack={
						id:''
					}
				}else {
					this.currentRack = rack
				}
				this.doSearch()
			},
			doGetProductType(){
				this.axios.getProductType({}).then(res=>{
					if(res){
						this.typeList = res.data.map(item=>{return{label:item.type_name,value:item.type_name,...item,show:true}})


					}

				})
			}
		}
	}
</script>
<style scoped lang="less">
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}

	/* ---滚动条默认显示样式-- */

	::-webkit-scrollbar-thumb {
		height: 50px;
		background-color: #999;
		border: 2px solid #fff;
		border-radius: 4px;
		outline: 2px solid #fff;
		outline-offset: -2px;
	}

	/* ---鼠标点击滚动条显示样式-- */

	::-webkit-scrollbar-thumb:hover {
		height: 50px;
		background-color: #018ee8;
		border-radius: 4px;
	}

	/* ---滚动条大小-- */

	::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	/* ---滚动框背景样式-- */

	::-webkit-scrollbar-track-piece {
		background-color: #fff;
		border-radius: 0;
	}
	.home{
		width: 100%;
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
		.main-view{
			flex-grow: 1;
			display: flex;

			width: 100%;
			.left-view{
				height: 100%;
				overflow: hidden;
				width: 240px;
				margin-right: 10px;
				.pro-box{
					height: calc(100% - 60px);
					width: 100%;
					background-color: #a86615;
					overflow-y: auto;
					.pro-item{
						width: 90%;
						padding: 10px 5%;

						cursor: pointer;
						/deep/.el-card__body{
							padding: 0;

						}

						.rack-box{
							line-height: 40px;
						}
					}
				};

				.add-btn{
					width: 100%;
					text-align: center;
					line-height: 60px;
					height: 60px;

				}
			}
			.custom-table{
				flex: 1;
				width: 1px;
				height: 100%;
			}
		}




	}
</style>
