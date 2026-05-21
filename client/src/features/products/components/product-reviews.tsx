"use client";

import { motion } from "framer-motion";
import { Star, ThumbsUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  helpful: number;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    author: "Priya Sharma",
    rating: 5,
    date: "2 weeks ago",
    title: "Exceeded expectations",
    body: "Build quality is exceptional. Packaging felt premium and delivery was faster than estimated. Would buy again without hesitation.",
    helpful: 24,
  },
  {
    id: "2",
    author: "James Chen",
    rating: 4,
    date: "1 month ago",
    title: "Great value, minor setup",
    body: "Product performs exactly as described. Took a few minutes to set up but the vendor documentation was clear and helpful.",
    helpful: 12,
  },
  {
    id: "3",
    author: "Aisha Khan",
    rating: 5,
    date: "1 month ago",
    title: "Perfect for daily use",
    body: "Clean design, reliable performance, and the seller responded quickly to my question. This is what marketplace shopping should feel like.",
    helpful: 18,
  },
];

const StarRating: React.FC<{ rating: number; size?: "sm" | "md" }> = ({
  rating,
  size = "md",
}) => {
  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${iconClass} ${
            star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-700"
          }`}
        />
      ))}
    </div>
  );
};

interface ProductReviewsProps {
  productName: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productName }) => {
  const average = 4.8;
  const total = 128;

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
        <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-4">
          <span className="text-4xl font-semibold tracking-tight text-white">
            {average}
          </span>
          <div>
            <StarRating rating={5} />
            <p className="mt-1 text-sm text-slate-500">{total} reviews</p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {["Quality", "Fast shipping", "Great support", "Value"].map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="space-y-0 divide-y divide-slate-800/80 rounded-2xl border border-slate-800/80 bg-slate-900/20">
        {MOCK_REVIEWS.map((review, index) => (
          <motion.article
            key={review.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="p-6 sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-semibold text-white">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{review.author}</p>
                    <p className="text-xs text-slate-500">{review.date}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-sm font-medium text-slate-300">
                    {review.title}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-400">
              {review.body}
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500 transition hover:text-slate-300"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Helpful ({review.helpful})
            </button>
          </motion.article>
        ))}
      </div>

      <Separator className="mt-8 bg-slate-800" />
      <p className="mt-4 text-center text-xs text-slate-600">
        Reviews are illustrative until the Review API is connected.
      </p>
    </section>
  );
};
