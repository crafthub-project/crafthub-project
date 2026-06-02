import { useState, useMemo } from 'react';
import {
  Search,
  Star,
  ShoppingCart,
  Eye,
  ChevronDown,
  Filter,
  X,
  MapPin,
  Package,
  TrendingUp,
} from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

const NAVY = '#003366';
const GOLD = '#B48C00';
const GREEN = '#1F5C2E';

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
  { id: 1,  name: 'Vanilla Cake',       seller: 'Grace',  location: 'Mukono',      price: 15000, rating: 4.8, reviews: 24, image: '🍰', category: 'Baking'      },
  { id: 2,  name: 'Handwoven Basket',   seller: 'Sarah',  location: 'Kampala',     price: 25000, rating: 5.0, reviews: 18, image: '🧺', category: 'Crafts'      },
  { id: 3,  name: 'Natural Soap Pack',  seller: 'Mary',   location: 'Wakiso',      price: 12000, rating: 4.6, reviews: 31, image: '🧼', category: 'Beauty'      },
  { id: 4,  name: 'Cotton Dress',       seller: 'Joy',    location: 'Jinja',       price: 35000, rating: 4.9, reviews: 12, image: '👗', category: 'Tailoring'   },
  { id: 5,  name: 'Scented Candles',    seller: 'Ruth',   location: 'Mukono',      price: 8000,  rating: 4.7, reviews: 45, image: '🕯️', category: 'Crafts'     },
  { id: 6,  name: 'Chocolate Cupcakes', seller: 'Grace',  location: 'Mukono',      price: 5000,  rating: 4.9, reviews: 67, image: '🧁', category: 'Baking'      },
  { id: 7,  name: 'Beaded Necklace',    seller: 'Anita',  location: 'Entebbe',     price: 18000, rating: 4.5, reviews: 22, image: '📿', category: 'Crafts'      },
  { id: 8,  name: 'Fresh Honey',        seller: 'Peter',  location: 'Masaka',      price: 22000, rating: 4.8, reviews: 38, image: '🍯', category: 'Agriculture' },
  { id: 9,  name: 'Braided Wig',        seller: 'Diana',  location: 'Kampala',     price: 45000, rating: 4.9, reviews: 15, image: '💇🏾', category: 'Beauty'  },
  { id: 10, name: 'Tie-Dye Shirt',      seller: 'Alice',  location: 'Mbale',       price: 20000, rating: 4.6, reviews: 29, image: '👕', category: 'Textiles'    },
  { id: 11, name: 'Mushroom Pack',      seller: 'James',  location: 'Fort Portal', price: 9000,  rating: 4.7, reviews: 41, image: '🍄', category: 'Agriculture' },
  { id: 12, name: 'Leather Bag',        seller: 'Brenda', location: 'Kampala',     price: 55000, rating: 4.8, reviews: 8,  image: '👜', category: 'Crafts'      },
  { id: 13, name: 'Chili Sauce',        seller: 'Miriam', location: 'Gulu',        price: 7000,  rating: 4.5, reviews: 53, image: '🌶️', category: 'Food'       },
  { id: 14, name: 'Wooden Bowl',        seller: 'Charles',location: 'Mbarara',     price: 30000, rating: 4.7, reviews: 19, image: '🥣', category: 'Crafts'      },
  { id: 15, name: 'Organic Coffee',     seller: 'Rose',   location: 'Kabale',      price: 18000, rating: 4.9, reviews: 62, image: '☕', category: 'Agriculture' },
  { id: 16, name: 'Embroidered Cloth',  seller: 'Stella', location: 'Soroti',      price: 28000, rating: 4.6, reviews: 14, image: '🎨', category: 'Textiles'    },
];

const FEATURED_SELLER = {
  name: 'Grace Nakato',
  location: 'Mukono District',
  avatar: '👩🏾',
  story: 'Mother of 2, baking delicious treats for the whole community since 2022. Trained through CraftHub and now earning over 300,000 UGX monthly.',
  productsCount: 3,
  totalSales: '1,200+',
  rating: 4.9,
};

const CATEGORIES = ['All', ...Array.from(new Set(ALL_PRODUCTS.map((p) => p.category))).sort()];

const SORT_OPTIONS = [
  { value: 'rating',     label: 'Top Rated' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'reviews',    label: 'Most Reviewed' },
];

const CATEGORY_BG: Record<string, string> = {
  Baking: '#FFF4EF', Crafts: '#EEF4FB', Beauty: '#FDF4FF',
  Tailoring: '#F0FDF4', Textiles: '#FFFBEB', Agriculture: '#F0FFF4',
  Food: '#FFF8EE',
};

function formatUGX(n: number) {
  return `UGX ${n.toLocaleString()}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          fill={i <= Math.round(rating) ? GOLD : 'none'}
          stroke={i <= Math.round(rating) ? GOLD : '#D1D5DB'}
        />
      ))}
    </div>
  );
}

const PAGE_SIZE = 12;

export default function Marketplace() {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [cart, setCart] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let list = ALL_PRODUCTS.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
    return [...list].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      return b.rating - a.rating;
    });
  }, [searchQuery, selectedCategory, sortBy]);

  const visibleProducts = filteredProducts.slice(0, page * PAGE_SIZE);
  const hasMore = visibleProducts.length < filteredProducts.length;

  const toggleCart = (id: number) =>
    setCart((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const uniqueSellers = new Set(ALL_PRODUCTS.map((p) => p.seller)).size;
  const uniqueCategories = new Set(ALL_PRODUCTS.map((p) => p.category)).size;

  return (
    <div className="space-y-6 max-w-screen-2xl">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('shopLocal') || 'Local Marketplace'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Handcrafted goods made by skilled artisans in your community
          </p>
        </div>
        {cart.size > 0 && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold self-start"
            style={{ backgroundColor: GOLD, color: '#fff' }}
          >
            <ShoppingCart size={16} />
            {cart.size} item{cart.size !== 1 ? 's' : ''} in cart
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Package, label: 'Products Listed', value: ALL_PRODUCTS.length, color: NAVY, bg: '#EEF2FF' },
          { icon: TrendingUp, label: 'Active Sellers', value: uniqueSellers, color: GREEN, bg: '#ECFDF5' },
          { icon: Filter, label: 'Categories', value: uniqueCategories, color: GOLD, bg: '#FFFBEB' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: stat.bg }}>
                <Icon size={18} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Seller Banner */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #004D99 60%, ${GREEN} 100%)` }}
      >
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: GOLD }} />
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
        <div className="relative flex items-start gap-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 border-2 border-white/20"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
          >
            {FEATURED_SELLER.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ backgroundColor: GOLD, color: '#fff' }}
              >
                ⭐ Featured Seller
              </span>
            </div>
            <p className="text-white font-bold text-xl leading-tight">{FEATURED_SELLER.name}</p>
            <p className="text-blue-200 text-xs mb-2 flex items-center gap-1">
              <MapPin size={11} /> {FEATURED_SELLER.location}
            </p>
            <p className="text-blue-100 text-sm leading-snug mb-3 max-w-xl">{FEATURED_SELLER.story}</p>
            <div className="flex flex-wrap gap-5 text-xs text-blue-200">
              <span>📦 {FEATURED_SELLER.productsCount} products</span>
              <span>💰 {FEATURED_SELLER.totalSales} sales</span>
              <span>⭐ {FEATURED_SELLER.rating} rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search products, sellers, locations…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all bg-slate-50"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="relative min-w-40">
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-slate-200 text-sm outline-none bg-slate-50 focus:border-slate-400 transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>

          <div className="relative min-w-44">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-slate-200 text-sm outline-none bg-slate-50 focus:border-slate-400 transition-all"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all border"
              style={
                selectedCategory === cat
                  ? { backgroundColor: NAVY, color: '#fff', borderColor: NAVY }
                  : { backgroundColor: '#fff', color: '#475569', borderColor: '#e2e8f0' }
              }
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1 opacity-60">
                  {ALL_PRODUCTS.filter((p) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filteredProducts.length === ALL_PRODUCTS.length
            ? `Showing all ${filteredProducts.length} products`
            : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
        {(searchQuery || selectedCategory !== 'All') && (
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Products grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-semibold text-slate-900 mb-2">No products found</h3>
          <p className="text-sm text-slate-500 mb-4">Try a different search or category.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: NAVY }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleProducts.map((product) => {
              const inCart = cart.has(product.id);
              const cardBg = CATEGORY_BG[product.category] ?? '#F3F4F6';
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all flex flex-col group"
                >
                  {/* Image area */}
                  <div
                    className="h-40 flex items-center justify-center text-6xl relative"
                    style={{ backgroundColor: cardBg }}
                  >
                    {product.image}
                    <span
                      className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: 'rgba(0,0,0,0.12)', color: '#fff' }}
                    >
                      {product.category}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1 group-hover:text-blue-700 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1.5 mb-1">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                        style={{ backgroundColor: NAVY }}
                      >
                        {product.seller[0]}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">{product.seller}</span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <MapPin size={10} className="text-slate-400" />
                      <span className="text-xs text-slate-400">{product.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-3">
                      <StarRating rating={product.rating} />
                      <span className="text-xs font-bold" style={{ color: GOLD }}>
                        {product.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-400">({product.reviews})</span>
                    </div>

                    <p className="text-base font-bold mb-3 mt-auto" style={{ color: NAVY }}>
                      {formatUGX(product.price)}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCart(product.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95"
                        style={{
                          backgroundColor: inCart ? GOLD : NAVY,
                          color: '#fff',
                        }}
                      >
                        <ShoppingCart size={12} />
                        {inCart ? 'Added ✓' : 'Add to Cart'}
                      </button>
                      <button
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors flex-shrink-0"
                        aria-label="View product"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="text-center pt-2">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-8 py-3 rounded-xl font-semibold text-sm transition hover:opacity-90 border-2"
                style={{ borderColor: NAVY, color: NAVY }}
              >
                Load More ({filteredProducts.length - visibleProducts.length} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
