/** @jsx React.DOM */

var SignUp = React.createClass({

  getInitialState: function() {
    return {
      username: null,
      password: null
    };
  },

  componentWillMount: function(){
    this.props.setBGImg(true);
  },

  handleUsernameChange: function(e) {
     this.setState({ username: e.target.value });
  },

  handlePasswordChange: function(e) {
     this.setState({ password: e.target.value });
  },

  handleSignUp: function(e) {
    e.preventDefault();
    var that = this;
    var user = new UserModel(this.state);
    user.save({}, {
      success: function(){
        that.props.setUser(user);
        that.props.transitionTo('/mealplans');
      },
      error: function(){
        alert('There was an error with your signup, please try a different username / password!');
      }
    });
  },

  render : function() {
    return (
      <div className="jumbotron-container">
        <div className="jumbotron">
        <h1 className="default-header">Sign Up</h1>
          <form onSubmit={this.handleSignUp}>

            <div className="form-group">
              <label
                className="input-label"
                htmlFor="username">
                  Username
              </label>
              <input
                className="form-control"
                type="text"
                name="username"
                placeholder="Enter username"
                onChange={this.handleUsernameChange}
                required />

            </div>

            <div className="form-group">

              <label
                className="input-label"
                htmlFor="password">
                  Password
              </label>
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={this.handlePasswordChange}
                pattern=".{5,10}"
                title="5 to 10 characters"
                required />

            </div>

            <input
              type="submit"
              className="btn btn-default btn-large pull-right"
              value="Sign Up">
            </input>

          </form>

          <p className="suggested-action">
            Already have an account with us?
            <a href="/#/login">Login here.</a>
          </p>

        </div>
      </div>
    );
  }

});



