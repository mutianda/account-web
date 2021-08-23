<template>
	<el-dialog :visible="showModal" width="400px" @close="closeModal" title="记账">
		<el-form
				:model="form"
				ref="addOrEditForm"
				inline
				:rules="rules"  label-width="100px"
		>
			<el-form-item  label="时间" prop="accountTime">
				<el-date-picker :disabled="isEdit" class="form-input" value-format="timestamp" type="datetime" placeholder="选择日期" v-model="form.accountTime" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item  label="类型" prop="type">
				<el-radio v-model="form.type" :label="1">收入</el-radio>
				<el-radio v-model="form.type" :label="-1">支出</el-radio>
			</el-form-item>
			<el-form-item  label="金额" prop="money">
				<el-input v-model.number="form.money" class="form-input">  <template slot="append">元</template></el-input>
			</el-form-item>
			<el-form-item  label="记账备注" prop="text">
				<el-input v-model="form.text" type="textarea" class="form-input"></el-input>
			</el-form-item>

		</el-form>
		<div slot="footer" class="dialog-footer" style="text-align: center">
		    <el-button @click="closeModal">取 消</el-button>
		    <el-button type="primary" @click="submit">确 定</el-button>
        </div>
	</el-dialog>
</template>

<script>
	export default {
		name: "add-edit",
		data(){
			return {
				showModal:false,
				axios:this.$api,
				form:{
					accountTime:(new Date()).getTime(),
					money:0,
					text:'aa',
					type:1
				},
				rules: {
					money: [
						{ required: true, message: '请输入金额', trigger: 'blur' },
						{ type:'number', message: '请输入数字', trigger: 'blur' }

					],
					accountTime:[
						{ required: true, message: '请选择时间', trigger: 'change' },
					],
					type:[
						{ required: true, message: '请选择类型', trigger: 'change' },
					]

				},
				isEdit:false

			}
		},
		methods:{
			closeModal(){
				this.form ={
					accountTime:'',
					money:0,
					text:'aa',
					type:1
				}
				this.$refs.addOrEditForm.clearValidate()
				this.showModal = false
			},
			openModal(row={}){
				if(row.id)this.isEdit = true
				else this.isEdit  = false

				this.form = {...this.form,accountTime:(new Date()).getTime(),...row}
				this.showModal = true
			},
			submit(){
				this.$refs.addOrEditForm.validate((valid)=> {
					if (valid) {
						const {
							accountTime,
							money,
							text,type} = this.form
						const params = {
							money:money*type ,
							time:accountTime,
							reason:text,
							id:this.form.id||''
						}

						this.axios[this.isEdit?'editRecord':'addRecord'](params).then(res=>{
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

<style scoped>
	.form-input{
		width: 250px !important;
	}

</style>