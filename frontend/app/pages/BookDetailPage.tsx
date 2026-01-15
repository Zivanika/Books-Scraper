"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Star, Clock, User, BookOpen, Loader, DollarSign, ExternalLink, RefreshCw } from "lucide-react";
import { useProduct, useRefreshProduct } from "../hooks/useProducts";
import Link from "next/link";
import toast from "react-hot-toast";

const BookDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.bookId as string;
  
  const { data: product, isLoading, error } = useProduct(id);
  const refreshMutation = useRefreshProduct();

  const handleRefresh = async () => {
    try {
      await toast.promise(
        refreshMutation.mutateAsync(id),
        {
          loading: 'Queuing product refresh...',
          success: 'Product refresh queued! Data will update shortly.',
          error: 'Failed to refresh product',
        }
      );
    } catch (err) {
      console.error('Refresh error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex justify-center items-center">
        <Loader className="h-10 w-10 text-amber-600 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Book not found</h2>
          <p className="text-amber-600 mb-6">
            The book you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Link
            href="/books"
            className="text-amber-700 hover:underline font-medium"
          >
            Browse all books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-10">
        <Link
          href="/books"
          className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-6 font-medium"
        >
          ← Back to books
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 bg-gradient-to-br from-amber-100/80 to-yellow-100/80 p-8 rounded-xl shadow-lg border-2 border-amber-200">
          <div className="lg:w-1/3 flex justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={`${product.title} cover`}
                className="w-full max-w-sm h-auto object-cover rounded-xl border-4 border-amber-300 shadow-xl"
              />
            ) : (
              <div className="w-full max-w-sm aspect-[3/4] bg-gradient-to-br from-amber-200 to-yellow-200 rounded-xl border-4 border-amber-300 shadow-xl flex items-center justify-center">
                <BookOpen className="h-24 w-24 text-amber-600" />
              </div>
            )}
          </div>

          <div className="lg:w-2/3 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 text-sm font-semibold bg-amber-300 text-amber-900 rounded-full border border-amber-400">
                {product.category?.title || 'All Books'}
              </span>
              <h1 className="text-4xl font-bold mt-2 text-amber-900">{product.title}</h1>
              <p className="text-lg text-amber-800">by {product.author || 'Unknown Author'}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-2xl font-bold text-amber-900">
                <DollarSign className="h-6 w-6" />
                <span>{parseFloat(product.price).toFixed(2)} {product.currency}</span>
              </div>
              
              {product.detail?.ratingsAvg && (
                <div className="flex items-center text-amber-600">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5"
                        fill={i < Math.round(product.detail!.ratingsAvg!) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm">
                    {product.detail.ratingsAvg.toFixed(1)} ({product.detail.reviewsCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {product.detail?.description && (
              <div>
                <h2 className="text-xl font-semibold mb-2 text-amber-900">About this book</h2>
                <p className="text-amber-900 leading-relaxed">
                  {product.detail.description}
                </p>
              </div>
            )}

            {product.detail?.specs && Object.keys(product.detail.specs).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3 text-amber-900">Specifications</h2>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.detail.specs).map(([key, value]) => (
                    <div key={key} className="bg-white/60 p-3 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-700">{key}</p>
                      <p className="font-medium text-amber-900">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <a
                href={product.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                View on World of Books
              </a>
              
              <button
                onClick={handleRefresh}
                disabled={refreshMutation.isPending}
                className="px-6 py-3 bg-white hover:bg-amber-100 text-amber-700 font-medium rounded-lg border-2 border-amber-300 transition-all duration-200 shadow-md hover:shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                {refreshMutation.isPending ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>

            <div className="text-sm text-amber-600 pt-2">
              <p>Last updated: {new Date(product.lastScrapedAt).toLocaleString()}</p>
              <p className="text-xs mt-1">Source ID: {product.sourceId}</p>
            </div>
          </div>
        </div>

        {product.detail && product.detail.reviewsCount > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Customer Reviews</h2>
            <div className="bg-gradient-to-br from-amber-100/80 to-yellow-100/80 p-6 rounded-xl border-2 border-amber-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-4xl font-bold text-amber-900 mr-4">
                    {product.detail.ratingsAvg?.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-amber-500"
                          fill={i < Math.round(product.detail!.ratingsAvg!) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-amber-700">
                      Based on {product.detail.reviewsCount} reviews
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
