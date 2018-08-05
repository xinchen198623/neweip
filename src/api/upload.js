import hcaxios from './hcaxios'

const resData = {
  name: 'food.jpeg',
  url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
}

// export const upload = (scheduleType) => hcaxios.get('rest/schedule/template', scheduleType)
export const upload = () => (data) => Promise.resolve(resData)
