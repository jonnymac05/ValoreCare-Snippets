import React, { Component } from "react";
import PropTypes from "prop-types";

class CheckBox extends Component {
  state = {};
  callHandleChange = (e) => {
    this.props.handleChange(
      e,
      this.props.item.parent,
      this.props.item.map,
      this.props.item.idArrName
    );
  };
  render() {
    return (
      <React.Fragment key={this.props.item.id}>
        <div className="form-check">
          <input
            type="checkbox"
            aria-label="Checkbox for following text input"
            className="checkbox-input"
            name={this.props.item.name}
            value={this.props.item.id}
            checked={this.props.item.isChecked}
            onChange={this.callHandleChange}
          />
          <label> {this.props.item.name}</label>
        </div>
      </React.Fragment>
    );
  }
}

export default CheckBox;

CheckBox.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    parent: PropTypes.string,
    isChecked: PropTypes.bool,
    map: PropTypes.string,
    idArrName: PropTypes.string,
  }),
  handleChange: PropTypes.func,
};
