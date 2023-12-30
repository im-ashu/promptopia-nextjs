"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@components/Profile";

const MyProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [myPrompts, setMyPrompts] = useState([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      const res = await fetch(`/api/user/${session?.user.id}/prompt`);
      const data = await res.json();
      setMyPrompts(data);
    };
    if (session?.user.id) fetchPrompts();
  }, [session?.user.id]);

  const handleEdit = (editPrompt) => {
    router.push(`/update-prompt?id=${editPrompt._id}`);
  };

  const handleDelete = async (deletePrompt) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );
    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${deletePrompt._id}`, {
          method: "DELETE",
        });
        const updatedPrompts = myPrompts.filter(
          (prompt) => prompt._id != deletePrompt._id
        );
        setMyPrompts(updatedPrompts);
      } catch (err) {
        console.log(err);
        return;
      }
    }
  };

  return (
    <Profile
      desc="Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination"
      data={myPrompts}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      name="My"
    />
  );
};

export default MyProfile;
