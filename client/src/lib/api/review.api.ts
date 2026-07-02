import { api } from "@/lib/api/axios";

export interface ReviewUser {
    id: string;
    name: string;
}

export interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: ReviewUser;
}

export interface ReviewsData {
    reviews: Review[];
    total: number;
    average: number;
}

interface ReviewsResponse {
    success: boolean;
    data: ReviewsData;
}

export const getProductReviews = async (
    productId: string
): Promise<ReviewsData> => {
    const response = await api.get<ReviewsResponse>(
        `/reviews/${productId}`
    );
    return response.data.data;
};

export const createReview = async (
    productId: string,
    payload: { rating: number; comment?: string }
): Promise<Review> => {
    const response = await api.post<{
        success: boolean;
        data: { review: Review };
    }>(`/reviews/${productId}`, payload);
    return response.data.data.review;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
};