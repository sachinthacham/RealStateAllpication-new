"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { propertyApi } from "@/lib/api/properties";
import { Grid, List, Map, Loader2, Filter } from "lucide-react";
import { usePropertyStore } from "@/stores/property.store";
import { Property } from "@/components/features/properties/types/property";
import PropertyGrid from "@/components/features/properties/components/propertySearch/propertyGrid/PropertyGrid";
import PropertyFilters from "@/components/features/properties/components/propertySearch/propertyFilters/PropertyFilters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Wrapper component to handle search params
function PropertyContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc");
  const [page, setPage] = useState(Number(searchParams.get("page") || "1"));
  const [totalPages, setTotalPages] = useState(1);
  
  const { favorites, toggleFavorite } = usePropertyStore();
  
  // Toggle for mobile filter sidebar
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        //  1. Convert Next.js ReadonlyURLSearchParams to standard URLSearchParams
        const params = new URLSearchParams(searchParams.toString());
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
        params.set("page", String(page));
        params.set("limit", "12");
        
        //  2. Pass params to API
        const response: any = await propertyApi.getAll(params);
        
        const data = response.data.data || response;
        const pagination = response.data.pagination;
        
        
        setProperties(data);
        setTotalPages(Math.max(1, pagination?.totalPages || 1));
      } catch (err) {
        console.error(err);
        setError("Failed to load properties");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams, sortBy, sortOrder, page]); //  Re-run whenever URL changes

  

  return (
    <div className="section-container py-8">
      
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button variant="outline" className="w-full border-slate-300 bg-white" onClick={() => setShowMobileFilters(!showMobileFilters)}>
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar (Filters) */}
        <aside className={`lg:w-1/4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <PropertyFilters />
        </aside>

        {/* Right Content (Grid) */}
        <main className="lg:w-3/4">
          <div className="surface-card subtle-ring p-4 md:p-5 flex flex-col gap-3 md:flex-row justify-between md:items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              {properties.length} Properties Found
            </h2>
            
            <div className="flex items-center space-x-2">
              <Select value={`${sortBy}:${sortOrder}`} onValueChange={(value) => {
                const [nextSortBy, nextSortOrder] = value.split(":");
                setSortBy(nextSortBy);
                setSortOrder(nextSortOrder);
                setPage(1);
              }}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt:desc">Newest</SelectItem>
                  <SelectItem value="price:asc">Price Low to High</SelectItem>
                  <SelectItem value="price:desc">Price High to Low</SelectItem>
                  <SelectItem value="area:desc">Largest Area</SelectItem>
                  <SelectItem value="averageRating:desc">Top Rated</SelectItem>
                </SelectContent>
              </Select>
              <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : ""}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : ""}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "map" ? "default" : "outline"} size="icon" onClick={() => setViewMode("map")} className={viewMode === "map" ? "bg-blue-600 hover:bg-blue-700" : ""}>
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-500">Loading properties...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 surface-card border-dashed">
              <p className="text-slate-500">No properties found matching your criteria.</p>
              <Button variant="link" onClick={() => window.location.href = '/search'}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <PropertyGrid
                properties={properties}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                viewMode={viewMode}
              />
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </main>
       
      </div>
    </div>
  );
}

// ✅ Wrap in Suspense for SearchParams to work in Next.js App Router
export default function PropertiesPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-r from-blue-700 via-blue-600 to-indigo-700 text-white py-10 shadow-sm">
        <div className="section-container">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">Browse Properties</h1>
          <p className="opacity-90">Explore verified homes with advanced filters and rich listing details.</p>
        </div>
      </div>
      <Suspense fallback={<div className="p-10 text-center">Loading search...</div>}>
        <PropertyContent />
      </Suspense>
    </div>
  );
}