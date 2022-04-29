import React from "react";
import PropTypes from "prop-types";
import "./MessageHistory.style.css"

const MessageHistory = ({ msg }) => {
    if (!msg) return null;

  return msg.map((el, i) => 
    <div key={i} className="message-history mt-3">
      <div className="send forn-weight-bold text-secondary">
        <div className="sender">{el.messageBy}</div>
        <div className="date">{el.date}</div>
      </div>
      <div className="message">{el.message}</div>
    </div>
  );
};

export default MessageHistory;

MessageHistory.propTypes = {
  msg: PropTypes.array.isRequired,
};
