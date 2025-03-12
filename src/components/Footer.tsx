
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-200 dark:bg-gray-900 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Brawl Stars Explorer</h3>
            <p className="">
              Track your stats, discover brawlers, and stay updated with the latest events.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/brawlers" className="text-gray-200 hover:text-primary transition-colors">
                  Brawlers
                </Link>
              </li>
              <li>
                <Link to="/maps" className=" hover:text-primary transition-colors">
                  Maps
                </Link>
              </li>
              <li>
                <Link to="/events" className=" hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://blog.brawlstars.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:text-primary transition-colors"
                >
                  Official Blog
                </a>
              </li>
              <li>
                <a 
                  href="https://help.supercell.com/brawl-stars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:text-primary transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} Brawl Stars Explorer. This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it.
          </p>
        </div>
      </div>
    </footer>
  );
};
