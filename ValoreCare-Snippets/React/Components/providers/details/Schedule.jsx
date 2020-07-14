import React from "react";
import { Container, Row, Col } from "reactstrap";
import "../ProviderDetailsStyle.css";
import PropTypes from 'prop-types'

import debug from "sabio-debug";
const _logger = debug.extend("ProviderDetails");

const Schedule = (props) => {
  _logger(props.providerSchedule);

  const filterDay = (id) => {
    let day = props.daysOfWeek.filter((day) => day.id === id);
    _logger(day);
    return day[0].name;
  };

  const mapSchedule = (schedule) => {
    return (
      <div key={schedule.id}>
        <Row>
          <Col>
            <h3>{filterDay(schedule.dayOfWeek)}</h3>
          </Col>
          <Col>
            <h3>
              <small>{schedule.startTime}</small>
            </h3>
          </Col>
          <Col>
            <h3>
              <small>
                {schedule.endTime === "00:00"
                  ? "Not Available"
                  : schedule.endTime}
              </small>
            </h3>
          </Col>
        </Row>
      </div>
    );
  };
  const providerSchedule =
    props.providerSchedule && props.providerSchedule.map(mapSchedule);
  return (
    <Container style={{textAlign:'center'}}>
      <Row>
        <Col className='provider-types'><span>Day Available</span></Col>
        <Col className='provider-types'><span>Start Time</span></Col>
        <Col className='provider-types'><span>End Time</span></Col>
      </Row>
      <hr className='mt-3 mb-3' style={{borderTop:'2px dotted #c3d1dd'}}/>
      {providerSchedule}
    </Container>
  );
};

Schedule.propTypes = {
  daysOfWeek: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      dayOfWeek: PropTypes.string,
      startTime: PropTypes.string,
      endTime: PropTypes.string,
    })
  )
}

export default Schedule;
