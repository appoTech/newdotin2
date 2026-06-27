import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { FileText, Check, CreditCard, Gift } from "lucide-react";
import { SaturnSVG } from "./AnimatedTokens";
import { Card, CardContent } from "./ui/card";
import { useHistory } from "react-router-dom";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import MarkdownRenderer from "../components/markdownrenderer";
import axios from "axios";
import { AddBlog, ValidateToken, generateDescAndMetaTags } from "../helper/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AddBlogForm = ({ onClose }) => {
  const navigate = useHistory();
  const [BannerImageUrl, setBannerImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPurchasedToken, setHasPurchasedToken] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tokenValidationMode, setTokenValidationMode] = useState(false);
  const [tokenValue, setTokenValue] = useState("");
  const [token, settoken] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [BannerImageError, setBannerImageError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    imageLink: "",
    category: "Technology",
    content: "",
    token: "",
    metaTags: [],
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [editor, setEditor] = useState(null); // Store EasyMDE editor instance3

  const [generatedDescriptions, setGeneratedDescriptions] = useState([]);
  const [metaTags, setMetaTags] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const easyMDERef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // validateForm();
  };
  useEffect(() => {
    const savedFormData = localStorage.getItem("blogFormData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("blogFormData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const easyMDEInstance = new EasyMDE({
      element: document.getElementById("markdown-editor"),
      spellChecker: false,
      toolbar: [
        "bold",
        "italic",
        "strikethrough",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        "code",
        "table",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "|",
        "guide",
      ],
    });
    setEditor(easyMDEInstance);

    // Set initial content of the editor
    easyMDEInstance.value(formData.content);

    // Listen for content changes and update formData
    easyMDEInstance.codemirror.on("change", () => {
      setFormData((prevData) => ({
        ...prevData,
        content: easyMDEInstance.value(),
      }));
    });
    return () => {
      // easyMDEInstance.toTextArea();
    };
  }, []);

  useEffect(() => {
    if (editor) {
      // Only set content if editor is empty
      if (!editor.value()) {
        editor.value(formData.content);
      }
    }
  }, [editor]);

  useEffect(() => {
    // Auto-detect user's currency based on browser locale
    try {
      const userLocale = navigator.language;
      const formatter = new Intl.NumberFormat(userLocale, {
        style: "currency",
        currency: "USD",
      });
      const symbol = formatter.format(0).replace(/[\d\., ]/g, "");
      // setCurrencySymbol(symbol);
    } catch (error) {
      console.error("Error detecting currency:", error);
    }
  }, []);

  const validateForm = () => {
    // Check name
    if (!formData.name.trim()) {
      toast.error("Author name is required");
      return false;
    }
    if (formData.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return false;
    }
    // Check title
    if (!formData.title.trim()) {
      toast.error("Blog title is required");
      return false;
    }

    // Check description
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (formData.description.trim().length < 50) {
      toast.error("Description must be at least 50 characters long");
      return false;
    }
    // Check content (min 50 words)
    const wordCount = formData.content
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    if (!formData.content.trim()) {
      toast.error("Content is required");
      return false;
    }
    if (wordCount < 50) {
      toast.error("Content must be at least 50 words long");
      return false;
    }
    if (!selectedFile) {
      toast.error("Banner image is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasPurchasedToken && !isFeatured) {
      toast({
        title: "Token Required",
        description: "You need to purchase a token to create a blog post.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setResponseMessage("");

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("content", formData.content);
      form.append("category", formData.category);
      form.append("image", selectedFile);
      // Optional: include metaTags if needed
      if (formData.metaTags.length > 0) {
        form.append("metaTags", JSON.stringify(formData.metaTags));
      }
      // or wherever you store it
      const res = await axios.post(
        `${process.env.REACT_APP_BLOG_API_URL}addBlog`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        toast({
          title: "Success",
          description: "Blog added successfully!",
        });
        toast.success(`${res.data.msg}`);
        setFormData({
          name: "",
          title: "",
          description: "",
          imageLink: "",
          category: "Technology",
          content: "",
          token: "",
          metaTags: [],
        });
        if (editor) editor.value("");
        localStorage.removeItem("blogFormData");
        setBannerImageUrl("");
        setImagePreview("");
        setSelectedFile(null);
      } else {
        toast({
          title: "Failed",
          description: "Something went wrong. Try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Server Error",
        description: error?.response?.data?.error || "Unable to submit blog.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setBannerImageError("Please select a valid image file");
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setBannerImageError("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setBannerImageError("");

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
    setBannerImageUrl(url);
    setImagePreview(url);

    // Clear selected file when URL is used
    if (url && selectedFile) {
      setSelectedFile(null);
    }
  };

  // const generateDescriptionAndMeta = async () => {
  //   try {
  //     const data = await generateDescAndMetaTags(formData.title);

  //     if (data && data.choices && data.choices.length > 0) {
  //       try {
  //         const parsedContent = JSON.parse(data.choices[0].message.content);
  //         setGeneratedDescriptions(parsedContent.descriptions || []);
  //         setMetaTags(parsedContent.metaTags || []);
  //         setFormData((prevData) => ({
  //           ...prevData,
  //           metaTags: parsedContent.metaTags || [],
  //         }));
  //         setShowModal(true); // ✅ Show modal only if data is valid
  //       } catch (parseError) {
  //         console.error("Error parsing response content:", parseError);
  //         alert(
  //           "Error processing the generated descriptions. Please try again."
  //         );
  //       }
  //     } else {
  //       console.error("Unexpected API response structure:", data);
  //       alert("Unexpected response from the AI. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error generating descriptions:", error);
  //     alert(
  //       "Failed to fetch AI-generated descriptions. Please check your internet connection and try again."
  //     );
  //   }
  // };

  const handleTokenValidate = async () => {
    // Mark function as async
    if (!tokenValue.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter a valid token.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate token validation
      const res = await ValidateToken(tokenValue);
      if (res.success === 1) {
        settoken(tokenValue);
        setTimeout(() => {
          setHasPurchasedToken(true);
          setIsSubmitting(false);
          setTokenValidationMode(false);
          toast({
            title: "Token Validated!",
            description: "Token activated. You can now create your blog post.",
          });
        }, 800);
      } else if (res.success === 3) {
        settoken("");
        alert("Invalid Token");
      } else {
        alert(
          "Error Occurred. Try again! \n If the error still persists, try again later."
        );
      }
    } catch (error) {
      console.error("Token validation error:", error);
      toast({
        title: "Validation Failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Token Validation/Purchase Section at the top */}
      <Card
        className={`mb-8 overflow-hidden border-gold/30 ${
          hasPurchasedToken ? "" : "bg-gray-400"
        }`}
      >
        <CardContent className="p-4 font-semibold">
          <div className="flex flex-col gap-4">
            {/* Title and Icon Section */}
            <div className="flex items-center gap-3">
              <SaturnSVG className="h-8 w-8 sm:h-10 sm:w-10 animate-float" />
              <div>
                <h3 className="font-bold text-yellow-500 animate-shimmer text-base sm:text-lg">
                  Premium Ink
                </h3>
                <p className="text-xs sm:text-sm text-white">
                  Fuel your creativity
                </p>
              </div>
            </div>

            {/* Token Actions Section */}
            {!hasPurchasedToken ? (
              tokenValidationMode ? (
                <div className="flex flex-col sm:flex-row gap-2 font-semibold w-full">
                  <input
                    value={tokenValue}
                    onChange={(e) => setTokenValue(e.target.value)}
                    placeholder="Enter your token"
                    className="flex-1 w-full px-3 text-black py-2 sm:px-4 sm:py-3 border rounded-lg focus:outline-none focus:ring-2"
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      onClick={handleTokenValidate}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? "Validating..." : "Validate"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setTokenValidationMode(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setTokenValidationMode(true)}
                    className="flex items-center gap-2 w-full sm:w-auto font-semibold"
                  >
                    <CreditCard className="h-4 w-4" /> I have a token
                  </Button>
                  <Button
                    onClick={() => navigate.push("/getToken")}
                    className="bg-gold text-white font-semibold hover:bg-gold/90 flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Gift className="h-4 w-4" />
                    Get Tokens
                  </Button>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <div className="bg-primary/10 px-3 py-1 rounded-full flex items-center gap-2">
                  <SaturnSVG className="h-5 w-5" />
                  {isFeatured ? (
                    <span className="gold-text font-semibold">
                      Premium token active
                    </span>
                  ) : (
                    <span className="font-semibold">Standard token active</span>
                  )}
                  <Check className="h-8 w-8 text-green-500" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {responseMessage && (
        <Card className="z-2">
          <CardContent>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                <h2 className="text-lg font-bold mb-2">
                  Blog Added Successfully!
                </h2>
                <p className="text-sm mb-4">{responseMessage}</p>
                <Link to="/blog">
                  <button className="bg-green-500   px-4 py-2 rounded">
                    Go to blogs
                  </button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="max-w-[100%] sm:max-w-4xl text-white py-2 bg-none">
        <form className="space-y-4">
          <div>
            <label className="block font-semibold">Author Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Author Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-2 sm:px-4 py-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Blog Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter Blog Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-2 sm:px-4 py-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white font-semibold">
              Banner Image{" "}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full text-sm mt-1 text-white file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            {selectedFile && (
              <p className="text-sm text-gray-500 mt-1">
                {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Thumbnail Preview"
                className="mt-3 w-[500px] h-[300px] object-cover rounded border border-gray-300"
              />
            )}
          </div>
          <div>
            <label className="block font-semibold">Category</label>
            <select
              className="w-full px-2 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-black"
              name="category"
              onChange={handleChange}
              value={formData.category}
            >
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Travel">Travel</option>
              <option value="Education">Education</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          <div className="mb-4 flex flex-col">
            <label className="block font-semibold">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Enter Blog Description (min 50 characters)"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-2 sm:px-4 py-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {/*<button
              type="button"
              onClick={generateDescriptionAndMeta}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 float-right"
            >
              Generate Description
            </button> */}
          </div>

          <div className="mt-4">
            <label className="block font-semibold">Content</label>
            <textarea
              id="markdown-editor"
              name="content"
              placeholder="Write your blog content in markdown (min 50 words)"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-2 sm:px-4 py-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={10}
              required
            />
          </div>
        </form>

        {/* {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96 text-black">
              <h2 className="text-lg font-semibold">Select a Description</h2>
              <div className="space-y-2 mt-4">
                {generatedDescriptions.map((desc, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setFormData({ ...formData, description: desc });
                      setShowModal(false);
                    }}
                  >
                    {desc}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )} */}

        <div className="mt-6">
          <h2 className="text-lg sm:text-xl font-bold">Content Preview</h2>
          <div className="p-4 border bg-black border-gray-300 rounded-lg mt-2">
            <MarkdownRenderer content={formData.content} />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 pt-6 mt-2 border-t">
        <div className="flex items-center justify-center">
          {!hasPurchasedToken && !isFeatured && (
            <div className="flex gap-2 items-center text-sm  ">
              <SaturnSVG className="h-5 w-5" />
              <span>Token required</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="font-semibold w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-sky-500 text-black font-semibold w-full sm:w-auto"
          >
            {isSubmitting ? "Creating..." : "Create Blog Post"}
            <FileText className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddBlogForm;
