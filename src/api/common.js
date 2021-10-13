import axios from '@/config/axiosCommon.js'

export default {
	//账单原因
	getReason (data) {
		return axios.request({
			url: '/getReason',
			method: 'post',
			data,
		})
	},
	addReason (data) {
		return axios.request({
			url: '/addReason',
			method: 'post',
			data,
		})
	},
	editReason (data) {
		return axios.request({
			url: '/updateReason',
			method: 'post',
			data,
		})
	},
	delReason (data) {
		return axios.request({
			url: '/delReason',
			method: 'post',
			data,
		})
	},
	//账单记录
	getRecord (data) {
		return axios.request({
			url: '/getRecord',
			method: 'post',
			data,
		})
	},
	addRecord (data) {
		return axios.request({
			url: '/addRecord',
			method: 'post',
			data,
		})
	},
	editRecord (data) {
		return axios.request({
			url: '/editRecord',
			method: 'post',
			data,
		})
	},
	delRecord (data) {
		return axios.request({
			url: '/delRecord',
			method: 'post',
			data,
		})
	},

	//商品类型
	getRack (data) {
		return axios.request({
		url: '/getRack',
		method: 'post',
		data,
		})
	},
	addRack (data) {
		return axios.request({
			url: '/addRack',
			method: 'post',
			data,
		})
	},
	addRackByList (data) {
		return axios.request({
			url: '/addRackByList',
			method: 'post',
			data,
		})
	},

	editRack (data) {
		return axios.request({
			url: '/updateRack',
			method: 'post',
			data,
		})
	},
	delRack (data) {
		return axios.request({
			url: '/delRack',
			method: 'post',
			data,
		})
	},
	//商品类型
	getProductType (data) {
		return axios.request({
			url: '/getProductType',
			method: 'post',
			data,
		})
	},
	addProductType (data) {
		return axios.request({
			url: '/addProductType',
			method: 'post',
			data,
		})
	},
	editProductType (data) {
		return axios.request({
			url: '/editProductType',
			method: 'post',
			data,
		})
	},
	delProductType (data) {
		return axios.request({
			url: '/delProductType',
			method: 'post',
			data,
		})
	},
	//商品记录
	getAccountProduct (data) {
		return axios.request({
			url: '/getAccountProduct',
			method: 'post',
			data,
		})
	},
	addAccountProduct (data) {
		return axios.request({
			url: '/addAccountProduct',
			method: 'post',
			data,
		})
	},
	editAccountProduct (data) {
		return axios.request({
			url: '/updateAccountProduct',
			method: 'post',
			data,
		})
	},
	delAccountProduct (data) {
		return axios.request({
			url: '/delAccountProduct',
			method: 'post',
			data,
		})
	},
}