import React, { useState } from "react";

const ReviewSection = ({ initialReviews = [] }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [reviewText, setReviewText] = useState("");

  const handleSubmitReview = () => {
    if (reviewText.trim()) {
      setReviews([...reviews, { text: reviewText, date: new Date() }]);
      setReviewText("");
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <div className="space-y-4 mb-6">
        {reviews.length > 0 ? (
          reviews.map((r, idx) => (
            <div key={idx} className="border p-4 rounded-md">
              <p>{r.text}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(r.date).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
      <div className="flex gap-4">
        <input
          type="text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
          className="flex-1 border rounded-md p-3"
        />
        <button
          onClick={handleSubmitReview}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;
