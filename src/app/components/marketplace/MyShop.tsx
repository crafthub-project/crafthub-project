import { useState } from 'react';
import { Plus, Edit, Trash2, TrendingUp, Package, DollarSign, Clock, BarChart3 } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

const NAVY = '#003366';
const GOLD = '#B48C00';
const GREEN = '#1F5C2E';

type Product = {
  id: number;
  name: string;
  price: number;
  stock: 'inStock' | 'outOfStock';
  orders: number;
  image: string;
  category: string;
};

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Vanilla Cake',        price: 15000, stock: 'inStock',    orders: 12, image: '🍰', category: 'Baking'  },
  { id: 2, name: 'Chocolate Cupcakes',  price: 5000,  stock: 'inStock',    orders: 8,  image: '🧁', category: 'Baking'  },
  { id: 3, name: 'Banana Bread',        price: 10000, stock: 'outOfStock', orders: 5,  image: '🍞', category: 'Baking'  },
];

export default function MyShop() {
  const { t } = useLocale();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const totalEarned = products.reduce((sum, p) => sum + p.price * p.orders, 0);
  const pendingOrders = products.reduce((sum, p) => sum + Math.floor(p.orders * 0.2), 0);
  const activeProducts = products.filter((p) => p.stock === 'inStock').length;

  const addProduct = () => {
    if (!newName.trim() || !newPrice) return;
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newName.trim(),
        price: Number(newPrice),
        stock: 'inStock',
        orders: 0,
        image: '📦',
        category: 'Other',
      },
    ]);
    setNewName('');
    setNewPrice('');
    setShowForm(false);
  };

  const removeProduct = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('myShop')}</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your products, orders, and earnings</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 self-start"
          style={{ backgroundColor: NAVY }}
        >
          <Plus size={16} />
          {t('addProduct')}
        </button>
      </div>

      {/* Add product form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">New Product</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Product name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-slate-400 bg-slate-50"
            />
            <input
              type="number"
              placeholder="Price (UGX)"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-40 px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-slate-400 bg-slate-50"
            />
            <button
              onClick={addProduct}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: GREEN }}
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: t('totalEarned'),    value: `${(totalEarned / 1000).toFixed(0)}K UGX`, color: GOLD,  bg: '#FFFBEB' },
          { icon: Clock,      label: t('pending'),         value: `${pendingOrders} orders`,                 color: '#EA580C', bg: '#FFF7ED' },
          { icon: Package,    label: t('active'),          value: `${activeProducts} products`,              color: GREEN, bg: '#ECFDF5' },
          { icon: BarChart3,  label: 'Total Sales',        value: products.reduce((s,p)=>s+p.orders,0),     color: NAVY,  bg: '#EEF2FF' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Products list */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">{t('myProducts')}</h2>
              <span className="text-xs text-slate-400">{products.length} products</span>
            </div>
            <div className="divide-y divide-slate-50">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ backgroundColor: '#EEF4FB' }}
                  >
                    {product.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{product.name}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: GOLD }}>
                      UGX {product.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={
                          product.stock === 'inStock'
                            ? { backgroundColor: '#ECFDF5', color: '#065F46' }
                            : { backgroundColor: '#FFF7ED', color: '#92400E' }
                        }
                      >
                        {t(product.stock)}
                      </span>
                      <span className="text-xs text-slate-400">{product.orders} {t('orders')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                      aria-label="Edit"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Income tracker */}
          <div
            className="rounded-xl p-5 text-white"
            style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #001F40 100%)` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} style={{ color: GOLD }} />
              <h3 className="font-semibold text-sm">{t('incomeTracker')}</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {(totalEarned / 1000).toFixed(0)}K
              <span className="text-sm font-medium text-slate-300 ml-1">UGX</span>
            </p>
            <p className="text-xs text-slate-300">Total revenue from all products</p>
            <div className="mt-4 space-y-2">
              {products.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{p.name}</span>
                  <span className="font-semibold" style={{ color: GOLD }}>
                    {((p.price * p.orders) / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Seller Tips</h3>
            <div className="space-y-2.5 text-xs text-slate-500">
              <p>📸 Add photos to your listings to get 3× more views</p>
              <p>💬 Reply to customers within 24 hours for better ratings</p>
              <p>🏷️ Offer bundle discounts to increase order value</p>
              <p>⭐ Ask satisfied buyers to leave reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
