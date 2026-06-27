import { Button } from "../ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const ShareActions = ({ onShare, onSetStoryOpen }) => {
  const handleShare = async (platform) => {
    try {
      if (platform === 'whatsapp') {
        const text = encodeURIComponent('Join me on this amazing platform!');
        window.open(`https://wa.me/?text=${text}`, '_blank');
      } else {
        await navigator.share({
          title: 'Check out this awesome platform!',
          text: 'Join me on this amazing journey!',
          url: window.location.href,
        });
      }
      onShare(platform);
    } catch (err) {
      console.log("Share failed:", err);
      toast.success("Share point added! (Demo mode)");
      onShare(platform);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-none"
        onClick={() => onSetStoryOpen(true)}
      >
        <Share2 className="h-4 w-4" />
        Add Story
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none"
        onClick={() => handleShare('other')}
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  );
};

export default ShareActions;