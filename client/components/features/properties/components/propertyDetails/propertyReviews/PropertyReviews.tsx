"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, MessageCircle, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Property } from "@/components/features/properties/types/property";
import { realEstateApi, ReviewItem } from "@/lib/api/realEstate";
import { useAuthStore } from "@/stores/auth.store";

interface PropertyReviewsProps {
  property: Property;
}

export default function PropertyReviews({ property }: PropertyReviewsProps) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await realEstateApi.getPropertyReviews(property._id);
      setReviews(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [property._id]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  }, [reviews]);

  const submitReview = async () => {
    if (!user?._id) {
      setError("Please login to add a review");
      return;
    }
    if (!rating || !newReview.trim()) {
      setError("Please provide a rating and comment");
      return;
    }

    try {
      setError(null);
      if (editingReviewId) {
        await realEstateApi.updatePropertyReview(property._id, editingReviewId, {
          rating,
          comment: newReview.trim(),
        });
      } else {
        await realEstateApi.createPropertyReview(property._id, {
          rating,
          comment: newReview.trim(),
        });
      }
      setNewReview("");
      setRating(0);
      setEditingReviewId(null);
      await fetchReviews();
    } catch (err: any) {
      setError(err?.message || "Failed to submit review");
    }
  };

  const startEdit = (review: ReviewItem) => {
    setEditingReviewId(review._id);
    setNewReview(review.comment);
    setRating(review.rating);
  };

  const removeReview = async (reviewId: string) => {
    try {
      await realEstateApi.deletePropertyReview(property._id, reviewId);
      await fetchReviews();
    } catch (err: any) {
      setError(err?.message || "Failed to delete review");
    }
  };

  const reportReview = async (reviewId: string) => {
    try {
      const reason = window.prompt("Reason for reporting this review") || "inappropriate";
      await realEstateApi.reportPropertyReview(property._id, reviewId, reason);
    } catch (err: any) {
      setError(err?.message || "Failed to report review");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Reviews & Ratings
      </h2>

      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8 p-6 bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">{reviews.length} reviews</p>
        </div>

        <div className="flex-1">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter(
                (r) => Math.floor(r.rating) === stars
              ).length;
                  const percentage = reviews.length ? (count / reviews.length) * 100 : 0;

              return (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm text-gray-600">{stars}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-10">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Review */}
      <div className="mb-8 p-6 border rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add Your Review
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-600">Your Rating:</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                onClick={() => setRating(i + 1)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 ${
                    i < rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <Textarea
          placeholder="Share your experience with this property..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          className="mb-4"
          rows={4}
        />
        <div className="flex gap-2">
          <Button onClick={submitReview}>
            {editingReviewId ? "Update Review" : "Submit Review"}
          </Button>
          {editingReviewId && (
            <Button
              variant="outline"
              onClick={() => {
                setEditingReviewId(null);
                setNewReview("");
                setRating(0);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Reviews List */}
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {loading ? (
        <p className="text-sm text-gray-500">Loading reviews...</p>
      ) : (
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border-b pb-6 last:border-0 last:pb-0"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                {(review.user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{review.user?.name || "User"}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{review.comment}</p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => reportReview(review._id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Report
                  </Button>
                  {user?._id && review.user?._id === user._id && (
                    <>
                      <Button variant="ghost" size="sm" className="gap-2" onClick={() => startEdit(review)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2" onClick={() => removeReview(review._id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
