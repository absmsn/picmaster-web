import React from 'react';
import { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { User } from '../../common/api';
import { AUTHORIZED } from "../../common/actionTypes";
import './index.scss';

const mapDispatchToProps = dispatch => ({
  onLoginSuccess: (info) =>
    dispatch({ type: AUTHORIZED, payload: info }),
});

function Login(props) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let history = useHistory();

  const login = function (email, password) {
    User
    .login(email, password)
    .then((res) => {
      props.onLoginSuccess(res.data);
      history.replace("/");
    }).catch(e => {
      console.log(e);
    });
  }

  return (
    <div className="login">
      <form className="login-form">
        <label htmlFor="">邮箱</label>
        <input type="text" className="email" value={email}
               onChange={(e) => setEmail(e.target.value)}/>
        <label htmlFor="">密码</label>
        <input type="password" className="password" value={password}
               onChange={(e) => setPassword(e.target.value)}/>
        <input type="button" value="登录" onClick={() => login(email, password)}/>
      </form>
    </div>
  )
}

export default connect(null, mapDispatchToProps)(Login);
