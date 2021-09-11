<template>
	<el-dialog :visible="showModal" width="400px" @close="closeModal" title="入货" :close-on-click-modal="false">
		<el-form
				:model="form"
				ref="addOrEditForm"
				:rules="rules"  label-width="100px"
		>

			<el-form-item  label="商品" prop="name">
				<el-input :value="form.name" readonly></el-input>
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
			<el-form-item  label="价格" prop="price">
				<el-input v-model="form.price" class="form-input">  <template slot="append">￥</template></el-input>
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

				if (value) {
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
					price: '',
					num:'',
				},
				rules: {
					price: [
						{ required: true, message: '请输入金额', trigger: 'blur' },
						{ validator: checkNumber, message: '请输入数字',trigger: 'blur' }

					],
					num: [
						{ required: true, message: '请输入金额', trigger: 'blur' },
						{ validator: checkNumber, message: '请输入数字',trigger: 'blur' }

					],
					type:[
						{ required: true, message: '请选择类型', trigger: 'change' },
					],
					name:[
						{ required: true, message: '请选择标签', trigger: 'change' },
					],

				},
				isEdit:false,
				productList:[],
				typeList:[],

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
					price: '',
					num:'',
				}
				this.$refs.addOrEditForm.clearValidate()
				this.showModal = false
			},
			openModal(row={}){
				this.showModal = true
				if(row.id)this.isEdit = true
				else this.isEdit  = false
				this.form = {...this.form,...row}
				this.doGetProductType()
				this.$nextTick(()=>{
					this.$refs.addOrEditForm.clearValidate()
				})
			},

			submit(){
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