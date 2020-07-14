import React from "react";
import PropTypes from "prop-types";
// import _logger from "sabio-debug";
// import Moment from "moment";
import {
  buildFullName,
  convertCostToString,
  buildDateTime,
  buildDateShort,
} from "../../services/utilityService";
import profileIcon from "../../assets/images/users/yellow-profile-icon.png";

const AppointmentCard = (props) => {
  const handleConfirmClick = () => {
    // TODO: Remove card from list
    props.onHandleConfirm(props.appointment);
  };

  const handleDeclineClick = () => {
    props.onHandleDecline(props.appointment);
  };

  const handleCancelClick = () => {
    props.onHandleCancel(props.appointment);
  };

  const handleNoShowClick = () => {
    props.onHandleNoShow(props.appointment);
  };

  const handleCompleteClick = () => {
    props.onHandleComplete(props.appointment);
  };

  const handleDeleteClick = () => {
    props.onHandleDelete(props.appointment);
  };

  const handleError = (e) => {
    e.target.src = profileIcon;
  };

  const startDate = buildDateShort(props.appointment.startTime);
  const endDate = buildDateShort(props.appointment.endTime);

  const startDateTime = buildDateTime(props.appointment.startTime);
  const endDateTime = buildDateTime(props.appointment.endTime);
  // eslint-disable-next-line no-console
  console.table(startDateTime, endDateTime);

  const Button = () => {
    const dateNow = new Date();
    const dateStart = new Date(props.appointment.startTime);
    const dateEnd = new Date(props.appointment.startTime);
    const isConfirmed = props.appointment.isConfirmed;

    const isCancelled = props.appointment.isCancelled;
    if (isCancelled) return null;

    //#region Seeker
    if (props.isSeeker) {
      // if current time is before start time, show cancel button
      if (dateNow < dateStart)
        return (
          <button className="btn btn-danger col-8" onClick={handleCancelClick}>
            Cancel
          </button>
        );
      // else if current time is before end time, show no show button
      else if (dateNow < dateEnd)
        return (
          <button className="btn btn-danger col-8" onClick={handleNoShowClick}>
            No Show
          </button>
        );
      else if (dateNow > dateEnd) {
        if (isConfirmed)
          return (
            <button disabled className="btn btn-success col-8">
              Completed
            </button>
          );
        else
          return (
            <button disabled className="btn btn-danger col-8">
              Missed
            </button>
          );
      }
    }
    //#endregion
    //#region Provider
    else {
      // if current time is before start time
      if (dateNow < dateStart) {
        // then if isConfirmed is true, show confirmed button
        if (isConfirmed) {
          return (
            <button disabled className="btn btn-success col-8">
              Confirmed
            </button>
          );
        }
        // else if isConfirmed is false, show confirm button AND decline button
        else if (!isConfirmed) {
          return (
            <div className="row justify-content-center">
              <button
                className="btn btn-primary col-8 m-1"
                onClick={handleConfirmClick}
              >
                Confirm
              </button>
              <button
                className="btn btn-danger col-8 m-1"
                onClick={handleDeclineClick}
              >
                Decline
              </button>
            </div>
          );
        }
      }
      // else if current time is before end time, show cancel button
      else if (dateNow < dateEnd) {
        // Cancel button
        return (
          <button className="btn btn-danger col-8" onClick={handleCancelClick}>
            Cancel
          </button>
        );
      }
      // else if current time is after end time
      else if (dateNow > dateEnd) {
        // if isConfirmed is true, show complete button
        if (isConfirmed) {
          // Complete
          return (
            <button
              className="btn btn-success col-8"
              onClick={handleCompleteClick}
            >
              Complete
            </button>
          );
        }
        // else if isConfirmed is false, show missed button
        else if (!isConfirmed) {
          // missed
          return (
            <div className="row justify-content-center">
              <button disabled className="btn btn-danger col-8">
                Missed
              </button>
              <button
                className="btn btn-danger col-8 m-1"
                onClick={handleDeleteClick}
              >
                Delete
              </button>
            </div>
          );
        }
      }
      //#endregion
    }

    return null;
  };

  const imageSrc = props.isSeeker
    ? props.appointment.provider.avatarUrl
    : props.appointment.seeker.avatarUrl;
  const user = props.isSeeker
    ? props.appointment.provider
    : props.appointment.seeker;
  const isCancelled = props.appointment.isCancelled;
  const isConfirmed = props.appointment.isConfirmed;
  const status = isCancelled
    ? "Cancelled"
    : isConfirmed
    ? "Confirmed"
    : "Not Confirmed";

  const handleMessage = () => {
    props.handleMessage(props.appointment);
  };

  return (
    <div
      className={
        props.isInDashboard
          ? "col-xl-6 m-0 pt-0 px-3 pb-3"
          : "col-md-6 col-lg-4 p-2"
      }
    >
      <div
        className={props.isInDashboard ? "card pt-0 h-100" : "card my-0 h-100"}
      >
        <div className={props.isInDashboard ? "card-body" : "my-0 card-body"}>
          <div className="row">
            <div className="col" style={{ width: "100%", height: "100%" }}>
              <img
                className="rounded-circle"
                alt="Profile Avatar"
                src={imageSrc}
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                onError={handleError}
              />
            </div>
            <div className="pl-3 col-8" style={{ textAlign: "left" }}>
              <div className="card-text text-center h3">
                {buildFullName(user)}
              </div>
              <div className="card-text text-center h5">
                {startDate === endDate
                  ? startDate
                  : `${startDate} - ${endDate}`}
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleMessage}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 pb-4 row">
            <div className="col">
              <h4>
                Start
                <br />
                <small>{startDateTime}</small>
              </h4>
            </div>
            <div
              className="col"
              style={{
                borderLeft: "thin solid rgb(204, 204, 204)",
              }}
            >
              <h4>
                End
                <br />
                <small>{endDateTime}</small>
              </h4>
            </div>
          </div>
          {props.isInDashboard ? null : (
            <div className="pt-4 pb-4 row">
              <div className="col">
                <h4>
                  Total
                  <br />
                  <small>
                    {convertCostToString(props.appointment.price * 100)}
                  </small>
                </h4>
              </div>
              <div
                className="col"
                style={{
                  borderLeft: "thin solid rgb(204, 204, 204)",
                }}
              >
                <h4>
                  Status
                  <br />
                  <small
                    className={
                      props.appointment.isConfirmed ? "text-success" : null
                    }
                  >
                    {status}
                  </small>
                </h4>
              </div>
            </div>
          )}
        </div>
        <div className="my-0 pt-0 card-body row">
          <div className="col text-center">
            <Button />
          </div>
        </div>
      </div>
    </div>
  );
};

AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    seeker: PropTypes.shape({
      userId: PropTypes.number,
      avatarUrl: PropTypes.string,
      firstName: PropTypes.string,
      mi: PropTypes.string,
      lastName: PropTypes.string,
    }).isRequired,
    provider: PropTypes.shape({
      userId: PropTypes.number,
      avatarUrl: PropTypes.string,
      firstName: PropTypes.string,
      mi: PropTypes.string,
      lastName: PropTypes.string,
    }),
    price: PropTypes.number,
    isConfirmed: PropTypes.bool,
    isCancelled: PropTypes.bool,
    id: PropTypes.number.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
  }),
  onHandleConfirm: PropTypes.func.isRequired,
  onHandleDecline: PropTypes.func.isRequired,
  onHandleNoShow: PropTypes.func.isRequired,
  onHandleCancel: PropTypes.func.isRequired,
  onHandleComplete: PropTypes.func.isRequired,
  onHandleDelete: PropTypes.func.isRequired,
  isSeeker: PropTypes.bool.isRequired,
  isInDashboard: PropTypes.bool.isRequired,
  handleMessage: PropTypes.func,
};
export default AppointmentCard;
