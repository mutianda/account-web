import axios from '@/config/axiosCommon.js'

export default {
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
			url: '/updateRecord',
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
}