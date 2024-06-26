import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import {
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  FreeMode,
} from "swiper/modules";

import Course_Card from "./Course_Card";

const CourseSlider = ({ Courses, description }) => {
  return (
    <>
      {Courses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          modules={[
            Autoplay,
            Navigation,
            Pagination,
            Scrollbar,
            A11y,
            FreeMode,
          ]}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem]"
        >
          {Courses?.map((course, i) => (
            <SwiperSlide key={i}>
              <Course_Card
                course={course}
                description={description}
                Height={"h-[250px]"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="mx-auto w-full flex items-center mt-20 justify-center">
          <p className="text-xl mx-auto   text-richblack-5">No Course Found</p>
        </div>
      )}
    </>
  );
};

export default CourseSlider;
