import React, { Component } from 'react'
import PageCharacterSettingCard from '../components/PageCharacterSettingCard.js'

class CPCharacterSettingList extends Component {
    state = {
        chapter: '',
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    sortAndFilterCharacterSettings = (array) => {
        const sortedArray = array.sort((a, b) => {
            return a.chapter - b.chapter
        })
        const filteredArray = sortedArray.filter((charSet) => {
            return charSet.chapter.toString() === this.state.chapter.toString()
        })
        if (this.state.chapter) {
            return filteredArray
        } else {
            return sortedArray
        }
    }

    renderCharacterSettings = () => {
        const charSetArray = this.sortAndFilterCharacterSettings(
            this.props.character.character_settings
        ).map((charSet) => {
            return (
                <PageCharacterSettingCard
                    key={Math.random()}
                    charSet={charSet}
                />
            )
        })
        if (charSetArray.length) {
            return charSetArray
        } else {
            return (
                <h3 style={{ textAlign: 'center' }}>
                    This character hasn't been detailed at any settings yet!
                </h3>
            )
        }
    }

    render() {
        return (
            <div
                className="ui raised card"
                style={{
                    width: '40%',
                    position: 'relative',
                    height: '38em',
                    minWidth: '42em',
                    marginLeft: '1%',
                    marginRight: '2.5%',
                    minHeight: '72.5%',
                    maxHeight: '72.5%',
                    overflowY: 'scroll',
                    display: 'inline-block',
                    float: 'right',
                }}
            >
                <div style={{ background: 'silver', height: '5em' }}>
                    <h3
                        style={{
                            textAlign: 'center',
                            position: 'absolute',
                            top: '4.5%',
                            left: '5%',
                        }}
                    >
                        Places This Character Has Been{' '}
                    </h3>
                    <div className="ui search">
                        <input
                            className="prompt"
                            style={{
                                position: 'relative',
                                left: '52%',
                                marginTop: '3%',
                            }}
                            onChange={this.handleChange}
                            name="chapter"
                            value={this.state.chapter}
                            type="number"
                            placeholder="Search by Chapter..."
                            min={0}
                        />
                    </div>
                </div>
                {this.renderCharacterSettings()}
            </div>
        )
    }
}

export default CPCharacterSettingList
