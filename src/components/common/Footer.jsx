import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";

import Logo from "../../assets/Logo/Logo-Full-Light.png";

import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
  return (
    <div className="bg-richblack-800">
      <div className=" w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto py-14 ">
        <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5 border-richblack-700">
          {/* Section 1 */}
          <div className="lg:w-[50%] w-full flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 ">
            <div className="w-[27%] flex flex-col gap-3  mb-7 lg:pl-0">
              <img src={Logo} alt="" className="object-contain" />
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Company
              </h1>
              <div className="flex flex-col gap-2">
                {["About", "Careers", "Affiliates"].map((ele, i) => {
                  return (
                    <div
                      key={i}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={ele.toLowerCase()}>{ele}</Link>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 text-lg">
                <FaFacebook />
                <FaGoogle />
                <FaTwitter />
                <FaYoutube />
              </div>
              <div></div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Resources
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Resources.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={ele.split(" ").join("-").toLowerCase()}>
                        {ele}
                      </Link>
                    </div>
                  );
                })}
              </div>

              <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                Support
              </h1>
              <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                <Link to={"/help-center"}>Help Center</Link>
              </div>
            </div>

            <div className="w-[75%] lg:w-[30%] mb-7 lg:pl-0  flex lg:flex-col flex-row  justify-between lg:justify-normal ">
              <div className="w-[30%]">
                <h1 className="text-richblack-50 font-semibold text-[16px]">
                  Plans
                </h1>

                <div className="flex flex-col gap-2 mt-2">
                  {Plans.map((ele, index) => {
                    return (
                      <div
                        key={index}
                        className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                      >
                        <Link to={ele.split(" ").join("-").toLowerCase()}>
                          {ele}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-[30%]">
                <h1 className="text-richblack-50 font-semibold text-[16px] lg:mt-7">
                  Community
                </h1>

                <div className="flex flex-col gap-2 mt-2">
                  {Community.map((ele, index) => {
                    return (
                      <div
                        key={index}
                        className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                      >
                        <Link to={ele.split(" ").join("-").toLowerCase()}>
                          {ele}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
            {FooterLink2.map((ele, i) => {
              return (
                <div key={i} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                  <h1 className="text-richblack-50 font-semibold text-[16px]">
                    {ele.title}
                  </h1>
                  <div className="flex flex-col gap-2 mt-2">
                    {ele.links.map((link, index) => {
                      return (
                        <div
                          key={index}
                          className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                        >
                          <Link to={link.link}>{link.title}</Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex w-11/12 mx-auto  ">
        <div className="flex lg:flex-row flex-col  w-full gap-5 items-center justify-between max-w-maxContent text-richblack-400   pb-14 text-sm">
          <div className="flex flex-row   ">
            {BottomFooter.map((ele, i) => {
              return (
                <div
                  key={i}
                  className={` ${
                    BottomFooter.length - 1 === i
                      ? ""
                      : "border-r border-richblack-700 "
                  } px-3 cursor-pointer hover:text-richblack-50 transition-all duration-200 `}
                >
                  <Link to={ele.split(" ").join("-").toLocaleLowerCase()}>
                    {ele}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            Made with ❤️ Dipesh © 2024 Studynotion
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
