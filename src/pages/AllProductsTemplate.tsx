"use client"
import { Product } from '@/types/product';
import { getProducts } from '@/utils/products';
import React, { useState } from 'react';
import ProductCard from '@/components/Product/ProductCard';

// Static filter options with counts
const FILTERS = [
    {
        key: 'discount', label: 'Discount', options: [
            { value: '10%+', count: 120 },
            { value: '20%+', count: 80 },
            { value: '30%+', count: 60 },
            { value: '40%+', count: 40 },
            { value: '50%+', count: 20 },
        ]
    },
    {
        key: 'department', label: 'Department', options: [
            { value: 'Mens', count: 200 },
            { value: 'Womens', count: 180 },
            { value: 'Kids', count: 90 },
            { value: 'Perfumes', count: 50 },
            { value: 'Gifts', count: 30 },
        ]
    },
    {
        key: 'category', label: 'Category', options: [
            { value: 'T-Shirts', count: 100 },
            { value: 'Shirts', count: 90 },
            { value: 'Blazers', count: 50 },
            { value: 'Dresses', count: 30 },
            { value: 'Tops', count: 25 },
            { value: 'Handbags', count: 15 },
            { value: 'Shoes', count: 20 },
            { value: 'Jeans', count: 35 },
            { value: 'Trousers', count: 50 },
        ]
    },
    {
        key: 'subCategory', label: 'Subcategory', options: [
            { value: 'Polo Shirts', count: 60 },
            { value: 'Flannel Shirts', count: 40 },
            { value: 'Casual Shirts', count: 60 },
            { value: 'Ceremonial Shirts', count: 9 },
            { value: 'Crew Neck T-Shirts', count: 22 },
            { value: 'Casual Blazers', count: 12 },
            { value: 'Casual Shoes', count: 18 },
            { value: 'Ath Fit Jeans', count: 7 },
            { value: 'Casual', count: 80 },
            { value: 'Formal', count: 60 },
            { value: 'Party', count: 40 },
            { value: 'Work', count: 30 },
            { value: 'Outdoor', count: 20 },
        ]
    },
    {
        key: 'occasion', label: 'Occasion', options: [
            { value: 'Casual', count: 100 },
            { value: 'Formal', count: 80 },
            { value: 'Party', count: 60 },
            { value: 'Work', count: 40 },
            { value: 'Outdoor', count: 20 },
        ]
    },
    {
        key: 'size', label: 'Sizes', options: [
            { value: '36', count: 40 },
            { value: '38', count: 50 },
            { value: '40', count: 60 },
            { value: '42', count: 70 },
        ]
    },
    {
        key: 'price', label: 'Price', options: [
            { value: 'Under ₹100', count: 30 },
            { value: '₹100-₹200', count: 60 },
            { value: '₹200-₹300', count: 40 },
            { value: 'Above ₹300', count: 20 },
        ]
    },
    {
        key: 'color', label: 'Color', options: [
            { value: 'White', count: 40 },
            { value: 'Black', count: 50 },
            { value: 'Blue', count: 60 },
            { value: 'Red', count: 30 },
            { value: 'Grey', count: 20 },
            { value: 'Brown', count: 10 },
            { value: 'Green', count: 15 },
            { value: 'Multicolor', count: 5 },
        ]
    },
    {
        key: 'fit', label: 'Fit', options: [
            { value: 'Regular Fit', count: 40 },
            { value: 'Slim Fit', count: 30 },
            { value: 'Relaxed Fit', count: 20 },
            { value: 'Oversized Fit', count: 10 },
            { value: 'Athletic Fit', count: 5 },
            { value: 'Tailored Fit', count: 8 },
        ]
    },
    {
        key: 'sleeves', label: 'Sleeves', options: [
            { value: 'Short Sleeves', count: 40 },
            { value: 'Long Sleeves', count: 30 },
            { value: 'Sleeveless', count: 10 },
        ]
    },
];

const MAX_VISIBLE_OPTIONS = 8;

// 1. Separate filter definitions for top bar and sidebar
const BASE_TOPBAR_FILTERS = [
    { key: 'discount', label: 'Discount' },
    { key: 'size', label: 'Size' },
    { key: 'price', label: 'Price' },
];
const SIDEBAR_FILTERS = [
    { key: 'category', label: 'Clothing Type' },
    { key: 'subCategory', label: 'Style' },
    { key: 'occasion', label: 'Occasion' },
    { key: 'color', label: 'Color' },
    { key: 'fit', label: 'Fit' },
    { key: 'sleeves', label: 'Sleeves' },
];
const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'priceLowHigh', label: 'Price: Low to High' },
    { value: 'priceHighLow', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
];

