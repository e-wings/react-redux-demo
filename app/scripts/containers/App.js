/**
 * 引入Redux和react-redux, 仅需要改动入口js:main.js,和容器: App.js.
 * main.js中新建整个程序唯一的store, 并绑定到App组件
 * App组件(本文件)中实现从全局state中引入自己需要的部分
 *
 * 理论上可以将没个组件都connect到store, 但尽量只connect最顶层的组件
 * 否则数据难以追踪
 */

import React, { Component, PropTypes } from 'react'
// 4) 引入connect
import { connect } from 'react-redux'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../actions'
import AddTodo from '../components/AddTodo'
import TodoList from '../components/TodoList'
import Footer from '../components/Footer'

class App extends Component {
  render() {
    // 7) 通过调用 connect(), 获得dispatch方法, 和需要的state
    // 如果要得到部分state, 则在这里标出,并在select方法中实现对全局state的筛选(见下方)
    const { dispatch, visibleTodos, visibilityFilter } = this.props
    return (
      <div>
        <AddTodo
          onAddClick={text =>
            dispatch(addTodo(text))
          } />
        { /* 8) 把得到的state以props的形式传入子组件*/ }
        <TodoList
          todos={visibleTodos}
          onTodoClick={index =>
            dispatch(completeTodo(index))
          } />
        <Footer
          filter={visibilityFilter}
          onFilterChange={nextFilter =>
            dispatch(setVisibilityFilter(nextFilter))
          } />
      </div>
    )
  }
}

/**
 * 类似于表单的验证,让程序更强健
 * 跟Redux没有关系,可忽略
 * @type {{visibleTodos: *, visibilityFilter: *}}
 */
App.propTypes = {
  visibleTodos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired,
  visibilityFilter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired
}

/**
 * 根据footer中的条件,对列表进行筛选
 * @param todos
 * @param filter
 * @returns {*}
 */
function selectTodos(todos, filter) {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(todo => todo.completed)
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(todo => !todo.completed)
  }
}

// 5) 基于全局 state ，得到那些我们需要的state
// 注意：使用 https://github.com/reactjs/reselect 效果更佳。
// state.todos - 全局state中todos的部分
// state.visibilityFilter - 字符串, 用于保存来自Footer的筛选条件: 全部,已完成,未完成
function select(state) {
  return {
    visibleTodos: selectTodos(state.todos, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  }
}

// 6) 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
// 任何一个从 connect() 包装好的组件都可以得到一个 dispatch 方法作为组件的 props，以及得到全局 state 中所需的任何内容
export default connect(select)(App)