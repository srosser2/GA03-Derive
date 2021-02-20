import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

// Pages
import CountryProfile from './containers/CountryProfile'
import Home from './containers/Home'
import Login from './containers/Login'
import Register from './containers/Register'
import UserProfile from './containers/UserProfile'
import SearchCountries from './containers/SearchCountries'
import SearchProfiles from './containers/SearchProfiles'
import 'bootstrap/dist/css/bootstrap.min.css'

import NavBar from './components/Navbar'

function App() {
  return <>
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/user" component={UserProfile} />
        <Route exact path="/search-countries" component={SearchCountries} />
        <Route exact path="/country/:id" component={CountryProfile} />
        <Route exact path="/search-profiles" component={SearchProfiles} />
      </Switch>
    </BrowserRouter>
  </>
}
export default App