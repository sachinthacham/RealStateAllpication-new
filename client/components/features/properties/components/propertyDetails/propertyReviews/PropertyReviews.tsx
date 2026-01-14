import { useState } from "react";
import Image from "next/image";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Property } from "@/components/features/properties/types/property";

interface PropertyReviewsProps {
  property: Property;
}

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
  replies: number;
}

export default function PropertyReviews({ property }: PropertyReviewsProps) {
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      user: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      rating: 4.5,
      date: "2 weeks ago",
      comment:
        "Beautiful property! The location is perfect and the amenities are top-notch. Highly recommended!",
      likes: 24,
      replies: 3,
    },
    {
      id: 2,
      user: "Sarah Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5,
      date: "1 month ago",
      comment:
        "Loved every bit of this place. The neighborhood is quiet and safe. Perfect for families!",
      likes: 18,
      replies: 1,
    },
  ]);

  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

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
              const percentage = (count / reviews.length) * 100;

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
        <Button>Submit Review</Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b pb-6 last:border-0 last:pb-0"
          >
            <div className="flex items-start gap-4 mb-4">
              <Image
                src={review.avatar}
                alt={review.user}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{review.user}</h4>
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
                    <span>{review.date}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{review.comment}</p>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful ({review.likes})
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Reply ({review.replies})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
