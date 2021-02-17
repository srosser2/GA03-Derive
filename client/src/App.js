import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

// Pages
// import CountryProfile from './containers/CountryProfile'
import Home from './containers/Home'
import Login from './containers/Login'
import Register from './containers/Register'
import UserProfile from './containers/UserProfile'
import SearchCountries from './containers/SearchCountries'
import SearchProfiles from './containers/SearchProfiles'

function App(){
  return <>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/user" component={UserProfile}/>
        <Route exact path="/search-countries" component={SearchCountries}/>
        <Route exact path="/search-profiles" component={SearchProfiles}/>
        {/* <Route exact path="/about" component={userProfile}/> */}
      </Switch>
    </BrowserRouter>
  </>
}
export default App