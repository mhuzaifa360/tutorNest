
import Typography from "../common/Typography";
import { FaStar } from "react-icons/fa";
import { reviews } from "../../assets/constant/reviews";


function StudentReviews() {
  return (
    <section className="w-full py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        {/* TITLE */}
        <div className="text-center mb-12">
          <Typography variant="h2" className="font-bold text-textBlack dark:text-white">
            What Our Students Say
          </Typography>

          <Typography variant="p" className="text-textGrey dark:text-gray-400 mt-3">
            Real success stories from students who achieved their goals with
            TutorNest
          </Typography>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((item, index) => (
            <div
              key={index}
              className="
                bg-lightGreyBG
                dark:bg-slate-800
                p-6
                rounded-2xl
                shadow-sm
                hover:shadow-lg
                transition-all
                duration-300
                flex flex-col
                gap-5
              "
            >
              {/* STARS */}
              <div className="flex gap-1 text-yellow-400">
                {Array(item.rating)
                  .fill()
                  .map((_, i) => (
                    <FaStar key={i} />
                  ))}
              </div>

              {/* TEXT */}
              <Typography className="text-textGrey dark:text-gray-300 leading-relaxed" variant="p">
                "{item.text}"
              </Typography>

              {/* USER */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {item.initials}
                </div>

                <div>
                  <Typography className="font-semibold text-textBlack dark:text-white">
                    {item.name}
                  </Typography>

                  <Typography className="text-sm text-textGrey dark:text-gray-400">
                    {item.role}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StudentReviews;
