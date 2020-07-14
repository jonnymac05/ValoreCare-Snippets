import React, { PureComponent } from "react";
import { Field, Form, Formik } from "formik";
import { textValidationSchema } from "./ValidationSchema";
import CommentCard from "./CommentCard";
import PropTypes from "prop-types";
import logger from "sabio-debug";
import Swal from "sweetalert";
import "./Comments.css";
import { entity, post, deleteComment } from "../../services/commentService";
const _logger = logger.extend("comments");

class Comments extends PureComponent {
  state = {
    comments: [],
    mappedComments: [],
    newComment: {
      subject: "",
      text: "",
      parentId: 0,
      isDeleted: false,
      largestBranch: 0,
      depth: 0,
    },
    entityTypeId: 1,
    entityId: 1,
  };

  componentDidMount() {
    this.commentRequest();
  }

  commentRequest = () => {
    entity(this.state.entityTypeId, this.state.entityId)
      .then(this.getCommentSuccess)
      .catch(this.getCommentError);
  };

  getCommentSuccess = (response) => {
    _logger("success getting comments", response.items);
    this.setState((prevState) => {
      let copyItems = [...response.items];
      const tree = this.reorganizeComments(copyItems);
      return {
        ...prevState,

        comments: tree,
        mappedComments: tree.map(this.commentCard),
        largestBranch: tree.length - 1,
      };
    });
  };

  reorganizeComments = (comments) => {
    const dict = {};
    const top = [];
    const orphans = [];

    for (let index = 0; index < comments.length; index++) {
      const currentComment = comments[index];
      dict[currentComment.id] = currentComment;

      if (currentComment.parentId === 0) {
        currentComment.branch = top.length;
        currentComment.depth = 0;
        top.push(currentComment);
      } else {
        let myParent = dict[currentComment.parentId];

        if (!myParent) {
          currentComment.isOrphan = true;
          currentComment.branch = -1;
          orphans.push(currentComment);
        } else {
          currentComment.branch = myParent.branch;
          currentComment.depth = myParent.depth + 1;
          myParent.replies = myParent.replies || [];
          myParent.replies.push(currentComment);
          currentComment.parent = myParent;
        }
        // currentComment.parent = myParent;
      }
    }
    _logger("dictionary:", dict);
    return top.concat(orphans);
  };

  getCommentError = (response) => {
    _logger(response);
  };

  commentCard = (aComment) => (
    <CommentCard
      key={aComment.id}
      comment={aComment}
      entityId={this.state.entityId}
      entityTypeId={this.state.entityTypeId}
      errorSubmitBanner={this.errorSubmitBanner}
      displayReply={this.displayReply}
      currentUser={this.props.currentUser}
      deleteRequest={this.deleteRequest}
      displayEdit={this.displayEdit}
    />
  );

  deleteRequest = (comment) => {
    deleteComment(comment.id, comment)
      .then(this.onDeleteSuccess)
      .catch(this.onDeleteError);
  };

  getIdsByBranch = (branchId, oldDictionary) => {
    //loop through dictionary and collect ids with matching branchId
    let idsArray = [];
    for (const key in oldDictionary) {
      if (oldDictionary.hasOwnProperty(key)) {
        const comment = oldDictionary[key];
        if (comment.branch === branchId) {
          idsArray.push(comment.id);
        }
      }
    }
    return idsArray;
  };

  pluck = (array, key) => {
    return array.map((obj) => obj[key]);
  };

  getChildrenToBeRemoved = (itemJustDeleted) => {
    let arrayOfChildren = [itemJustDeleted.id];
    if (itemJustDeleted.replies) {
      for (let index = 0; index < itemJustDeleted.replies.length; index++) {
        const currentChild = itemJustDeleted.replies[index];
        let arrayOfGrandchildren = this.getChildrenToBeRemoved(currentChild);
        arrayOfChildren = arrayOfChildren.concat(arrayOfGrandchildren);
      }
    }

    return arrayOfChildren;
  };

