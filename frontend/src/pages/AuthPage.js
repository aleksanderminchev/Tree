
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Auth } from "../components/Auth";
import { loginRequest } from "../redux/actions/auth";
import { useHistory } from "react-router-dom";

const AuthPage=({scenario,requesting,successful,modalOpen,handleClose,loginRequest,errors})=>{
  const history = useHistory();
  //form errors are for loading errors received from the backend onto the form as an error helper text
  //useEffect will track the errors array if it changes and it will re-render the page
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (errors) {
    errors.forEach((error) => {
      console.log(error);
        setFormErrors((i) => ({ ...i, [error.param]: error.msg }));
      });
    }
  }, [errors]);
  //login form used for submitting
  const [form, setForm] = useState({
    email: "",
    password:"",
  });
  // changes form values
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  //submitting the login
  const submitHandler = async (event) => {
    event.preventDefault();
    loginRequest(form);
    setFormErrors({});
  };
  return(
    <Auth
    modalOpen={modalOpen}
    handleClose={handleClose}
    changeHandler={changeHandler}
    submitHandler={submitHandler}
    form={form}
    formErrors={formErrors}
    />
  )
}
const mapStateToProps = (state) => {
  return {
    requesting:state.auth.requesting,
    successful:state.auth.successful,
    errors:state.message.errors,
    scenario:state.message.scenario
  }
}
export default connect(mapStateToProps,{loginRequest})(AuthPage)
