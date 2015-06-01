/** @jsx React.DOM */

var Navigation = ReactRouter.Navigation;

var LogIn = React.createClass({

  mixins: [Navigation],
  
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
    var that = this;
    var user = this.props.userLogIn;
    user.set(this.state);
    user.save({}, {
      success: function(model, res){
        console.log("Successful login!", res);
        that.props.user.set({id: res.id});
        that.transitionTo('mealquery');
      },
      error: function(model, err){
        console.error("ERROR while logging in!");
      }
    });
  },
  
  _transition: function(e){
    this.transitionTo(e.target.dataset.id);
  },

  render : function() {
    return (
      <div>
        <button type='button' data-id='signup' onClick={this._transition}>Sign Up</button>
        <button type='button' data-id='login' onClick={this._transition}>Log In</button>
        <form>
          <input type="text" name="email" placeholder="Email" onChange={this.handleEmailChange} />
          <input type="password" name="password" placeholder="Password" onChange={this.handlePasswordChange}/>
          <button type="button" onClick={this.handleLogin}>Login</button>
        </form>
      </div>
    );
  }

});