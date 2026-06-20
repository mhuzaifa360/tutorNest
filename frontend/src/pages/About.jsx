
import Typography from "../components/common/Typography"

function About() {
  return (
    <div className="w-full bg-white dark:bg-slate-950 text-textBlack dark:text-white transition-colors duration-300">

      {/* HERO SECTION */}
      <section className="bg-lightGreyBG dark:bg-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 text-center">

          <Typography variant="h2" className="font-bold text-textBlack dark:text-white">
            About TutorNest
          </Typography>

          <Typography className="text-textGrey dark:text-gray-400 mt-4 max-w-3xl mx-auto">
            We're on a mission to make quality education accessible to everyone through personalized online tutoring
          </Typography>

        </div>
      </section>

      {/* MISSION + VISION */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 grid md:grid-cols-2 gap-10">

          {/* MISSION */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-200 dark:border-slate-700">
            <Typography variant="h3" className="font-bold mb-3 text-textBlack dark:text-white">
              Our Mission
            </Typography>

            <Typography className="text-textGrey dark:text-gray-400 leading-relaxed" variant="p">
              At TutorNest, we believe every student deserves access to high-quality, personalized education. Our mission is to connect learners with expert tutors who can provide tailored guidance, helping students achieve their academic goals and unlock their full potential.
            </Typography>
          </div>

          {/* VISION */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-200 dark:border-slate-700">
            <Typography variant="h3" className="font-bold mb-3 text-textBlack dark:text-white" >
              Our Vision
            </Typography>

            <Typography className="text-textGrey dark:text-gray-400 leading-relaxed" variant="p">
              We envision a world where geography and circumstances don't limit educational opportunities. Through our platform, we're building a global community of learners and educators, making knowledge accessible anytime, anywhere.
            </Typography>
          </div>

        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="bg-lightGreyBG dark:bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">

          <div className="text-center mb-12">
            <Typography variant="h2" className="font-bold text-textBlack dark:text-white">
              What Makes Us Different
            </Typography>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* CARD 1 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm text-center border border-transparent dark:border-slate-800">
              <div className="text-3xl font-bold text-primary mb-3">1</div>
              <Typography variant="h4" className="font-semibold mb-2 text-textBlack dark:text-white">
                Verified Experts
              </Typography>
              <Typography className="text-textGrey dark:text-gray-400">
                All our tutors are thoroughly vetted professionals with proven teaching experience
              </Typography>
            </div>

            {/* CARD 2 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm text-center border border-transparent dark:border-slate-800">
              <div className="text-3xl font-bold text-primary mb-3">2</div>
              <Typography variant="h4" className="font-semibold mb-2 text-textBlack dark:text-white">
                Flexible Learning
              </Typography>
              <Typography className="text-textGrey dark:text-gray-400">
                Learn at your own pace with scheduling that fits your lifestyle
              </Typography>
            </div>

            {/* CARD 3 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm text-center border border-transparent dark:border-slate-800">
              <div className="text-3xl font-bold text-primary mb-3">3</div>
              <Typography variant="h4" className="font-semibold mb-2 text-textBlack dark:text-white">
                Personalized Approach
              </Typography>
              <Typography className="text-textGrey dark:text-gray-400">
                One-on-one sessions tailored to your unique learning style and goals
              </Typography>
            </div>

          </div>

        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">

          <div className="text-center mb-12">
            <Typography variant="h2" className="font-bold text-textBlack dark:text-white">
              Meet Our Team
            </Typography>

            <Typography className="text-textGrey dark:text-gray-400 mt-3">
              Dedicated professionals working to transform online education
            </Typography>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* MEMBER 1 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm text-center border border-gray-200 dark:border-slate-700">
              <div className="w-14 h-14 mx-auto bg-primary text-white rounded-full flex items-center justify-center font-bold mb-3">
                MH
              </div>
              <Typography className="font-semibold text-textBlack dark:text-white">Muhammad Huzaifa</Typography>
              <Typography className="text-sm text-textGrey dark:text-gray-400 mb-2">
                Founder & CEO
              </Typography>
              <Typography className="text-textGrey dark:text-gray-400 text-sm">
                Full-stack developer focused on building TutorNest as a scalable online learning platform that connects students with quality tutors.
              </Typography>
            </div>

            {/* MEMBER 2 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm text-center border border-gray-200 dark:border-slate-700">
              <div className="w-14 h-14 mx-auto bg-primary text-white rounded-full flex items-center justify-center font-bold mb-3">
                IK
              </div>
              <Typography className="font-semibold text-textBlack dark:text-white">Ihsan Ullah Khan</Typography>
              <Typography className="text-sm text-textGrey dark:text-gray-400 mb-2">
                Co-Developer
              </Typography>
              <Typography className="text-textGrey dark:text-gray-400 text-sm">
              Collaborating on TutorNest as a frontend/backend development partner, helping in building and improving features using React and Node.js.
              </Typography>
            </div>

        

          </div>

        </div>
      </section>

    </div>
  );
}

export default About;
