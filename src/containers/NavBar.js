import React, { Component, Fragment} from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import logo from './TellTaleLogo.png'



class NavBar extends Component {

  render(){
    return (

  <div className="ui menu" >
  <Link to ={"/create-entry"}>
    <div className = "item">
      <h3>Start a New Entry</h3>
    </div>
    </Link>
    <Link to="/entries">
    <div className="item">
    <h3>Your Entries</h3>
    </div>
    </Link>
    <Link to ={"/profile"}>
    <div className="item">
    <h3>View Your Profile</h3>
    </div>
      </Link>
    {this.props.currentUser === -1 || this.props.currentUser === null ?
      <Fragment><Link to="/signup"><div className="item"><h3>Sign Up</h3></div></Link><Link to="/login"><div className="item"><h3>Login</h3></div></Link></Fragment> :
      <Link to="/logout">
      <div className="item">
    <h3>Logout</h3>
      </div>
    </Link> }
    <Link to="/entries"><img alt="" src={logo} style={{height: "45px", position: "absolute", right: "3em"}}/></Link>
  </div>
    )
  }

}


const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  }
}

export default connect(mapStateToProps)(NavBar)
