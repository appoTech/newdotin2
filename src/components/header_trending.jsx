import { Link } from "react-router-dom";

import appOpnr from "../assets/AppOpener.png";

const HeaderTrending = () => {
  return (
    <div className="flex flex-col bg-gray-800 flex-solid ">
      <header
        className={`fixed z-50 bg-gradient-to-r from-gray-800 to-gray-950 top-0 left-0 right-0 transition-all duration-300`}
      >
        <div className="container flex items-center justify-between h-full px-4 md:px-6 ">
       
          <Link
            to="/"
            className="flex items-center justify-center gap-2 no-underline my-2"
          >
            <img src={appOpnr} alt="Logo" className="w-12 h-12" />
            <span className="navbar-brand text-3xl font-rubik font-semibold text-white">
              AppOpener
            </span>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default HeaderTrending;
