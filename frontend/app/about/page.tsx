"use client";
import { BookOpen, Heart, Users, Target, Sparkles, Award, Globe, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div
        className="absolute inset-0 opacity-10 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3Ccircle cx='13' cy='43' r='1'/%3E%3Ccircle cx='47' cy='17' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div
                className="w-20 h-20 p-4 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: "#ffff99",
                  border: "4px solid #d4af37",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.3), inset 0 0 20px rgba(212,175,55,0.2)",
                }}
              >
                <BookOpen className="h-10 w-10 text-amber-900" />
              </div>
            </div>
            <h1
              className="text-5xl font-bold text-amber-900 mb-4"
              style={{ fontFamily: '"Cutive Mono", monospace' }}
            >
              About BookMania
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-amber-700 leading-relaxed max-w-2xl mx-auto">
              Your gateway to discovering amazing books from World of Books, curated with care and powered by technology.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-100/80 to-yellow-100/80 rounded-xl shadow-lg border-2 border-amber-200 p-8 mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-6 flex items-center">
              <Heart className="h-8 w-8 mr-3 text-red-500" />
              Our Story
            </h2>
            <div className="space-y-4 text-amber-900 text-lg leading-relaxed">
              <p>
                BookMania was born from a simple idea: make book discovery effortless and enjoyable. 
                We partnered with World of Books to bring you an extensive collection of books at your fingertips.
              </p>
              <p>
                Our platform scrapes and curates thousands of books, providing you with detailed information, 
                real-time pricing, and authentic reviews to help you make informed decisions about your next read.
              </p>
              <p>
                Whether you're a casual reader or a bibliophile, BookMania is designed to connect you with 
                books that inspire, educate, and entertain.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-amber-100/80 to-yellow-100/80 rounded-xl shadow-lg border-2 border-amber-200 p-8">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-amber-700 mr-3" />
                <h3 className="text-2xl font-bold text-amber-900">Our Mission</h3>
              </div>
              <p className="text-amber-900 text-lg leading-relaxed">
                To democratize access to quality books by providing a seamless platform that connects 
                readers with their next favorite story, backed by real-time data and honest reviews.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-100/80 to-yellow-100/80 rounded-xl shadow-lg border-2 border-amber-200 p-8">
              <div className="flex items-center mb-4">
                <Sparkles className="h-8 w-8 text-amber-700 mr-3" />
                <h3 className="text-2xl font-bold text-amber-900">Our Vision</h3>
              </div>
              <p className="text-amber-900 text-lg leading-relaxed">
                To become the go-to destination for book lovers worldwide, offering personalized 
                recommendations and a vibrant community of readers sharing their literary journeys.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-100/80 to-yellow-100/80 rounded-xl shadow-lg border-2 border-amber-200 p-8 mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-8 flex items-center">
              <Award className="h-8 w-8 mr-3 text-amber-700" />
              What Makes Us Different
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Globe,
                  title: "Real-Time Data",
                  description: "Live pricing and availability from World of Books"
                },
                {
                  icon: Users,
                  title: "Community Driven",
                  description: "Authentic reviews from real readers like you"
                },
                {
                  icon: TrendingUp,
                  title: "Always Updated",
                  description: "Fresh content with daily updates and new additions"
                }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: "#ffff99",
                        border: "3px solid #d4af37",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      }}
                    >
                      <feature.icon className="h-8 w-8 text-amber-900" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-amber-900 mb-2">{feature.title}</h4>
                  <p className="text-amber-700">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-100/80 to-yellow-100/80 rounded-xl shadow-lg border-2 border-amber-200 p-8 text-center">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">Join Our Community</h2>
            <p className="text-amber-700 text-lg mb-6 max-w-2xl mx-auto">
              Discover thousands of books, read authentic reviews, and connect with fellow book lovers. 
              Your next great read is just a click away!
            </p>
            <a
              href="/books"
              className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Exploring Books
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
