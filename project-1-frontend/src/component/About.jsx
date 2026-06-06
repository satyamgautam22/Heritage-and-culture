// src/components/About.jsx
import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="bg-gray-50 py-20">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-10">
        
        {/* Left: Image */}
        <motion.div
          className="lg:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <img
            src="/images/about-image.jpg"
            alt="About Us"
            className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </motion.div>

        {/* Right: Text */}
        <motion.div
          className="lg:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            About Our Company
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We are committed to providing the best travel and tourism experience
            to our customers. With a team of experts and a passion for
            adventure, we bring you the best destinations, curated packages,
            and unforgettable memories.
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Whether you're seeking relaxation or an adrenaline rush, our
            services are tailored to meet every traveler’s needs. Let us guide
            you on a journey you’ll cherish forever.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
            Learn More
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
