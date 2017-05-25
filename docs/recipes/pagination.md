# Pagination

## React Router

If you are using `react-router`, components that are being used as routes receive `params` as a prop that contains route params.

If you route is setup with `/projects/:page` with `:page` corresponding to the page number the user is on (i.e. `/projects/1`)

```js
import React, { Component, PropTypes } from 'react'
import { map } from 'lodash'
import { connect } from 'react-redux'
import {
  firebaseConnect,
  populatedDataToJS,
  isLoaded,
  pathToJS,
  dataToJS
} from 'react-redux-firebase'
import TodoItem from './TodoItem'

const itemsPerPage = 10

@firebaseConnect(({ params: { page } }) => { // params comes from react-router
  return [
    {
      path: 'projects',
      storeAs: `projects.${page}`
      queryParams: [`startAt=${10}`, `limitToFirst=${itemsPerPage}`] },
  ]
})
@connect(
  ({firebase}) => ({
    projects: populatedDataToJS(firebase, 'projects', populates),
  })
)
export default class PageRoute extends Component {
  static propTypes = {
    projects: PropTypes.shape({
      name: PropTypes.string,
      owner: PropTypes.object // string if using childParam: 'displayName'
    }),
    firebase: PropTypes.shape({
      set: PropTypes.func.isRequired,
      remove: PropTypes.func.isRequired
    })
  }

  render () {
    const { firebase, projects } = this.props

    const projectsList = (!isLoaded(projects))
                        ? 'Loading'
                        : (isEmpty(projects))
                          ? 'Todo list is empty'
                          : map(projects, (todo, id) => (
                              <div>
                                Name: {project.name}
                                Owner: { owner.displayName || owner }
                              </div>
                            ))
    return (
      <div>
        <h2>react-redux-firebase paginate snippet</h2>
        <div>
          <h4>Projects List</h4>
          {projectsList}
        </div>
      </div>
    )
  }
}
```
