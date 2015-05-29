/** @jsx React.DOM */

//These variables are for the router at the bottom of the page.
var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Navigation = Router.Navigation;

var AppView = React.createClass({

  mixins: [Navigation],
  
  render: function() {

    return (
      <div>
        <header>
          <ul>
            <li><Link to="signup">Sign Up</Link></li>
            <li><Link to="login">Log In</Link></li>
            <li><Link to="mealquery">Meal Query</Link></li>
            <li><Link to="reviewmeals">Review Meals</Link></li>
            <li><Link to="shoppinglist">Shopping List</Link></li>
          </ul>
        </header>

        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route handler={AppView} path="/">
    <Route name="signup" handler={SignUp} />
    <Route name="login" handler={LogIn} />
    <Route name="mealquery" handler={MealQuery} />
    <Route name="reviewmeals" handler={ReviewMeals} />
    <Route name="shoppinglist" handler={ShoppingList} />
    <DefaultRoute handler={LogIn} />
  </Route>
);

Router.run(routes, Router.HashLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});
