// components/AboutUs.js

import Image from "next/image";


export default function AboutUs() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:flex-row items-center">
          {/* Textual Content */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              About Us
            </h2>
            <p className="text-gray-600 mb-6">
              Welcome to Health Tracker, your companion for monitoring and managing your health metrics effortlessly. Our mission is to empower you to take control of your health by providing intuitive tools to track your blood pressure, sugar levels, and more.
            </p>
            <p className="text-gray-600 mb-6">
              With Health Tracker, you can:
            </p>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884l8.496 5.236a1 1 0 001.105-.882V4a1 1 0 00-1.658-.753L2.003 5.884z" />
                  <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0z" />
                </svg>
                Log and monitor your daily health metrics.
              </li>
              {/* Repeat for other list items */}
            </ul>
            <a
              href="/register"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300 transform hover:scale-105"
            >
              Get Started
            </a>
          </div>

          {/* Image or Illustration */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src="https://mycityhospital.pk/wp-content/uploads/2024/01/shutterstock_1561815367.jpg" // Replace with your image path
              alt="Health Tracker Illustration"
              width={500}
              height={500}
              className="object-contain"
            />
   
          </div>
        </div>
      </div>
    </section>
  );
}
