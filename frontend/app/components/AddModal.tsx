import { useState, useEffect } from "react";
import { X, BookOpen } from "lucide-react";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookdata:any) => void;
  isSubmitting: boolean;
}

const AddBookModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AddBookModalProps) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [featured, setFeatured] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setDescription("");
    setGenre("");
    setPublishedYear("");
    setCoverImage("");
    setFeatured(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const bookData = {
      title,
      author,
      description,
      genre,
      publishedYear: parseInt(publishedYear) || undefined,
      coverImage,
      featured,
    };

    onSubmit(bookData);
    // Close modal after successful submission
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (e: any) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      return () => document.removeEventListener("keydown", handleEscapeKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)", // Safari support
      }}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-scale-in"
        style={{
          backgroundColor: "rgba(45, 27, 14, 0.95)",
          border: "3px solid #d4af37",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(212, 175, 55, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-amber-600/30">
          <h2
            className="text-2xl font-bold text-yellow-200 flex items-center"
            style={{ fontFamily: '"Cutive Mono", monospace' }}
          >
            <BookOpen className="mr-3 h-6 w-6" />
            Add New Book
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-all duration-200 hover:bg-amber-600/20 hover:scale-110"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6 text-yellow-200" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg text-amber-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
              style={{
                backgroundColor: "rgba(255,255,153,0.9)",
                border: "2px solid #d4af37",
              }}
              placeholder="Enter book title"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">
              Author *
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg text-amber-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
              style={{
                backgroundColor: "rgba(255,255,153,0.9)",
                border: "2px solid #d4af37",
              }}
              placeholder="Enter author name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg text-amber-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 resize-vertical"
              style={{
                backgroundColor: "rgba(255,255,153,0.9)",
                border: "2px solid #d4af37",
              }}
              placeholder="Enter book description"
            />
          </div>

          {/* Genre and Year Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Genre */}
            <div>
              <label className="block text-sm font-semibold text-yellow-200 mb-2">
                Genre
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-amber-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
                style={{
                  backgroundColor: "rgba(255,255,153,0.9)",
                  border: "2px solid #d4af37",
                }}
                placeholder="e.g., Fiction, Mystery"
              />
            </div>

            {/* Published Year */}
            <div>
              <label className="block text-sm font-semibold text-yellow-200 mb-2">
                Published Year
              </label>
              <input
                type="number"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value)}
                min="1000"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 placeholder:text-gray-500 rounded-lg text-amber-900 outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
                style={{
                  backgroundColor: "rgba(255,255,153,0.9)",
                  border: "2px solid #d4af37",
                }}
                placeholder="e.g., 2023"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-amber-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
              style={{
                backgroundColor: "rgba(255,255,153,0.9)",
                border: "2px solid #d4af37",
              }}
              placeholder="https://example.com/book-cover.jpg"
            />
          </div>

          {/* Featured Toggle */}
          <div
            className="flex items-center space-x-3 p-4 rounded-lg"
            style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
          >
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-yellow-600 bg-yellow-100 border-yellow-300 rounded focus:ring-yellow-500 focus:ring-2"
            />
            <label
              htmlFor="featured"
              className="text-yellow-200 font-medium cursor-pointer"
            >
              Mark as Featured Book
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t-2 border-amber-600/30">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !author.trim()}
              className={`flex-1 py-3 px-6 font-bold rounded-lg transition-all duration-300 ${
                isSubmitting || !title.trim() || !author.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105 hover:shadow-lg"
              }`}
              style={{
                backgroundColor: "#ffff99",
                color: "#2d1b0e",
                border: "2px solid #d4af37",
                fontFamily: '"Cutive Mono", monospace',
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding Book...
                </span>
              ) : (
                "Add Book"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none py-3 px-6 font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:bg-amber-600/30"
              style={{
                backgroundColor: "rgba(255,255,153,0.2)",
                color: "#fef3c7",
                border: "2px solid rgba(212,175,55,0.5)",
                fontFamily: '"Cutive Mono", monospace',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
