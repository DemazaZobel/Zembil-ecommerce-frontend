import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getReviewsByProduct,
  addReview,
  editReview,
  removeReview,
} from "../../features/Review/reviewSlice";
import { fetchUserById } from "../../features/user/userSlice";

const ReviewSection = ({ productId }) => {
  const dispatch = useDispatch();

  // Redux state
  const { productReviews = [], loading, error } = useSelector(
    (state) => state.review || {}
  );
  const { info: user, token, fetchedUsers } = useSelector((state) => state.user || {});

  // Local state
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch reviews on mount or productId change
  useEffect(() => {
    if (productId) {
      dispatch(getReviewsByProduct(productId));
    }
  }, [dispatch, productId]);

  // Fetch users for reviews (to show reviewer names)
  useEffect(() => {
    productReviews.forEach((r) => {
      if (r.userId && !fetchedUsers?.[r.userId]) {
        dispatch(fetchUserById(r.userId));
      }
    });
  }, [dispatch, productReviews, fetchedUsers]);

  // Submit or edit review
  const handleSubmitReview = async () => {
    if (!user) return alert("You must be logged in to submit a review");
    if (!reviewText.trim()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        await dispatch(
          editReview({
            id: editingId,
            reviewData: { comment: reviewText, rating },
            token,
          })
        ).unwrap();
        setEditingId(null);
      } else {
        await dispatch(
          addReview({
            reviewData: { productId, comment: reviewText, rating },
            token,
          })
        ).unwrap();
      }

      setReviewText("");
      setRating(5);
      dispatch(getReviewsByProduct(productId));
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Failed to submit review");
    }
    setSubmitting(false);
  };

  // Edit review
  const handleEdit = (review) => {
    setEditingId(review.id);
    setReviewText(review.comment);
    setRating(review.rating);
  };

  // Delete review
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await dispatch(removeReview({ id, token })).unwrap();
      dispatch(getReviewsByProduct(productId));
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Failed to delete review");
    }
  };

  // Helper to render stars
  const renderStars = (value) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < value ? "text-yellow-400" : "text-gray-300"}>★</span>
    ));
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>

      {loading && <p>Loading reviews...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-6 mb-8">
        {productReviews.length > 0 ? (
          productReviews.map((r) => {
            const reviewer = fetchedUsers?.[r.userId] || {};
            const isOwner = user?.id === r.userId;
            return (
              <div
                key={r.id}
                className="border p-4 rounded-lg flex flex-col md:flex-row md:justify-between md:items-start gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700">
                    {reviewer.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium">{reviewer.name || "Unknown User"}</p>
                    <p className="text-sm text-yellow-500">{renderStars(r.rating)}</p>
                    <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</p>
                    <p className="mt-1">{r.comment}</p>
                  </div>
                </div>

                {isOwner && (
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      onClick={() => handleEdit(r)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Review Form */}
      {user ? (
        <div className="flex flex-col gap-3 border-t pt-4">
          <h3 className="font-semibold">{editingId ? "Edit your review" : "Leave a review"}</h3>
          <div className="flex items-center gap-3">
            <label className="font-medium">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border rounded-md p-2 w-24"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review..."
            className="border rounded-md p-3 resize-none w-full"
          />
          <button
            onClick={handleSubmitReview}
            disabled={submitting || !reviewText.trim()}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors w-36"
          >
            {submitting ? "Submitting..." : editingId ? "Update Review" : "Submit Review"}
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Please log in to leave a review.</p>
      )}
    </div>
  );
};

export default ReviewSection;
