import React, { useState } from 'react';
import CustomAlertDialog from './CustomAlertDialog';
function CommentSection({ comments, onAddComment, onEditComment, onDeleteComment, currentUser }) {
  const [newCommentText, setNewCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');
  const [alertDialogAction, setAlertDialogAction] = useState(null);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAlertDialogMessage("Please sign in to add comments.");
      setShowAlertDialog(true);
      return;
    }
    if (newCommentText.trim()) {
      onAddComment(newCommentText);
      setNewCommentText('');
    }
  };

  const handleEditSubmit = (e, commentId) => {
    e.preventDefault();
    if (editingCommentText.trim()) {
      onEditComment(commentId, editingCommentText);
      setEditingCommentId(null);
      setEditingCommentText('');
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.text);
  };

  const handleDeleteClick = (commentId) => {
    setAlertDialogMessage("Are you sure you want to delete this comment?");
    setAlertDialogAction(() => () => onDeleteComment(commentId));
    setShowAlertDialog(true);
  };

  const handleAlertDialogConfirm = () => {
    if (alertDialogAction) {
      alertDialogAction();
    }
    setShowAlertDialog(false);
    setAlertDialogAction(null);
  };

  const handleAlertDialogCancel = () => {
    setShowAlertDialog(false);
    setAlertDialogAction(null);
  };

  return (
    <div className="comment-section bg-gray-800 p-4 md:p-6 lg:p-8 rounded-lg shadow-inner w-full max-w-4xl mx-auto">

      <h2 className="text-white text-lg md:text-xl font-bold mb-4">

        {comments.length} Comments
      </h2>

      <form onSubmit={handleAddSubmit} className="mb-6">
        <textarea
          className="w-full p-2 md:p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 mb-2 text-sm md:text-base resize-y"

          rows="3"
          placeholder={currentUser ? "Add a comment..." : "Sign in to add a comment..."}
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          disabled={!currentUser}
          required
        ></textarea>
        <button
          type="submit"
          className={`py-2 px-4 rounded-md font-semibold text-sm md:text-base transition-colors duration-200 ${currentUser ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          disabled={!currentUser}
        >
          Comment
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center text-sm md:text-base">

            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item bg-gray-700 p-3 md:p-4 rounded-lg mb-4 shadow-sm">

              <div className="flex items-start md:items-center mb-2">

                <img
                  src={comment.userId?.avatar || 'https://i.pravatar.cc/40?img=2'}
                  alt="User Avatar"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-3 border border-gray-600 flex-shrink-0"

                />
                <div>
                  <p className="text-white font-semibold text-sm md:text-base">{comment.userId?.username || comment.username || 'Anonymous'}</p>
                  <p className="text-gray-400 text-xs">{new Date(comment.timestamp).toLocaleString()}</p>
                </div>
              </div>

              {editingCommentId === comment._id ? (
                <form onSubmit={(e) => handleEditSubmit(e, comment._id)}>
                  <textarea
                    className="w-full p-2 rounded-md bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-400 mb-2 resize-y text-sm md:text-base"
                    rows="2"
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                    required
                  ></textarea>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-xs md:text-sm transition-colors duration-200">Save</button>
                    <button type="button" onClick={() => setEditingCommentId(null)} className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-xs md:text-sm transition-colors duration-200">Cancel</button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-200 mb-2 text-sm md:text-base whitespace-pre-wrap">{comment.text}</p>
              )}

              {currentUser && currentUser._id === comment.userId?._id && editingCommentId !== comment._id && (
                <div className="flex gap-2 text-xs md:text-sm mt-2">
                  {/*
                    - `text-xs` for mobile.
                    - `md:text-sm` for tablets and up.
                  */}
                  <button
                    onClick={() => startEditing(comment)}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(comment._id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <CustomAlertDialog
        isOpen={showAlertDialog}
        message={alertDialogMessage}
        onConfirm={handleAlertDialogConfirm}
        onCancel={handleAlertDialogCancel}
        showCancelButton={alertDialogAction !== null}
      />
    </div>
  );
}

export default CommentSection;