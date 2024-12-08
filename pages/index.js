// pages/index.js

import AboutUs from '@/components/AboutUs';
import PublicRoute from '@/hoc/PublicRoute';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Health Tracker</title>
        <meta name="description" content="Monitor and manage your health metrics effortlessly." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center bg-blue-600">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome to Health Tracker
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Your companion for monitoring and managing your health metrics.
            </p>
            <a
              href="/register"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-300"
            >
              Get Started
            </a>
          </div>
        </section>

        {/* About Us Section */}
        <AboutUs />

        {/* Additional Sections (Features, Testimonials, etc.) can go here */}
      </main>

      {/* Footer */}
      <footer className="py-6 bg-gray-800">
        <div className="container mx-auto text-center text-gray-400">
          &copy; {new Date().getFullYear()} Health Tracker. All rights reserved.
        </div>
      </footer>
    </>
  );
}

Home.getLayout = function getLayout(page) {
    return <PublicRoute>{page}</PublicRoute>;
  };
