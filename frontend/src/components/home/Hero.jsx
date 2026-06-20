
import Typography from "../common/Typography";
import Btn from "../common/Btn";
import { Link } from "react-router-dom";

import heroImg from "../../assets/images/home/hero.png";

function Hero() {
  return (
    <section className="w-full bg-lightGreyBG dark:bg-slate-950 py-20 transition-colors duration-300">
      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        {/* FLEX WRAPPER */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* LEFT CONTENT */}
          
          <div className="w-full lg:w-1/2 flex flex-col gap-6 text-center lg:text-left">
            <Typography
              variant="h1"
              className="font-bold text-textBlack dark:text-white leading-tight"
            >
              Find Your Perfect Tutor, Learn at Your Pace
            </Typography>

            <Typography variant="h3" className="text-textGrey dark:text-gray-400 leading-relaxed">
              Connect with verified expert tutors for personalized online
              learning. Achieve your academic goals with flexible scheduling and
              one-on-one support.
            </Typography>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link to="/teachers">
                <Btn variant="blue">Find a Tutor</Btn>
              </Link>

              <Link to="/login">
                <Btn variant="white">Become a Tutor</Btn>
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden lg:flex w-full lg:w-1/2 justify-center lg:justify-end ">
            <img
              src={heroImg}
              alt="Hero"
              className="
                w-full
                max-w-[330px]
                h-auto
                object-contain
                transition-transform duration-300
                hover:scale-105
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
