import React from 'react'
import { Link } from 'react-router-dom'

const logoMatcher = {
    adventure: '/icons/Adventure.png',
    comedy: '/icons/Comedy.png',
    drama: '/icons/Drama.png',
    'dungeons-and-dragons': '/icons/d&d.jpg',
    fantasy: '/icons/fantasy-3.png',
    'historical-fiction': '/icons/Historical-Fiction-3.png',
    horror: '/icons/ghost.png',
    mystery: '/icons/detective2.png',
    'non-fiction': '/icons/Non-Fiction-2.png',
    romance: '/icons/Romance.png',
    'science-fiction': '/icons/Science-Fiction-3.png',
    western: '/icons/Western-2.png',
    other: '/icons/Other.png',
}

class EntryCard extends React.Component {
    render() {
        return (
            <div
                style={{
                    width: '40%',
                    minWidth: '40em',
                    height: '18em',
                    position: 'relative',
                    top: '5em',
                    marginLeft: '5%',
                    marginTop: '2.5em',
                    display: 'inline-block',
                }}
                className="ui card"
            >
                <div className="content">
                    <div className="header">
                        <span
                            style={{
                                display: 'inline-block',
                                maxWidth: '20em',
                                overflowX: 'hidden',
                                height: '1.25em',
                                whiteSpace: 'no-wrap',
                                textOverflow: 'ellipsis',
                                position: 'relative',
                                top: '.25em',
                            }}
                        >
                            {this.props.entry.title.concat('    ')}
                        </span>{' '}
                        <span
                            style={{
                                display: 'inline-block',
                                position: 'relative',
                                marginLeft: '1em',
                                fontSize: '.75em',
                                color: 'gray',
                            }}
                        >
                            {' '}
                            ({this.props.entry.genre})
                        </span>
                        <img
                            className="ui avatar image"
                            style={{
                                height: '2em',
                                width: '2em',
                                position: 'absolute',
                                right: '2%',
                                top: '2.5%',
                            }}
                            src={logoMatcher[this.props.entry.genre]}
                            alt=""
                        />
                    </div>
                </div>

                <div className="extra content">
                    <div
                        style={{
                            position: 'absolute',
                            right: '.00001%',
                            bottom: '22.5%',
                            maxHeight: '55%',
                            minHeight: '55%',
                            overflowY: 'scroll',
                            width: '100%',
                            padding: '1%',
                        }}
                        className="description"
                    >
                        <p style={{ margin: '1.75%' }}>
                            {' '}
                            Description: {this.props.entry.description}
                        </p>
                    </div>

                    <Link
                        key={Math.random()}
                        to={`/storyboards/${this.props.entry.id}`}
                    >
                        <button
                            style={{
                                position: 'absolute',
                                left: '2%',
                                top: '80%',
                            }}
                            className="ui blue button"
                        >
                            View Storyboard
                        </button>
                    </Link>
                </div>
                {this.props.entry.published ? (
                    <div>
                        <img
                            style={{
                                height: '16.875%',
                                width: '7.5%',
                                position: 'absolute',
                                right: '1.75%',
                                top: '80%',
                                border: '.1125em silver solid',
                                borderRadius: '50%',
                                background: 'lightgreen',
                                padding: '.75%',
                            }}
                            src="/icons/Published-2.png"
                            alt=""
                        />
                    </div>
                ) : null}
            </div>
        )
    }
}

export default EntryCard
