import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import  CPCreateCharacterSettingForm from './CPCreateCharacterSettingForm.js'



class CharacterPage extends Component {

  state = {
    character: null
  }

  componentDidMount = () => {
    fetch("http://localhost:4000/api/v1/characters/".concat(`${this.props.match.params.id}`))
    .then(res=>res.json())
    .then(character => {
      this.setState({
        character: character
      }, () => {fetch("http://localhost:4000/api/v1/entries/".concat(`${this.state.character.entry_id}`))
       .then(response => response.json())
       .then(json => {
         this.props.setCurrentEntry(json)
       })})
    })


  }



  render (){
    console.log(this.props.currentEntry)
    if (!this.state.character) {
      return <h1>Loading...</h1>
    }

    return (
      <div>
      This is the Page for {this.state.character.name}
      <CPCreateCharacterSettingForm currentEntry={this.props.currentEntry}/>

      <Link to={`/storyboards/${this.state.character.entry_id}`}><button className="ui button positive">Return To Storyboard</button></Link>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
    currentEntry: state.currentEntry
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentEntry: (entry) => {

      dispatch({type: 'SET_CURRENT_ENTRY', payload: entry})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterPage)