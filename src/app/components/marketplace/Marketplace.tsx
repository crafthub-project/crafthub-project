import { useState, useMemo } from 'react';
import { Search, Star, ShoppingCart, Eye, ChevronDown } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

type Product = {
  id: number;
  name: string;
  seller: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
};

const ALL_PRODUCTS: Product[] = [
  { id: 1,  name: 'Vanilla Cake',       seller: 'Grace',  location: 'Mukono',     price: 15000, rating: 4.8, reviews: 24, image: '🍰',  category: 'Baking'      },
  { id: 2,  name: 'Handwoven Basket',   seller: 'Sarah',  location: 'Kampala',    price: 25000, rating: 5.0, reviews: 18, image: '🧺',  category: 'Crafts'      },
  { id: 3,  name: 'Natural Soap Pack',  seller: 'Mary',   location: 'Wakiso',     price: 12000, rating: 4.6, reviews: 31, image: '🧼',  category: 'Beauty'      },
  { id: 4,  name: 'Cotton Dress',       seller: 'Joy',    location: 'Jinja',      price: 35000, rating: 4.9, reviews: 12, image: '👗',  category: 'Tailoring'   },
  { id: 5,  name: 'Scented Candles',    seller: 'Ruth',   location: 'Mukono',     price: 8000,  rating: 4.7, reviews: 45, image: '🕯️', category: 'Crafts'      },
  { id: 6,  name: 'Chocolate Cupcakes', seller: 'Grace',  location: 'Mukono',     price: 5000,  rating: 4.9, reviews: 67, image: '🧁',  category: 'Baking'      },
  { id: 7,  name: 'Beaded Necklace',    seller: 'Anita',  location: 'Entebbe',    price: 18000, rating: 4.5, reviews: 22, image: '📿',  category: 'Crafts'      },
  { id: 8,  name: 'Fresh Honey',        seller: 'Peter',  location: 'Masaka',     price: 22000, rating: 4.8, reviews: 38, image: '🍯',  category: 'Agriculture' },
  { id: 9,  name: 'Braided Wig',        seller: 'Diana',  location: 'Kampala',    price: 45000, rating: 4.9, reviews: 15, image: '💇🏾', category: 'Beauty'     },
  { id: 10, name: 'Tie-Dye Shirt',      seller: 'Alice',  location: 'Mbale',      price: 20000, rating: 4.6, reviews: 29, image: '👕',  category: 'Textiles'    },
  { id: 11, name: 'Mushroom Pack',      seller: 'James',  location: 'Fort Portal', price: 9000, rating: 4.7, reviews: 41, image: '🍄',  category: 'Agriculture' },
  { id: 12, name: 'Leather Bag',        seller: 'Brenda', location: 'Kampala',    price: 55000, rating: 4.8, reviews: 8,  image: '👜',  category: 'Crafts'      },
];

const FEATURED_SELLER = {
  name: 'Grace',
  location: 'Mukono',
  avatar: '👩🏾',
  story: 'Mother of 2, baking delicious treats for the whole community since 2022.',
  productsCount: 3,
  totalSales: '1,200+',
  rating: 4.9,
};

const CATEGORIES = ['All', ...Array.from(new Set(ALL_PRODUCTS.map((p) => p.category))).sort()];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'reviews', label: 'Most Reviewed' },
];

