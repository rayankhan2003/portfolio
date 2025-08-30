import { Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black/90 backdrop-blur-sm text-gray-300 text-center py-4 px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <p className="text-md font-semibold">
          Copyright ©2025 All rights are reserved
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/rayankhanwebdev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://github.com/rayankhan2003"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
