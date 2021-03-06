import React from 'react'
import { connect } from 'react-redux'
import history from '../history'

class Login extends React.Component {
    state = {
        username: '',
        password: '',
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.createAuth(this.state)
    }

    createAuth = (info) => {
        fetch(`${process.env.REACT_APP_BASE_URL}`.concat('/api/v1/login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accepts: 'application/json',
            },
            body: JSON.stringify({
                username: info.username,
                password: info.password,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.errors) {
                    alert(json.errors)
                    this.props.setCurrentUser(-1)
                } else {
                    this.props.setCurrentUser(json.user)
                    localStorage.setItem('token', json.token)
                    history.push(`/profiles/${this.props.currentUser.id}`)
                }
            })
    }

    render() {
        return (
            <div
                className="ui raised card"
                style={{
                    width: '36%',
                    minWidth: '30em',
                    position: 'relative',
                    left: '32%',
                    padding: '5em',
                    top: '5em',
                }}
            >
                <div
                    className="ui attached message"
                    style={{
                        position: 'relative',
                        bottom: '3em',
                        textAlign: 'center',
                    }}
                >
                    <div className="header">
                        <img
                            style={{
                                height: '5em',
                                background: 'white',
                                border: '.25em solid gray',
                                borderRadius: '2.5em',
                                position: 'relative',
                                top: '1em',
                            }}
                            alt=""
                            src="./icons/TellTaleLogo.png"
                        />

                        <h2>Welcome Back! Log In to Keep on Writing!</h2>
                    </div>
                </div>

                <form onSubmit={this.handleSubmit}>
                    <div className="ui form">
                        <div className="required field">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="Username"
                                name="username"
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="required field">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <button
                            className="ui button"
                            style={{ left: '40%', top: '1.75em' }}
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrentUser: (user) => {
            dispatch({ type: 'SET_CURRENT_USER', payload: user })
        },
        setCurrentEntry: (entry) => {
            dispatch({ type: 'SET_CURRENT_ENTRY', payload: entry })
        },
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        currentEntry: state.currentEntry,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
