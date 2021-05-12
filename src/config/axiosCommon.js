import AxiosRequest from './axios'

const devUrl = $_devRequest
const proUrl = $_proRequest

const baseURL =
	process.env.NODE_ENV === 'development'
		? `${ devUrl.location }/`
		: `${ proUrl.location }/`

export default new AxiosRequest(baseURL)
