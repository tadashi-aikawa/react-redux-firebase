import React, { Component, PropTypes } from 'react'
import { map, last, range } from 'lodash'
import { connect } from 'react-redux'
import {
  firebaseConnect,
  populatedDataToJS,
  isLoaded,
  pathToJS,
  orderedToJS,
  dataToJS,
  isEmpty,
} from 'react-redux-firebase'
import { Link } from 'react-router'

const itemsPerPage = 5

@connect(
  ({ firebase }, { params: { id } }) => ({
    // NOTE: This assumes previous pages are stored, meaning navigating
    // directly to a page other than the first will not work
    lastProject: last(orderedToJS(firebase, `projects${id - 1}`)),
  })
)
@firebaseConnect(({ params: { id }, lastProject }) => { // params comes from react-router
  const endAtStr = lastProject ? `startAt=${lastProject.key}` : `startAt=0`
  return [
    {
      path: 'projects',
      storeAs: `projects${id}`,
      queryParams: [
        'orderByKey',
        endAtStr,
        `limitToFirst=${itemsPerPage}`
      ]
    },
  ]
})
@connect(
  ({ firebase }, { params: { id } }) => ({
    projects: orderedToJS(firebase, `projects${id}`),
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
    const { firebase, projects, params: { id } } = this.props

    const projectsList = (!isLoaded(projects))
                        ? 'Loading'
                        : (isEmpty(projects))
                          ? 'Todo list is empty'
                          : map(projects, (project, id) => (
                              <div key={id} style={{ marginBottom: '1rem' }}>
                                Name: {project.name}<br />
                                id: {project.key}
                              </div>
                            ))
    return (
      <div>
        <h2>react-redux-firebase pagination snippet</h2>
        <div>
          <h4>Projects List</h4>
          {projectsList}
          <Link to={`/projects/${parseInt(id) + 1}`}><button>Next Page</button></Link>
          <Link to={`/projects/${parseInt(id) - 1}`}><button>Previous Page</button></Link>
        </div>
      </div>
    )
  }
}
