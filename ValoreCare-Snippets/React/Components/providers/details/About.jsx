import React from "react";
import { Container } from "reactstrap";
import "../ProviderDetailsStyle.css";
import PropTypes from "prop-types";
import AppointmentAvailability from "../../appointments/AppointmentAvailability";

const About = (props) => {
  return (
    <Container style={{ textAlign: "center" }}>
      <div className="mb-3">
        <div className="provider-types">
          <AppointmentAvailability
            providerId={props.providerDetails.userId}
            price={props.providerDetails.price}
            userId={props.currentUser.userId}
            providerFirstName={props.providerDetails.firstName}
            providerLastName={props.providerDetails.lastName}
            {...props}
          />
          <span>Title</span>
        </div>
        <h2>
          <small>{props.providerDetails.title}</small>
        </h2>
      </div>

      <div className="mb-3">
        <div className="provider-types">
          <span>Summary</span>
        </div>
        <div className="provider-types">{props.providerDetails.summary}</div>
      </div>

      <div className="mb-3">
        <div className="provider-types">
          <span>Bio</span>
        </div>
        <div className="provider-types">{props.providerDetails.bio}</div>
      </div>
    </Container>
  );
};

About.propTypes = {
  providerDetails: PropTypes.shape({
    title: PropTypes.string,
    summary: PropTypes.string,
    bio: PropTypes.string,
    userId: PropTypes.number,
    price: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  currentUser: PropTypes.shape({
    userId: PropTypes.number,
  }),
};

export default About;