export default function AllProductTemplate(props: {
    filters: {
        department: boolean,
        category: boolean,
        subCategory: boolean,
    },
    slug: string | null,
    headers: {
        title: string,
        description: string,
    }
}) {
    const { filters, slug, headers } = props;
    const [products, setProducts] = useState<Product[]>(getProducts(null, 20));

    // Single-select for top bar filters
    const [topbarSelected, setTopbarSelected] = useState<{ [key: string]: string | null }>({});
    // Multi-select for sidebar filters
    const [selected, setSelected] = useState<{ [key: string]: string[] }>({});
    const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});
    const [sortBy, setSortBy] = useState<string>('relevance');

    // Dynamically add department to topbar filters if not true
    const TOPBAR_FILTERS = !filters.department
        ? [
            { key: 'department', label: 'Category' },
            ...BASE_TOPBAR_FILTERS
        ]
        : BASE_TOPBAR_FILTERS;

    // Helper for sidebar filter visibility
    const shouldShowSidebarFilter = (key: string) => {
        if (key === 'category' && filters.category) return false;
        if (key === 'subCategory' && filters.subCategory) return false;
        return true;
    };

    // Count selected for badge
    const getSelectedCount = (key: string) => (selected[key]?.length || 0);

    // Remove a selected option
    const removeSelected = (key: string, value: string) => {
        setSelected(sel => ({
            ...sel,
            [key]: sel[key].filter((v: string) => v !== value)
        }));
    };

    // Clear all selected
    const clearAll = () => setSelected({});

    // Render top bar dropdowns
    const renderTopBar = () => (
        <div className="w-full flex flex-row items-center gap-8 px-8 py-6 bg-white border-b border-gray-200">
            {TOPBAR_FILTERS.map(filter => {
                const filterDef = FILTERS.find(f => f.key === filter.key);
                if (!filterDef) return null;
                return (
                    <div key={filter.key} className="flex flex-col min-w-[180px]">
                        <label className="mb-1 text-xs font-semibold text-gray-700" htmlFor={`topbar-${filter.key}`}>{filter.label}</label>
                        <select
                            id={`topbar-${filter.key}`}
                            className="border border-black px-4 py-2 text-black bg-white text-sm font-medium w-full"
                            style={{ borderRadius: 0 }}
                            value={topbarSelected[filter.key] || ''}
                            onChange={e => setTopbarSelected(sel => ({ ...sel, [filter.key]: e.target.value }))}
                        >
                            <option value="">Select {filter.label}</option>
                            {filterDef.options.map(option => (
                                <option key={option.value} value={option.value}>{option.value} ({option.count})</option>
                            ))}
                        </select>
                    </div>
                );
            })}
            <div className="flex-1" />
            <div className="flex flex-col min-w-[180px]">
                <label className="mb-1 text-xs font-semibold text-gray-700" htmlFor="sort-by">Sort By</label>
                <select
                    id="sort-by"
                    className="border border-black px-4 py-2 text-black bg-white text-sm font-medium w-full"
                    style={{ borderRadius: 0 }}
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                >
                    {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );

    // Render sidebar filters
    const renderSidebar = () => (
        <div className="w-72 bg-white border-r border-gray-200 py-6 px-4 flex flex-col gap-6" style={{ borderRadius: 0 }}>
            {SIDEBAR_FILTERS.filter(f => shouldShowSidebarFilter(f.key)).map(filter => {
                const filterDef = FILTERS.find(fil => fil.key === filter.key);
                if (!filterDef) return null;
                const visibleOptions = showAll[filter.key] ? filterDef.options : filterDef.options.slice(0, MAX_VISIBLE_OPTIONS);
                return (
                    <div key={filter.key} className="mb-4">
                        <div className="font-bold text-base mb-2">{filter.label}</div>
                        <div className="flex flex-col gap-2">
                            {visibleOptions.map(option => {
                                const checked = selected[filter.key]?.includes(option.value);
                                return (
                                    <label key={option.value} className={`flex items-center gap-2 text-sm font-medium ${checked ? 'font-bold' : ''}`}>
                                        <input
                                            type="checkbox"
                                            className="accent-black w-4 h-4"
                                            checked={checked}
                                            onChange={() => {
                                                setSelected(sel => {
                                                    const arr = sel[filter.key] || [];
                                                    if (arr.includes(option.value)) {
                                                        return { ...sel, [filter.key]: arr.filter((v: string) => v !== option.value) };
                                                    } else {
                                                        return { ...sel, [filter.key]: [...arr, option.value] };
                                                    }
                                                });
                                            }}
                                        />
                                        <span>{option.value} <span className="text-gray-600">({option.count})</span></span>
                                    </label>
                                );
                            })}
                        </div>
                        {filterDef.options.length > MAX_VISIBLE_OPTIONS && (
                            <button
                                className="underline text-black text-xs mt-2 bg-transparent border-none px-2 py-1"
                                style={{ borderRadius: 0 }}
                                onClick={() => setShowAll(s => ({ ...s, [filter.key]: !s[filter.key] }))}
                            >
                                {showAll[filter.key] ? 'Show Less' : 'Show More'}
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
        for (const filter of SIDEBAR_FILTERS) {
            if (!shouldShowSidebarFilter(filter.key)) continue;
            const arr = selected[filter.key] || [];
            for (const value of arr) {
                chips.push(
                    <span key={filter.key + value} className="inline-flex items-center border border-black px-4 py-2 mr-2 mb-2 bg-white text-black text-sm font-medium" style={{ borderRadius: 0 }}>
                        {value}
                        <button
                            className="ml-2 text-black hover:underline"
                            style={{ borderRadius: 0 }}
                            onClick={() => removeSelected(filter.key, value)}
                        >
                            ×
                        </button>
                    </span>
                );
            }
        }
        if (chips.length === 0) return null;
        return (
            <div className="w-full flex flex-wrap items-center gap-2 py-4 px-2 bg-white border-b border-gray-200" style={{ borderRadius: 0 }}>
                {chips}
                <button className="underline text-black text-sm ml-2 bg-transparent border-none px-2 py-1" style={{ borderRadius: 0 }} onClick={clearAll}>Clear All</button>
            </div>
        );
    };

    // Layout: sidebar left, main content right
    return (
        <div className="max-w-7xl mx-auto min-h-screen bg-white mt-45 flex flex-col">
            {/* Header */}
            <div className="w-full px-8 py-8 bg-white border-b border-gray-300">
                <h1 className="text-3xl font-bold text-black tracking-tight">{headers.title}</h1>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
