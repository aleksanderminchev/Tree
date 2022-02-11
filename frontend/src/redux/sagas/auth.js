import { take, call, put } from "redux-saga/effects";
import history from "../../history";
import {
  LOGIN_REQUESTING,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from "../constants/auth";

import { setUser, } from "../actions/user";

import { USER_UNSET } from "../constants/user";

import {
  loginApi,
  getLocalAuthToken,
  setAuthToken,
  removeAuthToken,
} from "../../services/auth.service";

//const expirationTime = 60 * 60 * 1000;
const expirationTime = 30 * 60 * 1000;
function logout() {
  removeAuthToken();
}

function* loginFlow(credentials) {
  //function for logging in
  let payload;
  try {
    //we call the api here and then set the user
    payload = yield call(loginApi, credentials.email, credentials.password);
    const exp = new Date().valueOf() + expirationTime;
    console.log(payload);
    yield put(setUser(payload.token, payload.id, payload.role, exp,payload.username,payload.firstName,payload.lastName,payload.email,payload.phone,payload.address,payload.cart,payload.emailConfirmed,payload.orders));
    yield put({
      type: LOGIN_SUCCESS,
    });
    setAuthToken({
      userId: payload.userId,
      token: payload.token,
      role: payload.role,
      exp: exp,
    });
   

  } catch (error) {
    console.log(error);
    yield put({
      type: LOGIN_FAILURE,
      message: {
        text: "Session expired. Please login again",
        severity: "error",
      },
    });
  }
  return payload;
}

function* loginWatcher() {
  let token = yield call(getLocalAuthToken);
  console.log(token);
  while (true) {
    if (!token) {
      while (!token) {
        const { payload } = yield take(LOGIN_REQUESTING);
        console.log(payload);
        yield call(loginFlow, payload);
        token = yield call(getLocalAuthToken);
      }
    } else if (token.exp < Date.now().valueOf()) {
      yield call(logout);
      yield put({
        type: LOGIN_FAILURE,
        message: {
          text: "Session expired. Please login again",
          severity: "error",
        },
      });
      yield put({
        type:"FAILURE",
        message:{
          text:"Session expired. Please login again",
          severity:"error"
        }
      })
      const { payload } = yield take(LOGIN_REQUESTING);
      yield call(loginFlow, payload);
    } else {
      console.log(token);
      const { payload } = yield take(LOGIN_REQUESTING);
      yield call(loginFlow, payload);
    }
    const {error} = yield take(USER_UNSET);
    if(error){
      history.push("/");
      //this happens once the backend has reject a request
      //once the token has expired you will be sent to the fronpage with an error 
      //stating expired or error with authorization of the token
    }else{
      token = null;
      yield call(logout);
      yield put({
        type:"SUCCESS",
        message:{
          text:"Logged out successfully",
          severity:"success"
        }
      });
    }  
    }
 
}

export default loginWatcher;