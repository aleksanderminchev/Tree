import React from "react";
import { connect } from "react-redux";

import { Message } from "../components/Message";
import {hideMessage} from "../redux/actions/user"
const MessagePage = ({ message, dispatch }) => {
  //MessagePage displays a snackbar for most successfull or failure operation
  const onClose = (event, reason) => {
    if (reason === "clickaway") {
      dispatch(hideMessage());
    }
    dispatch(hideMessage());
  };
  return (
    <Message
      isOpen={message.isOpen}
      onClose={onClose}
      autoHideDuration={4000}
      severity={message.severity}
      text={message.text}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    message: state.message,
  };
};
// ({
//   message: state.message,
// });

const connected = connect(mapStateToProps)(MessagePage);

export default connected;
