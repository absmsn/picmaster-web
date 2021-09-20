import './App.css';
import 'antd/dist/antd.css';
import MainPage from './views/MainPage';
import Register from './views/Register';
import Login from './views/Login';
import {Switch, Route, BrowserRouter, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {AUTHORIZED} from "./common/actionTypes";

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
  onAuthenticated: (info) => dispatch({
    type: AUTHORIZED, payload: info
  })
});

function App(props) {
  let isAuthenticated = props.isAuthenticated;
  const jwt = localStorage.getItem("jwt");
  const userID = localStorage.getItem("userID");
  if (jwt && !props.isAuthenticated) {
    props.onAuthenticated({userID});
    isAuthenticated = true;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/register"><Register/></Route>
          <Route path="/login"><Login/></Route>
          <Route path="/" render={({location}) =>
            isAuthenticated ? <MainPage/>
              : <Redirect to={{pathname: "/login", state: {from: location}}}/>
          }/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
