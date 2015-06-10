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

  handleLogin: function(e) {
    e.preventDefault();
    var that = this;
    $.ajax({
      type: "POST",
      url: "api/user",
      data: JSON.stringify(that.state),
      dataType: "json",
      contentType: "application/json",
      success: function(res){
        var user = new UserModel({
          id: res.id,
          password: res.password,
          email: res.email
        });
        that.props.setUser(user);
        that.props.transitionTo('/mealquery');
      }
    });
  },

  render : function() {
    return (
      <div className="container">
        <div className="jumbotron">
        <h2 className="heading">Log In</h2>
          <form onSubmit={this.handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input className="form-control" type="text" name="email" placeholder="Enter email" onChange={this.handleEmailChange} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input className="form-control" type="password" name="password" placeholder="Enter password" onChange={this.handlePasswordChange}/>
            </div>
            <input type="submit" className="btn btn-right pull-right" value="Log In"></input>
          </form>
          <p>Don&#39;t have an account with us? <a href="/#/signup">Sign up here.</a></p>
        </div>
      </div>
    );
  }
});
