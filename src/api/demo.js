import hcaxios from './hcaxios'

export const getDefaultData = () => hcaxios.get('/demo/count')

// restfll api 调用方式
export const getDemo = (id) => hcaxios.get(`/demo/${id}`)

export const queryData = () => hcaxios.get('leak_card/query', {date: '2018/6/8', page: 2})

export const testsso = () => hcaxios.get('/api/test')
