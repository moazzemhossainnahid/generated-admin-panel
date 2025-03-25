// collection
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import { Collection, CollectionFilter } from "@/types/products";
import React from "react";

interface CollectionListProps {
  initialCollections: Collection[];
  initialTotal: number;
  initialFilter: CollectionFilter;
}

const CollectionList: React.FC<CollectionListProps> = ({
  initialCollections,
  initialTotal,
  initialFilter,
}) => {
  const [collections, setCollections] =
    useState<Collection[]>(initialCollections);
  const [filter, setFilter] = useState<CollectionFilter>(initialFilter);
  const [searchQuery, setSearchQuery] = useState(initialFilter.search || "");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilter = { ...filter, search: searchQuery, page: 1 };
    setFilter(newFilter);
    fetchCollections(newFilter);
  };

  // Handle status filter
  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    const newFilter = { ...filter, status, page: 1 };
    setFilter(newFilter);
    fetchCollections(newFilter);
  };

  // Handle bulk action
  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) {
      toast.warning("No items selected");
      return;
    }

    if (action === "delete") {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${selectedItems.length} selected collections?`
      );
      if (!confirmed) return;

      // In a real app, you would make an API call here
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        const updatedCollections = collections.filter(
          (collection) => !selectedItems.includes(collection.id)
        );
        setCollections(updatedCollections);
        setSelectedItems([]);
        toast.success(
          `Successfully deleted ${selectedItems.length} collections`
        );
        setLoading(false);
        setTotal(updatedCollections.length);
      }, 800);
    }
  };

  // Handle selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(collections.map((collection) => collection.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Handle individual delete
  const handleDelete = (id: string) => {
    const collection = collections.find((collection) => collection.id === id);
    const confirmed = window.confirm(
      `Are you sure you want to delete "${collection?.name}"?`
    );
    if (!confirmed) return;

    // In a real app, you would make an API call here
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedCollections = collections.filter(
        (collection) => collection.id !== id
      );
      setCollections(updatedCollections);
      toast.success("Collection deleted successfully");
      setLoading(false);
      setTotal(updatedCollections.length);
    }, 800);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const newFilter = { ...filter, page };
    setFilter(newFilter);
    fetchCollections(newFilter);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const limit = Number(e.target.value);
    const newFilter = { ...filter, limit, page: 1 };
    setFilter(newFilter);
    fetchCollections(newFilter);
  };

  // Handle sorting
  const handleSort = (sort: string) => {
    const sortDirection =
      filter.sort === sort && filter.sortDirection === "asc" ? "desc" : "asc";
    const newFilter: any = { ...filter, sort, sortDirection, page: 1 };
    setFilter(newFilter);
    fetchCollections(newFilter);
  };

  // Fetch collections based on filter
  const fetchCollections = (newFilter: CollectionFilter) => {
    setLoading(true);

    // In a real app, you would make an API call here
    // For now, simulate filtering on client side
    setTimeout(() => {
      let filtered = [...initialCollections];

      // Apply search filter
      if (newFilter.search) {
        const search = newFilter.search.toLowerCase();
        filtered = filtered.filter(
          (collection) =>
            collection.name.toLowerCase().includes(search) ||
            collection.id.toLowerCase().includes(search)
        );
      }

      // Apply status filter
      if (newFilter.status && newFilter.status !== "all") {
        filtered = filtered.filter(
          (collection) => collection.status === newFilter.status
        );
      }

      // Apply sorting
      if (newFilter.sort) {
        filtered.sort((a, b) => {
          const direction = newFilter.sortDirection === "desc" ? -1 : 1;

          switch (newFilter.sort) {
            case "name":
              return direction * a.name.localeCompare(b.name);
            case "createdAt":
              return (
                direction *
                (new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime())
              );
            default:
              return 0;
          }
        });
      }

      // Apply pagination
      const startIndex = (newFilter.page - 1) * newFilter.limit;
      const paginatedCollections = filtered.slice(
        startIndex,
        startIndex + newFilter.limit
      );

      setCollections(paginatedCollections);
      setTotal(filtered.length);
      setLoading(false);
    }, 500);
  };

  // Calculate pagination
  const totalPages = Math.ceil(total / filter.limit);

  // Render status badge
  const renderStatusBadge = (status: string) => {
    let bgColor = "";
    let textColor = "";

    switch (status) {
      case "active":
        bgColor = "bg-[#E6F6EE]";
        textColor = "text-[#0D894F]";
        break;
      case "inactive":
        bgColor = "bg-[#FFEAED]";
        textColor = "text-[#F04438]";
        break;
      default:
        bgColor = "bg-[#DCE8F8]";
        textColor = "text-[#007BF9]";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${bgColor} ${textColor} capitalize`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="collection-list">
      {/* Search & Action Buttons */}
      <div className="collection-list__header mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="collection-list__search flex-1 max-w-md">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by collection name or ID..."
                className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-sm"
              />
            </div>
            <Button type="submit" size="md" className="rounded-l-none">
              Search
            </Button>
          </form>
        </div>

        <div className="collection-list__actions">
          <Link href="/admin/products/collections/new">
            <Button leftIcon={<Plus size={16} />}>Add Collection</Button>
          </Link>
        </div>
      </div>

      {/* Status Filter Links */}
      <div className="collection-list__status-filters flex border-b border-[#E4E7EB] mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter.status === "all" || !filter.status
              ? "border-[#007BF9] text-[#007BF9]"
              : "border-transparent text-[#49617E] hover:text-[#007BF9]"
          }`}
          onClick={() => handleStatusFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter.status === "active"
              ? "border-[#007BF9] text-[#007BF9]"
              : "border-transparent text-[#49617E] hover:text-[#007BF9]"
          }`}
          onClick={() => handleStatusFilter("active")}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter.status === "inactive"
              ? "border-[#007BF9] text-[#007BF9]"
              : "border-transparent text-[#49617E] hover:text-[#007BF9]"
          }`}
          onClick={() => handleStatusFilter("inactive")}
        >
          Inactive
        </button>
      </div>

      {/* Bulk Actions */}
      <div className="collection-list__bulk-actions mb-4 flex items-center gap-4">
        <select
          className="bulk-action-select border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
          disabled={selectedItems.length === 0 || loading}
          onChange={(e) => handleBulkAction(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Bulk Actions
          </option>
          <option value="delete">Delete</option>
        </select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const selectEl = document.querySelector(
              ".bulk-action-select"
            ) as HTMLSelectElement;
            if (selectEl && selectEl.value) {
              handleBulkAction(selectEl.value);
            } else {
              toast.warning("Please select an action");
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

      {/* Collections Table */}
      <div className="collection-list__table bg-white rounded-md border border-[#E4E7EB] overflow-hidden mb-4">
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
                    checked={
                      selectedItems.length === collections.length &&
                      collections.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-[#E4E7EB]"
                    disabled={collections.length === 0 || loading}
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">
                  <button
                    className="flex items-center"
                    onClick={() => handleSort("name")}
                  >
                    Title
                    {filter.sort === "name" && (
                      <ChevronDown
                        size={16}
                        className={`ml-1 transition-transform ${
                          filter.sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">
                  Slug
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">
                  <button
                    className="flex items-center"
                    onClick={() => handleSort("createdAt")}
                  >
                    Created At
                    {filter.sort === "createdAt" && (
                      <ChevronDown
                        size={16}
                        className={`ml-1 transition-transform ${
                          filter.sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-center font-semibold text-sm text-[#49617E]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {collections.length > 0 ? (
                collections.map((collection) => (
                  <tr
                    key={collection.id}
                    className="border-b border-[#E4E7EB] hover:bg-[#F8F9FA]"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(collection.id)}
                        onChange={() => handleSelectItem(collection.id)}
                        className="rounded border-[#E4E7EB]"
                        disabled={loading}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/collection/${collection.id}`}
                        className="text-sm text-[#007BF9] hover:underline font-medium"
                      >
                        {collection.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#49617E]">
                      {collection.slug}
                    </td>
                    <td className="px-4 py-3">
                      {renderStatusBadge(collection.status)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#49617E]">
                      {new Date(collection.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <Link
                        href={`/admin/products/collections/${collection.id}`}
                        className="text-[#49617E] hover:text-[#007BF9] transition p-1 bg-[#F5F7FA] rounded"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(collection.id)}
                        className="text-[#49617E] hover:text-[#F85464] transition p-1 bg-[#F5F7FA] rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-[#6F8591]"
                  >
                    No collections found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="collection-list__pagination flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="collection-list__per-page flex items-center gap-2">
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
          <div className="collection-list__page-nav flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filter.page - 1)}
              disabled={filter.page === 1 || loading}
            >
              <ChevronLeft size={16} />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= filter.page - 1 && page <= filter.page + 1)
              )
              .map((page, i, array) => (
                <React.Fragment key={page}>
                  {i > 0 && array[i - 1] !== page - 1 && (
                    <span className="text-[#6F8591] px-2">...</span>
                  )}
                  <Button
                    variant={filter.page === page ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))}

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

export default CollectionList;
