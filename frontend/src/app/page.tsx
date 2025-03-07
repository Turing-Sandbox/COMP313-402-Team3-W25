"use client";

import { useState, useEffect } from "react";
import Background from "@/components/Background";
import AuthProvider from "../hooks/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PersonalizedFeed from "@/components/content/PersonalizedFeed";
import { User } from "@/models/User";
import { getTrendingContent } from "@/services/personalizedFeedService";
import Link from "next/link";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [trendingContent, setTrendingContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from local storage (your auth implementation may differ)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
    
    // Fetch trending content regardless of user login status
    fetchTrendingContent();
  }, []);

  const fetchTrendingContent = async () => {
    try {
      const content = await getTrendingContent(3);
      setTrendingContent(content);
    } catch (error) {
      console.error("Error fetching trending content:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthProvider>
      <Background />
      <Navbar />
      
      <div className='main-content'>
        <div className='header'>
          <h1>Summarizz</h1>
          <p>Summarize your articles, videos, and more with ease.</p>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Personalized Feed */}
          <div className="mb-12">
            <PersonalizedFeed user={user} />
            
            {!user && (
              <div className="mt-6 text-center">
                <p className="mb-4">Sign in to see content personalized to your interests</p>
                <div className="flex justify-center gap-4">
                  <Link href="/authentication/login" className="btn btn-primary">
                    Sign In
                  </Link>
                  <Link href="/authentication/register" className="btn btn-outline">
                    Register
                  </Link>
                </div>
              </div>
            )}
            
            {user && !user.interests?.length && (
              <div className="mt-6 text-center">
                <p className="mb-4">Select your interests to personalize your feed</p>
                <Link href="/interests" className="btn btn-primary">
                  Select Interests
                </Link>
              </div>
            )}
          </div>
          
          {/* Trending Content */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
            {loading ? (
              <div className="flex justify-center">
                <div className="loader"></div>
              </div>
            ) : trendingContent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingContent.map((content) => (
                  <div 
                    key={content.id} 
                    className="trending-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
                    onClick={() => window.location.href = `/content/${content.id}`}
                  >
                    {content.thumbnail && (
                      <div className="relative h-32 w-full">
                        <img
                          src={content.thumbnail}
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-md font-semibold mb-2 line-clamp-2">{content.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">{content.readtime} min read</span>
                        <span className="text-xs flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {content.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No trending content available</p>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </AuthProvider>
  );
}
