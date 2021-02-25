import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

// General Styles
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.scss'

// Container Styles
import './styles/containers/Register.scss'

// Component Styles
import './styles/components/Comments.scss'
import './styles/components/Modal.scss'

// Pages
import CountryProfile from './containers/CountryProfile'
import Home from './containers/Home'
import Login from './containers/Login'
import Register from './containers/Register'
import UserProfile from './containers/UserProfile'
import Countries from './containers/Countries'
import SearchProfiles from './containers/SearchProfiles'
import NotFound from './containers/NotFound'
import About from './containers/About'
import MyFriends from './containers/MyFriends'

function App() {
  return <>
    <BrowserRouter>
      <Switch>
        <Route exact path="/not-found" component={NotFound}/>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/users/:id" component={UserProfile} />
        <Route exact path="/countries" component={Countries} />
        <Route exact path="/countries/:id" component={CountryProfile} />
        <Route exact path="/about" component={About} />
        <Route exact path="/search-profiles" component={SearchProfiles} />
        <Route exact path="/friends" component={MyFriends}/>
        <Redirect to="/not-found"/>
      </Switch>
    </BrowserRouter>
  </>
}
export default App