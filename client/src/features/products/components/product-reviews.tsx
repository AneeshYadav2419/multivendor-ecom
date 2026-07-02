"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trash2, Loader2, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/useAuthStore";
import {
  getProductReviews,
  createReview,
  deleteReview,
  Review,
} from "@/lib/api/review.api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/* ── Star rating display ── */

const StarRating: React.FC<{
  rating: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onRate?: (rating: number) => void;
}> = ({ rating, size = "md", interactive = false, onRate }) => {
  const [hovered, setHovered] = useState(0);
  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const active = hovered || rating;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${iconClass} transition-colors ${star <= active
              ? "fill-amber-400 text-amber-400"
              : "text-slate-700"
            } ${interactive ? "cursor-pointer hover:scale-110" : ""}`}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
        />
      ))}
    </div>
  );
};

/* ── Review form ── */

const ReviewForm: React.FC<{ productId: string; onSuccess: () => void }> = ({
  productId,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => createReview(productId, { rating, comment }),
    onSuccess: () => {
      toast.success("Review submitted!");
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      setRating(0);
      setComment("");
      setIsOpen(false);
      onSuccess();
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Couldn't submit review. Please try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    mutate();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-8 inline-flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-2.5 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/20"
      >
        <MessageSquarePlus className="h-4 w-4" />
        Write a review
      </button>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl"
    >
      <h3 className="mb-4 text-base font-semibold text-white">
        Your review
      </h3>

      <div className="mb-4">
        <p className="mb-2 text-sm text-slate-400">Rating</p>
        <StarRating
          rating={rating}
          size="md"
          interactive
          onRate={setRating}
        />
      </div>

      <div className="mb-4">
        <p className="mb-2 text-sm text-slate-400">
          Comment{" "}
          <span className="text-slate-600">(optional)</span>
        </p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Share your experience with this product..."
          className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <p className="mt-1 text-right text-xs text-slate-600">
          {comment.length}/1000
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-semibold rounded-lg"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit review"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
          className="h-10 border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </motion.form>
  );
};

/* ── Single review card ── */

const ReviewCard: React.FC<{
  review: Review;
  currentUserId?: string;
  productId: string;
}> = ({ review, currentUserId, productId }) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteReview(review.id);
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    } catch {
      toast.error("Couldn't delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-semibold text-white">
            {review.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-white">{review.user.name}</p>
            <p className="text-xs text-slate-500">{timeAgo(review.createdAt)}</p>
          </div>
        </div>

        {currentUserId === review.user.id && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      <div className="mt-3">
        <StarRating rating={review.rating} size="sm" />
      </div>

      {review.comment && (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
          {review.comment}
        </p>
      )}
    </motion.article>
  );
};

/* ── Main component ── */

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productName,
}) => {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!useAuthStore((state) => state.accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => getProductReviews(productId),
    enabled: Boolean(productId),
  });

  const reviews = data?.reviews ?? [];
  const average = data?.average ?? 0;
  const total = data?.total ?? 0;

  return (
    <section className="mt-20">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Customer reviews
          </h2>
          <p className="mt-2 text-slate-400">
            What buyers say about {productName}
          </p>
        </div>
        {total > 0 && (
          <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-4">
            <span className="text-4xl font-semibold tracking-tight text-white">
              {average.toFixed(1)}
            </span>
            <div>
              <StarRating rating={Math.round(average)} />
              <p className="mt-1 text-sm text-slate-500">{total} review{total !== 1 ? "s" : ""}</p>
            </div>
          </div>
        )}
      </div>

      {/* Write review — logged in only */}
      {isLoggedIn ? (
        <ReviewForm productId={productId} onSuccess={() => { }} />
      ) : (
        <p className="mt-2 text-sm text-slate-500">
          <a href="/login" className="text-indigo-400 hover:underline">
            Sign in
          </a>{" "}
          to leave a review.
        </p>
      )}

      {/* Reviews list */}
      {isLoading ? (
        <div className="mt-8 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-800/50" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-slate-800/80 bg-slate-900/20 px-8 py-12 text-center">
          <p className="text-slate-400">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-0 divide-y divide-slate-800/80 rounded-2xl border border-slate-800/80 bg-slate-900/20">
          <AnimatePresence>
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={user?.id}
                productId={productId}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <Separator className="mt-8 bg-slate-800" />
    </section>
  );
};