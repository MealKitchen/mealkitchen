/** @jsx React.DOM */

var SignUp = React.createClass({

  getInitialState: function() {
    return {email: null, password: null, signup: true};
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

  handleSignUp: function(e) {
    e.preventDefault();
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
      <div className="container">
        <div className="jumbotron">
        <h2 className="heading">Sign Up</h2>
          <form onSubmit={this.handleSignup}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input className="form-control" type="text" name="email" placeholder="Enter email" onChange={this.handleEmailChange} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input className="form-control" type="password" name="password" placeholder="Enter password" onChange={this.handlePasswordChange}/>
            </div>
            <input type="submit" value="Sign Up"></input>
          </form>
          <p>Already have an account with us? <a href="/#/login">Login here.</a></p>
        </div>
      </div>
    );
  }

});



