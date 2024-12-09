import React from "react";
import Link from "next/link";
import Facebook from "../icons/facebook";
import Twitter from "../icons/twitter";
import Instagram from "../icons/instagram";

const nav_links = [
  { name: "Privacy Policy", url: "#" },
  { name: "Terms of Service", url: "#" },
  { name: "Contact Us", url: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-5 pb-2 text-white">
      <div className="mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-2 md:mb-0">
            <span className="font-bold text-xl">TrackIt</span>
          </div>
          <div className="flex space-x-6">
            <Link
              href="https://x.com/trackitweb3"
              className="hover:text-gray-400"
              aria-label="Twitter"
            >
              <Twitter />
            </Link>
            <Link
              href="https://facebook.com"
              className="hover:text-gray-400"
              aria-label="Facebook"
            >
              <Facebook />
            </Link>
            <Link
              href="https://instagram.com"
              className="hover:text-gray-400"
              aria-label="Instagram"
            >
              <Instagram />
            </Link>
          </div>
          {/* <nav>
            <ul className="flex space-x-4">
              {nav_links.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.url}
                    className="hover:text-gray-300 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav> */}
        </div>
      </div>
    </footer>
  );
}
