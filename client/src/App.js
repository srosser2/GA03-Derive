import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.scss'
import './styles/components/Comments.scss'
import './styles/containers/Register.scss'

// Pages
import CountryProfile from './containers/CountryProfile'
import Home from './containers/Home'
import Login from './containers/Login'
import Register from './containers/Register'
import UserProfile from './containers/UserProfile'
import Countries from './containers/Countries'
import SearchProfiles from './containers/SearchProfiles'

import NavBar from './components/Navbar'

function App() {
  return <>
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/users/:id" component={UserProfile} />
        <Route exact path="/countries" component={Countries} />
        <Route exact path="/countries/:id" component={CountryProfile} />
        <Route exact path="/search-profiles" component={SearchProfiles} />
      </Switch>
    </BrowserRouter>
  </>
}
export default App