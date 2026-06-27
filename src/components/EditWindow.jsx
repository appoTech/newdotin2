import React, { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
const EditLinkForm = ({
  originalURL,
  shortId,
  onSuccess,
  onCancel,
  disabled = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [currentShortId, setCurrentShortId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [verifyingId, setVerifyingId] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [idVerificationResult, setIdVerificationResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [thumbnailSource, setThumbnailSource] = useState("url");
  const [VideoId, setVideoId] = useState("");
  // Domain-safe validation function
  const validateDomainSafeShortId = (id) => {
    if (!id) {
      return { isValid: false, message: "Short ID is required" };
    }

    // Check length (reasonable limits for domain usage)
    if (id.length < 1) {
      return {
        isValid: false,
        message: "Short ID must be at least 1 character long",
      };
    }

    if (id.length > 63) {
      return {
        isValid: false,
        message: "Short ID must be 63 characters or less",
      };
    }

    // Check for domain-safe characters only (alphanumeric and hyphens)
    const domainSafeRegex = /^[a-zA-Z0-9-]+$/;
    if (!domainSafeRegex.test(id)) {
      return {
        isValid: false,
        message: "Short ID can only contain letters, numbers, and hyphens",
      };
    }

    // Cannot start or end with hyphen (domain rule)
    if (id.startsWith("-") || id.endsWith("-")) {
      return {
        isValid: false,
        message: "Short ID cannot start or end with a hyphen",
      };
    }

    // Cannot have consecutive hyphens (domain rule)
    if (id.includes("--")) {
      return {
        isValid: false,
        message: "Short ID cannot contain consecutive hyphens",
      };
    }

    // Reserved words that should not be used as short IDs
    const reservedWords = [
      "www",
      "mail",
      "ftp",
      "localhost",
      "admin",
      "root",
      "api",
      "app",
      "blog",
      "shop",
      "store",
      "news",
      "support",
      "help",
      "about",
      "contact",
      "login",
      "register",
      "signup",
      "signin",
      "logout",
      "dashboard",
      "profile",
      "settings",
      "config",
      "assets",
      "static",
      "cdn",
      "img",
      "images",
      "js",
      "css",
      "fonts",
      "media",
      "uploads",
      "downloads",
      "files",
      "docs",
      "legal",
      "privacy",
      "terms",
      "tos",
      "dmca",
      "security",
      "ssl",
      "tls",
      "http",
      "https",
      "ftp",
      "sftp",
      "ssh",
      "telnet",
      "smtp",
      "pop",
      "imap",
      "dns",
      "mx",
      "ns",
      "cname",
      "txt",
      "spf",
      "dkim",
      "dmarc",
    ];

    if (reservedWords.includes(id.toLowerCase())) {
      return {
        isValid: false,
        message: "This short ID is reserved and cannot be used",
      };
    }

    return { isValid: true, message: "Short ID is domain-safe" };
  };

  // Fetch link data from backend when component mounts
  useEffect(() => {
    console.log(shortId);
    if (shortId) {
      setCurrentShortId(shortId);
      fetchLinkData();
    }
  }, [shortId]);

  const fetchLinkData = async () => {
    setFetchingData(true);
    setError("");

    try {
      console.log("Fetching data for shortId:", shortId);
      const response = await fetch(
        process.env.REACT_APP_API_URL + `yt/preview/${shortId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        // Check if response is HTML (404 page)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          throw new Error(
            `API endpoint not found (${response.status}). Check if /api/get-link/${shortId} exists.`
          );
        }

        // Try to get JSON error message
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        } catch (jsonError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error("Expected JSON but got:", responseText.substring(0, 200));
        throw new Error(
          "Server returned HTML instead of JSON. Check your API endpoints."
        );
      }

      const data = await response.json();
      console.log("Received data:", data);

      // Populate form fields with fetched data
      setVideoId(data.videoId || "");
      setTitle(data.title || "");
      setDescription(data.description || "");
      setThumbnail(data.thumbnail || "");

      // Set initial preview if thumbnail exists
      if (data.thumbnail) {
        setImagePreview(data.thumbnail);
        setThumbnailSource("url");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load link data");
    } finally {
      setFetchingData(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailUrlChange = (e) => {
    const url = e.target.value;
    setThumbnail(url);
    setImagePreview(url);

    // Clear selected file when URL is used
    if (url && selectedFile) {
      setSelectedFile(null);
    }
  };

  // Add missing async function declaration for verifyShortId
  const verifyShortId = async () => {
    if (!currentShortId.trim()) {
      setIdVerificationResult({
        status: "error",
        message: "Please enter a short ID",
      });
      return;
    }

    // Check domain-safe validation first
    const validation = validateDomainSafeShortId(currentShortId);
    if (!validation.isValid) {
      setIdVerificationResult({
        status: "error",
        message: validation.message,
      });
      return;
    }

    setVerifyingId(true);
    setIdVerificationResult(null);

    try {
      // Check if the ID is already in use (assuming an endpoint exists)
      const response = await fetch(
        process.env.REACT_APP_API_URL + `checkShortId/${currentShortId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.exists && data.shortId !== shortId) {
        // ID exists and it's not the current one being edited
        setIdVerificationResult({
          status: "error",
          message: "This short ID is already in use",
        });
      } else if (data.exists && data.shortId === shortId) {
        // ID exists but it's the current one (no change)
        setIdVerificationResult({
          status: "info",
          message: "This is the current short ID",
        });
      } else {
        // ID is available
        setIdVerificationResult({
          status: "success",
          message: "Short ID is available and domain-safe",
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setIdVerificationResult({
        status: "error",
        message: "Failed to verify short ID. Please try again.",
      });
    } finally {
      setVerifyingId(false);
    }
  };

  const handleShopClick = () => {
    const dataToStore = {
      title,
      description,
      thumbnail: thumbnailSource === "upload" ? imagePreview : thumbnail,
      shortId: currentShortId,
      originalURL,
    };

    localStorage.setItem("editLinkData", JSON.stringify(dataToStore));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateDomainSafeShortId(currentShortId);
    if (!validation.isValid) {
      setError(`Invalid Short ID: ${validation.message}`);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();

      // Required fields
      formData.append("link", originalURL);
      if (currentShortId) {
        formData.append("customShortId", currentShortId);
      }

      // Metadata fields (as flat fields, not nested JSON)
      if (title) formData.append("title", title);
      if (description) formData.append("description", description);

      // Handle image
      if (thumbnailSource === "upload" && selectedFile) {
        formData.append("image", selectedFile);
      } else if (thumbnailSource === "url" && thumbnail) {
        formData.append("thumbnail", thumbnail); // image URL manually provided
      }

      const response = await fetch(
        process.env.REACT_APP_API_URL + "createOpenURL",
        {
          method: "POST",
          body: formData, // DO NOT set Content-Type manually
        }
      );

      const updatedData = await response.json();

      if (!response.ok) {
        throw new Error(updatedData.message || "Failed to create link");
      }

      setSuccess(true);

      // Show image if thumbnail was generated or returned
      if (updatedData.metadata?.thumbnail) {
        setThumbnail(updatedData.metadata.thumbnail);
        setImagePreview(updatedData.metadata.thumbnail);
      }

      // Trigger success callback
      setTimeout(() => {
        onSuccess && onSuccess(updatedData);
      }, 1500);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while fetching data
  if (fetchingData) {
    return (
      <div className="max-w-xl mx-auto p-4 bg-gray-900 text-white rounded-md shadow-md max-h-screen overflow-y-auto">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          <span className="ml-3">Loading link data...</span>
        </div>
      </div>
    );
  }

  // Show error if failed to fetch data
  if (error && !title && !description) {
    return (
      <div className="max-w-xl mx-auto p-4 bg-gray-900 text-white rounded-md shadow-md max-h-screen overflow-y-auto">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchLinkData}
            className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-600 transition mr-2"
          >
            Retry
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-600 text-white font-semibold px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-900 text-white rounded-md shadow-md max-h-screen overflow-y-auto">
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Thumbnail Preview"
          className="max-h-[300px] object-cover rounded border border-gray-300"
        />
      )}
    </div>
  );
};

export default EditLinkForm;
