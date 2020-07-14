import React from "react";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";

import "../ProviderDetailsStyle.css";

import debug from "sabio-debug";
const _logger = debug.extend("ProviderDetails");

const Education = (props) => {
  _logger(props.providerEducation);

  const filterCertificate = (id) => {
    let certificate = props.certificateTypes.filter((cert) => cert.id === id);
    _logger(certificate);
    return certificate[0].name;
  };

  const mapEducation = (education) => {
    return (
      <div key={education.certificateTypeId} style={{ textAlign: "center" }}>
        <Row>
          <Col>
            <div className="mb-3">
              <div className="provider-types">
                <span>Certificate</span>
              </div>
              <h2 style={{ lineHeight: ".8", textTransform: "capitalize" }}>
                <small>{filterCertificate(education.certificateTypeId)}</small>
              </h2>
            </div>
          </Col>
          <Col>
            <div className="mb-3">
              <div className="provider-types">
                <span>Major</span>
              </div>
              <h2 style={{ lineHeight: ".8", textTransform: "capitalize" }}>
                <small>{education.major}</small>
              </h2>
            </div>
          </Col>
          <Col>
            <div className="mb-3">
              <div className="provider-types">
                <span>Institute</span>
              </div>
              <h2 style={{ lineHeight: ".8", textTransform: "capitalize" }}>
                <small>{education.instituteName}</small>
              </h2>
            </div>
          </Col>
        </Row>

        <Row>
          <Col style={{ textAlign: "right" }}>
            <div className="provider-types">
              <span>Start Date</span>
              <br />
              {education.startDate.substring(0, 10)}
            </div>
          </Col>
          <Col style={{ textAlign: "left" }}>
            <div className="provider-types">
              <span>End Date</span>
              <br />
              {education.endDate.substring(0, 10)}
            </div>
          </Col>
        </Row>

        <hr className="mt-5 mb-5" style={{ borderTop: "2px dotted #c3d1dd" }} />
      </div>
    );
  };
  const providerEducation = props.providerEducation.map(mapEducation);
  return (
    <Container>
      <hr className="mb-5" style={{ borderTop: "2px dotted #c3d1dd" }} />
      {providerEducation}
    </Container>
  );
};

Education.propTypes = {
  certificateTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
  providerEducation: PropTypes.arrayOf(
    PropTypes.shape({
      certificateTypeId: PropTypes.number,
      instituteName: PropTypes.string,
      major: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    })
  ),
};

export default Education;
