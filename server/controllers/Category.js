const Category = require("../models/Category.js");

exports.createCategory = async (req, res) => {
  try {
    const { categoryname, description } = req.body;
    if (!categoryname || !description) {
      return res.status(402).json({
        success: false,
        message: "error in creating Category due to missing data",
      });
    }

    const categoryDetails = await Category.create({
      categoryname: categoryname,
      description: description,
    });
    console.log(categoryDetails);

    return res.status(200).json({
      success: true,
      message: "create Category succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in creating Category",
    });
  }
};

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { categoryname: true, description: true }
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "ratingandreview",
        },
      })
      .exec();
    return res.status(200).json({
      success: true,
      message: "show all Category",
      data: allCategories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in  showing cateorgy",
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    // console.log("here1 category", categoryId);
    const categoryDetails = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          {
            path: "ratingandreview",
          },
          {
            path: "instructor",
          },
        ],

        //
        // },
      })
      .exec();
    // console.log(categoryDetails);
    // console.log("here1 category");

    if (!categoryDetails) {
      return res.status(404).json({
        message: "wrong caterogy you send",
      });
    }

    if (categoryDetails?.courses?.length === 0) {
      console.log("no course in this category");
      return res.status(404).json({
        message: "no courses in this category",
      });
    }

    const categoryNewPageDetails = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Draft" },
        populate: {
          path: "instructor",
        },
      })

      .exec();

    // console.log("here2 category");

    const restCategory = await Category.find({
      _id: { $ne: categoryId },
      $expr: {
        $gt: [
          {
            $size: "$courses",
          },
          0,
        ],
      },
    });
    // console.log(restCategory?.length);

    function randomindex(maxnum) {
      return Math.floor(Math.random() * maxnum);
    }
    // console.log("here3");
    const randomCategoryDetails = await Category.find({
      _id: restCategory[randomindex(restCategory.length)]._id,
    })
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          {
            path: "ratingandreview",
          },
          {
            path: "instructor",
          },
        ],
      })
      .exec();

    // console.log("here4 category");

    // console.log(randomCategoryDetails);

    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          {
            path: "ratingandreview",
          },
          {
            path: "instructor",
          },
        ],
      })
      .exec();
    // console.log("here4 category");
    const allCourses = allCategories.flatMap((category) => category.courses);
    const topSellingCourses = allCourses
      ?.sort(
        (a, b) => b?.studentsenrolled?.length - a?.studentsenrolled?.length
      )
      ?.slice(0, 10);

    // console.log("mostSellingCourses COURSE", topSellingCourses);
    res.status(202).json({
      message: "all data regarding category is shown",
      success: true,

      categoryDetails,
      randomCategoryDetails,
      topSellingCourses,
      categoryNewPageDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
