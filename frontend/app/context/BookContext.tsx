"use client";
import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  book: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genre: string;
  publishedYear: number;
  averageRating: number;
  reviews?: Review[];
}

interface BookContextType {
  books: Book[];
  featuredBooks: Book[];
  book: Book | null;
  loading: boolean;
  error: string | null;
  getBooks: (
    page?: number,
    limit?: number,
    search?: string,
    genre?: string
  ) => Promise<void>;
  getBookById: (id: string) => Promise<void>;
  addReview: (bookId: string, rating: number, comment: string) => Promise<void>;
  addBook: (
    title: string,
    author: string,
    description: string,
    coverImage: string,
    genre: string,
    publishedYear: number,
    featured: boolean
  ) => Promise<void>;
}

const BookContext = createContext<BookContextType>({
  books: [],
  featuredBooks: [],
  book: null,
  loading: false,
  error: null,
  getBooks: async () => {},
  getBookById: async () => {},
  addReview: async () => {},
  addBook: async () => {},
});

export const BookProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      getBooks();
      getFeaturedBooks();
    }
  }, [pathname]);

  const getBooks = async (page = 1, limit = 10, search = "", genre = "") => {
    try {
      setLoading(true);
      let url = `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/api/books?page=${page}&limit=${limit}`;

      if (search) {
        url += `&search=${search}`;
      }

      if (genre) {
        url += `&genre=${genre}`;
      }

      const res = await axios.get(url);
      setBooks(res.data.books);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch books");
      setLoading(false);
    }
  };

  const getFeaturedBooks = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/featured`
      );
      console.log("Featured Books:", res.data);

      setFeaturedBooks(res.data);
    } catch (err) {
      setError("Failed to fetch featured books");
    }
  };

  const getBookById = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}`
      );
      setBook(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch book details");
      setLoading(false);
    }
  };

  const addReview = async (bookId: string, rating: number, comment: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews`,
        {
          book: bookId,
          rating,
          comment,
        },
        config
      );

      // Refresh book data to include the new review
      await getBookById(bookId);
    } catch (err) {
      throw err;
    }
  };

  const addBook = async (
    title: string,
    author: string,
    description: string,
    coverImage: string,
    genre: string,
    publishedYear: number,
    featured: boolean = false
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`,
        {
          title,
          author,
          description,
          coverImage,
          genre,
          publishedYear,
          featured,
        },
        config
      );
    } catch (err) {
      throw err;
    }
  };

  return (
    <BookContext.Provider
      value={{
        books,
        featuredBooks,
        book,
        loading,
        error,
        getBooks,
        getBookById,
        addReview,
        addBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export default BookContext;
