/** @jsx React.DOM */

var NavbarLinks = React.createClass({
  
  componentWillMount: function(){
    console.log(this.props);
  },

  _logOut: function(){
    var that = this;
    $.get("api/logout", function(data) {
      window.location.hash = '/login';
    });
  },

  render : function() {
    return (
      <div>
        <button data-route="/mealquery" type="button" className="btn btn-default" onClick={this.props.linkHandler}>Create Meal Plan</button>
        <button data-route="/mealplans" type="button" className="btn btn-default" onClick={this.props.linkHandler}>View Meal Plans</button>
        <button data-route="/login" type="button" className="btn btn-default" onClick={this.props.linkHandler}>Log In</button>
        <button data-route="/logout" type="button" className="btn btn-default" onClick={this._logOut}>Log Out</button>
      </div>
    );
  }
});
