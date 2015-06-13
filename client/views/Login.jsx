/** @jsx React.DOM */

var LogIn = React.createClass({

  getInitialState: function() {
    return {
      id: null,
      username: null,
      password: null
    };
  },

  componentWillMount: function(){
    this.props.setBGImg(true);
  },

  handleUsernameChange: function(e) {
    this.setState({
      id: e.target.value
      username: e.target.value
    });
  },

  handlePasswordChange: function(e) {
    this.setState({ password: e.target.value });
  },

  handleLogin: function(e) {
    e.preventDefault();
    var that = this;
    var user = new UserModel(this.state);
    user.fetch({}, {
      success: function(){
        that.props.setUser(user);
        that.props.transitionTo('/mealplans');
      },
      error: function(){
        alert('Please check your username and/or password!');
      }
    });
  },

  render : function() {
    return (
      <div className="jumbotron-container">
        <div className="jumbotron">
        <h1 className="default-header">Log In</h1>

          <form onSubmit={this.handleLogin}>
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
                required />

            </div>

            <input
              type="submit"
              className="btn btn-default btn-large pull-right"
              value="Log In">
            </input>

          </form>

          <p className="suggested-action">
            Don&#39;t have an account with us?
            <a href="/#/signup">Sign up here.</a>
          </p>

        </div>
      </div>
    );
  }
});
