import React from 'react'
import Media from 'react-media'
import { Route, Switch } from 'react-router-dom'

import SideBar from './SideBar'
import Article from './Article'

import classes from './index.module.css'

export default class Blog extends React.Component {
  state = {}

  componentDidMount () {
    this.fetchBlogList().then(list => {
      this.setState({ list: list.sort((a1, a2) => a2 - a1) })
    })
  }

  render () {
    let list = this.state.list
    let match = this.props.match
    let className = classes.Blog
    if (this.props.className) className += ' ' + this.props.className
    return (
      <Media query='(max-width: 1000px)'>
        {isPhone => {
          return isPhone ? (
            <div className={className}>
              {match && match.isExact
                // phone: /blog
                ? <SideBar list={list} className={classes['Blog-sidebar']} />
                // phone  /blog/:id
                : (list ? this.renderArticleRouter() : null)
              }
            </div>
          ) : (
            // desktop
            <div className={className}>
              <SideBar list={list} className={classes['Blog-sidebar']} />
              {list ? this.renderArticleRouter() : null}
            </div>
          )
        }}
      </Media>
    )
  }

  fetchBlogList = () => {
    return window
      .fetch('/articles/list.json')
      .then(res => res.json())
      .catch(err => console.log(err))
  }

  renderArticleRouter = () => {
    return (
      <Switch>
        {this.state.list.map(each => (
          <Route
            key={each.title}
            path={`/blog/${each.id}`}
            render={() => <Article className={classes['Blog-content']} {...each} />}
          />
        ))}
      </Switch>)
  }
}
