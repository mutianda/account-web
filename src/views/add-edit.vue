<template>
	<el-dialog :visible="showModal" width="500px" @close="closeModal">
		<el-form
				:model="addOrEditForm"
				ref="addOrEditForm"
				inline
				label-width="80px"
		>
			<el-form-item label="股票代码">
				<el-input
						v-model="addOrEditForm.share_code"
						autocomplete="off"
				></el-input>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script>
	export default {
		name: "add-edit",
		data(){
			return {
				showModal:false
			}
		},
		methods:{
			closeModal(){

			}
		}
	}
</script>

<style scoped>

</style>