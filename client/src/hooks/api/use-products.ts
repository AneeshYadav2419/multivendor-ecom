import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api/axios";

const fetchProducts = async () => {
    const res = await api.get("/products");
    return res.data;
};

export const useProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });
};