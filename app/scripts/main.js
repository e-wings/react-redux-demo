import React from 'react'
import { render } from 'react-dom'
// 1)引入包
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import todoApp from './reducers'

// 2)新建store
let store = createStore(todoApp)

let rootElement = document.getElementById('root')
// 3) 将App绑定到store
render(
  <Provider store={store}><App /></Provider>, rootElement
)