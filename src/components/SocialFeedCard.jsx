import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { SaturnSVG } from "./AnimatedTokens";
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Bookmark,
  ChevronDown,
  Star,
} from "lucide-react";

const SocialFeedCard = ({ blog, viewMode }) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const likesCount = blog.id * 17 + 43;
  const commentsCount = blog.id * 3 + 7;

  const renderGridCard = () => (
    <Card
      className={`
      glass-card overflow-hidden h-full transition-all duration-300 
      hover:shadow-xl hover:-translate-y-1 animate-scale-in text-white
      ${blog.format === "youtube" ? "border-red-500/20" : ""}
      ${blog.format === "tiktok" ? "border-cyan-500/20" : ""}
      ${blog.format === "pinterest" ? "border-red-700/20" : ""}
      ${blog.format === "reel" ? "border-purple-500/20" : ""}
    `}
    >
      <CardHeader className="p-4 pb-0">
        <CardTitle
          className={cn("text-xl font-bold line-clamp-2", blog.titleClass)}
        >
          {blog.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-white text-sm line-clamp-2">{blog.description}</p>
        <div className="mt-2">
          <Button
            variant="link"
            size="sm"
            className="px-0 h-auto text-primary/80"
          >
            See more
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <div className="w-full h-32 overflow-hidden group relative">
          <img
            src={blog.image}
            alt={blog.title}
            className={`
              w-full h-full object-cover
              ${
                blog.isGif
                  ? "group-hover:scale-110 transition-transform duration-4000"
                  : "transition-transform duration-500 hover:scale-110"
              }
            `}
          />
        </div>
      </CardFooter>
    </Card>
  );

  const renderFeedCard = () => (
    <Card
      className={`overflow-hidden transition-all duration-300 animate-scale-in`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-darkAccent rounded-full flex items-center justify-center">
            <span className="text-white text-xl">{blog.icon}</span>
          </div>
          <div>
            <CardTitle className={cn("text-base font-bold", blog.titleClass)}>
              {blog.title}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Premium Insights • <SaturnSVG className="h-3 w-3 inline" /> Author
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3 pb-0">
        <div className="flex gap-1 mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 rounded-full p-0"
            onClick={() => setLiked(!liked)}
          >
            <Heart
              className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 rounded-full p-0"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 rounded-full p-0"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 rounded-full p-0"
              onClick={() => setSaved(!saved)}
            >
              <Bookmark
                className={`h-5 w-5 ${
                  saved ? "fill-primary text-primary" : ""
                }`}
              />
            </Button>
          </div>
        </div>
        <div className="text-sm mb-1">
          <span className="font-semibold">{likesCount} likes</span> •{" "}
          <span>{commentsCount} comments</span>
        </div>
        <div className="text-sm">
          <span className="font-semibold">Premium Insights</span>{" "}
          <span className={expanded ? "" : "line-clamp-2"}>
            {blog.description}
          </span>
        </div>
        {!expanded && blog.description.length > 120 && (
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto text-muted-foreground text-xs mt-1"
            onClick={() => setExpanded(true)}
          >
            See more <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return viewMode === "grid" ? renderGridCard() : renderFeedCard();
};

export default SocialFeedCard;
