"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Content } from "@/models/Content";
import { getPersonalizedFeed, trackContentView } from "@/services/personalizedFeedService";
import Link from "next/link";
import Image from "next/image";
import { User } from "@/models/User";

interface PersonalizedFeedProps {
  user: User | null;
}

export default function PersonalizedFeed({ user }: PersonalizedFeedProps) {
  const [feedContent, setFeedContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (user?.uid) {
      fetchPersonalizedFeed(user.uid, page);
    } else {
      setLoading(false);
      setError("Please sign in to see your personalized feed");
    }
  }, [user, page]);

  const fetchPersonalizedFeed = async (userId: string, currentPage: number) => {
    setLoading(true);
    try {
      const response = await getPersonalizedFeed(userId, currentPage);
      setFeedContent(response.content);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feed:", error);
      setError("Failed to load your personalized feed");
      setLoading(false);
    }
  };

  const handleContentClick = async (contentId: string) => {
    if (user?.uid) {
      await trackContentView(user.uid, contentId);
      router.push(`/content/${contentId}`);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        {!user && (
          <Link href="/authentication/login" className="btn btn-primary mt-4">
            Sign In
          </Link>
        )}
      </div>
    );
  }

  if (feedContent.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Your feed is empty</h2>
        <p className="mb-6">
          Start by following creators or selecting your interests to personalize your experience.
        </p>
        <Link href="/interests" className="btn btn-primary">
          Select Interests
        </Link>
      </div>
    );
  }

  return (
    <div className="personalized-feed">
      <h2 className="text-2xl font-bold mb-6">Your Personalized Feed</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedContent.map((content) => (
          <div 
            key={content.id} 
            className="content-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleContentClick(content.id)}
          >
            {content.thumbnail && (
              <div className="relative h-40 w-full">
                <Image
                  src={content.thumbnail || "/images/placeholder.png"}
                  alt={content.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{content.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {content.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
              </p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-500">
                  {content.readtime} min read
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {content.likes || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="btn btn-outline disabled:opacity-50"
          >
            Previous
          </button>
          <span className="flex items-center">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="btn btn-outline disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
