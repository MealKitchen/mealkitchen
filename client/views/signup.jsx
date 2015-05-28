/** @jsx React.DOM */
var Login = React.createClass({
  
  mixins: [Backbone.Events],

  getInitialState: function() {
    return new UserModel(); 
  },

  //Set listener on state (which is a backbone model)
  componentDidMount: function(){
    this.listenTo(this.state, 'change', function(){
      console.log('heard a change event!');
    }, this);
  },

  //Every time a user interacts with the form, we need to update the state of the view to reflect that change.
  handleChange: function(event) {
    var name = event.target.name;
    if(name === 'email'){
      this.state.set('email', event.target.value);
    } else if(name === 'password') {
      this.state.set('password', event.target.value);
    } else if(name === 'firstName') {
      this.state.set('firstName', event.target.value);
    } else if(name === 'lastName') {
      this.state.set('lastName', event.target.value);
    };
  },

  //Send the state to a backbone model to be sent to Yummly
  handleSubmit: function(e){
    e.preventDefault();
    var that = this;

    //TODO: This is a temporary call to load the next view without actually logging in. Make sure to fix it and place it inside of the save method.
    that.props.onSubmit();

    // this.state.save({}, {
    //   //TODO: set up response handling for rendering the next view after successful signup or failed signup.
    //   success: function(model, res){
    //     console.log("Response from the server: ", res);
        
    //   },
    //   error: function(model, err){
    //     console.error("There was an error with your request! ", err);
    //   }
    // }); 
  },

  //TODO: Add button functionality to switch between Sign Up / Log In
  render: function() {
    return (
      <div>
        <button>Sign Up</button>
        <button>Log In</button>
        <form name="signup" onSubmit={this.handleSubmit}>
          <ul>
            <li><label for="firstName">First Name</label>
            <input type="firstName" name="firstName" placeholder="First Name" required /></li>
            <li><label for="lastName">Last Name</label>
            <input type="lastName" name="lastName" placeholder="lastName" required /></li>
            <li><label for="email">Email</label>
            <input type="email" name="email" placeholder="youremail@email.com" required /></li>
            <li><label for="password">Password</label>
            <input type="password" name="password" placeholder="password" required /></li>
            <li>
            <input type="submit" value="Signup" /></li>
          </ul>
        </form>
      </div>
    );
  }
});

