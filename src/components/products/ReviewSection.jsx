// src/components/review/ReviewSection.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getReviewsByProduct,
  addReview,
  editReview,
  removeReview,
} from "../../features/Review/reviewSlice";
import { fetchUserById } from "../../features/user/userSlice";
import { FaStar } from "react-icons/fa";

const toNumber = (v) => {
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const ReviewSection = ({ productId }) => {
  const dispatch = useDispatch();

  // Redux state
  const { loading, error } = useSelector((state) => state.review || {});
  const productReviews = useSelector(
    (state) => state.review.productReviews[productId] || []
  );
  const { info: user, token, fetchedUsers } = useSelector(
    (state) => state.user || {}
  );

  // Local state
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch reviews on mount or productId change
  useEffect(() => {
    if (productId) dispatch(getReviewsByProduct(productId));
  }, [dispatch, productId]);

  // Fetch user info for each review
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

  const handleEdit = (review) => {
    setEditingId(review.id);
    setReviewText(review.comment || "");
    setRating(toNumber(review.rating) || 0);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(removeReview({ id: deleteTarget, token })).unwrap();
      dispatch(getReviewsByProduct(productId));
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Failed to delete review");
    }
    setDeleteTarget(null);
  };

  // Render stars
  const renderStars = (value, interactive = false) => {
    const v = toNumber(value);
    const activeValue = interactive ? (hoverRating || rating) : v;

    return Array.from({ length: 5 }).map((_, i) => {
      const fillPercent = Math.min(1, Math.max(0, activeValue - i)) * 100;

      return (
        <span
          key={i}
          className="relative inline-block w-6 h-6"
          onMouseLeave={() => interactive && setHoverRating(0)}
        >
          <FaStar className="w-6 h-6 text-gray-300" />
          <span
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${fillPercent}%` }}
          >
            <FaStar className="w-6 h-6 text-yellow-400" />
          </span>

          {interactive && (
            <>
              <span
                className="absolute top-0 left-0 h-full w-1/2 cursor-pointer"
                onMouseEnter={() => setHoverRating(i + 0.5)}
                onClick={() => setRating(i + 0.5)}
              />
              <span
                className="absolute top-0 left-1/2 h-full w-1/2 cursor-pointer"
                onMouseEnter={() => setHoverRating(i + 1)}
                onClick={() => setRating(i + 1)}
              />
            </>
          )}
        </span>
      );
    });
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {loading && <p>Loading reviews...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-6 mb-8">
        {productReviews.length > 0 ? (
          productReviews.map((r) => {
            const reviewer = fetchedUsers?.[r.userId] || {};
            const isOwner = user?.id === r.userId;
            const numericRating = toNumber(r.rating);

            return (
              <div
                key={r.id}
                className="bg-white shadow-sm border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {reviewer.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-800">
                        {reviewer.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center text-sm mt-1">
                      <div className="flex items-center">
                        {renderStars(numericRating, false)}
                      </div>
                      <span className="ml-2 text-xs text-gray-600">
                        {numericRating.toFixed(1)} / 5
                      </span>
                    </div>

                    <p className="mt-2 text-gray-700">{r.comment}</p>

                    {isOwner && (
                      <div className="flex gap-3 mt-3 text-sm">
                        <button
                          onClick={() => handleEdit(r)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
        )}
      </div>

      {user ? (
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-5">
          <h3 className="font-semibold text-lg mb-3">
            {editingId ? "Edit your review" : "Write a review"}
          </h3>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center">{renderStars(null, true)}</div>
            <div className="text-sm text-gray-700">
              {(hoverRating || rating).toFixed(1)} / 5
            </div>
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this product..."
            className="border rounded-md p-3 resize-none w-full focus:ring-2 focus:ring-primary focus:outline-none"
            rows={3}
          />

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleSubmitReview}
              disabled={submitting || !reviewText.trim()}
              className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
                submitting || !reviewText.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-secondary"
              }`}
            >
              {submitting
                ? "Submitting..."
                : editingId
                ? "Update Review"
                : "Submit Review"}
            </button>

            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setReviewText("");
                  setRating(5);
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">
          Please <span className="text-primary font-semibold">log in</span> to leave a review.
        </p>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-2">Delete Review</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
