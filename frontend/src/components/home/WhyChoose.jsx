import React from "react";
import Typography from "../common/Typography";
import { features } from "../../assets/constant/features";

function WhyChoose() {
  return (
    <section className="w-full py-16 bg-white">
      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        {/* TITLE */}
        <div className="text-center mb-12">
          <Typography variant="h2" className="font-bold text-textBlack">
            Why Choose TutorNest?
          </Typography>

          <Typography variant="h4" className="text-textGrey mt-4">
            Everything you need for a smooth and effective learning experience
          </Typography>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  bg-lightGreyBG
                  rounded-2xl
                  p-6
                  flex flex-col
                  gap-4
                  shadow-sm
                  hover:shadow-lg
                  transition-all
                  duration-300
                "
              >
                {/* ICON */}
                <div className="text-primary text-5xl">
                  <Icon />
                </div>

                {/* TITLE */}
                <Typography
                  variant="h4"
                  className="font-semibold text-textBlack"
                >
                  {item.title}
                </Typography>

                {/* DESC */}
                <Typography
                  variant="body"
                  className="text-textGrey leading-relaxed"
                >
                  {item.desc}
                </Typography>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;
