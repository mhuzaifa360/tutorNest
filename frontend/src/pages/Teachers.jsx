import React, { useState } from "react";
import {teachers} from "../assets/constant/teachersData"
import Typography from "../components/common/Typography";
import Btn from "../components/common/Btn";

function Teachers() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [price, setPrice] = useState("All");

  // FILTER LOGIC
  const filtered = teachers.filter((t) => {
    const matchName = t.name.toLowerCase().includes(search.toLowerCase());

    const matchSubject = subject === "All" || t.subjects.includes(subject);

    const matchPrice =
      price === "All" ? true : price === "low" ? t.price <= 45 : t.price > 45;

    return matchName && matchSubject && matchPrice;
  });

  return (
    <section className="w-full py-20 bg-lightGreyBG">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        {/* TITLE */}
        <div className="text-center mb-10">
          <Typography variant="h2" className="font-bold">
            Find Your Perfect Tutor
          </Typography>

          <Typography className="text-textGrey mt-2">
            Browse our verified tutors and find the perfect match for your
            learning needs
          </Typography>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search tutors..."
            className="w-full md:w-1/2 p-3 rounded-xl border outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* SUBJECT */}
          <select
            className="w-full md:w-1/4 p-3 rounded-xl border"
            onChange={(e) => setSubject(e.target.value)}
          >
            <option>All</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Computer Science</option>
            <option>Programming</option>
            <option>English</option>
            <option>Chemistry</option>
            <option>Biology</option>
          </select>

          {/* PRICE */}
          <select
            className="w-full md:w-1/4 p-3 rounded-xl border"
            onChange={(e) => setPrice(e.target.value)}
          >
            <option value="All">All Prices</option>
            <option value="low">Below $45</option>
            <option value="high">Above $45</option>
          </select>
        </div>

        {/* RESULTS */}
        <p className="text-textGrey mb-6">{filtered.length} tutors found</p>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition flex flex-col gap-3 items-center"
            >
              {/* INITIALS */}
              <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-full font-bold">
                {t.initials}
              </div>

              {/* NAME */}
              <Typography className="font-semibold">{t.name}</Typography>

              {/* SUBJECTS */}
              <div className="flex flex-wrap gap-2">
                {t.subjects.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs bg-lightGreyBG px-2 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* RATING */}
              <Typography className="text-textGrey">
                ⭐ {t.rating} ({t.reviews})
              </Typography>

              {/* PRICE */}
              <Typography className="font-semibold">${t.price}/hour</Typography>

              {/* BUTTON */}
              <Btn variant="blue">
                View Profile
              </Btn>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Teachers;
