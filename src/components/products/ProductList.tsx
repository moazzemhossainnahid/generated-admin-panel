'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Upload,
  Download
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import { Product, ProductFilter } from '@/types/products';
import React from 'react';

interface ProductListProps {
  initialProducts: Product[];
  initialTotal: number;
  initialFilter: ProductFilter;
}

const ProductList: React.FC<ProductListProps> = ({ 
  initialProducts,
  initialTotal,
  initialFilter
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filter, setFilter] = useState<ProductFilter>(initialFilter);
  const [searchQuery, setSearchQuery] = useState(initialFilter.search || '');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [total, setTotal] = useState(initialTotal);
  const [productCounts, setProductCounts] = useState({
    all: initialTotal,
    published: 0,
    draft: 0,
    trash: 0
  });
  const [loading, setLoading] = useState(false);

  // Fetch product counts for each status
  useEffect(() => {
    // In a real app, you would fetch this from your API
    // For now, calculate from the initial data
    const counts = {
      all: initialTotal,
      published: initialProducts.filter(p => p.status === 'published').length,
      draft: initialProducts.filter(p => p.status === 'draft').length,
      trash: initialProducts.filter(p => p.status === 'trash').length
    };
    setProductCounts(counts);
  }, [initialProducts, initialTotal]);

  // Handle filter changes
  const handleStatusFilter = (status: 'all' | 'published' | 'draft' | 'trash') => {
    const newFilter = { ...filter, status, page: 1 };
    setFilter(newFilter);
    fetchProducts(newFilter);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilter = { ...filter, search: searchQuery, page: 1 };
    setFilter(newFilter);
    fetchProducts(newFilter);
  };

  // Handle bulk action
  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) {
      toast.warning('No items selected');
      return;
    }

    let confirmMessage = '';
    let successMessage = '';

    switch (action) {
      case 'trash':
        confirmMessage = `Are you sure you want to move ${selectedItems.length} product(s) to trash?`;
        successMessage = `Successfully moved ${selectedItems.length} product(s) to trash`;
        break;
      case 'restore':
        confirmMessage = `Are you sure you want to restore ${selectedItems.length} product(s)?`;
        successMessage = `Successfully restored ${selectedItems.length} product(s)`;
        break;
      case 'delete':
        confirmMessage = `Are you sure you want to permanently delete ${selectedItems.length} product(s)? This action cannot be undone.`;
        successMessage = `Successfully deleted ${selectedItems.length} product(s)`;
        break;
      default:
        return;
    }

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    // In a real app, you would make an API call here
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update UI based on action
      let updatedProducts = [...products];
      
      if (action === 'trash') {
        updatedProducts = products.map(product => 
          selectedItems.includes(product.id) ? { ...product, status: 'trash' } : product
        );
      } else if (action === 'restore') {
        updatedProducts = products.map(product => 
          selectedItems.includes(product.id) ? { ...product, status: 'draft' } : product
        );
      } else if (action === 'delete') {
        updatedProducts = products.filter(product => !selectedItems.includes(product.id));
      }
      
      setProducts(updatedProducts);
      setSelectedItems([]);
      toast.success(successMessage);
      setLoading(false);
      
      // Recalculate counts
      const counts = {
        all: updatedProducts.length,
        published: updatedProducts.filter(p => p.status === 'published').length,
        draft: updatedProducts.filter(p => p.status === 'draft').length,
        trash: updatedProducts.filter(p => p.status === 'trash').length
      };
      setProductCounts(counts);
      setTotal(updatedProducts.length);
    }, 800);
  };

  // Handle individual item actions
  const handleItemAction = (id: string, action: 'view' | 'edit' | 'trash' | 'delete') => {
    if (action === 'trash' || action === 'delete') {
      const product = products.find(p => p.id === id);
      const confirmMessage = action === 'trash' 
        ? `Are you sure you want to move "${product?.name}" to trash?`
        : `Are you sure you want to permanently delete "${product?.name}"? This action cannot be undone.`;
      
      const confirmed = window.confirm(confirmMessage);
      if (!confirmed) return;
      
      // In a real app, you would make an API call here
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        let updatedProducts = [...products];
        
        if (action === 'trash') {
          updatedProducts = products.map(product => 
            product.id === id ? { ...product, status: 'trash' } : product
          );
        } else if (action === 'delete') {
          updatedProducts = products.filter(product => product.id !== id);
        }
        
        setProducts(updatedProducts);
        toast.success(action === 'trash' ? 'Product moved to trash' : 'Product deleted');
        setLoading(false);
        
        // Recalculate counts
        const counts = {
          all: updatedProducts.length,
          published: updatedProducts.filter(p => p.status === 'published').length,
          draft: updatedProducts.filter(p => p.status === 'draft').length,
          trash: updatedProducts.filter(p => p.status === 'trash').length
        };
        setProductCounts(counts);
        setTotal(updatedProducts.length);
      }, 800);
    }
  };

  // Handle selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(products.map(product => product.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const newFilter = { ...filter, page };
    setFilter(newFilter);
    fetchProducts(newFilter);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const limit = Number(e.target.value);
    const newFilter = { ...filter, limit, page: 1 };
    setFilter(newFilter);
    fetchProducts(newFilter);
  };

  // Handle category filter
  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    const newFilter = { ...filter, category: category === 'all' ? undefined : category, page: 1 };
    setFilter(newFilter);
    fetchProducts(newFilter);
  };

  // Fetch products based on filter
  const fetchProducts = (newFilter: ProductFilter) => {
    setLoading(true);
    
    // In a real app, you would make an API call here
    // For now, simulate filtering on client side
    setTimeout(() => {
      let filtered = [...initialProducts];
      
      // Apply status filter
      if (newFilter.status && newFilter.status !== 'all') {
        filtered = filtered.filter(product => product.status === newFilter.status);
      }
      
      // Apply search filter
      if (newFilter.search) {
        const search = newFilter.search.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(search) || 
          product.id.toLowerCase().includes(search)
        );
      }
      
      // Apply category filter
      if (newFilter.category) {
        filtered = filtered.filter(product => 
          product.categories.some(cat => cat.id === newFilter.category || cat.name.toLowerCase() === newFilter.category?.toLowerCase())
        );
      }
      
      // Apply sorting
      if (newFilter.sort) {
        filtered.sort((a, b) => {
          const direction = newFilter.sortDirection === 'desc' ? -1 : 1;
          
          switch (newFilter.sort) {
            case 'name':
              return direction * a.name.localeCompare(b.name);
            case 'price':
              return direction * (a.regularPrice - b.regularPrice);
            case 'date':
              return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            default:
              return 0;
          }
        });
      }
      
      // Apply pagination
      const startIndex = (newFilter.page - 1) * newFilter.limit;
      const paginatedProducts = filtered.slice(startIndex, startIndex + newFilter.limit);
      
      setProducts(paginatedProducts);
      setTotal(filtered.length);
      setLoading(false);
    }, 500);
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
      case 'published':
        bgColor = 'bg-[#E6F6EE]';
        textColor = 'text-[#0D894F]';
        break;
      case 'draft':
        bgColor = 'bg-[#FFF4EB]';
        textColor = 'text-[#E46A11]';
        break;
      case 'trash':
        bgColor = 'bg-[#FFEAED]';
        textColor = 'text-[#F04438]';
        break;
      default:
        bgColor = 'bg-[#DCE8F8]';
        textColor = 'text-[#007BF9]';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${bgColor} ${textColor} capitalize`}>
        {status}
      </span>
    );
  };

  // Calculate pagination
  const totalPages = Math.ceil(total / filter.limit);

  // Determine which bulk actions to show based on status filter
  const getBulkActions = () => {
    switch (filter.status) {
      case 'trash':
        return (
          <select 
            className="bulk-action-select border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
            disabled={selectedItems.length === 0 || loading}
            onChange={(e) => handleBulkAction(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Bulk Actions</option>
            <option value="restore">Restore</option>
            <option value="delete">Permanently Delete</option>
          </select>
        );
      case 'draft':
        return (
          <select 
            className="bulk-action-select border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
            disabled={selectedItems.length === 0 || loading}
            onChange={(e) => handleBulkAction(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Bulk Actions</option>
            <option value="trash">Move to Trash</option>
          </select>
        );
      default:
        return (
          <select 
            className="bulk-action-select border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
            disabled={selectedItems.length === 0 || loading}
            onChange={(e) => handleBulkAction(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Bulk Actions</option>
            <option value="trash">Move to Trash</option>
          </select>
        );
    }
  };

  return (
    <div className="product-list">
      {/* Status Filter Links */}
      <div className="product-list__status-filters flex border-b border-[#E4E7EB] mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter.status === 'all' || !filter.status
              ? 'border-[#007BF9] text-[#007BF9]'
              : 'border-transparent text-[#49617E] hover:text-[#007BF9]'
          }`}
          onClick={() => handleStatusFilter('all')}
        >
          All Products ({productCounts.all})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter.status === 'published'
              ? 'border-[#007BF9] text-[#007BF9]'
              : 'border-transparent text-[#49617E] hover:text-[#007BF9]'
          }`}
          onClick={() => handleStatusFilter('published')}
        >
          Published ({productCounts.published})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter.status === 'draft'
              ? 'border-[#007BF9] text-[#007BF9]'
              : 'border-transparent text-[#49617E] hover:text-[#007BF9]'
          }`}
          onClick={() => handleStatusFilter('draft')}
        >
          Draft ({productCounts.draft})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter.status === 'trash'
              ? 'border-[#007BF9] text-[#007BF9]'
              : 'border-transparent text-[#49617E] hover:text-[#007BF9]'
          }`}
          onClick={() => handleStatusFilter('trash')}
        >
          Trash ({productCounts.trash})
        </button>
      </div>
      
      {/* Search & Action Buttons */}
      <div className="product-list__header mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="product-list__search flex-1 max-w-md">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or product ID..."
                className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-sm"
              />
            </div>
            <Button type="submit" size="md" className="rounded-l-none">
              Search
            </Button>
          </form>
        </div>
        
        <div className="product-list__actions flex flex-wrap gap-3">
          <Link href="/admin/products/new">
            <Button leftIcon={<Plus size={16} />}>
              Add New Product
            </Button>
          </Link>
          <Button variant="outline" leftIcon={<Download size={16} />}>
            Export Products
          </Button>
          <Button variant="outline" leftIcon={<Upload size={16} />}>
            Import Products
          </Button>
        </div>
      </div>
      
      {/* Bulk Actions & Category Filter */}
      <div className="product-list__filters mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="product-list__bulk-actions flex items-center gap-2">
          {getBulkActions()}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const selectEl = document.querySelector('.bulk-action-select') as HTMLSelectElement;
              if (selectEl && selectEl.value) {
                handleBulkAction(selectEl.value);
              } else {
                toast.warning('Please select an action');
              }
            }}
            disabled={selectedItems.length === 0 || loading}
          >
            Apply
          </Button>
          
          {selectedItems.length > 0 && (
            <span className="text-sm text-[#49617E]">
              {selectedItems.length} item(s) selected
            </span>
          )}
        </div>
        
        <div className="product-list__category-filter flex items-center gap-2">
          <select
            className="border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
            value={filter.category || 'all'}
            onChange={handleCategoryFilter}
          >
            <option value="all">Select Category</option>
            <option value="invitation-card">Invitation Card</option>
            <option value="business-card">Business Card</option>
            <option value="brochure">Brochure</option>
            <option value="flyer">Flyer</option>
            <option value="poster">Poster</option>
          </select>
        </div>
      </div>
      
      {/* Products Table */}
      <div className="product-list__table bg-white rounded-md border border-[#E4E7EB] overflow-hidden mb-4">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full"></div>
          </div>
        )}
        
        <div className="relative overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FA] border-b border-[#E4E7EB]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-[#E4E7EB]"
                    disabled={products.length === 0 || loading}
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Image</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">
                  <button 
                    className="flex items-center"
                    onClick={() => {
                      const newSort = filter.sort === 'name' && filter.sortDirection === 'asc' ? 'desc' : 'asc';
                      const newFilter = { ...filter, sort: 'name', sortDirection: newSort as 'asc' | 'desc' };
                      setFilter(newFilter);
                      fetchProducts(newFilter);
                    }}
                  >
                    Product Name
                    {filter.sort === 'name' && (
                      <ChevronDown 
                        size={16} 
                        className={`ml-1 transition-transform ${filter.sortDirection === 'desc' ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">
                  <button 
                    className="flex items-center"
                    onClick={() => {
                      const newSort = filter.sort === 'price' && filter.sortDirection === 'asc' ? 'desc' : 'asc';
                      const newFilter = { ...filter, sort: 'price', sortDirection: newSort as 'asc' | 'desc' };
                      setFilter(newFilter);
                      fetchProducts(newFilter);
                    }}
                  >
                    Price
                    {filter.sort === 'price' && (
                      <ChevronDown 
                        size={16} 
                        className={`ml-1 transition-transform ${filter.sortDirection === 'desc' ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Categories</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">
                  <button 
                    className="flex items-center"
                    onClick={() => {
                      const newSort = filter.sort === 'date' && filter.sortDirection === 'asc' ? 'desc' : 'asc';
                      const newFilter = { ...filter, sort: 'date', sortDirection: newSort as 'asc' | 'desc' };
                      setFilter(newFilter);
                      fetchProducts(newFilter);
                    }}
                  >
                    Created At
                    {filter.sort === 'date' && (
                      <ChevronDown 
                        size={16} 
                        className={`ml-1 transition-transform ${filter.sortDirection === 'desc' ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr 
                    key={product.id} 
                    className="border-b border-[#E4E7EB] hover:bg-[#F8F9FA] group relative"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(product.id)}
                        onChange={() => handleSelectItem(product.id)}
                        className="rounded border-[#E4E7EB]"
                        disabled={loading}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {product.featuredImage ? (
                        <div className="w-12 h-12 rounded overflow-hidden">
                          <Image
                            src={product.featuredImage}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded bg-[#F5F5F5] flex items-center justify-center text-[#6F8591]">
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="product-name">
                        {filter.status === 'trash' ? (
                          <span className="text-sm text-[#333333] font-medium">{product.name}</span>
                        ) : (
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-sm text-[#007BF9] hover:underline font-medium"
                          >
                            {product.name}
                          </Link>
                        )}
                        
                        <div className="product-actions opacity-0 group-hover:opacity-100 flex gap-2 text-xs text-[#6F8591] mt-1 transition-opacity">
                          <span>ID: {product.id.substring(0, 8)}</span>
                          
                          {filter.status !== 'trash' && (
                            <>
                              <span className="text-[#E4E7EB]">|</span>
                              <Link 
                                href={`/admin/products/${product.id}`}
                                className="text-[#007BF9] hover:underline"
                              >
                                Edit
                              </Link>
                              <span className="text-[#E4E7EB]">|</span>
                              <button
                                onClick={() => handleItemAction(product.id, 'trash')}
                                className="text-[#F85464] hover:underline"
                              >
                                Trash
                              </button>
                              <span className="text-[#E4E7EB]">|</span>
                              <a 
                                href={`/products/${product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#007BF9] hover:underline"
                              >
                                View
                              </a>
                            </>
                          )}
                          
                          {filter.status === 'trash' && (
                            <>
                              <span className="text-[#E4E7EB]">|</span>
                              <button
                                onClick={() => handleBulkAction('restore')}
                                className="text-[#007BF9] hover:underline"
                              >
                                Restore
                              </button>
                              <span className="text-[#E4E7EB]">|</span>
                              <button
                                onClick={() => handleItemAction(product.id, 'delete')}
                                className="text-[#F85464] hover:underline"
                              >
                                Delete Permanently
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="product-price">
                        <span className="text-sm text-[#333333] font-medium">
                          ${product.regularPrice.toFixed(2)}
                        </span>
                        {product.salePrice && (
                          <span className="text-xs text-[#F85464] line-through ml-2">
                            ${product.salePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {renderStatusBadge(product.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {product.categories.map((category, index) => (
                          <span 
                            key={category.id} 
                            className="inline-block bg-[#DCE8F8] text-[#007BF9] px-2 py-0.5 rounded-full text-xs"
                          >
                            {category.name}
                          </span>
                        ))}
                        {product.categories.length === 0 && (
                          <span className="text-xs text-[#6F8591]">No categories</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#49617E]">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#6F8591]">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="product-list__pagination flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="product-list__per-page flex items-center gap-2">
          <span className="text-sm text-[#49617E]">Show</span>
          <select
            value={filter.limit}
            onChange={handleItemsPerPageChange}
            className="border border-[#E4E7EB] rounded px-2 py-1 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
            disabled={loading}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-[#49617E]">entries</span>
        </div>
        
        {totalPages > 1 && (
          <div className="product-list__page-nav flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filter.page - 1)}
              disabled={filter.page === 1 || loading}
            >
              <ChevronLeft size={16} />
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => (
                page === 1 || 
                page === totalPages || 
                (page >= filter.page - 1 && page <= filter.page + 1)
              ))
              .map((page, i, array) => (
                <React.Fragment key={page}>
                  {i > 0 && array[i - 1] !== page - 1 && (
                    <span className="text-[#6F8591] px-2">...</span>
                  )}
                  <Button
                    variant={filter.page === page ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))
            }
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filter.page + 1)}
              disabled={filter.page === totalPages || loading}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;