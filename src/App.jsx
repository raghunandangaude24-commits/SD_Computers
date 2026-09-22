import { useState } from 'react'
import './App.css'
import logo from './assets/sd-computers-logo.svg'

const products = [
  ['AMD Ryzen 7 7700X', '8-Core, 16-Thread Processor', '24,999', '29,499', '-15%', 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=500&q=85'],
  ['Gigabyte RTX 4060 Ti', '8GB GDDR6 Graphics Card', '39,999', '45,499', '-12%', 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=85'],
  ['ASUS TUF Gaming B650-Plus', 'WiFi Motherboard', '18,499', '20,499', '-10%', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=85'],
  ['Corsair Vengeance RGB 16GB', '(16GBx1) DDR5 5600MHz', '4,799', '5,999', '-20%', 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=85'],
  ['Samsung 980 Pro 1TB', 'PCIe 4.0 NVMe SSD', '8,999', '10,999', '-18%', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=500&q=85'],
]

const categoryCards = [
  ['Processors', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=300&q=80'],
  ['Motherboards', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80'],
  ['Graphics Cards', products[1][5]],
  ['RAM', products[3][5]],
  ['Storage', products[4][5]],
  ['Power Supplies', 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=300&q=80'],
  ['PC Cases', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=300&q=80'],
  ['Cooling', 'https://images.unsplash.com/photo-1610493985857-4f4f6f9c2f0e?auto=format&fit=crop&w=300&q=80'],
]

const categories = ['Processors (CPU)', 'Motherboards', 'Graphics Cards (GPU)', 'RAM', 'Storage', 'Power Supplies (PSU)', 'Cooling', 'PC Cases', 'Monitors', 'Peripherals', 'Networking', 'Accessories', 'Deals']

const cartItems = [
  {
    name: 'Gigabyte RTX 4060 Ti',
    subtitle: '8GB GDDR6 Graphics Card',
    price: '₹39,999',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80',
    qty: 1,
  },
  {
    name: 'AMD Ryzen 7 7700X',
    subtitle: '8-Core, 16-Thread Processor',
    price: '₹24,999',
    image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=500&q=85',
    qty: 2,
  },
  {
    name: 'Corsair Vengeance RGB 16GB',
    subtitle: '(16GBx1) DDR5 5600MHz',
    price: '₹4,799',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=85',
    qty: 1,
  },
]

const couponFeatures = [
  { icon: '✔', title: 'Secure Checkout', text: 'Your data is safe with us' },
  { icon: '▣', title: 'Fast Delivery', text: 'Quick & reliable shipping' },
  { icon: '◒', title: '24/7 Support', text: 'We’re here to help' },
]

function Header({ onHome, onCart, cartCount, onSearch }) {
  const [query, setQuery] = useState('')

  const submitSearch = () => {
    onSearch(query)
  }

  return (
    <header className="topbar">
      <button className="brand" onClick={onHome} type="button">
        <img className="brand-logo" src={logo} alt="SD Computers logo" />
        <span>
          <strong>SD COMPUTERS</strong>
          <small>BUILD YOUR LEGEND</small>
        </span>
      </button>

      <div className="search">
        <button onClick={() => onSearch('')} type="button">All Categories⌄</button>
        <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && submitSearch()} placeholder="Search for products, brands..." />
        <button onClick={submitSearch} className="search-btn" type="button" aria-label="Search">⌕</button>
      </div>

      <nav className="top-links">
        <span>◉ &nbsp; Track Order</span>
        <span>♡ &nbsp; Wishlist <b>3</b></span>
        <button type="button" className="nav-cart" onClick={onCart}>
          🛒 &nbsp; Cart <b>{cartCount}</b>
        </button>
        <span>◯ &nbsp; Hi, Raghav⌄</span>
      </nav>
    </header>
  )
}

function Benefits() {
  return (
    <section className="benefits">
      <div><i>♢</i><span><strong>100% Genuine Products</strong><small>Trusted & genuine products<br />with warranty</small></span></div>
      <div><i>▱</i><span><strong>Fast Delivery</strong><small>Quick delivery at your<br />doorstep</small></span></div>
      <div><i>♧</i><span><strong>Expert Support</strong><small>Get help from our<br />PC experts</small></span></div>
      <div><i>♙</i><span><strong>Best Prices</strong><small>Competitive prices<br />everyday</small></span></div>
    </section>
  )
}

function Sidebar({ onProduct }) {
  return (
    <aside className="sidebar">
      <div className="category-title">▦ &nbsp; All Categories</div>
      {categories.map((category) => (
        <button key={category} onClick={onProduct} type="button">
          <span>◌</span>
          {category}
        </button>
      ))}
      <div className="build-box">
        <strong>BUILD YOUR PC <em>→</em></strong>
        <small>Not sure what fits best?<br />Use our PC Builder</small>
        <button onClick={onProduct} type="button">Start Building&nbsp; →</button>
        <div className="mini-case">▥</div>
      </div>
    </aside>
  )
}

function ProductCard({ product, onProduct, onAddCart }) {
  return (
    <article className="product-card" onClick={onProduct}>
      <label>{product[4]}</label>
      <img src={product[5]} alt={product[0]} />
      <strong>{product[0]}</strong>
      <small>{product[1]}</small>
      <div className="card-price">₹{product[2]} <del>₹{product[3]}</del><button onClick={(event) => { event.stopPropagation(); onAddCart(product[0]) }} aria-label={`Add ${product[0]} to cart`} type="button">＋</button></div>
    </article>
  )
}

function Home({ onProduct, onCart, onAddCart, searchMessage }) {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [categoryOffset, setCategoryOffset] = useState(0)
  const visibleCategories = categoryCards.slice(categoryOffset, categoryOffset + 8)

  const subscribe = () => {
    setNewsletterMessage(newsletterEmail.includes('@') ? 'Subscribed successfully' : 'Enter a valid email address')
  }

  return (
    <div className="home-layout">
      <Sidebar onProduct={onProduct} />
      <main className="home-main">
        {searchMessage && <div className="home-feedback">{searchMessage}</div>}
        <section className="hero-banner">
          <div>
            <small>NEW ARRIVALS</small>
            <h1>POWER YOUR<br /><b>PERFORMANCE</b></h1>
            <p>Top quality PC components for gamers,<br />creators and professionals.</p>
            <button onClick={onProduct} type="button">Shop Now&nbsp; →</button>
          </div>
          <div className="hero-pc">▦</div>
          <div className="dots">● ● ● ●</div>
        </section>
        <Benefits />
        <section className="section">
          <div className="section-head">
            <h2>SHOP BY CATEGORY</h2>
            <div className="section-actions">
              <button onClick={() => setCategoryOffset(Math.max(0, categoryOffset - 1))} type="button" aria-label="Previous categories">‹</button>
              <button onClick={() => setCategoryOffset(categoryOffset >= categoryCards.length - 8 ? 0 : categoryOffset + 1)} type="button" aria-label="Next categories">›</button>
            </div>
          </div>
          <div className="category-grid">
            {visibleCategories.map(([name, image]) => (
              <button key={name} onClick={onProduct} type="button">
                <img src={image} alt="" />
                <strong>{name}</strong>
              </button>
            ))}
          </div>
        </section>
        <section className="section deals">
          <div className="section-head">
            <h2>DEALS OF THE DAY</h2>
            <button onClick={onProduct} className="view-deals" type="button">View All Deals&nbsp; →</button>
          </div>
          <div className="products">
            {products.map((product) => (
              <ProductCard key={product[0]} product={product} onProduct={onProduct} onAddCart={onAddCart} />
            ))}
          </div>
        </section>
      </main>
      <aside className="right-rail">
        <div className="rail-builder">
          <strong>PC BUILDER</strong>
          <small>Select components and<br />build your dream PC</small>
          <div>▥</div>
          <button onClick={onProduct} type="button">Start Building&nbsp; →</button>
        </div>
        <div className="newsletter">
          <strong>NEWSLETTER</strong>
          <small>Get updates on new arrivals<br />and exclusive offers</small>
          <input value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder="Enter your email" aria-label="Newsletter email" />
          <button onClick={subscribe} type="button">Subscribe</button>
          {newsletterMessage && <small className="newsletter-message">{newsletterMessage}</small>}
        </div>
        <div className="mini-cart-cta">
          <strong>CART</strong>
          <small>2 items ready for checkout</small>
          <button onClick={onCart} type="button">View Cart&nbsp; →</button>
        </div>
      </aside>
    </div>
  )
}

function ProductDetail() {
  const [quantity, setQuantity] = useState(1)
  const gpu = products[1]

  return (
    <>
      <div className="breadcrumbs">Home &nbsp;›&nbsp; Graphics Cards (GPU) &nbsp;›&nbsp; NVIDIA GeForce RTX 4060 Ti</div>
      <main className="detail-page">
        <div className="thumbs">
          {products.slice(1, 5).map((product, index) => (
            <button className={index === 0 ? 'active' : ''} key={product[0]} type="button">
              <img src={product[5]} alt="" />
            </button>
          ))}
          <button className="video-thumb" type="button">▷<small>1:02</small></button>
        </div>

        <div className="main-image">
          <img src={gpu[5]} alt={gpu[0]} />
          <button type="button">⛶</button>
        </div>

        <section className="product-info">
          <small className="eyebrow">GIGABYTE</small>
          <h1>Gigabyte GeForce RTX 4060 Ti<br />Gaming OC 8GB GDDR6 Graphics Card</h1>
          <div className="rating">★★★★★ <span>4.6 &nbsp;(128 reviews) &nbsp;&nbsp; | &nbsp;&nbsp;250+ bought in past month</span></div>
          <div className="detail-price">₹39,999 <b>-12%</b><del>₹45,499</del> <small>(Inclusive of all taxes)</small></div>
          <div className="stock"><strong>◉ &nbsp; In Stock</strong><span>Ships within 24 hours</span></div>
          <h3>Key Features</h3>
          <ul>
            <li>8GB GDDR6 Memory</li>
            <li>Boost Clock 2595 MHz</li>
            <li>PCI Express 4.0</li>
            <li>WINDFORCE 3X Cooling System</li>
            <li>Ray Tracing & DLSS 3</li>
            <li>3 x DisplayPort 1.4a, 1 x HDMI 2.1a</li>
          </ul>
          <div className="assurances">
            <span>♢ <small>1 Year<br />Warranty</small></span>
            <span>◌ <small>7 Days<br />Replacement</small></span>
            <span>▱ <small>Secure<br />Payment</small></span>
            <span>♢ <small>100%<br />Authentic</small></span>
          </div>
        </section>

        <aside className="buy-panel">
          <div className="quantity">
            <strong>Quantity</strong>
            <span>
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button">-</button>
              {quantity}
              <button onClick={() => setQuantity((value) => value + 1)} type="button">+</button>
            </span>
          </div>
          <button className="add" type="button">🛒 &nbsp; Add to Cart</button>
          <button className="buy" type="button">ϟ &nbsp; Buy Now</button>
          <div className="delivery">
            <strong>▱ &nbsp; Check Delivery</strong>
            <div>
              <input placeholder="Enter your pincode" />
              <b>Check</b>
            </div>
          </div>
          <div className="payment-box">
            <strong>Secure Payment</strong>
            <div><span>VISA</span><span>MasterCard</span><span>PayPal</span></div>
          </div>
        </aside>
      </main>
    </>
  )
}

function CartPage({ onHome }) {
  const [items, setItems] = useState(cartItems)
  const [selectedItems, setSelectedItems] = useState(() => new Set(cartItems.map((item) => item.name)))
  const [coupon, setCoupon] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const selected = items.filter((item) => selectedItems.has(item.name))
  const subtotal = selected.reduce((sum, item) => sum + Number(item.price.replace(/[₹,]/g, '')) * item.qty, 0)
  const discount = Math.min(5000 + couponDiscount, subtotal)
  const total = subtotal - discount
  const allSelected = items.length > 0 && selectedItems.size === items.length

  const toggleItem = (name) => {
    setSelectedItems((current) => {
      const next = new Set(current)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
    setCheckoutMessage('')
  }

  const updateQuantity = (name, change) => {
    setItems((current) => current.map((item) => item.name === name
      ? { ...item, qty: Math.max(1, item.qty + change) }
      : item))
    setCheckoutMessage('')
  }

  const removeItem = (name) => {
    setItems((current) => current.filter((item) => item.name !== name))
    setSelectedItems((current) => {
      const next = new Set(current)
      next.delete(name)
      return next
    })
  }

  const toggleAll = () => {
    setSelectedItems(allSelected ? new Set() : new Set(items.map((item) => item.name)))
    setCheckoutMessage('')
  }

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'SAVE10') {
      setCouponDiscount(Math.round(subtotal * 0.1))
      setCouponMessage('Coupon applied: 10% extra discount')
    } else {
      setCouponDiscount(0)
      setCouponMessage('Try coupon code SAVE10')
    }
  }

  const proceedToCheckout = () => {
    if (!selected.length) {
      setCheckoutMessage('Select at least one item to continue')
      return
    }
    setCheckoutMessage(`Ready for checkout: ${selected.length} item${selected.length === 1 ? '' : 's'}`)
  }

  return (
    <div className="cart-page-wrap">
      <div className="page-header">
        <div className="cart-icon">🛒</div>
        <div>
          <h1>Shopping Cart</h1>
          <p>{items.length} items in your cart</p>
        </div>
      </div>

      <div className="cart-layout">
        <section className="items-panel">
          <div className="items-header">
            <button className={`check-all ${allSelected ? 'checked' : ''}`} onClick={toggleAll} type="button" aria-label="Select all items">{allSelected ? '✓' : ''}</button>
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span>Remove</span>
          </div>

          {items.length === 0 && <div className="empty-cart">Your cart is empty. Continue shopping to add products.</div>}

          {items.map((item) => (
            <div className="cart-item" key={item.name}>
              <button className={`select-box ${selectedItems.has(item.name) ? 'checked' : ''}`} onClick={() => toggleItem(item.name)} type="button" aria-label={`Select ${item.name}`}>
                {selectedItems.has(item.name) ? '✓' : ''}
              </button>

              <div className="product-cell">
                <img src={item.image} alt={item.name} />
                <div className="product-meta">
                  <h3>{item.name}</h3>
                  <p>{item.subtitle}</p>
                  <span className="stock">In Stock</span>
                </div>
              </div>

              <div className="price-box">{item.price}</div>

              <div className="qty-box">
                <button onClick={() => updateQuantity(item.name, -1)} type="button" aria-label={`Decrease ${item.name} quantity`}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQuantity(item.name, 1)} type="button" aria-label={`Increase ${item.name} quantity`}>+</button>
              </div>

              <div className="total-box">₹{(Number(item.price.replace(/[₹,]/g, '')) * item.qty).toLocaleString('en-IN')}</div>
              <button onClick={() => removeItem(item.name)} type="button" className="remove-btn" aria-label={`Remove ${item.name}`}>🗑</button>
            </div>
          ))}

          <div className="coupon-box">
            <div className="coupon-head">
              <h3>Coupon Code</h3>
              <p>Have a coupon? Apply it here to get a discount.</p>
            </div>

            <div className="coupon-row">
              <input value={coupon} onChange={(event) => setCoupon(event.target.value)} type="text" placeholder="Enter coupon code" aria-label="Coupon code" />
              <button onClick={applyCoupon} type="button">Apply</button>
            </div>
            {couponMessage && <p className="cart-feedback">{couponMessage}</p>}

            <div className="feature-row">
              {couponFeatures.map((feature) => (
                <div className="feature-item" key={feature.title}>
                  <div className="feature-icon">{feature.icon}</div>
                  <div>
                    <strong>{feature.title}</strong>
                    <small>{feature.text}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="summary-panel">
          <div className="summary-head">
            <span className="bag-icon">🛒</span>
            <h2>Order Summary</h2>
          </div>

          <div className="summary-row">
            <span>Subtotal ({selected.length} items)</span>
            <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery Charges</span>
            <strong className="free">FREE</strong>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <strong className="discount">- ₹{discount.toLocaleString('en-IN')}</strong>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <strong>₹{total.toLocaleString('en-IN')}</strong>
          </div>

          <button onClick={proceedToCheckout} type="button" className="checkout-btn" disabled={!items.length}>Proceed to Checkout →</button>
          {checkoutMessage && <p className="cart-feedback checkout-feedback">{checkoutMessage}</p>}

          <div className="payment-row">
            <span>100% Secure Payments</span>
            <div className="payment-icons">
              {['VISA', 'MasterCard', 'G Pay', 'PayPal'].map((method) => <button key={method} type="button" onClick={() => setCheckoutMessage(`${method} selected for payment`)}>{method}</button>)}
            </div>
          </div>
        </aside>
      </div>

      <div className="back-home-row">
        <button type="button" onClick={onHome}>Continue Shopping →</button>
      </div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState('home')
  const [cartCount, setCartCount] = useState(2)
  const [searchMessage, setSearchMessage] = useState('')

  const addToCart = (productName) => {
    setCartCount((count) => count + 1)
    setSearchMessage(`${productName} added to your cart`)
  }

  const searchProducts = (query) => {
    setSearchMessage(query ? `Searching for "${query}"` : 'Showing all product categories')
    setPage('home')
  }

  return (
    <div className="app">
      <Header onHome={() => setPage('home')} onCart={() => setPage('cart')} cartCount={cartCount} onSearch={searchProducts} />
      {page === 'home' && <Home onProduct={() => setPage('product')} onCart={() => setPage('cart')} onAddCart={addToCart} searchMessage={searchMessage} />}
      {page === 'product' && <ProductDetail />}
      {page === 'cart' && <CartPage onHome={() => setPage('home')} />}
    </div>
  )
}

export default App
