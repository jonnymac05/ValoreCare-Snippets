import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import yellowIcon from "../../assets/images/users/yellow-profile-icon.png";
import debug from "sabio-debug";
const _logger = debug.extend("LatestUsers");

class LatestUser extends PureComponent {
  state = {};
  render() {
    _logger("card render", this.props.user.userId);
    return (
      <React.Fragment key={this.props.user.userId}>
        <td>
          <div className="d-flex no-block align-items-center">
            <div className="mr-2">
              <img
                src={
                  this.props.user.avatarUrl
                    ? this.props.user.avatarUrl
                    : "https://images.vexels.com/media/users/3/136558/isolated/preview/43cc80b4c098e43a988c535eaba42c53-person-user-icon-by-vexels.png"
                }
                className="rounded-circle"
                alt={yellowIcon}
                width="45"
                ref={(img) => (this.img = img)}
                onError={() =>
                  (this.img.src =
                    "https://images.vexels.com/media/users/3/136558/isolated/preview/43cc80b4c098e43a988c535eaba42c53-person-user-icon-by-vexels.png")
                }
              />
            </div>
            <div>
              <p className="mb-0 font-14 font-medium text-white">
                {this.props.user.firstName ? this.props.user.firstName : ""}
              </p>
              <p className="mb-0 font-14 font-medium text-white">
                {this.props.user.lastName ? this.props.user.lastName : ""}
              </p>
            </div>
          </div>
        </td>
      </React.Fragment>
    );
  }
}

export default LatestUser;

LatestUser.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatarUrl: PropTypes.string,
  }),
};
