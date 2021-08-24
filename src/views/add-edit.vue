<template>
	<el-dialog :visible="showModal" width="400px" @close="closeModal" title="记账" :close-on-click-modal="false">
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
				<el-input v-model="form.money" class="form-input">  <template slot="append">元</template></el-input>
			</el-form-item>
			<el-form-item  label="记账备注" prop="text">

				<el-popover
						placement="bottom"
						width="400"
						v-model="showPopover"
						trigger="click">
					<div class="tag-box">
						<el-input v-model="searchTxt" placeholder="请输入内容" size="small" class="tag-item" 	clearable> <template slot="prepend">搜索</template></el-input>
						<div v-for="item in treeList" class="tag-item" @click="tagClick(item)">
							<el-tag :disable-transitions="false"
							        closable
							        @close="handleClose(item)">{{item.reason}}</el-tag>
						</div>
						<el-input
								class="tag-item"
								v-if="inputVisible"
								v-model="inputValue"
								ref="saveTagInput"
								size="small"
								clearable
								style="width: 100px"
								@keyup.enter.native="handleInputConfirm"
								@blur="handleInputConfirm"
						>
						</el-input>
						<el-button  class="tag-item" size="mini" type="text" icon="el-icon-plus" circle plain v-else  @click="showInput"></el-button>

					</div>
					<el-input v-model="form.text" type="textarea" class="form-input" slot="reference"></el-input>
				</el-popover>

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
					accountTime:(new Date()).getTime(),
					money:'',
					text:'',
					type:1
				},
				rules: {
					money: [
						{ required: true, message: '请输入金额', trigger: 'blur' },
						{ validator: checkNumber, message: '请输入数字',trigger: 'blur' }

					],
					accountTime:[
						{ required: true, message: '请选择时间', trigger: 'change' },
					],
					type:[
						{ required: true, message: '请选择类型', trigger: 'change' },
					]

				},
				isEdit:false,
				inputVisible: false,
				inputValue: '',
				treeData:[],
				searchTxt:'',
				showPopover:false,

			}
		},
		computed:{
			treeList(){

				return this.treeData.filter(item=>{
					if(!this.searchTxt){
						return  true
					}
					const match = PinyinMatch.match(item.reason,this.searchTxt)
					console.log(match);
					if(match){
						return  true
					}else {
						return false
					}

				})
			}
		},
		methods:{
			handleClose(tag) {

				this.axios.delReason({id:tag.id}).then(res=>{
					this.doGetReason()
				})
			},

			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
					this.addReason()
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			tagClick(item){
				this.form.text+=item.reason
				this.showPopover = false
			},
			closeModal(){
				this.form ={
					accountTime:'',
					money:'',
					text:'',
					type:1
				}
				this.$refs.addOrEditForm.clearValidate()
				this.showModal = false
			},
			openModal(row={}){
				if(row.id)this.isEdit = true
				else this.isEdit  = false

				this.form = {...this.form,accountTime:(new Date()).getTime(),...row}
				this.doGetReason()
				this.showModal = true
			},
			doGetReason(){
				this.axios.getReason({}).then(res=>{
					if(res){
						this.treeData = res.data
					}
				})
			},
			addReason(){
				const params = {
					pid:'0',
					reason:this.inputValue,
					nemo:''
				}
				this.axios.addReason(params).then(res=>{
					if(res.code==200){
						this.doGetReason()
					}
				})
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