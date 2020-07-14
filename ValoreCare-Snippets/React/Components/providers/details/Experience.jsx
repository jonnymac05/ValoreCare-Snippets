import React from "react";
import { Row, Col } from "reactstrap";
import PropTypes from "prop-types";

import "../ProviderDetailsStyle.css";

const Experience = props => {
  const mapExperience = experience => {
    return (
      <Col xs="12" className="mb-5" key={experience.startDate}>
        <Row>
          <Col md="4">
            <div className="mb-3">
              <div className="provider-types">
                <span>Job Title</span>
              </div>
              <h2 style={{ lineHeight: ".8" }}>
                <small>{experience.jobTitle}</small>
              </h2>
            </div>

            <div className="mb-3">
              <div className="provider-types">
                <span>Company</span>
              </div>
              <h2 style={{ lineHeight: ".8" }}>
                <small>{experience.companyName}</small>
              </h2>
            </div>
          </Col>
          <Col>
            <div className="mb-3">
              <div className="provider-types">
                <span>Description </span>
              </div>
              <div className="provider-types">{experience.description}</div>
            </div>

            <div className="mb-3">
              <div className="provider-types">
                <span>Where</span>
              </div>
              <div className="provider-types">
                {experience.city}, {experience.state}, {experience.country}
              </div>
            </div>

            <div className="mb-3">
              <div className="provider-types">
                <span>When</span>
              </div>
              <div className="provider-types">
                {experience.startDate.substring(0, 10)} -{" "}
                {experience.isCurrent
                  ? "Present"
                  : experience.endDate.substring(0, 10)}
              </div>
            </div>
          </Col>
        </Row>

        <hr className="mt-5 mb-3" style={{ borderTop: "2px dotted #c3d1dd" }} />
      </Col>
    );
  };
  const providerExperience =
    props.history.location.state.experienceDetails &&
    props.history.location.state.experienceDetails.map(mapExperience);

  return <Row>{providerExperience}</Row>;
};

Experience.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        experienceDetails: PropTypes.arrayOf(
          PropTypes.shape({
            jobTitle: PropTypes.string,
            companyName: PropTypes.string,
            description: PropTypes.string,
            city: PropTypes.string,
            state: PropTypes.string,
            country: PropTypes.string,
            startDate: PropTypes.string,
            endDate: PropTypes.string,
          }),
        ),
      }),
    }),
  }),
};

export default Experience;
