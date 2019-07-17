import React from 'react';
import { Route,Switch} from "react-router-dom";
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import Settings from './components/Profile/Settings/Settings';
import AddPost from './components/Posts/AddPost';
import PrivateRoute from './auth/PrivateRoute';

const mainRouter=(props)=>(
    <>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/login" component={Login}/>
            <PrivateRoute exact path="/dashboard"component={Dashboard}/>
            <PrivateRoute exact path="/user/:userId" component={Profile}/>
            <PrivateRoute exact path="/settings/:userId" component={Settings}/>
            <PrivateRoute exact path="/post/add" component={AddPost}/>
        </Switch>
    </>
)

export default  mainRouter;