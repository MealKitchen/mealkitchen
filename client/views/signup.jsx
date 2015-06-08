/** @jsx React.DOM */

var SignUp = React.createClass({
  
  getInitialState: function() {
    return {email: null, password: null, signup: true};
  },
  
  handleEmailChange: function(e) {
     this.setState({email: e.target.value});
  },

  handlePasswordChange: function(e) {
     this.setState({password: e.target.value});
  },

  handleSignUp: function() {
    var that = this;
    this.props.user.set(this.state);
    this.props.user.save({}, {
      success: function(model, res){
        console.log("Successful sign up!");
        that.props.transitionTo('/login');
      },
      error: function(model, err){
        console.error("I'm sorry, there was an error!");
      }
    });
  },

  render : function() {
    return (
      <div>
        <button type='button' data-route='/signup' onClick={this.props.linkHandler}>Sign Up</button>
        <button type='button' data-route='/login' onClick={this.props.linkHandler}>Log In</button>
        <form>
          <input type="text" name="email" placeholder="Email" onChange={this.handleEmailChange} />
          <input type="password" name="password" placeholder="Password" onChange={this.handlePasswordChange}/>
          <button type="button" onClick={this.handleSignUp}>Sign Up</button>
        </form>
      </div>
    );
  }

});
