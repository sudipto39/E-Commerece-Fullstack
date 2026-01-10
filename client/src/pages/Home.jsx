import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import api from '../utils/axios';
import { SHOE_CATEGORIES } from '../utils/config';

const MAX_RETRIES = 3;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.data);
      setRetryCount(0); // reset on success
    } catch (err) {
      // Render cold-start handling
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(fetchProducts, 2000); // retry after 2s
      } else {
        setError('Failed to fetch products. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [filters, retryCount]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // ---------------- UI STATES ----------------

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {retryCount > 0
            ? 'Waking up server, please wait...'
            : 'Loading products...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => {
            setRetryCount(0);
            fetchProducts();
          }}
          className="mt-4 btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ---------------- MAIN UI ----------------

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search shoes..."
                className="input pl-10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Category */}
          <div className="w-full md:w-48">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">All Categories</option>
              {SHOE_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="flex gap-2">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min"
              className="input w-24"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max"
              className="input w-24"
            />
          </div>
        </div>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No products found
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <Link key={product._id} to={`/products/${product._id}`} className="card group">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  onError={(e) => {
                    e.target.src =
                      'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium">{product.name}</h3>
                <p className="text-gray-500">{product.brand}</p>
                <div className="flex justify-between mt-2">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <span className="text-sm">{product.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
