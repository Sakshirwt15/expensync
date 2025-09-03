import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import styles from "../style";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Stats from "../components/Stats";
import Business from "../components/Business";
import Billing from "../components/Billing";
import CardDeal from "../components/CardDeal";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Clients from "../components/Clients";
import Footer from "../components/Footer";

const Landing = () => {
  const { theme } = useTheme();

  // Get API URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Test backend connection
  useEffect(() => {
    console.log("Testing backend connection to:", API_BASE_URL);

    fetch(API_BASE_URL)
      .then((res) => res.text())
      .then((data) => {
        console.log("✅ Backend connection successful:", data);
      })
      .catch((err) => {
        console.error("❌ Backend connection failed:", err);
        console.error("Make sure your backend is running at:", API_BASE_URL);
      });
  }, [API_BASE_URL]);

  return (
    <div
      className={`bg-[var(--color-primary)] text-[var(--color-dim-white)] w-full overflow-hidden ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      <Navbar />
      <div
        className={`bg-[var(--color-primary)] text-[var(--color-dim-white)] ${styles.flexStart}`}
      >
        <div className={`${styles.boxWidth}`}>
          <Hero />
        </div>
      </div>
      <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Stats />
          <Business />
          <Billing />
          <CardDeal />
          <Testimonials />
          <Clients />
          <CTA />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
