/** @jsx React.DOM */

var NavbarLinks = React.createClass({

  render : function() {
    return (
      <ul className="nav navbar-nav">
        <li><a
          className="navbar-link"
          data-route="/mealquery"
          onClick={this.props.linkHandler}>
            Create Meal Plan
        </a></li>
        <li><a
          className="navbar-link"
          data-route="/mealplans"
          onClick={this.props.linkHandler}>
            View Meal Plans
        </a></li>
        <li><a
          className="navbar-link"
          data-route="/logout"
          onClick={this.props.logOut}>
            Log Out
        </a></li>
      </ul>
    );
  }
});
