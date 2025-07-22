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
            { value: 'Polo Shirts', count: 60 },
            { value: 'Flannel Shirts', count: 40 },
            { value: 'Dresses', count: 30 },
            { value: 'Tops', count: 25 },
            { value: 'Handbags', count: 15 },
            { value: 'Shoes', count: 20 },
            { value: 'Jeans', count: 35 },
            { value: 'Belts', count: 10 },
            { value: 'Casual Trousers', count: 50 },
            { value: 'Casual Blazers', count: 12 },
            { value: 'Casual Shirts', count: 60 },
            { value: 'Casual Shoes', count: 18 },
            { value: 'Ceremonial Shirts', count: 9 },
            { value: 'Combo Boxes', count: 16 },
            { value: 'Crew Neck T-Shirts', count: 22 },
            { value: 'Bandhgala', count: 9 },
            { value: 'Ath Fit Jeans', count: 7 },
        ]
    },
    {
        key: 'subCategory', label: 'Subcategory', options: [
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

export default function AllProductTemplate(props: {
    filters: {
        department: boolean,
        category: boolean,
        subCategory: boolean,
    },
    slug: string | null,
}) {
    const { filters, slug } = props;
    const [products, setProducts] = useState<Product[]>(getProducts(null, 20));

    // Multi-select for each filter
    const [selected, setSelected] = useState<{ [key: string]: string[] }>({});
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});

    // Hierarchical logic for disabling
    const departmentSelected = selected['department'] && selected['department'].length > 0;
    const categorySelected = selected['category'] && selected['category'].length > 0;
    const isFilterDisabled = (key: string) => {
        if (key === 'category') return !filters.category || !departmentSelected;
        if (key === 'subCategory') return !filters.subCategory || !departmentSelected || !categorySelected;
        if (key === 'department') return !filters.department;
        return false;
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

    // Render filter options panel
    const renderOptionsPanel = () => {
        if (!openFilter) return null;
        const filter = FILTERS.find(f => f.key === openFilter);
        if (!filter) return null;
        const disabled = isFilterDisabled(filter.key);
        const visibleOptions = showAll[filter.key] ? filter.options : filter.options.slice(0, MAX_VISIBLE_OPTIONS);
        return (
            <div className="w-full bg-white border-b border-gray-200 py-6 flex flex-wrap gap-6 items-center" style={{ borderRadius: 0 }}>
                {visibleOptions.map(option => {
                    const checked = selected[filter.key]?.includes(option.value);
                    return (
                        <button
                            key={option.value}
                            className={`flex items-center gap-2 px-4 py-2 border border-black bg-white text-black text-sm font-medium min-w-[180px] h-12 transition-colors duration-150 ${checked ? 'bg-black text-white' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{ borderRadius: 0 }}
                            disabled={disabled}
                            onClick={() => {
                                if (disabled) return;
                                setSelected(sel => {
                                    const arr = sel[filter.key] || [];
                                    if (arr.includes(option.value)) {
                                        return { ...sel, [filter.key]: arr.filter((v: string) => v !== option.value) };
                                    } else {
                                        return { ...sel, [filter.key]: [...arr, option.value] };
                                    }
                                });
                            }}
                        >
                            <span className={`w-5 h-5 border border-black flex items-center justify-center mr-2 ${checked ? 'bg-black' : 'bg-white'}`} style={{ borderRadius: 0 }}>
                                {checked && <span className="w-3 h-3 bg-white block" style={{ borderRadius: 0 }} />}
                            </span>
                            <span className="flex-1 text-left">{option.value} <span className="text-gray-600">({option.count})</span></span>
                        </button>
                    );
                })}
                {filter.options.length > MAX_VISIBLE_OPTIONS && (
                    <button
                        className="underline text-black text-sm ml-4 bg-transparent border-none px-2 py-1"
                        style={{ borderRadius: 0 }}
                        onClick={() => setShowAll(s => ({ ...s, [filter.key]: !s[filter.key] }))}
                    >
                        {showAll[filter.key] ? 'Show Less' : 'Show More'}
                    </button>
                )}
            </div>
        );
    };

    // Render selected chips
    const renderSelectedChips = () => {
        const chips = [];
        for (const filter of FILTERS) {
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

    return (
        <div className="max-w-7xl mx-auto min-h-screen bg-white mt-45">
            {/* Filter Names Bar */}
            <div className="w-full bg-white border-b border-gray-200 flex flex-row flex-wrap gap-0 px-2">
                {FILTERS.map(filter => (
                    <button
                        key={filter.key}
                        className={`flex items-center gap-2 px-6 py-4 text-center text-base font-medium uppercase text-black border border-black rounded-sm border-none bg-white transition-colors duration-150 relative ${openFilter === filter.key ? 'bg-gray-100' : ''} ${isFilterDisabled(filter.key) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ borderRadius: 0 }}
                        disabled={isFilterDisabled(filter.key)}
                        onClick={() => {
                            if (!isFilterDisabled(filter.key)) {
                                setOpenFilter(openFilter === filter.key ? null : filter.key);
                            }
                        }}
                    >
                        {filter.label}
                        <span className="ml-1">▾</span>
                        {getSelectedCount(filter.key) > 0 && (
                            <span className="ml-2 px-2 py-1 bg-black text-white text-xs font-bold" style={{ borderRadius: 16 }}>{getSelectedCount(filter.key)}</span>
                        )}
                    </button>
                ))}
            </div>
            {/* Filter Options Panel */}
            {renderOptionsPanel()}
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
    );
}
