import React from 'react'
import {
    EditorState,
    RichUtils,
    convertToRaw,
    convertFromRaw,
    Modifier,
} from 'draft-js'
import { Link } from 'react-router-dom'
import Editor from 'draft-js-plugins-editor'
import HOCWithAuth from '../components/HOCWithAuth.js'
import createHighlightPlugin from '../highlightPlugin'
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin'
import createToolbarPlugin from 'draft-js-static-toolbar-plugin'
import createCounterPlugin from 'draft-js-counter-plugin'
import createUndoPlugin from 'draft-js-undo-plugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'
import createEmojiPlugin from 'draft-js-emoji-plugin'

import '../App.css'
import { connect } from 'react-redux'
import history from '../history.js'
import 'draft-js/dist/Draft.css'
import 'draft-js-side-toolbar-plugin/lib/plugin.css'
import 'draft-js-static-toolbar-plugin/lib/plugin.css'
import 'last-draft-js-toolbar-plugin/lib/plugin.css'
import buttonStyles from '../buttonStyles.css'
import 'draft-js-counter-plugin/lib/plugin.css'
import 'draft-js-emoji-plugin/lib/plugin.css'

import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
} from 'draft-js-buttons'

const highlightPlugin = createHighlightPlugin({
    background: 'lightblue',
})

const sideToolbarPlugin = createSideToolbarPlugin()

const toolbarPlugin = createToolbarPlugin()
const { Toolbar } = toolbarPlugin

const counterPlugin = createCounterPlugin()

// Extract a counter from the plugin.
const { CharCounter, WordCounter, LineCounter } = counterPlugin

const theme = {
    undo: buttonStyles.button,
    redo: buttonStyles.button,
}
const undoPlugin = createUndoPlugin({
    undoContent: 'Undo',
    redoContent: 'Redo',
    theme,
})
const { UndoButton, RedoButton } = undoPlugin

const linkifyPlugin = createLinkifyPlugin()

const emojiPlugin = createEmojiPlugin()
const { EmojiSuggestions } = emojiPlugin

const tabCharacter = '   '

class EntryEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editorState: EditorState.createEmpty(),
            fetched: false,
            entry: null,
        }
    }

    makeBold() {
        this.onChange(
            RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD')
        )
    }

    makeItalic() {
        this.onChange(
            RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC')
        )
    }

    makeUnderlined() {
        this.onChange(
            RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE')
        )
    }

    makeHighlighted() {
        this.onChange(
            RichUtils.toggleInlineStyle(this.state.editorState, 'HIGHLIGHT')
        )
    }

    saveContent = (noteContent) => {
        if (this.state.fetched) {
            fetch(
                `${process.env.REACT_APP_BASE_URL}`
                    .concat('/api/v1/entries/')
                    .concat(`${this.props.match.params.id}`),
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Accepts: 'application/json',
                    },
                    body: JSON.stringify({
                        id: `${this.props.match.params.id}`,
                        content: JSON.stringify(
                            convertToRaw(
                                this.state.editorState.getCurrentContent()
                            )
                        ),
                    }),
                }
            )
                .then((response) => response.json())
                .then((json) => {})
        }
    }

    togglePublished = () => {
        if (this.state.fetched) {
            fetch(
                `${process.env.REACT_APP_BASE_URL}`
                    .concat('/api/v1/entries/')
                    .concat(`${this.props.match.params.id}`),
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Accepts: 'application/json',
                    },
                    body: JSON.stringify({
                        published: !this.state.entry.published,
                    }),
                }
            )
                .then((response) => response.json())
                .then((json) => {
                    this.setState({
                        entry: json,
                    })
                    this.props.updateEntryInfo(json)
                })
        }
    }

    onChange = (editorState) => {
        const contentState = editorState.getCurrentContent()
        this.saveContent(contentState)
        this.setState({
            editorState: editorState,
        })
    }

    handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(
            this.state.editorState,
            command
        )

        if (newState) {
            this.onChange(newState)
            return 'handled'
        }

        return 'not-handled'
    }

    handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            this.onChange(newState)
            return 'handled'
        }
        return 'not-handled'
    }

    onKeyPressed = (event) => {
        if (event.key === 'Tab') {
            const newEditorState = RichUtils.onTab(
                event,
                this.state.editorState,
                40 /* maxDepth */
            )
            if (newEditorState !== this.state.editorState) {
                this.onChange(newEditorState)
            }
            event.preventDefault()
        }
    }

    componentDidMount = () => {
        fetch(
            `${process.env.REACT_APP_BASE_URL}`
                .concat('/api/v1/entries/')
                .concat(`${this.props.match.params.id}`)
        )
            .then((response) => response.json())
            .then((entry) => {
                if (entry.status === 404) {
                    alert('This is not a valid entry.')
                    return history.push('/about')
                }
                if (entry) {
                    this.setState({
                        editorState: EditorState.createWithContent(
                            convertFromRaw(JSON.parse(entry.content))
                        ),
                        fetched: true,
                        entry: entry,
                    })
                } else {
                    this.setState({
                        fetched: true,
                    })
                }
            })
    }

    onTab = (e) => {
        e.preventDefault()

        const currentState = this.state.editorState
        const newContentState = Modifier.replaceText(
            currentState.getCurrentContent(),
            currentState.getSelection(),
            tabCharacter
        )

        this.setState({
            editorState: EditorState.push(
                currentState,
                newContentState,
                'insert-characters'
            ),
        })
    }

    render() {
        if (!this.state.editorState || !this.state.entry) {
            return <h1 className="loading">Loading...</h1>
        } else if (this.props.currentUser && this.state.entry.user) {
            if (this.props.currentUser.id !== this.state.entry.user.id) {
                alert(
                    'You do not have access to this page! You are being re-directed to a read-only version of this entry.'
                )
                history.push(`/total-entries/${this.state.entry.id}`)
                return null
            } else {
                return (
                    <div>
                        <h1>
                            Welcome back, "{this.state.entry.title}" has been
                            waiting for you!
                        </h1>
                        <div>
                            <div className="toolbar">
                                <Toolbar>
                                    {(externalProps) => (
                                        <div className="middle-toolbar">
                                            <div className="mini-toolbar">
                                                <UndoButton />
                                                <RedoButton />

                                                <button
                                                    onClick={() => {
                                                        this.makeHighlighted()
                                                    }}
                                                >
                                                    Highlight
                                                </button>
                                            </div>
                                            <BoldButton {...externalProps} />
                                            <ItalicButton {...externalProps} />
                                            <UnderlineButton
                                                {...externalProps}
                                            />
                                            <CodeButton {...externalProps} />
                                            <UnorderedListButton
                                                {...externalProps}
                                            />
                                            <OrderedListButton
                                                {...externalProps}
                                            />
                                            <BlockquoteButton
                                                {...externalProps}
                                            />
                                            <CodeBlockButton
                                                {...externalProps}
                                            />
                                        </div>
                                    )}
                                </Toolbar>
                            </div>
                            <div onKeyDown={this.onKeyPressed}>
                                <Editor
                                    onChange={(editorState) => {
                                        this.onChange(editorState)
                                    }}
                                    editorState={this.state.editorState}
                                    handleKeyCommand={this.handleKeyCommand}
                                    plugins={[
                                        highlightPlugin,
                                        sideToolbarPlugin,
                                        toolbarPlugin,
                                        undoPlugin,
                                        counterPlugin,
                                        linkifyPlugin,
                                        emojiPlugin,
                                    ]}
                                    onTab={this.onTab}
                                    placeholder="Write your story here..."
                                    spellCheck={true}
                                />
                                <EmojiSuggestions />

                                <div
                                    style={{
                                        position: 'relative',
                                        left: '82.5%',
                                        bottom: '1.5em',
                                        fontWeight: 'bold',
                                        width: '10%',
                                        display: 'inline',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'inline',
                                            position: 'relative',
                                            right: '12.5%',
                                            top: '1em',
                                        }}
                                    >
                                        <CharCounter /> characters
                                    </div>
                                    <div
                                        style={{
                                            display: 'inline',
                                            position: 'relative',
                                            right: '10%',
                                            top: '1em',
                                        }}
                                    >
                                        <WordCounter /> words
                                    </div>
                                    <div
                                        style={{
                                            display: 'inline',
                                            position: 'relative',
                                            right: '7.5%',
                                            top: '1em',
                                        }}
                                    >
                                        <LineCounter /> lines
                                    </div>
                                </div>
                            </div>

                            <Link
                                key={Math.random()}
                                to={`/storyboards/${this.state.entry.id}`}
                            >
                                <button
                                    style={{
                                        position: 'relative',
                                        left: '7.5%',
                                        bottom: '2em',
                                    }}
                                    className="ui blue button"
                                >
                                    View Storyboard
                                </button>
                            </Link>
                            <button
                                style={{
                                    position: 'relative',
                                    left: '10%',
                                    bottom: '2em',
                                }}
                                className="ui button positive"
                                onClick={this.togglePublished}
                            >
                                {this.state.entry && this.state.entry.published
                                    ? 'Unpublish Entry'
                                    : 'Publish Entry'}
                            </button>
                        </div>
                    </div>
                )
            }
        } else {
            return null
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateEntryInfo: (entry) => {
            dispatch({ type: 'UPDATE_ENTRY_INFO', payload: entry })
        },
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
    }
}

export default HOCWithAuth(
    connect(mapStateToProps, mapDispatchToProps)(EntryEditor)
)
