
import Typography from "../components/common/Typography";

function Contact() {
  return (
    <div className="w-full bg-white dark:bg-slate-950 text-textBlack dark:text-white transition-colors duration-300">
      {/* HERO / TITLE */}
      <section className="bg-lightGreyBG dark:bg-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 text-center">
          <Typography variant="h2" className="font-bold text-textBlack dark:text-white">
            Get in Touch
          </Typography>

          <Typography className="text-textGrey dark:text-gray-400 mt-3 max-w-2xl mx-auto">
            Have questions? We’d love to hear from you. Send us a message and
            we’ll respond as soon as possible.
          </Typography>
        </div>
      </section>

      {/* MAIN SECTION */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 grid md:grid-cols-2 gap-10">
          {/* FORM */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700">
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-textBlack dark:text-white placeholder:text-gray-400 p-3 rounded-lg outline-none focus:border-primary"
              />

              <input
                type="email"
                placeholder="your@email.com"
                className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-textBlack dark:text-white placeholder:text-gray-400 p-3 rounded-lg outline-none focus:border-primary"
              />

              <textarea
                placeholder="Tell us how we can help..."
                rows="5"
                className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-textBlack dark:text-white placeholder:text-gray-400 p-3 rounded-lg outline-none focus:border-primary"
              />

              <button
                type="submit"
                className="bg-primary text-white py-3 rounded-lg hover:opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* CONTACT INFO */}
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700">
              <Typography className="font-semibold mb-1 text-textBlack dark:text-white">Email</Typography>
              <Typography className="text-textGrey dark:text-gray-400">
                support@tutornest.com
              </Typography>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700">
              <Typography className="font-semibold mb-1 text-textBlack dark:text-white">Phone</Typography>
              <Typography className="text-textGrey dark:text-gray-400">
                +1 (555) 123-4567
              </Typography>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700">
              <Typography className="font-semibold mb-1 text-textBlack dark:text-white">Office</Typography>
              <Typography className="text-textGrey dark:text-gray-400">
                123 Education Street, San Francisco, CA 94102
              </Typography>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
