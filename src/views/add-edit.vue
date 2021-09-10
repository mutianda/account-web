<template>
	<el-dialog :visible="showModal" width="400px" @close="closeModal" title="记账" :close-on-click-modal="false">
		<el-form
				:model="form"
				ref="addOrEditForm"

				:rules="rules"  label-width="100px"
		>
			<el-form-item  label="时间" prop="accountTime">
				<el-date-picker :disabled="isEdit" class="form-input" value-format="timestamp" type="datetime" placeholder="选择日期" v-model="form.accountTime" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item  label="类型" prop="type">
				<el-radio v-model="form.type" :label="1">收入</el-radio>
				<el-radio v-model="form.type" :label="-1">支出</el-radio>
			</el-form-item>
			<el-form-item  label="标签" prop="reason" align="left" >
				<el-popover
						placement="top"
						width="400"
						v-model="showPopover"
						trigger="hover">
					<div class="tag-box">
						<el-switch
								style="display: block"
								v-model="editModel"
								active-color="#13ce66"
								inactive-color="#eeeeee"
								active-text="启用编辑"
								inactive-text="禁用编辑">
						</el-switch>
						<el-input v-model="searchTxt" placeholder="请输入内容" size="small" class="tag-item" 	clearable> <template slot="prepend">搜索</template></el-input>

						<div v-for="item in treeList" class="tag-item" @click="tagClick(item)">
							<el-tag :disable-transitions="false"
							        :closable="editModel"
							        @close="handleClose(item)">{{item.reason}}</el-tag>
						</div>
						<el-input
								class="tag-item"
								v-if="inputVisible&&editModel"
								v-model="inputValue"
								ref="saveTagInput"
								size="small"
								style="width: 100px"
								@keyup.enter.native="handleInputConfirm"
								@blur="handleInputConfirm"
						>
						</el-input>
						<el-button  class="tag-item" size="mini" type="text" icon="el-icon-plus" circle plain v-if="!inputVisible&&editModel"  @click="showInput" ></el-button>

					</div>
					<el-button type="warning" v-if="form.reason" slot="reference" size="small" plain>{{form.reason}}</el-button>
					<el-button type="primary" v-else slot="reference" size="small" >选择标签</el-button>
				</el-popover>

			</el-form-item>

			<el-form-item  label="记账备注" prop="text">
				<el-popover
						ref="popover"
						placement="top"
						title=""
						width="400"
						trigger="hover"
						content=""
						:open-delay="2000"
						v-model="showSelect"
				>
					<div class="search-box" >

							<div class="search-item" v-for="(it,i) in searchList" @click="chooseOne(it)">
								<div class="desc">
										{{it.account_desc}}
								</div>
								<span class="type">
									<el-tag :type="it.account_money>0?'success':'warning'">{{it.account_reason}}</el-tag>
								</span>

							</div>
					</div>

				</el-popover>
				<el-input v-model="form.text" class="form-input" @input="changeTxt" ref="inputTxt" @mousemove="moveInInput" @mouseout="moveOutInput"> </el-input>

			</el-form-item>
			<el-form-item  label="金额" prop="money">
				<el-input v-model="form.money" class="form-input" ref="moneyInput">  <template slot="append">元</template></el-input>
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
					reason:'',
					type:1
				},
				showSelect:false,
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
					],
					reason:[
						{ required: true, message: '请选择标签', trigger: 'change' },
					],

				},
				isEdit:false,
				editModel:false,
				inputVisible: false,
				inputValue: '',
				treeData:[],
				searchTxt:'',
				showPopover:false,
				tableData:[]

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
			},
			searchList(){
				return this.tableData.filter(item=>{
					if(!this.form.text){
						return true
					}else {
						const match = PinyinMatch.match(item.account_desc,this.form.text)

						if(match){
							return  true
						}else {
							return false
						}
					}
				})
			}
		},
		mounted() {
			this.doSearch()
		},
		watch:{

		},
		methods:{
			moveInInput(){
				this.showSelect = true

			},
			moveOutInput(){
				this.showSelect = false

			},
			changeTxt(val){
				console.log(val);
			},
			chooseOne(row){
				this.form.reason = row.account_reason

				this.form.text = row.account_desc
				this.$refs.moneyInput.focus()
			},
			doSearch(){
				const [startTime,endTime] =[1500000000000,(new Date()).getTime()]
				const params = {
					desc:'',
					reason:'',
					startTime,
					endTime

				}

				this.axios.getRecord(params).then((res) => {
					console.log(res);
					this.tableData= res.data.filter((it,i)=>{
						return  res.data.findIndex(currentValue=> currentValue.account_desc==it.account_desc)==i

					}).map(item=>{
						item.account_money -=0
						item.show = true
						return item
					})
					console.log(this.tableData);



				}).catch(e =>{
					this.$message.error('查询失败')
				})
			},
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
				const has = this.treeData.some(it=>it.reason==inputValue)
				if(has){
					this.$message.warning(
						'该种类已经存在'
					)
					return
				}
				if (inputValue) {
					this.addReason()
				}else {
					this.inputVisible = false;
					this.inputValue = '';
				}

			},
			tagClick(item){
				this.$refs.inputTxt.focus(0)
				this.form.reason = item.reason
				this.form.text+=item.reason
				this.showPopover = false

			},
			closeModal(){
				this.form ={
					accountTime:'',
					money:'',
					reason: '',
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
						this.inputVisible = false;
						this.inputValue = '';
					}
				})
			},
			submit(){
				this.$refs.addOrEditForm.validate((valid)=> {
					if (valid) {
						const {
							accountTime,
							money,
							text,type,reason} = this.form
						const params = {
							money:money*type ,
							time:accountTime,
							reason,
							nemo:text,
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
	.search-box{
		height: 400px;
		width: 100%;
		overflow: scroll;
		.search-item{
			width: 100%;
			line-height: 40px;
			height: 40px;
			cursor: pointer;
			border-bottom: .1px solid #eee;
			display: flex;
			align-items: center;
			flex-wrap: nowrap;
			.desc{
				flex:1;
				text-align: left;
			}
			.type{
				width: 100px;
				text-align: right;
			}
		}
	}

</style>