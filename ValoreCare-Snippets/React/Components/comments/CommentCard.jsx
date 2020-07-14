import React, { PureComponent } from "react";
import { Field, Form, Formik } from "formik";
import { textValidationSchema } from "./ValidationSchema";
import ReactTooltip from "react-tooltip";
import PropTypes from "prop-types";
import "./Comments.css";
import { post, update } from "../../services/commentService";
import logger from "sabio-debug";
const _logger = logger.extend("comments card");

class CommentCard extends PureComponent {
  state = {
    formVisibility: false,
    editFormVisibility: false,
    reply: {
      subject: "",
      text: "",
      isDeleted: false,
    },
  };

  commentCard = (aComment) => (
    <CommentCard
      key={aComment.id}
      comment={aComment}
      entityId={this.props.entityId}
      entityTypeId={this.props.entityTypeId}
      errorSubmitBanner={this.props.errorSubmitBanner}
      displayReply={this.props.displayReply}
      deleteRequest={this.props.deleteRequest}
      currentUser={this.props.currentUser}
      displayEdit={this.props.displayEdit}
    />
  );

  onClickReply = () => {
    _logger("onClickReply", this.props.comment.id);
    if (this.state.formVisibility === true) {
      this.setState((prevState) => {
        return { ...prevState, formVisibility: false };
      });
    } else {
      this.setState((prevState) => {
        return { ...prevState, formVisibility: true };
      });
    }
  };

  onClickEdit = () => {
    _logger("onClickEdit", this.props.comment.id);
    if (this.state.editFormVisibility === true) {
      this.setState((prevState) => {
        return { ...prevState, editFormVisibility: false };
      });
    } else {
      this.setState((prevState) => {
        return {
          ...prevState,
          editFormVisibility: true,
        };
      });
    }
  };

  submitReply = (reply) => {
    let aComment = { ...reply };
    aComment.entityTypeId = this.props.entityTypeId;
    aComment.entityId = this.props.entityId;
    aComment.parentId = this.props.comment.id;
    post(aComment).then(this.onSuccessReply).catch(this.onErrorReply);
  };

  onSuccessReply = (response) => {
    _logger("post reply successful", response);
    let newReply = { ...response };
    newReply.firstName = this.props.currentUser.firstName || "";
    newReply.avatarUrl = this.props.currentUser.avatarUrl || "";
    newReply.depth = this.props.comment.depth + 1;
    newReply.createdBy = this.props.currentUser.id;
    newReply.dateCreated = new Date().toISOString();
    this.props.displayReply(newReply, this.props.comment);
    this.onClickReply();
  };

  onErrorReply = (response) => {
    _logger("error posting reply", response);
  };

  onClickDelete = () => {
    _logger("delete clicked", this.props.comment.id);
    this.props.deleteRequest(this.props.comment);
  };

  submitEdit = (completeComment) => {
    let aComment = { ...completeComment };
    delete aComment.parent;
    delete aComment.replies;
    delete aComment.branch;
    delete aComment.depth;
    update(aComment, completeComment)
      .then(this.onSuccessUpdate)
      .catch(this.onErrorUpdate);
  };

  onSuccessUpdate = (completeComment) => {
    _logger("update comment successful", completeComment);
    this.props.displayEdit(completeComment);
    this.onClickEdit();
  };

  onErrorUpdate = (response) => {
    _logger("error updating comment", response);
  };

