/** @jsx React.DOM */
var Login = React.createClass({displayName: "Login",
  
  mixins: [Backbone.Events],

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
    var user = new UserModel(this.state);
    
    user.save({}, {
      success: function(model, res){
        console.log("SUCCESS!");
      },
      error: function(model, err){
        console.log("ERROR!");
      }
    });
  },

  render : function() {
    return (
      React.createElement("div", null, 
        React.createElement("button", null, "Sign Up"), 
        React.createElement("button", null, "Log In"), 
        React.createElement("form", null, 
          React.createElement("input", {type: "text", name: "email", placeholder: "Email", onChange: this.handleEmailChange}), 
          React.createElement("input", {type: "password", name: "password", placeholder: "Password", onChange: this.handlePasswordChange}), 
          React.createElement("button", {type: "button", onClick: this.handleLogin}, "Login")
        )
      )
    );
  }

});