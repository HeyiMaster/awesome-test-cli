import ioContext from '../../utils/io-context'

ioContext.create('{{lowerName}}', {
  getContent: {
    url: 'content',
    method: 'GET',
  },
})
export default ioContext.api.{{lowerName}}
