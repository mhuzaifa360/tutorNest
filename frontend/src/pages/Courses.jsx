import React from "react";
import Typography from "../components/common/Typography";
import { courses } from "../assets/constant/coursesData";

function Courses() {
  return (
    <section className="w-full py-20 bg-lightGreyBG">
      {/* CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        {/* TITLE */}
        <div className="text-center mb-12">
          <Typography variant="h2" className="font-bold">
            Our Courses
          </Typography>

          <Typography className="text-textGrey mt-3">
            Explore our comprehensive range of courses designed to help you
            excel in your studies
          </Typography>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="
                bg-white
                rounded-2xl
                p-6
                shadow-sm
                hover:shadow-lg
                transition-all
                duration-300
                flex flex-col
                gap-4
              "
            >
              {/* TITLE */}
              <Typography className="font-semibold text-lg text-textBlack">
                {course.title}
              </Typography>

              {/* DESCRIPTION */}
              <Typography className="text-textGrey">{course.desc}</Typography>

              {/* META INFO */}
              <div className="flex justify-between text-sm text-textGrey">
                <span>👨‍🎓 {course.students} students</span>
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs">
                  {course.level}
                </span>
              </div>

              {/* BUTTON */}
              <button className="mt-2 bg-primary text-white py-2 rounded-lg hover:opacity-90 transition">
                Join Course
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Courses;
