import Link from 'next/link';
import React from "react";
import {IconConvergenceLogo} from "../components/icons/IconConvergenceLogo";

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-center mb-3 text-teal-500 ">
              <div className="w-30 text-teal-500 size-auto">
                <IconConvergenceLogo/>

              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Welcome to the Frontend Developer Task
            </h1>

            <p className="text-gray-600 mb-6 text-center">
              Your task is to build a chat interface that communicates with a backend via WebSockets.
            </p>

            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <h2 className="font-medium text-gray-700 mb-2">Task Overview:</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Build a chat panel at the <code className="bg-gray-200 px-1 rounded">/chat</code> route</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Implement WebSocket communication with the backend</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Create a clean, responsive UI with good user experience</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Follow the detailed requirements in the task document</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Link
                  href="/chat"
                  className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
              >
                Go to Chat Page
              </Link>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-100 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Get started by modifying <code className="bg-gray-200 px-1 rounded">src/app/chat/page.tsx</code>
            </p>
          </div>
        </div>
      </main>
  );
}