import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {observable, action} from "mobx"
import {FormattedMessage} from 'react-intl'
import './{{upperName}}.less'
import io from './io'
import {{upperName}}Store from './store-{{lowerName}}'

const store = new {{upperName}}Store()
@observer
class {{upperName}} extends Component {
  @observable visible = false

  componentDidMount() {
    store.getContent({
      page: 10,
      limit: 5,
    })
  }
  @observable count = 100

  @action clickCount = () => {
    this.count ++
    console.log('click')
    
  }

  @action handleClose = () => this.visible = false

  @action handleOpen = () => this.visible = true

  render() {
    return (
      <div className="{{lowerName}}">
        <header className="{{lowerName}}-header">
          <FormattedMessage
            id="app.home.hello"
          />
          <div>count: {this.count}</div>
          <Button type="primary" onClick={this.clickCount}>add</Button>
          <Button type="danger" onClick={() => store.increaseCount()}>store  add</Button>
        </header>
        <ATable />
      </div>
    )
  }
}

export default {{upperName}}
