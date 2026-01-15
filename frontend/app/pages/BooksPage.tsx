"use client";
import { useState, useEffect } from "react";
import {
  Filter,
  Search,
  X,
  Book,
  ChevronLeft,
  ChevronRight,
  Loader,
  DollarSign,
  Star,
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { BookGridSkeleton } from "../components/LoadingSkeleton";
import Link from "next/link";
import toast from "react-hot-toast";

const BookCard = ({ book }: any) => (
  <Link href={`/books/${book.id}`} className="group">
    <div
      style={{
        backgroundColor: "#ffff99",
        color: "#2d1b0e",
        border: "3px solid #d4af37",
        borderRadius: "0",
        boxShadow:
          "4px 4px 0px rgba(0,0,0,0.3), inset 0 0 10px rgba(212,175,55,0.2)",
      }}
      className="group relative shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-amber-200 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-100/20 to-amber-200/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative p-4">
        {book.imageUrl ? (
          <div className="h-64 overflow-hidden mb-4 rounded-lg border-2 border-amber-300">
            <img
              src={book.imageUrl}
              alt={`${book.title} cover`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg mb-4 flex items-center justify-center border border-amber-300 shadow-inner">
            <Book className="h-12 w-12 text-amber-600" />
          </div>
        )}
        <h3 className="font-bold text-amber-900 text-lg mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
          {book.title}
        </h3>
        <p className="text-amber-700 text-sm mb-2">by {book.author || 'Unknown'}</p>
        <div className="flex justify-between items-center">
          <span className="px-3 py-1 bg-amber-200 text-amber-800 text-xs rounded-full font-medium border border-amber-300">
            {book.category?.title || 'All Books'}
          </span>
          <div className="flex items-center text-amber-600">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-semibold">{parseFloat(book.price).toFixed(2)}</span>
          </div>
        </div>
        {book.detail?.ratingsAvg && (
          <div className="flex items-center mt-2 text-amber-600">
            <Star className="h-4 w-4 fill-amber-500" />
            <span className="text-sm ml-1">{book.detail.ratingsAvg.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  </Link>
);

const BooksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [minRating, setMinRating] = useState<number | undefined>();
  const [authorFilter, setAuthorFilter] = useState("");
  
  // Debounced values for search and author
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedAuthor, setDebouncedAuthor] = useState("");
  
  const limit = 20;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Debounce author filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAuthor(authorFilter);
      setCurrentPage(1); // Reset to first page on filter change
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [authorFilter]);

  // Fetch products with filters
  const { data, isLoading, error } = useProducts({
    page: currentPage,
    limit,
    search: debouncedSearch || undefined,
    categoryId: selectedCategoryId || undefined,
    minPrice,
    maxPrice,
    author: debouncedAuthor || undefined,
    minRating,
  });

  // Fetch categories for filter
  const { data: categoriesData } = useCategories();
  const categories = categoriesData || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Debouncing handles the actual search
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategoryId("");
    setCurrentPage(1);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinRating(undefined);
    setAuthorFilter("");
    setDebouncedSearch("");
    setDebouncedAuthor("");
  };

  const hasActiveFilters = debouncedSearch || selectedCategoryId || minPrice || maxPrice || minRating || debouncedAuthor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50"> 
      <div
        className="absolute inset-0 opacity-10 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3Ccircle cx='13' cy='43' r='1'/%3E%3Ccircle cx='47' cy='17' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-6 md:mb-0">
            <h1
              className="text-4xl font-bold text-amber-900 mb-2"
              style={{ fontFamily: '"Cutive Mono", monospace' }}
            >
              Browse Books
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full"></div>
            {data && (
              <p className="text-amber-700 mt-2">
                {data.meta.total} books available
              </p>
            )}
          </div>
        
          <div className="w-full md:w-auto md:max-w-md">
            <form onSubmit={handleSearch} className="flex shadow-lg">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search books..."
                  className="w-full py-3 px-4 pr-12 border-2 border-amber-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 text-amber-900 placeholder-amber-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && searchTerm !== debouncedSearch ? (
                  <Loader className="absolute right-3 top-3.5 h-5 w-5 text-amber-600 animate-spin" />
                ) : (
                  <Search className="absolute right-3 top-3.5 h-5 w-5 text-amber-600" />
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 border-2 border-amber-300 border-l-0 px-4 rounded-r-xl transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
              >
                <Filter className="h-5 w-5 text-white" />
              </button>
            </form>
          </div>
        </div>

        <div
          className={`bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 rounded-xl shadow-lg border-2 border-amber-200 p-6 mb-8 transition-all duration-300 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-xl font-bold text-amber-900 flex items-center"
              style={{ fontFamily: '"Cutive Mono", monospace' }}
            >
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-amber-700 hover:text-amber-900 flex items-center bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-full transition-colors duration-200 border border-amber-300"
              >
                <X className="h-4 w-4 mr-1" />
                Clear filters
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide">
                Category
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                    !selectedCategoryId
                      ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white border-amber-600 shadow-lg transform scale-105"
                      : "bg-white/80 text-amber-800 border-amber-300 hover:bg-amber-200 hover:border-amber-400 hover:shadow-md"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                      selectedCategoryId === category.id
                        ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white border-amber-600 shadow-lg transform scale-105"
                        : "bg-white/80 text-amber-800 border-amber-300 hover:bg-amber-200 hover:border-amber-400 hover:shadow-md"
                    }`}
                  >
                    {category.title} ({category.productCount})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide">
                Price Range
              </h3>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="text-xs text-amber-700 mb-1 block">Min Price</label>
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full py-2 px-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/90 text-amber-900"
                    value={minPrice || ''}
                    onChange={(e) => {
                      setMinPrice(e.target.value ? parseFloat(e.target.value) : undefined);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <span className="text-amber-600 mt-6">-</span>
                <div className="flex-1">
                  <label className="text-xs text-amber-700 mb-1 block">Max Price</label>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full py-2 px-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/90 text-amber-900"
                    value={maxPrice || ''}
                    onChange={(e) => {
                      setMaxPrice(e.target.value ? parseFloat(e.target.value) : undefined);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide">
                Author
              </h3>
              <input
                type="text"
                placeholder="Filter by author..."
                className="w-full py-2 px-4 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/90 text-amber-900 placeholder-amber-600"
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
              />
              {authorFilter && authorFilter !== debouncedAuthor && (
                <p className="text-xs text-amber-600 mt-1">Searching...</p>
              )}
            </div>

          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-300 text-red-800 px-6 py-4 rounded-xl mb-8">
            <p className="font-semibold">Error loading books</p>
            <p className="text-sm">{error instanceof Error ? error.message : 'An error occurred'}</p>
          </div>
        )}

        {isLoading ? (
          <BookGridSkeleton count={limit} />
        ) : data && data.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {data.items.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {data.meta.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-yellow-100 p-4 rounded-xl shadow-lg border-2 border-amber-200">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === 1
                        ? "bg-amber-200 text-amber-400 cursor-not-allowed"
                        : "bg-white text-amber-700 hover:bg-amber-200 hover:text-amber-800 shadow-md hover:shadow-lg"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>

                  {(() => {
                    const pages = [];
                    const startPage = Math.max(1, currentPage - 2);
                    const endPage = Math.min(data.meta.totalPages, currentPage + 2);
                    
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            currentPage === i
                              ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg transform scale-105"
                              : "bg-white text-amber-700 hover:bg-amber-200 hover:text-amber-800 shadow-md hover:shadow-lg"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    return pages;
                  })()}

                  <button
                    onClick={() => setCurrentPage(Math.min(data.meta.totalPages, currentPage + 1))}
                    disabled={currentPage === data.meta.totalPages}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === data.meta.totalPages
                        ? "bg-amber-200 text-amber-400 cursor-not-allowed"
                        : "bg-white text-amber-700 hover:bg-amber-200 hover:text-amber-800 shadow-md hover:shadow-lg"
                    }`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </nav>
              </div>
            )}

            <div className="text-center mt-4 text-amber-700">
              <p className="text-sm">
                Showing {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, data.meta.total)} of {data.meta.total} books
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl border-2 border-amber-200 shadow-lg">
            <div className="mb-6">
              <Book className="h-16 w-16 text-amber-400 mx-auto mb-4" />
              <p className="text-amber-800 text-xl font-semibold mb-2">
                No books found matching your criteria
              </p>
              <p className="text-amber-600">
                Try adjusting your search or filters
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Clear filters and try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;