  onDeleteSuccess = (itemDeleted) => {
    _logger("delete Success", itemDeleted);
    let topCandidate = null;
    let newComments = [...this.state.comments];
    let deleteTopBranch = false;

    //if the item has parent
    if (itemDeleted.parent) {
      //create a copy of that parent, remove deleted item from its replies and make the parent the topCandidate
      const parent = { ...itemDeleted.parent };
      parent.replies = parent.replies.filter((r) => r.id !== itemDeleted.id);
      topCandidate = parent;
    } else {
      //otherwise the topCandidate is the itemToBeDeleted; deleteTopBranch is true for the later if statement
      topCandidate = itemDeleted;
      deleteTopBranch = true;
    }
    _logger("top candidate", topCandidate);
    //while the top candidate has a parent go through this loop that makes a copy of parents and their replies
    while (topCandidate && topCandidate.parent) {
      let currentItemParent = topCandidate.parent;

      const parentClone = { ...currentItemParent };
      const indexOfChild = parentClone.replies.findIndex(filterComment);
      parentClone.replies = [...parentClone.replies];
      parentClone.replies[indexOfChild] = topCandidate;
      topCandidate.parent = parentClone;

      topCandidate = parentClone;
      _logger("top candidate in loop", topCandidate);
    }

    //this if statement only fires if the itemToBeDeleted has no parent.
    if (deleteTopBranch) {
      //find the index and remove this item from newComments
      const idX = newComments.findIndex((obj) => obj.id === itemDeleted.id);
      newComments.splice(idX, 1);
    }

    //this else statement fires when itemToBeDeleted has a parent
    else {
      const top = newComments.findIndex((c) => c.id === topCandidate.id);

      if (top >= 0) {
        newComments[top] = topCandidate;
      }
      _logger("top", top, "new comments", newComments);
    }

    this.setState((prevState) => {
      return {
        ...prevState,
        comments: newComments,
        mappedComments: newComments.map(this.commentCard),
        largestBranch: newComments.length - 1,
      };
    });

    function filterComment(c) {
      return c.id === topCandidate.id;
    }
  };

  onDeleteError = (response) => {
    _logger("delete error", response);
  };

  displayEdit = (comment) => {
    _logger("displayEdit, comment:", comment);

    let topCandidate = {};

    if (comment.parent) {
      let myParent = { ...comment.parent };
      let commentIndex = myParent.replies.findIndex(
        (obj) => obj.id === comment.id
      );
      myParent.replies[commentIndex] = comment;
      topCandidate = { ...myParent };
    } else {
      topCandidate = { ...comment };
    }

    let newComments = [...this.state.comments];

    //create a copy of that parent and make the parent the topCandidate

    _logger("top candidate", topCandidate);
    //while the top candidate has a parent go through this loop that makes a copy of parents and their replies
    while (topCandidate && topCandidate.parent) {
      let currentItemParent = topCandidate.parent;

      const parentClone = { ...currentItemParent };
      const indexOfChild = parentClone.replies.findIndex(filterComment);
      parentClone.replies = [...parentClone.replies];
      parentClone.replies[indexOfChild] = topCandidate;
      topCandidate.parent = parentClone;

      topCandidate = parentClone;
      _logger("top candidate in loop", topCandidate);
    }

    const top = newComments.findIndex((c) => c.id === topCandidate.id);

    if (top >= 0) {
      newComments[top] = topCandidate;
    }

    this.setState((prevState) => {
      return {
        ...prevState,
        comments: newComments,
        mappedComments: newComments.map(this.commentCard),
      };
    });

    function filterComment(c) {
      return c.id === topCandidate.id;
    }
  };

  submitClicked = (comment) => {
    let aComment = { ...comment };
    aComment.entityTypeId = this.state.entityTypeId;
    aComment.entityId = this.state.entityId;
    post(aComment).then(this.onSuccessPost).catch(this.onErrorPost);
  };

