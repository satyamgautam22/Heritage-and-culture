import React from "react";
import Navbar from "../component/Navbar";
import GallerySection from "../gallery/GallerySection"; 
import dance from "../assets/dance.jpg";

const user = {
    name: "Satyam",
  };

export default function Home() {
  return (
    <div className="bg-[#F8F5F0] overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: `url(${dance})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">
          <span className="uppercase tracking-[6px] text-amber-300">
            India's Living Heritage
          </span>

          <h1 className="text-5xl md:text-7xl font-bold mt-4 leading-tight">
            Discover the
            <span className="block text-amber-300">
              Soul of India
            </span>
          </h1>

          <p className="max-w-xl mt-6 text-lg text-gray-200">
            Explore monuments, festivals, traditions,
            food, languages and stories from every corner
            of India.
          </p>

          <div className="flex gap-4 mt-8 flex-wrap">
            <a
              href="#gallery"
              className="px-7 py-3 bg-amber-600 rounded-full"
            >
              Explore Gallery
            </a>

            <a
              href="/login"
              className="px-7 py-3 border border-white rounded-full"
            >
              Login
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-6">
          {[
            ["5000+", "Photos"],
            ["1000+", "Locations"],
            ["28", "States"],
            ["100+", "Contributors"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="bg-white rounded-3xl p-8 shadow-lg text-center"
            >
              <h3 className="text-4xl font-bold text-amber-700">
                {value}
              </h3>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <img
            src={dance}
            alt=""
            className="rounded-3xl shadow-xl"
          />

          <div>
            <h2 className="text-5xl font-bold">
              India's Heritage in One Place
            </h2>

            <p className="mt-6 text-gray-600 leading-8">
              Discover monuments, festivals, crafts,
              traditions, cuisines and stories that
              define the identity of India.
            </p>

            <div className="mt-8 space-y-3">
              <p>✓ Ancient Monuments</p>
              <p>✓ Cultural Traditions</p>
              <p>✓ Regional Festivals</p>
              <p>✓ Folk Arts & Crafts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-5xl font-bold mb-14">
            Explore Heritage
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "🏛 Monuments",
              "🎭 Festivals",
              "🍛 Cuisine",
              "🎨 Arts",
              "🕌 Architecture",
              "📜 Traditions",
            ].map((item) => (
              <div
                key={item}
                className="p-10 rounded-3xl shadow-lg hover:-translate-y-2 transition"
              >
                <h3 className="text-2xl font-bold">
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Existing Gallery */}
      <section id="gallery">
        <GallerySection />
      </section>

      {/* CTA */}
     {user ? (
  <section className="py-24">
    <div className="max-w-4xl mx-auto text-center px-6">
      <h2 className="text-5xl font-bold">
        Welcome Back, {user.name}
      </h2>

      <p className="mt-6 text-gray-600">
        Continue sharing India's heritage with the community.
      </p>

      <a
        href="/dashboard"
        className="inline-block mt-8 px-8 py-3 bg-amber-600 text-white rounded-full"
      >
        Go To Dashboard
      </a>
    </div>
  </section>
) : (
  <section className="py-24">
    {/* Login/Register section */}
  </section>
)}

      <footer className="bg-[#1F1F1F] text-white py-10 text-center">
        <h3 className="text-2xl font-bold">
          Heritage India
        </h3>

        <p className="text-gray-400 mt-2">
          Preserving culture, traditions and stories.
        </p>
      </footer>
    </div>
  );
}