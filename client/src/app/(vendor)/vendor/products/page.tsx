"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVendorProducts } from "@/lib/api/vendor";
import { deleteProduct } from "@/lib/api/products";
import { Product } from "@/features/products/types";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  Loader2, 
  Filter, 
  ExternalLink,
  PackageOpen,
  Image as ImageIcon,
  CheckSquare
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function VendorProducts() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  
  // Deletion state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk action state
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Fetch products
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["vendorProducts"],
    queryFn: getVendorProducts,
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorProducts"] });
      queryClient.invalidateQueries({ queryKey: ["vendorDashboardStats"] });
      toast.success("Product deleted successfully");
      setProductToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete product");
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setIsDeleting(true);
      deleteMutation.mutate(productToDelete.id);
    }
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const deletePromises = Array.from(selectedProductIds).map(id => deleteProduct(id));
      await Promise.all(deletePromises);
      
      toast.success(`${selectedProductIds.size} products deleted successfully`);
      setSelectedProductIds(new Set());
      setShowBulkDeleteConfirm(false);
      queryClient.invalidateQueries({ queryKey: ["vendorProducts"] });
      queryClient.invalidateQueries({ queryKey: ["vendorDashboardStats"] });
    } catch (err) {
      toast.error("Failed to delete some products");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // Format currency helper
  const formatCurrency = (value: string | number) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(numericValue);
  };

  // Filter products locally based on search query and status filter
  const filteredProducts = useMemo(() => {
    if (!data?.data) return [];
    
    return data.data.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category?.name && product.category.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = 
        statusFilter === "ALL" || 
        product.isActive === (statusFilter === "ACTIVE"); // Fallback check or direct status match
        
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && filteredProducts.length > 0) {
      const allIds = new Set(filteredProducts.map(p => p.id));
      setSelectedProductIds(allIds);
    } else {
      setSelectedProductIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedProductIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedProductIds(newSet);
  };

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#090d1f]/40 p-8 text-center backdrop-blur-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20 mb-4 animate-pulse">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200">Failed to load products</h3>
        <p className="mt-2 text-sm text-slate-400 max-w-sm">
          Could not fetch your active product listings. Please refresh or try again.
        </p>
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          className="mt-6 border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── HEADER ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Products</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your inventory, pricing, and active listings.
          </p>
        </div>
        <div>
          <Link href="/vendor/products/create">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* ── FILTER & SEARCH CONTROLS ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search products by name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-800 bg-[#060a17]/50 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 text-slate-200 placeholder:text-slate-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-[#060a17]/50 px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL" className="bg-[#0c1020] text-slate-300">All Statuses</option>
            <option value="ACTIVE" className="bg-[#0c1020] text-slate-300">Active Listings</option>
            <option value="INACTIVE" className="bg-[#0c1020] text-slate-300">Inactive / Drafts</option>
          </select>
        </div>
      </div>

      {/* ── PRODUCTS TABLE ── */}
      <Card className="border-slate-800 bg-[#060a17]/40 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900/20 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-4 w-12">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-slate-700 bg-[#020617] text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                      checked={filteredProducts.length > 0 && selectedProductIds.size === filteredProducts.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-4">Product Info</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Price</th>
                  <th scope="col" className="px-6 py-4">Stock</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-transparent">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-4 bg-slate-800 rounded" /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-lg bg-slate-800 shrink-0" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32 bg-slate-800" />
                            <Skeleton className="h-3 w-20 bg-slate-800" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-slate-800" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-12 bg-slate-800" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-8 bg-slate-800" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16 bg-slate-800" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-16 bg-slate-800 ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
                          <PackageOpen className="h-6 w-6" />
                        </div>
                        <h4 className="text-base font-semibold text-slate-300">No products found</h4>
                        <p className="mt-1 text-sm text-slate-500 max-w-sm">
                          {searchQuery || statusFilter !== "ALL" 
                            ? "Try adjusting your search criteria or filters." 
                            : "Get started by adding your first product to your shop catalog."}
                        </p>
                        {!searchQuery && statusFilter === "ALL" && (
                          <Link href="/vendor/products/create" className="mt-4">
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                              <Plus className="mr-1.5 h-3.5 w-3.5" />
                              Add your first product
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    // Determine status
                    const statusText = (product as any).status || (product.isActive ? "ACTIVE" : "DRAFT");
                    
                    let statusColorClasses = "bg-slate-500/10 text-slate-400 border-slate-500/20";
                    if (statusText === "ACTIVE") statusColorClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                    else if (statusText === "DRAFT") statusColorClasses = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                    else if (statusText === "OUT_OF_STOCK") statusColorClasses = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                    else if (statusText === "ARCHIVED") statusColorClasses = "bg-slate-800 text-slate-400 border-slate-700";
                    
                    return (
                      <tr 
                        key={product.id} 
                        className={`hover:bg-slate-900/40 transition-colors group ${selectedProductIds.has(product.id) ? 'bg-indigo-500/5' : ''}`}
                      >
                        <td className="px-4 py-4">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-slate-700 bg-[#020617] text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                            checked={selectedProductIds.has(product.id)}
                            onChange={(e) => handleSelectOne(product.id, e.target.checked)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shrink-0 flex items-center justify-center text-slate-600 relative">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = ""; // Clear src to render icon
                                  }}
                                />
                              ) : (
                                <ImageIcon className="h-5 w-5" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <Link href={`/vendor/products/edit/${product.id}`} className="font-semibold text-white hover:text-indigo-400 transition-colors truncate max-w-[200px] sm:max-w-xs md:max-w-md block">
                                {product.name}
                              </Link>
                              <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-slate-300">
                            {product.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-200 whitespace-nowrap">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={product.stock === 0 ? "text-rose-400 font-medium" : product.stock <= 10 ? "text-amber-400 font-medium" : "text-slate-300"}>
                              {product.stock} pcs
                            </span>
                            {product.stock > 0 && product.stock <= 10 && (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] px-1.5 py-0 h-5">Low Stock</Badge>
                            )}
                            {product.stock === 0 && (
                              <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px] px-1.5 py-0 h-5">Out of Stock</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant="outline"
                            className={statusColorClasses}
                          >
                            {statusText}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/vendor/products/edit/${product.id}`}>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8.5 w-8.5 text-slate-400 hover:text-white hover:bg-slate-800/50"
                                title="Edit Product"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8.5 w-8.5 text-slate-400 hover:text-red-400 hover:bg-red-950/20"
                              onClick={() => setProductToDelete(product)}
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── DELETE CONFIRMATION DIALOG MODAL ── */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => !isDeleting && setProductToDelete(null)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-[#0c1020] p-6 shadow-2xl animate-in scale-in duration-200">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-lg font-bold text-white">Delete Product?</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold text-slate-200">"{productToDelete.name}"</span>? 
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="border-slate-850 bg-slate-900/40 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-500 text-white min-w-[90px]"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── BULK DELETE CONFIRMATION DIALOG MODAL ── */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => !isBulkDeleting && setShowBulkDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-[#0c1020] p-6 shadow-2xl animate-in scale-in duration-200">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-lg font-bold text-white">Delete {selectedProductIds.size} Products?</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Are you sure you want to delete the selected products? 
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBulkDeleteConfirm(false)}
                disabled={isBulkDeleting}
                className="border-slate-850 bg-slate-900/40 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
                className="bg-red-600 hover:bg-red-500 text-white min-w-[90px]"
              >
                {isBulkDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  "Delete All"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING BULK ACTION BAR ── */}
      {selectedProductIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4 rounded-full border border-indigo-500/30 bg-[#090d1f]/90 px-6 py-3 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400 border border-indigo-500/20">
                {selectedProductIds.size}
              </span>
              <span className="text-sm font-medium text-slate-300">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-400 hover:text-white rounded-full"
                onClick={() => setSelectedProductIds(new Set())}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 rounded-full"
                onClick={() => setShowBulkDeleteConfirm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
