/** @jsx React.DOM */

var Navbar = React.createClass({

  componentWillMount: function(){
    // console.log(this.props);
  },

  //TODO: refactor to handle cases when BGImage is or isn't showing. When it is present, make the navbar transparent and remove everything except the logo. When it isn't present, include links to other pages.
  render : function() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a href="/#/login" className="navbar-brand">Meal Kitchen</a>
            <div id={this.props.bgImage ? 'hide' : 'show'}>
              <NavbarLinks linkHandler={this.props.linkHandler} logOut={this.props.logOut} />
            </div>
          </div>
        </div>
      </nav>
    );
  }
});
