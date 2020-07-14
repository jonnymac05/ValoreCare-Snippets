import React from "react";
import { Row, Col } from "reactstrap";
import "../ProviderDetailsStyle.css";
import PropTypes from "prop-types";

const Types = (props) => {
  const mapType = (type) => {
    return (
      <div key={type.id}>
        <div>
          <i className="far fa-check-circle mr-2" />
          {type.name}
        </div>
      </div>
    );
  };

  const providerConcern =
    props.location.state.concerns && props.location.state.concerns.map(mapType);
  const providerCare =
    props.location.state.careNeeds &&
    props.location.state.careNeeds.map(mapType);
  const providerExpertise =
    props.location.state.expertise &&
    props.location.state.expertise.map(mapType);
  const providerHelp =
    props.location.state.helperNeeds &&
    props.location.state.helperNeeds.map(mapType);
  const providerLanguage =
    props.location.state.languages &&
    props.location.state.languages.map(mapType);

  return (
    <Row>
      <Col>
        <Row className="mb-5">
          <Col>
            <div className="provider-types">
              <span>I Am Fluent In: </span>
              {providerLanguage}
            </div>
          </Col>
          <Col>
            <div className="provider-types">
              <span>Hourly Rate: </span>
              <div>${props.location.state.price}</div>
            </div>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col md="6" className="provider-types">
            <span>I Can Help With: </span>
            {providerCare}
          </Col>
          <Col md="6" className="provider-types">
            <span>I Can Focus On: </span>
            {providerConcern}
          </Col>
        </Row>
        <Row>
          <Col className="provider-types">
            <span>I Have Experience In: </span>
            {providerExpertise}
          </Col>
          <Col className="provider-types">
            <span>Help Types: </span>
            {providerHelp}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

Types.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      concerns: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
        }),
      ),
      careNeeds: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
        }),
      ),
      helperNeeds: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
        }),
      ),
      expertise: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
        }),
      ),
      languages: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
        }),
      ),
    }),
  }),
};

export default Types;
