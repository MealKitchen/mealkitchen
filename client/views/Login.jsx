/** @jsx React.DOM */

var LogIn = React.createClass({

  getInitialState: function() {
    return {email: null, password: null, login: true};
  },

  componentWillMount: function(){
    this.props.setBGImg(true);
  },

  handleEmailChange: function(e) {
     this.setState({email: e.target.value});
  },

  handlePasswordChange: function(e) {
     this.setState({password: e.target.value});
  },

  handleLogin: function() {
    var that = this;
    var user = new UserModel(this.state);
    user.save({}, {
      success: function(model, res){
        console.log("Successful login!", res);
        user.set({id: res.id});
        that.props.setUser(user);
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
        <button type='button' data-route='/signup' onClick={this.props.linkHandler}>Sign Up</button>
        <button type='button' data-route='/login' onClick={this.props.linkHandler}>Log In</button>
        <form>
          <input type="text" name="email" placeholder="Email" onChange={this.handleEmailChange} />
          <input type="password" name="password" placeholder="Password" onChange={this.handlePasswordChange}/>
          <button type="button" onClick={this.handleLogin}>Login</button>
        </form>
      </div>
    );
  }
});