  onSuccessPost = (comment) => {
    _logger("post comment successful", comment);
    this.setState((prevState) => {
      //will need to update this when we see how user info is passed down in props
      let newRemark = { ...comment };
      // newRemark.id = response.item;
      newRemark.firstName = this.props.currentUser.firstName || "";
      newRemark.avatarUrl = this.props.currentUser.avatarUrl || "";
      newRemark.dateCreated = new Date().toISOString();
      newRemark.branch = this.state.largestBranch + 1;
      newRemark.createdBy = this.props.currentUser.id;
      let remarks = [...this.state.comments];
      remarks.push(newRemark);
      return {
        ...prevState,
        comments: remarks,
        mappedComments: remarks.map(this.commentCard),
        largestBranch: newRemark.branch,
      };
    });
  };

  displayReply = (reply, parent) => {
    _logger("displaying reply", reply);

    let myParent = { ...parent };
    reply.branch = myParent.branch;
    reply.parent = myParent;
    myParent.replies = [...(myParent.replies || [])];
    myParent.replies.push(reply);

    let newComments = [...this.state.comments];

    //create a copy of that parent and make the parent the topCandidate

    let topCandidate = { ...myParent };

    _logger("top candidate", topCandidate);
    //while the top candidate has a parent go through this loop that makes a copy of parents and their replies
    while (topCandidate && topCandidate.parent) {
      let currentItemParent = topCandidate.parent;

      const parentClone = { ...currentItemParent };
      const indexOfChild = parentClone.replies.findIndex(filterComment);
      parentClone.replies = [...parentClone.replies];
      parentClone.replies[indexOfChild] = topCandidate;
      topCandidate.parent = parentClone;

      topCandidate = parentClone;
      _logger("top candidate in loop", topCandidate);
    }

    const top = newComments.findIndex((c) => c.id === topCandidate.id);

    if (top >= 0) {
      newComments[top] = topCandidate;
    }

    this.setState((prevState) => {
      return {
        ...prevState,

        comments: newComments,
        mappedComments: newComments.map(this.commentCard),
      };
    });

    function filterComment(c) {
      return c.id === topCandidate.id;
    }
  };

  onErrorPost = (response) => {
    _logger("error posting comment", response);
  };

  errorSubmitBanner = () => {
    Swal("Whoops..", "Don't forget to enter a subject and text", "error");
  };

  changeHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    this.setState((prevState) => {
      const updatedFormData = {
        ...prevState.newComment,
      };
      updatedFormData[name] = value;

      return { newComment: updatedFormData };
    });
  };

  render() {
    _logger("comments render");
    return (
      <React.Fragment>
        <div className="comment-area">
          <h2 className="comments-title">Comments</h2>
          {this.state.mappedComments}
          <Formik
            className="comment-form"
            enableReinitialize={true}
            validationSchema={textValidationSchema}
            initialValues={this.state.newComment}
            onSubmit={(values, { resetForm }) => {
              _logger("values:", values);
              this.submitClicked(values);
              resetForm({
                subject: "",
                text: "",
                parentId: 0,
                isDeleted: false,
                largestBranch: 0,
                depth: 0,
              });
            }}
          >
            {(props) => (
              <Form className="comment-form">
                <h4>Add A Comment</h4>

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
                  type="submit"
                  className="submit-button btn btn-secondary"
                >
                  Submit Comment
                </button>
              </Form>
            )}
          </Formik>

          <div className="spacer-div"></div>
          <div className="comment-card-holder"></div>
        </div>
      </React.Fragment>
    );
  }
}

Comments.propTypes = {
  entityTypeId: PropTypes.number,
  entityId: PropTypes.number,
  currentUser: PropTypes.shape({
    firstName: PropTypes.string,
    avatarUrl: PropTypes.string,
    id: PropTypes.number,
  }),
};

export default Comments;
