import React from "react";
import { Col, Row } from "reactstrap";
import PropTypes from "prop-types";

const Certification = (props) => {
  const mapCertifications = (certification) => {
    return (
      <Col xs="12" md="6" key={certification.id}>
        <img
          style={{ objectFit: "contain", width: "100%" }}
          src={certification.certificationUrl}
          alt="certificate"
        />
      </Col>
    );
  };
  const providerCertification =
    props.history.location.state.certifications &&
    props.history.location.state.certifications.map(mapCertifications);

  return <Row>{providerCertification}</Row>;
};

Certification.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        certifications: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            certificationUrl: PropTypes.string,
          })
        ),
      }),
    }),
  }),
};

export default Certification;