function formatUGX(amount: number): string {
  return `UGX ${amount.toLocaleString()}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          fill={i <= Math.round(rating) ? '#B48C00' : 'none'}
          stroke={i <= Math.round(rating) ? '#B48C00' : '#D1D5DB'}
        />
      ))}
    </div>
  );
}

const CATEGORY_BG: Record<string, string> = {
  Baking:      '#FFF4EF',
  Crafts:      '#EEF4FB',
  Beauty:      '#FDF4FF',
  Tailoring:   '#F0FDF4',
  Textiles:    '#FFFBEB',
  Agriculture: '#F0FFF4',
};

function getEmojiCardBg(category: string): string {
  return CATEGORY_BG[category] ?? '#F3F4F6';
}

const PAGE_SIZE = 8;

export default function Marketplace() {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [cart, setCart] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let list = ALL_PRODUCTS.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      return b.rating - a.rating;
    });

    return list;
  }, [searchQuery, selectedCategory, sortBy]);

  const visibleProducts = filteredProducts.slice(0, page * PAGE_SIZE);
  const hasMore = visibleProducts.length < filteredProducts.length;

  const toggleCart = (id: number) => {
    setCart((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const uniqueSellers = new Set(ALL_PRODUCTS.map((p) => p.seller)).size;
  const uniqueCategories = new Set(ALL_PRODUCTS.map((p) => p.category)).size;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--off-white)' }}>
      {/* Header */}
      <div
        className="px-5 pt-6 pb-5"
        style={{ backgroundColor: 'var(--navy)' }}
      >
        <h1
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {t('shopLocal') || '🛍️ Local Marketplace'}
        </h1>
        <p className="text-sm text-blue-200">
          Handcrafted goods made by skilled artisans in your community
        </p>

        <div className="flex gap-4 mt-4">
          {[
            { label: 'Products', value: ALL_PRODUCTS.length },
            { label: 'Sellers', value: uniqueSellers },
            { label: 'Categories', value: uniqueCategories },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex-1 rounded-xl py-2 text-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-xs text-blue-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search + filters */}
      <div className="px-5 py-4 space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--muted-foreground)' }}
          />
          <input
            type="text"
            placeholder="Search products, sellers, locations…"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none focus:ring-2"
            style={{
              backgroundColor: 'white',
              borderColor: 'var(--border)',
              color: 'var(--charcoal)',
            }}
          />
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border text-sm outline-none"
              style={{
                backgroundColor: 'white',
                borderColor: 'var(--border)',
                color: 'var(--charcoal)',
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--muted-foreground)' }}
            />
          </div>

          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border text-sm outline-none"
              style={{
                backgroundColor: 'white',
                borderColor: 'var(--border)',
                color: 'var(--charcoal)',
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--muted-foreground)' }}
            />
          </div>
        </div>
      </div>

      {/* Featured Seller Banner */}
      <div className="px-5 mb-5">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, var(--navy) 0%, #004D99 60%, var(--green) 100%)',
          }}
        >
          <div
            className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10"
            style={{ backgroundColor: 'var(--gold)' }}
          />
          <div
            className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-10"
            style={{ backgroundColor: 'white' }}
          />

          <div className="relative flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              {FEATURED_SELLER.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--gold)', color: 'white' }}
                >
                  ⭐ Featured Seller
                </span>
              </div>
              <p className="text-white font-bold text-lg leading-tight">{FEATURED_SELLER.name}</p>
              <p className="text-blue-200 text-xs mb-2">{FEATURED_SELLER.location}</p>
              <p className="text-blue-100 text-sm leading-snug mb-3">{FEATURED_SELLER.story}</p>
              <div className="flex gap-4 text-xs text-blue-200">
                <span>📦 {FEATURED_SELLER.productsCount} products</span>
                <span>💰 {FEATURED_SELLER.totalSales} sales</span>
                <span>⭐ {FEATURED_SELLER.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold" style={{ color: 'var(--navy)' }}>
            {filteredProducts.length > 0
              ? `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
              : 'No products found'}
          </h2>
          {cart.size > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: 'var(--gold)', color: 'white' }}
            >
              <ShoppingCart size={13} />
              {cart.size} in cart
            </div>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ backgroundColor: 'white' }}
          >
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold mb-1" style={{ color: 'var(--navy)' }}>
              No products found
            </p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Try a different search or category
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleProducts.map((product) => {
                const inCart = cart.has(product.id);
                return (
                  <div
                    key={product.id}
                    className="rounded-2xl overflow-hidden shadow-sm flex flex-col transition-shadow hover:shadow-md"
                    style={{ backgroundColor: 'white' }}
                  >
                    <div
                      className="h-36 flex items-center justify-center text-6xl"
                      style={{ backgroundColor: getEmojiCardBg(product.category) }}
                    >
                      {product.image}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className="font-bold text-sm leading-snug"
                          style={{ color: 'var(--charcoal)' }}
                        >
                          {product.name}
                        </h3>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                          style={{
                            backgroundColor: 'var(--card-bg)',
                            color: 'var(--navy)',
                          }}
                        >
                          {product.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            backgroundColor: 'var(--navy)',
                            color: 'white',
                          }}
                        >
                          {product.seller[0]}
                        </div>
                        <span
                          className="text-xs font-medium"
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {product.seller}
                        </span>
                      </div>

                      <div className="mb-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: 'var(--success)',
                            color: 'var(--green)',
                          }}
                        >
                          📍 {product.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-3">
                        <StarRating rating={product.rating} />
                        <span
                          className="text-xs font-bold"
                          style={{ color: 'var(--gold)' }}
                        >
                          {product.rating.toFixed(1)}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          ({product.reviews})
                        </span>
                      </div>

                      <p
                        className="text-base font-bold mb-3"
                        style={{ color: 'var(--navy)' }}
                      >
                        {formatUGX(product.price)}
                      </p>

                      <div className="flex gap-2 mt-auto">
                        <button
                          type="button"
                          onClick={() => toggleCart(product.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                          style={{
                            backgroundColor: inCart ? 'var(--gold)' : 'var(--navy)',
                            color: 'white',
                          }}
                        >
                          <ShoppingCart size={13} />
                          {inCart ? 'Added' : 'Add to Cart'}
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center w-9 h-9 rounded-xl transition hover:opacity-70"
                          style={{
                            backgroundColor: 'var(--card-bg)',
                            color: 'var(--navy)',
                          }}
                          aria-label="View product"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="px-8 py-3 rounded-xl font-semibold text-sm transition hover:opacity-80"
                  style={{ backgroundColor: 'var(--navy)', color: 'white' }}
                >
                  Load More ({filteredProducts.length - visibleProducts.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
