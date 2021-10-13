<template>
	<div class="home" >

		<div class="right-view">
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
			<div class="pro-box">
				<div class="pro-item" v-for="item in rackList">
					<el-card class="box-card">
						<div  @click="chooseRack(item)" :style="{background:currentBox.includes(item.id)?'#e08819':currentRack.id==item.id?'#3ab9ea':'#fff'}" class="rack-box">
							<i class="el-icon-edit"  @click="editRack(item)" style="padding: 0 10px"></i>
							<i class="el-icon-delete"  @click="delRack(item)" style="padding: 0 10px"></i>
							<span>
								{{item.name}}
							</span>
							<i class="el-icon-plus"  @click="doAdd(item)" style="padding: 0 10px"></i>
						</div>

					</el-card>

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

					<el-table-column prop="pro_num" label="数量" min-width="100" align="center">
						<template slot-scope="{row,$index}">
							<div @click.stop="currentRow = row" v-if="currentRow.id!==row.id">{{row.pro_num}}个</div>
							<div class="" v-else >
								<el-button  @click="closeEdit" style="margin-right: 10px">取消</el-button>
								<span @click.stop="currentRow = row">
									<el-input-number   v-model="row.pro_num" :min="1" :max="1000" label="数量" ></el-input-number>
								</span>
								<el-button   type="success" @click.stop="editNum(row)" style="margin-left: 10px">提交</el-button>

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
				const {id,pro_price:price,pro_name:name,pro_num:num,pro_type:type} = row
				const params = {price,name,num,type,id}
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
				const params = {
					keyword:this.searchForm.keyword,
					pid:this.currentRack.id,
					type: this.searchForm.type,
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
				this.$refs.addEdit.openModal({pid:item.id,},true)
			},
			editRack(row){
				const {id,name,sort} = row
				this.$refs.addEdit.openModal({id,name,sort},false)
			},
			doEdit(row){
				const {id,pro_price:price,pro_name:name,pro_num:num,pro_type:type,rack_id:pid} = row
				this.$refs.addEdit.openModal({price,name,num,type,id,pid},true)
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
				this.currentRack = rack
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
	.home{
		width: 100%;
		display: flex;
		.left-tree{
			width: 320px;
			height: calc(100% - 20px);
			padding: 5px 10px;
			margin-right: 10px;
			.control-btn{
				height: 50px;
				text-align: left;
				line-height: 50px;
			}
			.tree-box{
				margin-top: 10px;
				height: calc(100% - 110px);
			}
		}
		.right-view{
			flex:1;
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
			.pro-box{
				height: calc(100% - 400px);
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				.pro-item{
					width: 300px;
					padding: 20px;
					height: 100px;
					cursor: pointer;

					/deep/.el-card__body{
							padding: 0;
						}

					.rack-box{
						height: 100px;
						line-height: 100px;
					}
				}
				.add-btn{
					width: 100px;
					padding: 20px;
					line-height: 100px;
					height: 100px;

				}
			}
			.custom-table{

				height: 300px;
			}
		}


	}
</style>
