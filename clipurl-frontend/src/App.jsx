import React, { useState } from 'react';
import { Link, Copy, Check, Scissors, Globe } from 'lucide-react';
import axios from "axios";
import dotenv from "dotenv";
export default function App() {
  const [longUrl, setLongUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleShorten = async () => {
    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(longUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError('');
    
    setTimeout(async () => {
      const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/shorten`, {
      originalUrl:longUrl,
      customAlias:customName,
      })
      setShortUrl(data.shortUrl);
      setIsLoading(false);
    }, 1000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setLongUrl('');
    setShortUrl('');
    setError('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl mr-4">
              <Scissors className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-white tracking-tight">
              Clip<span className="text-purple-300">URL</span>
            </h1>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Transform your long URLs into short, shareable links in seconds
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="space-y-6">
              {/* URL Input */}
              <div className="space-y-2">
                <label className="block text-white font-medium mb-2">
                  <Globe className="inline w-5 h-5 mr-2" />
                  Enter your long URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={longUrl}
                    onChange={(e) => {
                      setLongUrl(e.target.value);
                      setError('');
                    }}
                    placeholder="https://example.com/very-long-url-that-needs-shortening"
                    className="w-full p-4 bg-white/5 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                  />
                  
                  <input
                    type="url"
                    value={customName}
                    onChange={(e) => {
                      setCustomName(e.target.value);
                      setError('');
                    }}
                    placeholder="Write the custom name you want to give your link"
                    className="w-full mt-4 p-4 bg-white/5 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </div>

              {/* Shorten Button */}
              <button
                onClick={handleShorten}
                disabled={isLoading || !longUrl.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Shortening...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    <span>Shorten URL</span>
                  </>
                )}
              </button>

              {/* Output Section */}
              {shortUrl && (
                <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/20">
                  <div className="flex items-center space-x-2 text-green-400">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">URL shortened successfully!</span>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-white font-medium">
                      <Link className="inline w-5 h-5 mr-2" />
                      Your shortened URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={shortUrl}
                        readOnly
                        className="flex-1 p-4 bg-white/5 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={handleCopy}
                        className="px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleReset}
                      className="text-white/70 hover:text-white transition-colors underline"
                    >
                      Shorten another URL
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Scissors className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
              <p className="text-white/70">Shorten your URLs in seconds with our optimized platform</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="text-white font-semibold mb-2">Global Access</h3>
              <p className="text-white/70">Your shortened links work everywhere, anytime</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Link className="w-6 h-6 text-green-300" />
              </div>
              <h3 className="text-white font-semibold mb-2">Clean & Simple</h3>
              <p className="text-white/70">Beautiful, memorable links that are easy to share</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}