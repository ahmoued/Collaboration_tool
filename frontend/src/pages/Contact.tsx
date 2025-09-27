import React from "react";
import { Mail, Phone, User, MapPin, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-purple-100 to-slate-200 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-300/20 via-pink-300/15 to-transparent rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-300/20 via-purple-300/15 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-300/10 to-blue-300/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-slate-300/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                CollabEditor
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="/"
                className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Home
              </a>
              <a
                href="/dashboard"
                className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/login"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="bg-white/70 backdrop-blur-sm border border-purple-300/40 rounded-full px-6 py-2 shadow-lg">
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  📞 GET IN TOUCH
                </span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent">
                Contact Me
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Have questions about CollabEditor or want to discuss collaboration
              opportunities? I'd love to hear from you!
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Personal Info Card */}
            <div className="bg-white/90 backdrop-blur-sm border border-slate-300/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                  Developer Info
                </h2>
                <p className="text-slate-600">
                  Get to know the creator behind CollabEditor
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-200/30">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Full Name
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                      Ahmed Ouederni
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-200/30">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Location
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                      Tunisia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Methods Card */}
            <div className="bg-white/90 backdrop-blur-sm border border-slate-300/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                  Contact Methods
                </h2>
                <p className="text-slate-600">
                  Choose your preferred way to reach out
                </p>
              </div>

              <div className="space-y-6">
                <a
                  href="mailto:ouederni.ahmid@gmail.com"
                  className="flex items-center space-x-4 p-4 bg-green-50/50 rounded-2xl border border-green-200/30 hover:bg-green-100/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Email Address
                    </p>
                    <p className="text-lg font-semibold text-slate-800 group-hover:text-green-700">
                      ouederni.ahmid@gmail.com
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+1234567890"
                  className="flex items-center space-x-4 p-4 bg-pink-50/50 rounded-2xl border border-pink-200/30 hover:bg-pink-100/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Phone Number
                    </p>
                    <p className="text-lg font-semibold text-slate-800 group-hover:text-pink-700">
                      +216 53 670 417
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="bg-white/70 backdrop-blur-sm border border-purple-300/40 rounded-3xl p-12 shadow-2xl text-center">
            <h3 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Let's Build Something Amazing Together
              </span>
            </h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Whether you have questions about CollabEditor, want to report a
              bug, suggest a feature, or discuss collaboration opportunities,
              I'm always excited to connect with fellow creators and innovators.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href="mailto:ouederni.ahmid@gmail.com"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Send Email
              </a>
              <a
                href="/"
                className="bg-white/80 backdrop-blur-sm border border-slate-300/50 hover:border-purple-400/50 text-slate-700 hover:text-purple-700 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-sm border-t border-slate-300/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                CollabEditor
              </span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2025 CollabEditor. Created by Ahmed Moued with ✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
