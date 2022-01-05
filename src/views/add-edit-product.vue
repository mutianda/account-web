<template>
	<el-dialog :visible="showModal" width="400px" @close="closeModal" :title="addType?'商品':'货架'" :close-on-click-modal="false">
		<el-form
				v-if="addType"
				:model="form"
				ref="addOrEditForm"
				:rules="rules"  label-width="100px"
		>

			<el-form-item  label="类型" prop="type">
				<el-input :value="form.pname" readonly v-if="!isEdit" class="form-input"></el-input>
				<el-select v-model="form.pid" placeholder="请选择" filterable class="form-input"  v-else>

					<el-option
							v-for="item in rackList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item  label="商品" prop="name">
				<el-input v-model="form.name" ></el-input>
<!--				<el-select v-model="form.name" placeholder="请选择" filterable class="form-input" :filter-method="filterMethod">-->
<!--					<el-option-->
<!--							v-if="item.show"-->
<!--							v-for="item in productList"-->
<!--							:key="item.value"-->
<!--							:label="item.label"-->
<!--							:value="item.value">-->
<!--					</el-option>-->
<!--				</el-select>-->
			</el-form-item>
			<el-form-item  label="类型" prop="type">
				<el-select v-model="form.type" placeholder="请选择" filterable class="form-input" >
					<el-option
							v-for="item in typeList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item  label="数量" prop="num">
				<el-input v-model="form.num" class="form-input">  <template slot="append">个</template></el-input>
			</el-form-item>

			<el-form-item  label="排序" prop="sort">
				<el-input v-model="form.sort" class="form-input">  </el-input>
			</el-form-item>
		</el-form>
		<el-form
				v-else
				:model="form1"
				ref="addOrEditForm1"
				:rules="rules1"  label-width="100px"
		>

			<el-form-item  label="货架名称" prop="name">
				<el-input v-model="form1.name" ></el-input>
				<!--				<el-select v-model="form.name" placeholder="请选择" filterable class="form-input" :filter-method="filterMethod">-->
				<!--					<el-option-->
				<!--							v-if="item.show"-->
				<!--							v-for="item in productList"-->
				<!--							:key="item.value"-->
				<!--							:label="item.label"-->
				<!--							:value="item.value">-->
				<!--					</el-option>-->
				<!--				</el-select>-->
			</el-form-item>
			<el-form-item  label="排序" prop="sort">
				<el-input v-model="form1.sort" class="form-input">  </el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer" style="text-align: center">
			<el-button @click="closeModal">取 消</el-button>
			<el-button type="primary" @click="submit">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import PinyinMatch from 'pinyin-match';  // es
	export default {
		name: "add-edit",
		data(){
			const checkNumber = (rule, value, callback) => {

				if (value!='') {
					if (parseFloat(value).toString() == 'NaN') {
						//alert(“请输入数字……”);
						return callback(new Error('不能输入汉字'))
					} else {
						this.form.money=parseFloat(value)
						callback()
					}
				}
				callback()
			}
			return {
				showModal:false,
				axios:this.$api,
				form:{
					name:'',
					type:'',
					price: '0',
					num:'',
					pid:'',
					pname:'',
					sort:0
				},
				form1:{
					name:'',
					sort:0
				},
				rules: {

					num: [
						{ required: true, message: '请输入数量', trigger: 'blur' },
						{ validator: checkNumber, message: '请输入数量',trigger: 'blur' }

					],
					type:[
						{ required: true, message: '请选择类型', trigger: 'change' },
					],
					name:[
						{ required: true, message: '请输入商品', trigger: 'blur' },
					],


				},
				rules1: {
					name:[
						{ required: true, message: '请输入货架名', trigger: 'blur' },
					],

				},
				isEdit:false,
				productList:[],
				typeList:[],
				addType:true,
				rackList:[]

			}
		},
		computed:{

		},

		methods:{
			doGetProduct(){
				this.axios.getProduct({}).then(res=>{
					if(res){
						this.productList = res.data.map(item=>{return{label:item.name,value:item.name,...item,show:true}})
					}

				})
			},
			doGetProductType(){
				this.axios.getProductType({}).then(res=>{
					if(res){

						this.typeList = res.data.map(item=>{return{label:item.type_name,value:item.type_name,...item,show:true}})
						if(!this.form.type){
							this.form.type= this.typeList[0].value
						}
					}

				})
			},
			filterMethod(val){
				const filters = val.split(' ')
				this.productList.forEach(item=>{
					item.show = true
					filters.forEach(it=>{
						if(it){
							const match = PinyinMatch.match(item.value,it)
							if(!match){
								item.show = false
							}
						}
					})
				})
			},
			closeModal(){
				this.form ={
					name:'',
					type:'',
					price: '0',
					num:'',
					pid:'',
					pname:'',
					sort: 0
				}
				this.form1 = {
					name:'',
					sort: 0
				}
				this.addType&&this.$refs.addOrEditForm.clearValidate()
				!this.addType&&this.$refs.addOrEditForm1.clearValidate()
				this.showModal = false
			},
			openModal(row={},addType,rackList){
				this.rackList = rackList
				this.showModal = true
				this.addType= addType
				if(row.id)this.isEdit = true
				else this.isEdit  = false
				if(addType){
					this.form = {...this.form,...row,}

				}else {
					this.form1 = {...this.form1,...row,}

				}
				this.doGetProductType()
				this.$nextTick(()=>{
					addType&&this.$refs.addOrEditForm.clearValidate()
					!addType&&this.$refs.addOrEditForm1.clearValidate()
				})
			},

			submit(){
				if(this.addType){
					this.$refs.addOrEditForm.validate((valid)=> {
						if (valid) {
							this.axios[this.isEdit?'editAccountProduct':'addAccountProduct'](this.form).then(res=>{
								if(res.code==200){
									this.$emit('doSearch')
									this.closeModal()
									this.$message.success(this.isEdit?'编辑成功':'新增成功')
								}else {
									this.$message.error(this.isEdit?'编辑失败':'新增失败')
								}
							})
						} else {

						}
					})
				}else {
					this.$refs.addOrEditForm1.validate((valid)=> {
						if (valid) {
							this.axios[!this.isEdit?'addRack':'editRack']({...this.form1, pid: 0}).then(res => {
								if (res.code == 200) {
									this.closeModal()
									this.$message.success(this.isEdit?'编辑成功':'新增成功')
									this.$emit('doGetRack')
								} else {
									this.$message.error(this.isEdit?'编辑失败':'新增失败')

								}
							})
						}
					})
				}





			}

		}
	}
</script>

<style scoped lang="less">
	.form-input{
		width: 250px !important;
	}
	.tag-box{
		padding: 30px 10px;
		display: flex;
		flex-wrap: wrap;
		.tag-item{
			margin: 5px 10px;
			cursor: pointer;
		}
	}

</style>