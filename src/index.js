// React
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Route, Redirect } from 'react-router-dom'
// Components
import BeerScreen from './pages/beerscreen/beerscreen'
import AdminCP from './pages/admincp/admincp'
import Login from './pages/login/login'
// Services
import { getVenueSettings } from './services/venueservice';

class App extends Component {
  constructor({ venue, isLogged }) {
    super()
    // receives venue settings and mounts the app with its info
    // also returns if the user is logged in or not
    this.state = {
      venue,
      isLogged
    }
  }

  handleLogin = () => {
    const { isLogged } = this.state;
    this.setState({
      isLogged: !isLogged
    });
  }

  render() {
    const { venue, isLogged } = this.state;
    console.log(isLogged ? 'you are logged in' : 'you are not logged in');
    document.title = venue.name;

    return (
      <MemoryRouter>
        <div>
          <Route path="/" exact render={() => <BeerScreen beers={venue.beers} settings={venue.settings}/>}/>
          <Route path="/login" render={() => {
            return !isLogged ? <Login onLogin={this.handleLogin}/> : <Redirect to="/admin"/>
          }}/>
          <Route path="/admin" render={() => {
            return isLogged ? <AdminCP onLogout={this.handleLogin} venue={venue}/> : <Redirect to="/login"/>
          }}/>
        </div>
      </MemoryRouter>
    );
  }
}

// Load app if venue is found.
getVenueSettings()
  .then(data => {
    // getvenuesettings returns null when it fails to fetch
    if (!data) {
      return alert(`no response from the server`);
    }
    const { status, venue } = data;
    // load page if status is 200, catch 404 also for future redirects, and default catches the rest of the responses
    switch (status) {
      case 200:
      return ReactDOM.render(<App venue={venue} isLogged={venue.logged}/>, document.getElementById('root'));
      case 404:
      return alert(`couldn't find venue -redirect-`);
      default:
        const result = venue;
        alert(`oops! server responded with "${result.code}"`);
    };
  })
  .catch(err => console.log(err));
