import {observable, action, runInAction} from 'mobx'
import {message} from 'antd'
import io from './io'

export default class {{upperName}} {
  // 内容
  @observable content = {};

  @action async getContent(params) {
    try {
      const response = await io.getContent(params)
      runInAction(() => {
        this.content = response
      })
    } catch (e) {
      message.error(e.message)
    }
  }
}