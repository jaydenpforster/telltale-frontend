import React, { Component, Fragment } from 'react'
import ReadOnlyEntryCard from '../components/ReadOnlyEntryCard.js'
import ReadOnlyEntryEditor from './ReadOnlyEntryEditor.js'
import { Route, Switch, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import HOCWithAuth from '../components/HOCWithAuth.js'

class FollowingEntryContainer extends Component {
    state = {
        typeSearch: '',
        genreSearch: '',
        totalPublishedEntries: [],
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    filterEntries = (array) => {
        const singleFilteredArray = array.filter((entry) => {
            return (
                entry.title
                    .toLowerCase()
                    .includes(this.state.typeSearch.toLowerCase()) ||
                entry.user.username
                    .toLowerCase()
                    .includes(this.state.typeSearch.toLowerCase())
            )
        })
        const fullFilteredArray = singleFilteredArray.filter((entry1) => {
            return entry1.genre.includes(this.state.genreSearch)
        })
        return fullFilteredArray
    }

    filterForFollowing = (array) => {
        let followingEntryArray = []
        if (this.props.currentUser) {
            const followedArray = this.props.currentUser.followings.map(
                (following) => {
                    return following.user_id
                }
            )
            if (this.state.totalPublishedEntries) {
                const followedEntryArray =
                    this.state.totalPublishedEntries.filter((entry) => {
                        return followedArray.includes(entry.user.id)
                    })
                followingEntryArray = followedEntryArray
            }
        }
        return followingEntryArray
    }

    renderEntryCards = () => {
        if (this.state.totalPublishedEntries) {
            const entryCardComponentArray = this.filterEntries(
                this.filterForFollowing()
            ).map((entry) => {
                return <ReadOnlyEntryCard key={Math.random()} entry={entry} />
            })
            if (entryCardComponentArray.length) {
                return entryCardComponentArray
            } else {
                return (
                    <h1
                        style={{
                            position: 'absolute',
                            textAlign: 'center',
                            left: '15%',
                            top: '5em',
                        }}
                    >
                        No entries meet these specifications.{' '}
                        <Link to="/total-entries">
                            You can see entries by other authors here
                        </Link>
                        !
                    </h1>
                )
            }
        }
    }

    componentDidMount = () => {
        fetch(`${process.env.REACT_APP_BASE_URL}`.concat('/api/v1/entries'))
            .then((res) => res.json())
            .then((entries) => {
                const publishedEntries = entries.filter((entry) => {
                    return entry.published === true
                })
                this.setState({
                    totalPublishedEntries: publishedEntries,
                })
            })
    }

    render() {
        return (
            <Fragment>
                <Switch>
                    <Route
                        path="/following-entries/:id"
                        render={(props) => {
                            return <ReadOnlyEntryEditor {...props} />
                        }}
                    ></Route>
                    <Route
                        path="/following-entries"
                        render={() => (
                            <Fragment>
                                <div
                                    style={{
                                        background: 'lightgray',
                                        position: 'relative',
                                        width: '100%',
                                        height: '3em',
                                        bottom: '1em',
                                    }}
                                >
                                    <input
                                        style={{
                                            position: 'absolute',
                                            right: '10%',
                                            top: '10%',
                                            width: '22.5%',
                                            height: '80%',
                                        }}
                                        placeholder="Search These Entries..."
                                        value={this.state.search}
                                        onChange={this.handleChange}
                                        name="typeSearch"
                                    />
                                    <select
                                        style={{
                                            position: 'absolute',
                                            right: '35%',
                                            top: '10%',
                                            background: 'white',
                                            color: 'gray',
                                            height: '80%',
                                            width: '15%',
                                        }}
                                        onChange={this.handleChange}
                                        name="genreSearch"
                                    >
                                        <option label="Genre"></option>
                                        <option value="adventure">
                                            Adventure
                                        </option>
                                        <option value="comedy">Comedy</option>
                                        <option value="drama">Drama</option>
                                        <option value="fantasy">Fantasy</option>
                                        <option value="historical-fiction">
                                            Historical Fiction
                                        </option>
                                        <option value="horror">Horror</option>
                                        <option value="mystery">Mystery</option>
                                        <option value="non-fiction">
                                            Non-Fiction
                                        </option>
                                        <option value="romance">Romance</option>
                                        <option value="science-fiction">
                                            Science Fiction
                                        </option>
                                        <option value="western">Western</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {this.renderEntryCards()}
                                </div>{' '}
                            </Fragment>
                        )}
                    ></Route>
                </Switch>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
    }
}

export default HOCWithAuth(connect(mapStateToProps)(FollowingEntryContainer))
