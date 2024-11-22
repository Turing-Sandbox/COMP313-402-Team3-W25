"use client";

import Navbar from "@/app/components/Navbar";
import { apiURL } from "@/app/scripts/api";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "../styles/profile.scss";
import { Content } from "@/app/content/models/Content";
import { User } from "../models/User";
import { useRouter } from "next/navigation";

interface ViewProfileProps {
  id: string;
}

export default function ViewProfile({ id }: ViewProfileProps) {
  // ---------------------------------------
  // -------------- Variables --------------
  // ---------------------------------------
  const [user, setUser] = useState<User | null>(null);
  const [contents, setContents] = useState<Content[]>([]);

  const router = useRouter();

  // ---------------------------------------
  // ------------ Event Handler ------------
  // ---------------------------------------

  // Fetch user data on page load
  const hasFetchedData = useRef(false);
  useEffect(() => {
    if (!hasFetchedData.current) {
      getUserInfo();
      hasFetchedData.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------
  // -------------- Functions --------------
  // ---------------------------------------
  function getUserInfo() {
    axios.get(`${apiURL}/user/${id}`).then((res) => {
      console.log(res.data);
      setUser(res.data);

      if (res.data?.content) {
        for (let i = 0; i < res.data.content.length; i++) {
          console.log(res.data.content[i]);
          getContent(res.data.content[i]);
        }
      }
    });
  }

  function getContent(contentId: string) {
    axios.get(`${apiURL}/content/${contentId}`).then((res) => {
      const fetchedContent = res.data;
      fetchedContent.id = contentId;
      setContents((prevContents) => [...prevContents, fetchedContent]);
    });
  }

  // --------------------------------------
  // -------------- Render ----------------
  // --------------------------------------
  return (
    <>
      <Navbar />
      <div className='main-content'>
        <h1>{user?.username}</h1>
        {/* <img src={user.profilePicture} alt='Profile Picture' /> */}

        <p>
          {user?.firstName} {user?.lastName}
        </p>
        <p>{user?.bio}</p>

        <h2>Content</h2>
        <div className='content-list'>
          {contents.map((content, index) => (
            <div
              key={content.id || index}
              className='content-list-item'
              onClick={() => router.push(`/content/${content.id}`)}
            >
              <h3>{content.title}</h3>
              <p>{content.content}</p>
              {/* Load thumbnail image from URL */}
              <div className='content-thumbnail-container'>
                <Image
                  src={content.thumbnail}
                  alt='Thumbnail'
                  width={200}
                  height={200}
                  className='content-thumbnail'
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
