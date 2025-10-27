"use client";
import { Product, ProductFilters, Attribute } from "@/types/product";
import { getProducts, getAttributes } from "@/utils/products";
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/Product/ProductCard";
import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/contexts/LoadingContext";

const MAX_VISIBLE_OPTIONS = 8;

const SORT_OPTIONS = [
  { value: "created_at", label: "Newest First" },
  { value: "updated_at", label: "Recently Updated" },
  { value: "name", label: "Name A-Z" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
  { value: "rating_count", label: "Most Reviewed" },
];

export default function AllProductsPage(props: {
  slug_type: "tag" | "collection" | "category" | "none";
  slug: string | null;
  searchQuery?: string | null;
}) {
  const { slug_type, slug, searchQuery } = props;
  const [headers, setHeaders] = useState<{
    title: string;
    description: string;
  }>({ title: "", description: "" });
  const [products, setProducts] = useState<Product[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const { startLoading, stopLoading } = useLoading();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Search functionality
  const [searchTerm, setSearchTerm] = useState(searchQuery || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Multi-select for sidebar filters
  const [selected, setSelected] = useState<{ [key: string]: string[] }>({});
  const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [rating, setRating] = useState<string>("");

  // Fetch products and attributes on component mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        // Fetch attributes
        const attributesResponse = await getAttributes();
        if (attributesResponse.success && attributesResponse.data) {
          setAttributes(attributesResponse.data);
        }

        // Build filter object
        const filterParams: ProductFilters = {
          search: debouncedSearchTerm || undefined,
          min_price: minPrice ? parseFloat(minPrice) : undefined,
          max_price: maxPrice ? parseFloat(maxPrice) : undefined,
          rating: rating ? parseFloat(rating) : undefined,
          sort_by: sortBy as any,
          sort_order: sortOrder,
          page: pagination.page,
          limit: pagination.limit,
        };
        if (slug_type !== "none") {
          if (slug_type === "collection" && slug) {
            filterParams.collection_slug = slug;
          } else if (slug_type === "category" && slug) {
            filterParams.category_slug = slug;
          } else if (slug_type === "tag" && slug) {
            filterParams.tag_slug = slug;
          }
        }

        // Add attribute filters
        const attributeIds = Object.values(selected).flat();
        if (attributeIds.length > 0) {
          filterParams.attributes = attributeIds.join(",");
        }

        // Fetch products
        const productsResponse = await getProducts(filterParams);
        if (productsResponse.success && productsResponse.data) {
          setProducts(productsResponse.data);
          if (productsResponse.pagination) {
            setPagination(productsResponse.pagination);
          }
          if (productsResponse.headers) {
            setHeaders(productsResponse.headers);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        stopLoading();
      }
    };

    fetchData();
  }, [
    debouncedSearchTerm,
    slug_type,
    slug,
    minPrice,
    maxPrice,
    rating,
    sortBy,
    sortOrder,
    selected,
    pagination.page,
  ]);


  // Remove a selected option
  const removeSelected = (key: string, value: string) => {
    setSelected((sel) => ({
      ...sel,
      [key]: sel[key].filter((v: string) => v !== value),
    }));
  };

  // Clear all selected
  const clearAll = () => setSelected({});

  // Render top bar dropdowns
  const renderTopBar = () => (
    <div className="w-full flex flex-row items-center gap-8 px-8 py-6 bg-white border-b border-gray-200">
      {/* Search Input */}
      <div className="flex flex-col min-w-[200px]">
        <label
          className="mb-1 text-xs font-semibold text-gray-700"
          htmlFor="search"
        >
          Search
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search products..."
          className="border border-black px-4 py-2 text-black bg-white text-sm font-medium w-full"
          style={{ borderRadius: 0 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Rating Filter */}
      <div className="flex flex-col min-w-[120px]">
        <label
          className="mb-1 text-xs font-semibold text-gray-700"
          htmlFor="rating"
        >
          Rating
        </label>
        <select
          id="rating"
          className="border border-black px-4 py-2 text-black bg-white text-sm font-medium w-full"
          style={{ borderRadius: 0 }}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="1">1+ Stars</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="flex flex-col min-w-[120px]">
        <label
          className="mb-1 text-xs font-semibold text-gray-700"
          htmlFor="min-price"
        >
          Min Price
        </label>
        <input
          id="min-price"
          type="number"
          placeholder="Min"
          className="border border-black px-4 py-2 text-black bg-white text-sm font-medium w-full"
          style={{ borderRadius: 0 }}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>
      <div className="flex flex-col min-w-[120px]">
        <label
          className="mb-1 text-xs font-semibold text-gray-700"
          htmlFor="max-price"
        >
          Max Price
        </label>
        <input
          id="max-price"
          type="number"
          placeholder="Max"
          className="border border-black px-4 py-2 text-black bg-white text-sm font-medium w-full"
          style={{ borderRadius: 0 }}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <div className="flex-1" />

      {/* Sort By */}
      <div className="flex flex-col min-w-[180px]">
        <label
          className="mb-1 text-xs font-semibold text-gray-700"
          htmlFor="sort-by"
        >
          Sort By
        </label>
        <select
          id="sort-by"
          className="border border-black px-4 py-2 text-black bg-white text-sm font-medium w-full"
          style={{ borderRadius: 0 }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Order */}
      <div className="flex flex-col min-w-[120px]">
        <label
          className="mb-1 text-xs font-semibold text-gray-700"
          htmlFor="sort-order"
        >
          Order
        </label>
        <select
          id="sort-order"
          className="border border-black px-4 py-2 text-black bg-white text-sm font-medium w-full"
          style={{ borderRadius: 0 }}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );

  // Render sidebar filters
  const renderSidebar = () => (
    <div
      className="w-72 bg-white border-r border-gray-200 py-6 px-4 flex flex-col gap-6"
      style={{ borderRadius: 0 }}
    >
      {attributes.map((attribute) => {
        const visibleOptions = showAll[attribute.id]
          ? attribute.values
          : attribute.values.slice(0, MAX_VISIBLE_OPTIONS);
        return (
          <div key={attribute.id} className="mb-4">
            <div className="text-base mb-2 text-black">
              {attribute.display_name}
            </div>
            <div className="flex flex-col gap-2">
              {visibleOptions.map((option) => {
                const checked = selected[attribute.id]?.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className={`flex items-center gap-2 text-sm font-medium ${
                      checked ? "font-bold" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-black w-4 h-4"
                      checked={checked}
                      onChange={() => {
                        setSelected((sel) => {
                          const arr = sel[attribute.id] || [];
                          if (arr.includes(option.id)) {
                            return {
                              ...sel,
                              [attribute.id]: arr.filter(
                                (v: string) => v !== option.id
                              ),
                            };
                          } else {
                            return {
                              ...sel,
                              [attribute.id]: [...arr, option.id],
                            };
                          }
                        });
                      }}
                    />
                    <span>
                      {option.display_value}{" "}
                      <span className="text-gray-600">
                        ({option.product_count})
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {attribute.values.length > MAX_VISIBLE_OPTIONS && (
              <button
                className="underline text-black text-xs mt-2 bg-transparent border-none px-2 py-1"
                style={{ borderRadius: 0 }}
                onClick={() =>
                  setShowAll((s) => ({
                    ...s,
                    [attribute.id]: !s[attribute.id],
                  }))
                }
              >
                {showAll[attribute.id] ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  // Render selected chips
  const renderSelectedChips = () => {
    const chips = [];
    for (const attribute of attributes) {
      const arr = selected[attribute.id] || [];
      for (const valueId of arr) {
        const value = attribute.values.find((v) => v.id === valueId);
        if (value) {
          chips.push(
            <span
              key={attribute.id + valueId}
              className="inline-flex items-center border border-black px-4 py-2 mr-2 mb-2 bg-white text-black text-sm font-medium"
              style={{ borderRadius: 0 }}
            >
              {value.display_value}
              <button
                className="ml-2 text-black hover:underline"
                style={{ borderRadius: 0 }}
                onClick={() => removeSelected(attribute.id, valueId)}
              >
                ×
              </button>
            </span>
          );
        }
      }
    }
    if (chips.length === 0) return null;
    return (
      <div
        className="w-full flex flex-wrap items-center gap-2 py-4 px-2 bg-white border-b border-gray-200"
        style={{ borderRadius: 0 }}
      >
        {chips}
        <button
          className="underline text-black text-sm ml-2 bg-transparent border-none px-2 py-1"
          style={{ borderRadius: 0 }}
          onClick={clearAll}
        >
          Clear All
        </button>
      </div>
    );
  };

  // Layout: sidebar left, main content right
  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-white mt-25 flex flex-col">
      {/* Header */}
      <div className="w-full px-8 py-8 bg-white border-b border-gray-300">
        <h1 className="text-3xl font-serif text-black tracking-tight">
          {headers.title}
        </h1>
        <p className="text-gray-600 mt-2 text-base">{headers.description}</p>
      </div>
      {/* Top Bar */}
      {renderTopBar()}
      <div className="flex flex-row flex-1">
        {/* Sidebar */}
        {renderSidebar()}
        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Selected Chips */}
          {renderSelectedChips()}
          {/* Products Grid */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            {products.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-lg text-gray-600">
                  No products found matching your criteria.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 border border-black text-black bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderRadius: 0 }}
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-black text-black bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderRadius: 0 }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
