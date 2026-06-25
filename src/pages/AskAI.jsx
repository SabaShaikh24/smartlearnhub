/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Send, ImageIcon, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function AskAI() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hi! I'm your AI assistant. Ask me anything about your notes or upload an image!",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMessage = { 
      sender: "user", 
      text: input,
      image: selectedImage
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        message: input || "What's in this image?",
        ...(selectedImage && { image: selectedImage })
      };

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      const aiMessage = {
        sender: "ai",
        text: data.reply,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const aiMessage = {
        sender: "ai",
        text: "Sorry, I couldn't connect to the AI service.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setLoading(false);
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Chat Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center p-4 bg-gradient-to-r from-[#b76e8b] to-[#6d2d47] shadow-md"
      >
        <div className="text-2xl font-bold text-white">💬 Ask AI</div>
        <div className="flex justify-end mt-2">
          <button 
           onClick={() => setMessages([{
           sender: "ai",
           text: "👋 Hi! I'm your AI assistant...",
           }])}
         className="text-sm font-semibold text-[#b6517a] hover:text-white transition ml-4"
        >
         🗑️ Clear Chat
        </button>
        </div>
      </motion.div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="flex items-start space-x-2 max-w-xs md:max-w-md">
              {msg.sender === "ai" && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#b6517a] to-[#4c1c2f] flex items-center justify-center text-white text-xs mt-1">
                  AI
                </div>
              )}
              
              <div className="flex flex-col">
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-br-none"
                      : "bg-white text-gray-800 shadow-md rounded-bl-none border border-purple-100"
                  }`}
                >
                  {msg.image && (
                    <div className="mb-2">
                      <img 
                        src={msg.image} 
                        alt="Uploaded" 
                        className="w-32 h-32 object-cover rounded-lg border border-pink-200"
                      />
                    </div>
                  )}
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-400 to-[#512335] flex items-center justify-center text-white text-xs mt-1">
                  You
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#79324e] to-pink-400 flex items-center justify-center text-white text-xs">
                AI
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white text-gray-500 text-sm shadow-md rounded-bl-none border border-purple-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mx-4 mb-2 relative">
          <div className="bg-white rounded-lg p-2 shadow-md inline-block border border-purple-200">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-16 h-16 object-cover rounded"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-pink-500 rounded-full p-1 text-white hover:bg-[#7f3c57] transition"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="sticky bottom-0 bg-white border-t border-purple-200 p-4 shadow-lg"
      >
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="p-2 rounded-full bg-purple-100 text-purple-400 hover:bg-purple-200 transition cursor-pointer"
          >
            <ImageIcon size={18} />
          </label>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question or upload an image..."
            className="flex-1 px-4 py-3 bg-purple-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 border border-purple-200"
          />
          
          <button
            type="submit"
            disabled={!input.trim() && !selectedImage}
            className="p-3 rounded-full bg-gradient-to-r from-[#b6517a] to-pink-500 text-white hover:from-[#4e1d31] hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
