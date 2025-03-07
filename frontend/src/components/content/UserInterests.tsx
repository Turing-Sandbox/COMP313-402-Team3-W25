"use client";

import { useState, useEffect } from "react";
import { User } from "@/models/User";
import { UserInterest } from "@/models/UserPreferences";
import { updateUserInterests } from "@/services/personalizedFeedService";

// TODO: Replace with actual interests from within the database
const DEFAULT_INTERESTS = [
  { id: "1", name: "Technology", selected: false },
  { id: "2", name: "Business", selected: false },
  { id: "3", name: "Science", selected: false },
  { id: "4", name: "Health", selected: false },
  { id: "5", name: "Politics", selected: false },
  { id: "6", name: "Entertainment", selected: false },
  { id: "7", name: "Sports", selected: false },
  { id: "8", name: "Education", selected: false },
  { id: "9", name: "Art", selected: false },
  { id: "10", name: "Travel", selected: false },
];

interface UserInterestsProps {
  user: User | null;
  onComplete?: () => void;
}

export default function UserInterests({ user, onComplete }: UserInterestsProps) {
  const [interests, setInterests] = useState<UserInterest[]>(DEFAULT_INTERESTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.interests) {
      const updatedInterests = [...interests];
      user.interests.forEach((interestId) => {
        const index = updatedInterests.findIndex((i) => i.id === interestId);
        if (index !== -1) {
          updatedInterests[index].selected = true;
        }
      });
      setInterests(updatedInterests);
    }
  }, [user]);

  const toggleInterest = (id: string) => {
    const updatedInterests = interests.map((interest) =>
      interest.id === id
        ? { ...interest, selected: !interest.selected }
        : interest
    );
    setInterests(updatedInterests);
  };

  const handleSave = async () => {
    if (!user) {
      setError("You must be logged in to save interests");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const selectedInterests = interests
        .filter((interest) => interest.selected)
        .map((interest) => interest.id);
      
      if (selectedInterests.length === 0) {
        setError("Please select at least one interest");
        setLoading(false);
        return;
      }
      
      const success = await updateUserInterests(user.uid, selectedInterests);
      
      if (success) {
        setSuccess(true);
        if (onComplete) {
          onComplete();
        }
      } else {
        setError("Failed to save interests");
      }
    } catch (err) {
      console.error("Error saving interests:", err);
      setError("An error occurred while saving your interests");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Please sign in to personalize your feed
        </p>
      </div>
    );
  }

  return (
    <div className="user-interests-container max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Select Your Interests</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Choose topics you're interested in to personalize your content feed
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Your interests have been saved successfully!
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {interests.map((interest) => (
          <div
            key={interest.id}
            className={`interest-item cursor-pointer rounded-lg border p-4 text-center transition-all ${
              interest.selected
                ? "bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-400"
                : "bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-800 dark:border-gray-700"
            }`}
            onClick={() => toggleInterest(interest.id)}
          >
            {interest.name}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          className="btn btn-primary px-6 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Interests"}
        </button>
      </div>
    </div>
  );
}
