import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Skeleton from "./Skeleton";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 dark:text-gray-100 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.length === 0
          ? Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="p-4 border border-blue-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
                >
                  <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
          : doctors.slice(0, 10).map((item, index) => (
              <div
                onClick={() => {
                  navigate(`/appointment/${item._id}`);
                  scrollTo(0, 0);
                }}
                className="group border border-blue-200 dark:border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-gray-800"
                key={index}
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    className="bg-blue-50 dark:bg-gray-700 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    src={item.image}
                    alt=""
                  />
                </div>
                <div className="p-4">
                  <div
                    className={`flex items-center gap-2 text-sm text-center ${item.available ? "text-green-500" : "text-gray-500"}`}
                  >
                    <p
                      className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-gray-500"}`}
                    ></p>
                    <p>{item.available ? "Available" : "Not Available"}</p>
                  </div>
                  <p className="text-gray-900 dark:text-white text-lg font-medium mt-1">
                    {item.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.speciality}
                  </p>
                </div>
              </div>
            ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:border dark:border-gray-700 px-12 py-3 rounded-full mt-10 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
      >
        more
      </button>
    </div>
  );
};

export default TopDoctors;
