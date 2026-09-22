import { Fragment, useEffect, useState } from "react";
import {
    ArrowLeft,
    Search,
    Heart,
    ShoppingCart,
    ChevronDown,
    ChevronRight,
    LayoutGrid,
    Cpu,
    Monitor,
    HardDrive,
    BatteryCharging,
    Fan,
    Box,
    X,
} from "lucide-react";

import "../styles/SearchResults.css";
import { searchProducts } from "../services/searchService.js";
import { authService } from "../services/authService.js";

const RESULTS_PER_PAGE = 12;


// ======================================================
// CATEGORIES
// ======================================================

const categories = [
    {
        name: "All Categories",
        icon: LayoutGrid,
    },

    {
        name: "Processors (CPU)",
        icon: Cpu,
    },

    {
        name: "Motherboards",
        icon: Box,
    },

    {
        name: "Graphics Cards (GPU)",
        icon: Monitor,
    },

    {
        name: "RAM",
        icon: Box,
    },

    {
        name: "Storage",
        icon: HardDrive,
    },

    {
        name: "Power Supplies (PSU)",
        icon: BatteryCharging,
    },

    {
        name: "Cooling",
        icon: Fan,
    },
];


// ======================================================
// DEFAULT BRANDS (shown until the backend provides facets)
// ======================================================

const defaultBrands = [
    ["MSI", 4],
    ["ASUS", 3],
    ["Gigabyte", 3],
    ["Zotac", 2],
    ["Inno3D", 1],
];


// ======================================================
// SEARCH RESULTS PAGE
// ======================================================