  render() {
    _logger("rendering", this.props.comment.id);
    return (
      <React.Fragment key={this.props.comment.id}>
        {/* <div className="card comment-card"> */}
        <div
          className={
            this.props.comment.parentId > 0
              ? "card comment-card-child"
              : "card comment-card"
          }
        >
          <div className="card-body">
            <img
              className="comment-image"
              height="50"
              alt=""
              src={this.props.comment.avatarUrl}
              ref={(img) => (this.img = img)}
              onError={() =>
                (this.img.src =
                  "https://images.vexels.com/media/users/3/136558/isolated/preview/43cc80b4c098e43a988c535eaba42c53-person-user-icon-by-vexels.png")
              }
            ></img>
            <div className="name-spacer-div"></div>
            <h6 className="card-subtitle mb-2 text-muted">
              {this.props.comment.firstName}
            </h6>
            <div>
              <p className="card-subtitle mb-2 text-muted">
                {this.props.comment.dateCreated.split("T")[0]}
              </p>
            </div>
            <div>
              <h4 className="card-title">{this.props.comment.subject}</h4>
            </div>
            <p className="card-text">{this.props.comment.text}</p>

            <div className="icon-div">
              {/* <i
                onClick={this.onClickEdit}
                data-for="main"
                data-tip="Edit Comment"
                data-iscapture="true"
                className={
                  this.props.currentUser.id === this.props.comment.createdBy
                    ? "far fa-edit"
                    : "d-none"
                }
              ></i> */}
              <i
                onClick={this.onClickDelete}
                data-for="main"
                data-tip="Delete Comment"
                className={
                  this.props.currentUser.id === this.props.comment.createdBy
                    ? "fas fa-trash-alt"
                    : "d-none"
                }
              ></i>
              <i
                onClick={this.onClickReply}
                data-for="main"
                data-tip="Reply"
                className="fas fa-reply"
              ></i>
              <ReactTooltip
                id="main"
                place="top"
                type="dark"
                effect="float"
                multiline={true}
              />
            </div>
          </div>
        </div>
        <div
          className={
            this.state.formVisibility === true
              ? "reply-div"
              : "reply-div d-none"
          }
        >
          <Formik
            className={
              this.state.formVisibility === true
                ? "comment-form"
                : "d-none display-none"
            }
            enableReinitialize={true}
            validationSchema={textValidationSchema}
            initialValues={this.state.reply}
            onSubmit={(values, { resetForm }) => {
              _logger("values:", values);
              this.submitReply(values);
              resetForm({
                subject: "",
                text: "",
                isDeleted: false,
              });
            }}
          >
            {(props) => (
              <Form className="comment-form">
                <h4>Reply to Comment</h4>

                {props.errors.subject && (
                  <div id="feedback">{props.errors.subject}</div>
                )}
                <Field
                  name="subject"
                  type="text"
                  className="form-control comment-subject"
                  placeholder="Subject for your comment..."
                />
                {props.errors.text && (
                  <div id="feedback">{props.errors.text}</div>
                )}
                <Field
                  name="text"
                  type="text"
                  component="textarea"
                  rows={2}
                  className="form-control"
                  placeholder="Enter your comment here..."
                />
                <button
                  type="reset"
                  className="btn btn-light cancel-reply"
                  onClick={this.onClickReply}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button btn btn-secondary"
                >
                  Submit Reply
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div
          className={
            this.state.editFormVisibility === true
              ? "edit-div"
              : "edit-div d-none"
          }
        >
          <Formik
            className={
              this.state.editFormVisibility === true
                ? "comment-form"
                : "d-none display-none"
            }
            enableReinitialize={true}
            validationSchema={textValidationSchema}
            initialValues={this.props.comment}
            onSubmit={(values) => {
              _logger("values:", values);
              this.submitEdit(values);
            }}
          >
            {(props) => (
              <Form className="comment-form">
                <h4>Edit Comment</h4>

                {props.errors.subject && (
                  <div id="feedback">{props.errors.subject}</div>
                )}
                <Field
                  name="subject"
                  type="text"
                  className="form-control comment-subject"
                  placeholder="Subject for your comment..."
                />
                {props.errors.text && (
                  <div id="feedback">{props.errors.text}</div>
                )}
                <Field
                  name="text"
                  type="text"
                  component="textarea"
                  rows={2}
                  className="form-control"
                  placeholder="Enter your comment here..."
                />
                <button
                  type="reset"
                  className="btn btn-light cancel-reply"
                  onClick={this.onClickEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button btn btn-secondary"
                >
                  Submit Update
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className={this.props.comment.depth < 4 ? "indent" : ""}>
          {this.props.comment.replies
            ? this.props.comment.replies.map(this.commentCard)
            : ""}
        </div>
      </React.Fragment>
    );
  }
}

CommentCard.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number,
    subject: PropTypes.string,
    text: PropTypes.string,
    parentId: PropTypes.number,
    entityTypeId: PropTypes.number,
    entityId: PropTypes.number,
    createdBy: PropTypes.number,
    dateCreated: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatarUrl: PropTypes.string,
    replies: PropTypes.array,
    branch: PropTypes.number.isRequired,
    depth: PropTypes.number,
  }),
  currentUser: PropTypes.shape({
    firstName: PropTypes.string,
    avatarUrl: PropTypes.string,
    id: PropTypes.number,
  }),
  entityTypeId: PropTypes.number,
  entityId: PropTypes.number,
  errorSubmitBanner: PropTypes.func,
  displayReply: PropTypes.func,
  deleteRequest: PropTypes.func,
  displayEdit: PropTypes.func,
};

export default CommentCard;
