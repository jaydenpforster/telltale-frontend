import React, { Component } from 'react'
import history from "../history"

class CPCreateCharacterSettingForm extends Component {

    state = {
      setting_id: "",
      chapter: "",
      description: ""
    }

  renderRows = () => {
    if(this.props.currentEntry){
    let settingOptionsArray = this.props.currentEntry.settings.map((setting)=>{
      return (<option key={Math.random()} value={setting.id}>{setting.name}</option>)
    })
    return settingOptionsArray
    }
  }


  handleChange=(e)=> {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.createCharacterSetting(this.state)
  }

  createCharacterSetting = (info) => {
    fetch("http://localhost:4000/api/v1/character_settings", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accepts": "application/json" },
      body: JSON.stringify({character_id:`${this.props.character.id}`, setting_id: info.setting_id, description: info.description, chapter:info.chapter})
     })
     .then(res=>res.json())
     .then(characterSetting=>{
     })
     history.push("/storyboards/".concat(`${this.props.currentEntry.id}`))
  }

  render(){
    if (!this.props.currentEntry){
      return <h1>Loading...</h1>
    }
    return (
      <div>
        {!!this.props.currentEntry.settings.length &&
        <div>
        Where does {this.props.character.name} appear at in your story? Detail it here!
            <form className="ui form" onSubmit={this.handleSubmit}>
              <select onChange={this.handleChange} className="ui dropdown" value={this.state.setting_id} name="setting_id" required>
              <option label="Select a Setting!"></option>
                {this.renderRows()}
              </select>
              <label>Chapter</label>
              <input onChange={this.handleChange} type="number" name="chapter" value={this.state.chapter} min={0} placeholder="Chapter" required/>
              <div className ="field">
                <label>Description</label>
                <textarea onChange={this.handleChange} name="description" placeholder="Description" value={this.state.description} required ></textarea >
              </div>
              <button className="ui button" type="submit">Submit</button>
            </form>
        </div>}
      </div>
    )
  }
}

export default CPCreateCharacterSettingForm