export default function SearchResults() {

    const [input, setInput] = useState("rtx 4060");
    const [searchTerm, setSearchTerm] = useState("rtx 4060");
    const [category, setCategory] = useState(null);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [sort, setSort] = useState("relevance");
    const [page, setPage] = useState(1);

    const [results, setResults] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: RESULTS_PER_PAGE,
        total: 0,
        totalPages: 0,
    });
    const [brandFacets, setBrandFacets] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const user = authService.getUser();
    const userName = user?.name || "Raghav";
    const userInitial = (user?.name || "H").trim().charAt(0).toUpperCase() || "H";

    const brandList = brandFacets && brandFacets.length > 0
        ? brandFacets.map((item) => [item.name, item.count])
        : defaultBrands;

    useEffect(() => {
        let cancelled = false;

        searchProducts({
            q: searchTerm,
            category: category || undefined,
            brand: selectedBrands.length > 0 ? selectedBrands : undefined,
            sort,
            page,
            limit: RESULTS_PER_PAGE,
        })
            .then((data) => {
                if (cancelled) return;
                setResults(data.results ?? []);
                setPagination(data.pagination ?? {});
                if (Array.isArray(data.brands)) setBrandFacets(data.brands);
                setError(null);
                setLoading(false);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err.message || "Failed to load search results.");
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [searchTerm, category, selectedBrands, sort, page, retryCount]);

    const submitSearch = (event) => {
        event.preventDefault();
        const term = input.trim();
        setError(null);
        if (term !== searchTerm) {
            setSearchTerm(term);
            setPage(1);
        }
    };

    const selectCategory = (index) => {
        setError(null);
        setCategory(index === 0 ? null : categories[index].name);
        setPage(1);
    };

    const toggleBrand = (brand) => {
        setError(null);
        setSelectedBrands((current) =>
            current.includes(brand)
                ? current.filter((item) => item !== brand)
                : [...current, brand]
        );
        setPage(1);
    };

    const clearFilters = () => {
        setError(null);
        setCategory(null);
        setSelectedBrands([]);
        setPage(1);
    };

    const changePage = (nextPage) => {
        if (nextPage < 1 || nextPage > pagination.totalPages) return;
        setError(null);
        setPage(nextPage);
    };

    let productArea;
    if (error) {
        productArea = (
            <div className="search-status error">
                <p>{error}</p>
                <button
                    type="button"
                    className="retry-button"
                    onClick={() => setRetryCount((count) => count + 1)}
                >
                    Try again
                </button>
            </div>
        );
    } else if (loading) {
        productArea = (
            <div className="search-status">
                Loading products...
            </div>
        );
    } else if (results.length === 0) {
        productArea = (
            <div className="search-status">
                <p>
                    No products found for{" "}
                    <strong>"{searchTerm}"</strong>.
                </p>
                <p>
                    Try a different keyword, or clear the filters.
                </p>
            </div>
        );
    } else {
        productArea = (
            <>
                <div className="product-grid">
                    {results.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>

                {pagination.totalPages > 1 && (
                    <div className="pagination">
                        <button
                            type="button"
                            className="prev-page"
                            aria-label="Previous page"
                            onClick={() => changePage(page - 1)}
                        >
                            ←
                        </button>

                        {Array.from(
                            { length: pagination.totalPages },
                            (_, index) => index + 1
                        ).map((pageNumber) => (
                            <button
                                type="button"
                                key={pageNumber}
                                className={
                                    pageNumber === pagination.page
                                        ? "page active-page"
                                        : "page"
                                }
                                onClick={() => changePage(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        <button
                            type="button"
                            className="next-page"
                            aria-label="Next page"
                            onClick={() => changePage(page + 1)}
                        >
                            →
                        </button>
                    </div>
                )}
            </>
        );
    }

    return (
        <div className="search-page">

            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="top-header">

                {/* BRAND */}

                <div className="brand">

                    <div className="brand-logo">
                        SD
                    </div>

                    <div className="brand-text">

                        <h1>
                            SD COMPUTERS
                        </h1>

                        <p>
                            BUILD YOUR DREAM PC
                        </p>

                    </div>

                </div>


                {/* SEARCH */}

                <form
                    className="search-box"
                    onSubmit={submitSearch}
                >

                    <input
                        type="text"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Search products..."
                    />

                    <button
                        type="submit"
                        aria-label="Search"
                    >
                        <Search size={21} />
                    </button>

                </form>


                {/* HEADER ACTIONS */}

                <div className="header-actions">

                    {/* WISHLIST */}

                    <button
                        type="button"
                        className="header-action"
                    >

                        <div className="icon-wrapper">

                            <Heart size={21} />

                            <span>
                                3
                            </span>

                        </div>

                        <p>
                            Wishlist
                        </p>

                    </button>


                    {/* CART */}

                    <button
                        type="button"
                        className="header-action"
                    >

                        <div className="icon-wrapper">

                            <ShoppingCart size={21} />

                            <span>
                                2
                            </span>

                        </div>

                        <p>
                            Cart
                        </p>

                    </button>


                    {/* USER */}

                    <button
                        type="button"
                        className="user-area"
                    >

                        <div className="user-avatar">
                            {userInitial}
                        </div>

                        <span>
                            Hi, {userName}
                        </span>

                        <ChevronDown size={15} />

                    </button>

                </div>

            </header>


            {/* ==================================================
                MAIN
            ================================================== */}

            <div className="main-layout">


                {/* ==================================================
                    SIDEBAR
                ================================================== */}

                <aside className="sidebar">


                    {/* BACK BUTTON */}

                    <button
                        type="button"
                        className="back-button"
                        onClick={() => { window.location.href = "/"; }}
                    >

                        <ArrowLeft size={18} />

                        <span>
                            Back to Home
                        </span>

                    </button>


                    {/* CATEGORIES */}

                    <div className="sidebar-section">

                        <h3>
                            Categories
                        </h3>


                        <div className="category-list">

                            {categories.map(
                                (categoryItem, index) => {

                                    const Icon = categoryItem.icon;

                                    return (

                                        <button
                                            type="button"
                                            key={categoryItem.name}
                                            className={
                                                (index === 0 && category === null) ||
                                                category === categoryItem.name
                                                    ? "category active"
                                                    : "category"
                                            }
                                            onClick={() => selectCategory(index)}
                                        >

                                            <Icon size={18} />

                                            <span>
                                                {categoryItem.name}
                                            </span>

                                        </button>

                                    );
                                }
                            )}

                        </div>

                    </div>


                    {/* ==================================================
                        PRICE FILTER
                    ================================================== */}

                    <div className="filter-section">

                        <h3>
                            Price Range
                        </h3>


                        <div className="price-slider">

                            <div className="slider-line"></div>

                            <div className="slider-dot left"></div>

                            <div className="slider-dot right"></div>

                        </div>


                        <div className="price-labels">

                            <span>
                                ₹0
                            </span>

                            <span>
                                ₹1,50,000
                            </span>

                        </div>

                    </div>


                    {/* ==================================================
                        BRAND FILTER
                    ================================================== */}

                    <div className="filter-section">

                        <h3>
                            Brand
                        </h3>


                        <div className="brand-list">

                            {brandList.map(
                                ([brand, count]) => (

                                    <label
                                        className="brand-filter"
                                        key={brand}
                                    >

                                        <input
                                            type="checkbox"
                                            value={brand}
                                            checked={selectedBrands.includes(brand)}
                                            onChange={() => toggleBrand(brand)}
                                        />

                                        <span className="custom-checkbox"></span>

                                        <span>
                                            {brand}
                                        </span>

                                        <small>
                                            ({count})
                                        </small>

                                    </label>

                                )
                            )}

                        </div>

                    </div>


                    {/* CLEAR FILTERS */}

                    <button
                        type="button"
                        className="clear-button"
                        onClick={clearFilters}
                    >

                        <X size={16} />

                        <span>
                            Clear Filters
                        </span>

                    </button>

                </aside>


                {/* ==================================================
                    CONTENT
                ================================================== */}

                <main className="content">


                    {/* BREADCRUMB */}

                    <div className="breadcrumb">

                        <span>
                            Home
                        </span>

                        <ChevronRight size={15} />

                        <span>
                            Search Results
                        </span>

                    </div>


                    {/* ==================================================
                        TITLE + SORT
                    ================================================== */}

                    <div className="title-row">


                        <div className="title-content">

                            <h2>
                                Search Results
                            </h2>

                            <p>
                                Showing{" "}
                                {loading ? "…" : pagination.total}{" "}
                                {pagination.total === 1 ? "result" : "results"} for{" "}
                                <strong>
                                    "{searchTerm}"
                                </strong>
                            </p>

                        </div>


                        <div className="sort-button sort-wrap">

                            <span>
                                Sort by:
                            </span>

                            <select
                                value={sort}
                                onChange={(event) => {
                                    setError(null);
                                    setSort(event.target.value);
                                    setPage(1);
                                }}
                                aria-label="Sort results"
                            >
                                <option value="relevance">
                                    Relevance
                                </option>

                                <option value="price_asc">
                                    Price: Low to High
                                </option>

                                <option value="price_desc">
                                    Price: High to Low
                                </option>

                                <option value="name_asc">
                                    Name: A to Z
                                </option>

                            </select>

                            <ChevronDown size={17} className="chevron" />

                        </div>

                    </div>


                    {/* ==================================================
                        PRODUCTS
                    ================================================== */}

                    {productArea}

                </main>

            </div>

        </div>
    );
}


// ======================================================
// PRODUCT CARD
// ======================================================

function ProductCard({ product }) {

    const specifications = Array.isArray(product.specifications)
        ? product.specifications
        : ["8GB GDDR6", "128-bit", "DLSS 3"];

    return (

        <article className="product-card">


            {/* FAVORITE */}

            <button
                type="button"
                className="favorite"
                aria-label={`Add ${product.name} to wishlist`}
            >
                <Heart size={19} />
            </button>


            {/* PRODUCT IMAGE */}

            <div className="product-image">

                <img
                    src={product.image}
                    alt={product.name}
                    onError={(event) => {
                        event.currentTarget.style.display = "none";
                    }}
                />

            </div>


            {/* PRODUCT NAME */}

            <h3>
                {product.name}
            </h3>


            {/* SPECIFICATIONS */}

            <div className="specifications">

                {specifications.map((spec, index) => (
                    <Fragment key={index}>
                        {index > 0 && <i>|</i>}
                        <span>{spec}</span>
                    </Fragment>
                ))}

            </div>


            {/* PRICE */}

            <div className="price-row">

                <strong>
                    {product.price}
                </strong>


                {product.oldPrice && (
                    <del>
                        {product.oldPrice}
                    </del>
                )}


                {product.discount && (
                    <span className="discount">
                        {product.discount}
                    </span>
                )}

            </div>


            {/* ADD TO CART */}

            <button
                type="button"
                className="add-cart"
            >

                <ShoppingCart size={17} />

                <span>
                    Add to Cart
                </span>

            </button>

        </article>

    );
}