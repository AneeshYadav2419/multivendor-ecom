"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/categories";
import { createProduct } from "@/lib/api/products";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Zod validation schema matching backend createProductSchema
const productFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .trim(),
  price: z
    .number({ message: "Price is required" })
    .positive("Price must be greater than 0"),
  stock: z
    .number({ message: "Stock is required" })
    .int()
    .nonnegative("Stock cannot be negative"),
  categoryId: z
    .string()
    .min(1, "Please select a category"),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .min(1, "At least one image is required"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", // Headphones
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", // Watch
  "https://images.unsplash.com/photo-1511467687858-23d96c43e13a?w=800&q=80", // Keyboard
  "https://images.unsplash.com/photo-1551028713-0b4c967ca6bc?w=800&q=80", // Jacket
  "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80", // Lamp
];

export default function CreateProduct() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [imageInput, setImageInput] = useState("");

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = categoriesData?.data || [];

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "" as any,
      stock: "" as any,
      categoryId: "",
      images: [],
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images" as never,
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorProducts"] });
      queryClient.invalidateQueries({ queryKey: ["vendorDashboardStats"] });
      toast.success("Product created as DRAFT successfully!");
      router.push("/vendor/products");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create product");
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    createMutation.mutate(values);
  };

  const handleAddImage = () => {
    if (!imageInput) return;
    try {
      z.string().url().parse(imageInput);
      appendImage(imageInput);
      setImageInput("");
    } catch {
      toast.error("Please enter a valid image URL");
    }
  };

  const handleAddDemoImage = () => {
    const randomImage = DEMO_IMAGES[Math.floor(Math.random() * DEMO_IMAGES.length)];
    appendImage(randomImage);
    toast.success("Demo image added!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* ── BREADCRUMB / HEADER ── */}
      <div className="flex items-center gap-3">
        <Link href="/vendor/products">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800/50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create New Product</h1>
          <p className="text-sm text-slate-400">Add a new item listing to your store inventory.</p>
        </div>
      </div>

      {/* ── FORM ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-slate-800 bg-[#060a17]/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white text-base">General Details</CardTitle>
                <CardDescription className="text-slate-400">Basic details about your product listing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300 font-medium">Product Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Wireless Noise-Cancelling Headphones"
                    {...register("name")}
                    className="border-slate-800 bg-[#020617]/50 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 text-slate-200"
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300 font-medium">Description</Label>
                  <textarea
                    id="description"
                    rows={6}
                    placeholder="Describe the product details, features, specifications, and materials..."
                    {...register("description")}
                    className="flex w-full rounded-lg border border-slate-800 bg-[#020617]/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors.description && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Inventory and Pricing */}
            <Card className="border-slate-800 bg-[#060a17]/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white text-base">Pricing & Inventory</CardTitle>
                <CardDescription className="text-slate-400">Configure cost, margins, and physical stock limits.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-slate-300 font-medium">Price (INR)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₹</span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("price", { valueAsNumber: true })}
                      className="pl-7 border-slate-800 bg-[#020617]/50 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 text-slate-200"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-slate-300 font-medium">Stock / Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    {...register("stock", { valueAsNumber: true })}
                    className="border-slate-800 bg-[#020617]/50 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 text-slate-200"
                  />
                  {errors.stock && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings (Category / Images) */}
          <div className="space-y-6">
            {/* Category selection */}
            <Card className="border-slate-800 bg-[#060a17]/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white text-base">Organization</CardTitle>
                <CardDescription className="text-slate-400">Classify your products for search navigation.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="categoryId" className="text-slate-300 font-medium">Category</Label>
                  {isLoadingCategories ? (
                    <Skeleton className="h-10 w-full bg-slate-800 rounded-lg" />
                  ) : categoriesError ? (
                    <p className="text-xs text-rose-400">Failed to load categories.</p>
                  ) : (
                    <select
                      id="categoryId"
                      {...register("categoryId")}
                      className="flex w-full rounded-lg border border-slate-800 bg-[#020617]/50 px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-[#0c1020]">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.categoryId && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Images selection */}
            <Card className="border-slate-800 bg-[#060a17]/50 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-white text-base">Media Link</CardTitle>
                  <CardDescription className="text-slate-400">Provide product image URLs.</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg"
                  onClick={handleAddDemoImage}
                  title="Insert a random demo image"
                >
                  <Sparkles className="h-4.5 w-4.5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-input" className="text-slate-300 font-medium">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image-input"
                      placeholder="https://example.com/image.jpg"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      className="border-slate-800 bg-[#020617]/50 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 text-slate-200"
                    />
                    <Button
                      type="button"
                      onClick={handleAddImage}
                      className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-3"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Selected Images List */}
                <div className="space-y-2">
                  {imageFields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 border border-dashed border-slate-800 rounded-lg bg-slate-950/20 text-slate-500 text-center text-xs">
                      <ImageIcon className="h-6 w-6 text-slate-700 mb-1.5" />
                      <span>No images added yet</span>
                      <span className="text-[10px] text-slate-600 mt-0.5">Click the Sparkles icon for a demo image</span>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {imageFields.map((field, index) => {
                        const url = getValues(`images.${index}`);
                        return (
                          <div
                            key={field.id}
                            className="flex items-center gap-2 p-2 border border-slate-800/80 bg-slate-950/40 rounded-lg group"
                          >
                            <div className="h-8 w-8 rounded overflow-hidden bg-slate-900 shrink-0 border border-slate-850">
                              <img
                                src={url}
                                alt={`Media ${index}`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-450 truncate flex-1 leading-none">{url}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-red-950/20 shrink-0"
                              onClick={() => removeImage(index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {errors.images && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.images.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-6">
          <Link href="/vendor/products">
            <Button
              type="button"
              variant="outline"
              disabled={createMutation.isPending}
              className="border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[120px] shadow-lg shadow-indigo-600/20"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
