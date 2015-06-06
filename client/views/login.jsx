/** @jsx React.DOM */

var LogIn = React.createClass({

  mixins: [],
  
  getInitialState: function() {
    return {email: null, password: null, login: true};
  },
  
  handleEmailChange: function(e) {
     this.setState({email: e.target.value});
  },

  handlePasswordChange: function(e) {
     this.setState({password: e.target.value});
  },

  handleLogin: function() {
    var that=this;
    this.props.user.set(this.state);
    this.props.user.save({}, {
      success: function(model, res){
        console.log("Successful login!", res);
        that.props.user.set({id: res.id});
        that.props.transitionTo('/mealquery');
      },
      error: function(model, err){
        console.error("ERROR while logging in!");
      }
    });
  },

  render : function() {
    return (
      <div>
        <button type='button' data-route='/signup' onClick={this.props._linkHandler}>Sign Up</button>
        <button type='button' data-route='/login' onClick={this.props._linkHandler}>Log In</button>
        <form>
          <input type="text" name="email" placeholder="Email" onChange={this.handleEmailChange} />
          <input type="password" name="password" placeholder="Password" onChange={this.handlePasswordChange}/>
          <button type="button" onClick={this.handleLogin}>Login</button>
        </form>
      </div>
    );
  }

});