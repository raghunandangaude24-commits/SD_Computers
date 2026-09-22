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

import "../styles/searchresults.css";


// ======================================================
// PRODUCTS
// ======================================================

const products = [
    {
        id: 1,
        name: "MSI GeForce RTX 4060 Ventus 2X 8GB GDDR6",
        image: "/products/msi-rtx-4060.png",
        price: "₹34,999",
        oldPrice: "₹37,999",
        discount: "8% OFF",
        brand: "MSI",
    },

    {
        id: 2,
        name: "Gigabyte GeForce RTX 4060 Eagle 8GB GDDR6",
        image: "/products/gigabyte-rtx-4060.png",
        price: "₹33,499",
        oldPrice: "₹36,999",
        discount: "9% OFF",
        brand: "Gigabyte",
    },

    {
        id: 3,
        name: "ASUS Dual GeForce RTX 4060 8GB GDDR6",
        image: "/products/asus-rtx-4060.png",
        price: "₹34,499",
        oldPrice: "₹38,999",
        discount: "11% OFF",
        brand: "ASUS",
    },

    {
        id: 4,
        name: "Zotac Gaming GeForce RTX 4060 Twin Edge 8GB GDDR6",
        image: "/products/zotac-rtx-4060.png",
        price: "₹32,999",
        oldPrice: "₹36,499",
        discount: "10% OFF",
        brand: "Zotac",
    },

    {
        id: 5,
        name: "Palit GeForce RTX 4060 Dual 8GB GDDR6",
        image: "/products/palit-rtx-4060.png",
        price: "₹32,499",
        oldPrice: "₹35,999",
        discount: "10% OFF",
        brand: "Palit",
    },

    {
        id: 6,
        name: "Inno3D GeForce RTX 4060 TWIN X2 8GB GDDR6",
        image: "/products/inno3d-rtx-4060.png",
        price: "₹31,999",
        oldPrice: "₹35,499",
        discount: "10% OFF",
        brand: "Inno3D",
    },

    {
        id: 7,
        name: "ASUS TUF Gaming GeForce RTX 4060 8GB GDDR6",
        image: "/products/asus-tuf-rtx-4060.png",
        price: "₹36,999",
        oldPrice: null,
        discount: null,
        brand: "ASUS",
    },

    {
        id: 8,
        name: "Gigabyte RTX 4060 Gaming OC 8GB GDDR6",
        image: "/products/gigabyte-gaming-rtx-4060.png",
        price: "₹38,499",
        oldPrice: "₹42,999",
        discount: "10% OFF",
        brand: "Gigabyte",
    },
];


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
// BRANDS
// ======================================================

const brands = [
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

                <div className="search-box">

                    <input
                        type="text"
                        defaultValue="rtx 4060"
                        placeholder="Search products..."
                    />

                    <button
                        type="button"
                        aria-label="Search"
                    >
                        <Search size={21} />
                    </button>

                </div>


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
                            H
                        </div>

                        <span>
                            Hi, Raghav
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
                                (category, index) => {

                                    const Icon =
                                        category.icon;

                                    return (

                                        <button
                                            type="button"
                                            key={category.name}
                                            className={
                                                index === 0
                                                    ? "category active"
                                                    : "category"
                                            }
                                        >

                                            <Icon size={18} />

                                            <span>
                                                {category.name}
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

                            {brands.map(
                                ([brand, count]) => (

                                    <label
                                        className="brand-filter"
                                        key={brand}
                                    >

                                        <input
                                            type="checkbox"
                                            value={brand}
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
                                Showing 8 results for{" "}
                                <strong>
                                    "rtx 4060"
                                </strong>
                            </p>

                        </div>


                        <button
                            type="button"
                            className="sort-button"
                        >

                            <span>
                                Sort by:
                            </span>

                            <strong>
                                Relevance
                            </strong>

                            <ChevronDown size={17} />

                        </button>

                    </div>


                    {/* ==================================================
                        PRODUCTS
                    ================================================== */}

                    <div className="product-grid">

                        {products.map(
                            (product) => (

                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />

                            )
                        )}

                    </div>


                    {/* ==================================================
                        PAGINATION
                    ================================================== */}

                    <div className="pagination">

                        <button
                            type="button"
                            className="page active-page"
                        >
                            1
                        </button>

                        <button
                            type="button"
                            className="page"
                        >
                            2
                        </button>

                        <button
                            type="button"
                            className="next-page"
                            aria-label="Next page"
                        >
                            →
                        </button>

                    </div>

                </main>

            </div>

        </div>
    );
}


// ======================================================
// PRODUCT CARD
// ======================================================

function ProductCard({ product }) {

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

                <span>
                    8GB GDDR6
                </span>

                <i>
                    |
                </i>

                <span>
                    128-bit
                </span>

                <i>
                    |
                </i>

                <span>
                    DLSS 3
                </span>

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