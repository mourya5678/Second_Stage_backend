const Joi = require("joi");
const config = require("../config");
const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");

const {
  createProductDetails,
  createProduct,
  getProductColourFilter,
  update_product_value,
  getProductBrandFilter,
  addProductBrand,
  addProductCategoryData,
  getColourProduct,
  fetchProductById,
  updateProductById,
  get_product_image_url,
  product_padding_details,
  getProductCategory,
  get_product_image_by_id,
  product_billing_details,
  deleteProductById,
  update_billing_data,
  updateProduct_image_ById,
  getAllProduct_filterrrrrr,
  get_Product_Details,
  fetchProductDetailsById,
  updateProductDetailsById,
  getAllProductById,
  insert_product_images,
  update_paddingData,
  get_product_images,
  update_product,
  delete_product_images,
  insert__into_product,
  get_product_by_id,
  get_product_by_category,
  insert_product_color,
  get_product_color,
  delete_product_colors,
  getAllProduct,
  get__products,
  getAllProduct_images,
  getAllProduct_colors,
  getAllProduct_filter,
  getAllProduct_by_id,
  fetchBuyerBy_Id,
  addproductColourData,
  insert_product_images_bulk,
  getAllProduct_by_category,
  fetch_product_categories,
  getAllProduct_brands,
  update_product_colour,
  update_product_size,
  update_product_style,
  fetchProductCategories,
  fetchProductBrand,
  fetchProductBuyRent,
  fetchProductRentalPeriod,
  fetchProductStyleTop,
  fetchProductStyleBottom,
  fetchProductSizeTop,
  fetchProductSizeBottom,
  fetchProductBillingType,
  fetchProductBillingLevel,
  fetchProductBillingCondition,
  fetchProductPadding,
  getProductCategoryFilter,
  fetchProductSizeStandard,
  fetchProductColor,
  fetchProductLocation,
  insert_product_brand,
  insert_product_billing,
  insert_product_category,
  insert_product_size,
  insert_product_style,
  insert_product_padding,
  delete_rpoduct_image_by_id,
  get_product_brandd,
  get_product_style,
  get_product_size,
  get_my_Product,
  get_product_billing,
  get_product_padding,
  get_product_imagesss,
  get_product_category,
  fetch_product_brand,
  fetch_product_style,
  fetch_product_size,
  fetch_product_billing,
  fetch_product_id,
  fetch_product_padding,
  getAllProductByIdd,
  checkWishlistBy_id,
  checkWishlistBy_productId,
  getProductbrandData,
  getBrandData,
  getProductCountOfBrand
} = require("../web_models/productModels");

const baseurl = config.base_url;
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "testing26614@gmail.com",
    pass: "ibxakoguozdwqtav",
  },
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve(__dirname + "/view/"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname + "/view/"),
};

transporter.use("compile", hbs(handlebarOptions));
//************Example of get_product_details function start***********

// Function to get product details including images and colors

async function get_product_details_by_id(product_id) {
  const product = await get_product_by_id(product_id);
  const product_images = await get_product_images(product_id);
  const product_colors = await get_product_color(product_id);
  const product_brands = await get_product_brandd(product_id);
  const product_styles = await get_product_style(product_id);
  const product_size = await get_product_size(product_id);
  const product_billing = await get_product_billing(product_id);
  const product_padding = await get_product_padding(product_id);
  return {
    product,
    product_images,
    product_colors,
    product_brands,
    product_styles,
    product_size,
    product_billing,
    product_padding,
  };
}

const fetchProduct = async () => {
  const product_categories = await getProductCategory();
  const product_brand = await getProductbrandData();
  const productColor = await getColourProduct();
  const transformArray = (array) =>
    Array.from(new Set(array.map((item) => item[Object.keys(item)[0]])));
  const combinedDetails = {
    product_categories: transformArray(product_categories),
    product_brand: transformArray(product_brand),
    productColor: transformArray(productColor),
    productBuy_rent: ["buy", "rent"],
    product_rental_period: ["1 Days", "12 days", "val", "7 days"],
    styleTop: ["Moulded", "Bombshell", "Slider", "Other"],
    styleBottom: ["Cheeky", "Extra Cheeky", "Brazilian", "Pro", "Micro Pro", "Olympian"],
    sizeTop: ["A/B", "C", "D", "DD & Bigger"],
    sizeBottom: ["xxs", "xs", "s", "m", "l", "xl"],
    sizeStandard: ["xxs", "xs", "s", "m", "l", "xl"],
    billingType: ["Standard Rhinestones", "Preciosa", "Swarovski"],
    billingLevel: ["Plain", "Basic", "Full"],
    billingCondition: ["new", "worn once", "worn"],
    padding: ["Yes", "No"],
    location: ["Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia"]
  };
  return combinedDetails;
};

exports.fetchProCategories = async (req, res) => {
  try {
    const result = await fetchProduct();
    if (result) {
      return res.json({
        success: true,
        status: 200,
        message: "All categories fetch successfully!",
        data: result,
      });
    } else {
      return res.json({
        success: false,
        status: 200,
        message: "Categories fetch failed!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};


exports.getBrandDataCount = async (req, res) => {
  try {
    const brand_data = await getBrandData();
    const brand_value = [];
    for (var i = 0; i < brand_data?.length; i++) {
      const data = await getProductCountOfBrand(brand_data[i]?.product_brand);
      console.log(data, i)
      var key = brand_data[i]?.product_brand;
      var obj = {};
      obj[key] = data?.length;
      brand_value.push(obj);
    }
    let mergedObject = brand_value.reduce((accumulator, currentObject) => {
      return Object.assign(accumulator, currentObject);
    }, {});
    return await res.json({
      success: true,
      message: "Data found sucessfully.",
      status: 200,
      data: mergedObject,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

exports.add_product_brands = async (req, res) => {
  try {
    const { product_brand } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        product_brand: Joi.string().required()
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data1 = {
        product_brand: product_brand
      }
      const isData = await getProductBrandFilter(product_brand);
      if (isData?.length == 0) {
        const data = await addProductBrand(data1);
        if (data?.affectedRows > 0) {
          return res.json({
            success: true,
            message: "Brand added successfully.",
            status: 200,
            data: data,
          });
        } else {
          return res.json({
            success: false,
            message: "Unable to add product brand!",
            status: 200,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Already have this brand!",
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

exports.add_product_category = async (req, res) => {
  try {
    const { product_category } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        product_category: Joi.string().required()
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data1 = {
        product_category: product_category
      }
      const is_data = await getProductCategoryFilter(product_category);
      if (is_data?.length == 0) {
        const data = await addProductCategoryData(data1);
        if (data?.affectedRows > 0) {
          return res.json({
            success: true,
            message: "Product category added successfully.",
            status: 200,
            data: data
          });
        } else {
          return res.json({
            success: false,
            message: "Unable to add product category!",
            status: 200,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Already have this product category!",
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log(error)
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

exports.add_product_colour = async (req, res) => {
  try {
    const { product_color } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        product_color: Joi.string().required()
      })
    )
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data1 = {
        product_color: product_color
      }
      const is_data = await getProductColourFilter(product_color)
      if (is_data?.length == 0) {
        const data = await addproductColourData(data1)
        if (data?.affectedRows > 0) {
          return res.json({
            success: true,
            message: "Product colour added successfully.",
            status: 200,
            data: data
          });
        } else {
          return res.json({
            success: false,
            message: "Unable to add product colour!",
            status: 200,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Already have this colour!",
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log(error)
  }
};
//********end Example of get_product_details function end**********
//***********product api kaif start here******************
exports.add_product = async (req, res) => {
  try {
    const {
      size_standard,
      product_buy_rent,
      location,
      product_brand,
      price_sale_lend_price,
      product_replacement_price,
      product_rental_period,
      product_description,
      product_category,
      product_color,
      size_top,
      size_bottom,
      style_top,
      style_bottom,
      billing_type,
      billing_level,
      billing_condition,
      product_padding,
      product_name,
      userId,
      product_type
    } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        product_name: Joi.string().required(),
        size_standard: Joi.string().optional(),
        size_top: Joi.string().optional(),
        size_bottom: Joi.string().optional(),
        style_top: Joi.string().optional(),
        style_bottom: Joi.string().required(),
        billing_type: Joi.string().required(),
        billing_level: Joi.string().required(),
        billing_condition: Joi.string().required(),
        product_brand: Joi.string().required(),
        product_color: Joi.string().required(),
        product_category: Joi.string().required(),
        product_buy_rent: Joi.string().required(),
        location: Joi.string().required(),
        price_sale_lend_price: Joi.number().required(),
        userId: Joi.number().required(),
        product_replacement_price: Joi.number().required(),
        product_rental_period: Joi.string().optional(),
        product_category: Joi.string().required(),
        product_description: Joi.string().required(),
        product_padding: Joi.string().required(),
        product_type: Joi.string().required()
      })
    );

    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const productData = {
        size_standard: size_standard ? size_standard : 0,
        product_name,
        product_brand,
        seller_id: userId,
        product_buy_rent,
        product_name,
        location,
        product_brand,
        price_sale_lend_price,
        product_replacement_price,
        product_rental_period,
        product_category,
        product_description,
        product_type
      };
      console.log(productData, "productData");
      const productResult = await insert__into_product(productData);
      const product_id = productResult.insertId;
      let filename = "";
      if (req.files) {
        const file = req.files;
        console.log("request files==>>>", file);
        var productImage = [];
        for (let i = 0; i < file.length; i++) {
          productImage.push(req.files[i].filename);
        }
      }
      console.log("product_image==>>>", productImage);
      const update_product = await updateProduct_image_ById(productImage[0], product_id);
      await Promise.all(
        productImage.map(async (item) => {
          let imageData = {
            product_image: item,
            product_id: product_id,
          };
          const insertImageResult = await insert_product_images(imageData);
        })
      );
      const colorData = {
        product_id,
        product_color,
      };
      const insertColorResult = await insert_product_color(colorData);
      const billingData = {
        product_id,
        billing_type,
        billing_level,
        billing_condition,
      };
      const insertBillingResult = await insert_product_billing(billingData);
      const sizeData = {
        product_id,
        size_top: size_top ? size_top : 0,
        size_bottom: size_bottom ? size_bottom : 0
      };
      const insertSizeResult = await insert_product_size(sizeData);
      const styleData = {
        product_id,
        style_top,
        style_bottom,
      };
      const insertStyleResult = await insert_product_style(styleData);
      const padding = {
        product_id,
        product_padding,
      };
      const insertPaddingResult = await insert_product_padding(padding);
      // Fetch product details including images and colors
      const productDetails = await getAllProduct_by_id(product_id);
      const get_seller_email = await fetchBuyerBy_Id(userId);
      let mailOptions = {
        from: "testing26614@gmail.com",
        to: `${get_seller_email[0]?.email}`,
        subject: "Selling Renting Confirmation",
        template: "Selling_RentingConfirmation",
        context: {
          product_category: product_category,
          product_buy_rent: product_buy_rent == 'buy' ? "Sale" : product_buy_rent
        },
      };
      transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
          return res.json({
            success: false,
            status: 400,
            message: "Mail Not delivered!",
          });
        } else {
          return res.json({
            success: true,
            message: "Product added successfully!",
            status: 200,
            data: productDetails,
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

// exports.edit_product = async (req, res) => {
//   try {

//     const {
//       size_standard,
//       product_buy_rent,
//       location,
//       product_brand,
//       price_sale_lend_price,
//       product_replacement_price,
//       product_rental_period,
//       product_description,
//       product_category,
//       product_color,
//       size_top,
//       size_bottom,
//       style_top,
//       style_bottom,
//       billing_type,
//       billing_level,
//       billing_condition,
//       product_padding, product_name
//     } = req.body;

//     const schema = Joi.alternatives(
//       Joi.object({
//         product_name: Joi.string().required(),
//         size_standard: Joi.string().optional(),
//         size_top: Joi.string().required(),
//         size_bottom: Joi.string().optional(),
//         style_top: Joi.string().optional(),
//         style_bottom: Joi.string().required(),
//         billing_type: Joi.string().required(),
//         billing_level: Joi.string().required(),
//         billing_condition: Joi.string().required(),
//         product_brand: Joi.string().required(),
//         product_color: Joi.string().required(),
//         product_category: Joi.string().required(),
//         product_buy_rent: Joi.string().required(),
//         location: Joi.string().required(),
//         price_sale_lend_price: Joi.number().required(),
//         product_replacement_price: Joi.number().required(),
//         product_rental_period: Joi.string().optional(),
//         product_category: Joi.string().required(),
//         product_description: Joi.string().required(),
//         product_padding: Joi.string().required(),
//       })
//     );
//     const result = schema.validate(req.body);
//     if (result.error) {
//       const message = result.error.details.map((i) => i.message).join(",");
//       return res.json({
//         message: result.error.details[0].message,
//         error: message,
//         missingParams: result.error.details[0].message,
//         status: 400,
//         success: false,
//       });
//     } else {
//       // Insert common data into product
//       const productData = {
//         size_standard: size_standard ? size_standard : 0,
//         product_name, product_brand,
//         product_buy_rent, product_name,
//         location, product_brand,
//         price_sale_lend_price,
//         product_replacement_price,
//         product_rental_period, product_category,
//         product_description,
//       };

//       const productResult = await insert__into_product(productData);
//       const product_id = productResult.insertId; // Get the auto-generated product_id

//       // Insert images
//       let filename = "";
//       if (req.files) {
//         const file = req.files;
//         console.log("request files==>>>", file);
//         var productImage = [];
//         for (let i = 0; i < file.length; i++) {
//           productImage.push(req.files[i].filename);
//         }
//       }
//       console.log("product_image==>>>", productImage);

//       const update_product = await updateProduct_image_ById(productImage[0], product_id);




//       // Insert color separately
//       const colorData = {
//         product_id,
//         product_color,
//       };

//       const insertColorResult = await insert_product_color(colorData);

//       // const brandData = {
//       //   product_id,
//       //   product_brand,
//       // };

//       // const insertBrandResult = await insert_product_brand(brandData);

//       const billingData = {
//         product_id,
//         billing_type,
//         billing_level,
//         billing_condition,
//       };

//       const insertBillingResult = await insert_product_billing(billingData);

//       // const categoryData = {
//       //   product_id,
//       //   product_category,
//       // };

//       // const insertCategoryResult = await insert_product_category(categoryData);

//       const sizeData = {
//         product_id,
//         size_top: size_top ? size_top : 0,
//         size_bottom: size_bottom ? size_bottom : 0
//       };

//       const insertSizeResult = await insert_product_size(sizeData);

//       const styleData = {
//         product_id,
//         style_top,
//         style_bottom,
//       };

//       const insertStyleResult = await insert_product_style(styleData);

//       const padding = {
//         product_id,
//         product_padding,
//       };

//       const insertPaddingResult = await insert_product_padding(padding);

//       // Fetch product details including images and colors
//       const productDetails = await getAllProduct_by_id(product_id);

//       return res.json({
//         success: true,
//         message: "Product added successfully!",
//         status: 200,
//         data: productDetails,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.json({
//       success: false,
//       message: "An internal server error occurred. Please try again later.",
//       status: 500,
//       error: error,
//     });
//   }
// };

exports.get_all_Product = async (req, res) => {
  try {
    const { user_id, sort } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: [Joi.number().empty().required()],
        sort: [Joi.number().empty().required()],
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const allProduct = await getAllProduct();
      if (allProduct.length > 0) {
        await Promise.all(
          allProduct.map(async (item) => {
            let prodcutId = item.id
            if (item.product_image) {
              item.product_image =
                baseurl + "/productImage/" + item.product_image;
            }
            const get_prduct_size = await get_product_size(prodcutId)
            const get_prduct_color = await get_product_color(prodcutId)
            const get_product_images = await get_product_imagesss(prodcutId)
            item.product_images = get_product_images.map(imageObj => imageObj.product_image ? imageObj.product_image : " ")
            item.product_size = get_prduct_size;
            // item.size_bottom = get_prduct_size[0]?.size_bottom;
            item.product_color = get_prduct_color.map(imageObj => imageObj.product_color ? imageObj.product_color : " ");
            item.product_type = item.product_type
            if (user_id != 0) {
              const check_product_wishlist = await checkWishlistBy_id(prodcutId, user_id)
              if (check_product_wishlist.length != 0 && item?.seller_id != user_id) {
                item.wishlist_like = 1
              } else {
                item.wishlist_like = 0
              }
            } else {
              item.wishlist_like = 0
            }
          })
        );
        return res.json({
          message: "All product details",
          status: 200,
          success: true,
          products: allProduct,
        });
      } else {
        return res.json({
          message: "No data found",
          status: 200,
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

exports.get_my_product = async (req, res) => {
  try {

    const { user_id } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        user_id: [Joi.number().empty().required()],
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {

      const allProduct = await get_my_Product(user_id);

      if (allProduct.length > 0) {

        await Promise.all(
          allProduct.map(async (item) => {

            let prodcutId = item.id

            if (item.product_image) {
              // item.profile_image = baseurl + "/profile/" + item.profile_image;
              item.product_image =
                baseurl + "/productImage/" + item.product_image;
            }
            const get_prduct_size = await get_product_size(prodcutId)
            // const get_prduct_brands = await get_product_brandd(prodcutId)
            // const get_product_Category = await get_product_category(prodcutId)
            const get_prduct_color = await get_product_color(prodcutId)
            const get_product_images = await get_product_imagesss(prodcutId)


            item.product_images = get_product_images.map(imageObj => imageObj.product_image ? imageObj.product_image : " ")
            // item.product_brand = get_prduct_brands.map(imageObj => imageObj.product_brand ? imageObj.product_brand : " ")
            item.product_color = get_prduct_color.map(imageObj => imageObj.product_color ? imageObj.product_color : " ")
            // item.product_Categories = get_product_Category[0].product_category
            item.product_size = get_prduct_size

            if (user_id != 0) {

              const check_product_wishlist = await checkWishlistBy_id(prodcutId, user_id)
              if (check_product_wishlist.length != 0) {
                item.wishlist_like = 1
              } else {
                item.wishlist_like = 0
              }
            } else {
              item.wishlist_like = 0
            }
          })
        );
        return res.json({
          message: "All product details",
          status: 200,
          success: true,
          products: allProduct,
        });
      } else {
        return res.json({
          message: "No data found",
          status: 200,
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

exports.getProductDetails_by_id = async (req, res) => {
  try {
    const { user_id, prodcutId } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: [Joi.number().empty().required()],
        prodcutId: [Joi.number().empty().required()],
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const allProduct = await getAllProduct_by_id(prodcutId);
      if (allProduct.length > 0) {
        await Promise.all(
          allProduct.map(async (item) => {
            let prodcut_Id = item.id
            if (item.product_image) {
              item.product_image =
                baseurl + "/productImage/" + item.product_image;
            }
            const get_prduct_size = await get_product_size(prodcutId)
            const product_styles = await get_product_style(prodcutId);
            const get_prduct_color = await get_product_color(prodcutId)
            const get_product_images = await get_product_imagesss(prodcutId)
            item.product_images = get_product_images.map(imageObj => imageObj.product_image ? imageObj.product_image : " ")
            item.product_color = get_prduct_color.map(imageObj => imageObj.product_color ? imageObj.product_color : " ")
            item.product_size = get_prduct_size;
            item.style_product = product_styles;
            if (user_id != 0) {
              const check_product_wishlist = await checkWishlistBy_id(prodcut_Id, user_id)
              if (check_product_wishlist.length != 0 && check_product_wishlist[0]?.buyer_id != user_id) {
                item.wishlist_like = 1
              } else {
                item.wishlist_like = 0
              }
            } else {
              item.wishlist_like = 0
            }
          })
        );
        // let get_product_data
        return res.json({
          message: "All product details",
          status: 200,
          success: true,
          products: allProduct,
        });
      } else {
        return res.json({
          message: "No data found",
          status: 200,
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

exports.getProductDetails_by_Category = async (req, res) => {
  try {
    const { product_category, sort, } = req.params;
    let { userId, } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        userId: Joi.number().empty().required(),
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const get_product_By_category = await getAllProduct_by_category(product_category);
      if (get_product_By_category.length > 0) {
        await Promise.all(
          get_product_By_category.map(async (item) => {
            let prodcutId = item.id
            if (item.product_image) {
              item.product_image =
                baseurl + "/productImage/" + item.product_image;
            }
            const get_prduct_size = await get_product_size(prodcutId)
            const get_prduct_color = await get_product_color(prodcutId)
            const get_product_images = await get_product_imagesss(prodcutId)
            item.product_images = get_product_images.map(imageObj => imageObj.product_image ? imageObj.product_image : " ")
            item.product_size = get_prduct_size
            item.product_color = get_prduct_color
            if (userId != 0) {
              const check_product_wishlist = await checkWishlistBy_id(prodcutId, userId)
              if (check_product_wishlist.length != 0 && userId != item?.seller_id) {
                item.wishlist_like = 1
              } else {
                item.wishlist_like = 0
              }
            } else {
              item.wishlist_like = 0
            }
          })
        );
        if (sort == 1) {
          console.log("1")
          get_product_By_category.sort((a, b) => (a.price_sale_lend_price) - (b.price_sale_lend_price));
          return res.json({
            message: "All product details",
            status: 200,
            success: true,
            product_by_category: get_product_By_category,
          });
        } else if (sort == 2) {
          console.log("2")
          get_product_By_category.sort((a, b) => (b.price_sale_lend_price) - (a.price_sale_lend_price));
          return res.json({
            message: "All product details",
            status: 200,
            success: true,
            product_by_category: get_product_By_category,
          });
        } else if (sort == 3) {
          console.log("3")
          get_product_By_category.reverse();
          return res.json({
            message: "All product details",
            status: 200,
            success: true,
            product_by_category: get_product_By_category,
          });
        } else if (sort == 4) {
          console.log("4")
          return res.json({
            message: "All product details",
            status: 200,
            success: true,
            product_by_category: get_product_By_category,
          });
        } else if (sort == 5) {
          console.log("5")
          const featuredProducts = get_product_By_category.filter(get_product_By_category => get_product_By_category.featured_product === 1);
          console.log(featuredProducts);
          return res.json({
            message: "All product details",
            status: 200,
            success: true,
            product_by_category: featuredProducts,
          });
        }
      } else {
        return res.json({
          message: "No data found",
          status: 200,
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

exports.get_all_filter_Product = async (req, res) => {
  try {
    const {
      product_brand,
      product_category,
      product_color,
      size_top,
      size_bottom,
      style_top,
      style_bottom,
      billing_type,
      billing_level,
      billing_condition,
      product_padding,
      location,
      price_sale_lend_price_max,
      price_sale_lend_price_min,
      price_sale_lend_price_max_rent,
      price_sale_lend_price_min_rent,
      product_replacement_price,
      product_rental_period,
      product_description,
      product_buy_rent,
      size_standard,
      userId
    } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        userId: Joi.number().empty().required(),
        product_brand: Joi.array().items(Joi.string()).optional(),
        product_category: Joi.array().items(Joi.string()).optional(),
        product_color: Joi.array().items(Joi.string()).optional(),
        size_top: Joi.array().items(Joi.string()).optional(),
        size_bottom: Joi.array().items(Joi.string()).optional(),
        style_top: Joi.array().items(Joi.string()).optional(),
        style_bottom: Joi.array().items(Joi.string()).optional(),
        size_bottom: Joi.array().items(Joi.string()).optional(),
        billing_type: Joi.array().items(Joi.string()).optional(),
        billing_level: Joi.array().items(Joi.string()).optional(),
        billing_condition: Joi.array().items(Joi.string()).optional(),
        product_padding: Joi.array().items(Joi.string()).optional(),
        location: Joi.array().items(Joi.string()).optional(),
        price_sale_lend_price_max: Joi.array().items().optional(),
        price_sale_lend_price_min: Joi.array().items().optional(),
        price_sale_lend_price_max_rent: Joi.array()
          .items()
          .optional(),
        price_sale_lend_price_min_rent: Joi.array()
          .items()
          .optional(),
        product_replacement_price: Joi.array().items(Joi.string()).optional(),
        product_rental_period: Joi.array().items(Joi.string()).optional(),
        product_description: Joi.array().items(Joi.string()).optional(),
        product_buy_rent: Joi.array().items(Joi.string()).optional(),
        size_standard: Joi.array().items(Joi.string()).optional(),
      })
    );

    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    }

    /// kaif code
    console.log("req.body>>>>>>>>>>>>>>", req.body);
    console.log(">>>>>>>>>>", req.body);

    var filteredProducts = await getAllProduct_filterrrrrr(
      product_brand,
      product_category,
      product_color,
      size_top,
      size_bottom,
      style_top,
      style_bottom,
      billing_type,
      billing_level,
      billing_condition,
      product_padding,
      location,
      price_sale_lend_price_max,
      price_sale_lend_price_min,
      price_sale_lend_price_max_rent,
      price_sale_lend_price_min_rent,
      product_replacement_price,
      product_rental_period,
      product_description,
      product_buy_rent,
      size_standard
    );

    // let userId = req.user;
    const setWishlistLike = async (item) => {
      const productId = item.id;
      const checkWishlist = await checkWishlistBy_id(productId, userId);
      const isWishlist = checkWishlist.length > 0;
      return isWishlist ? 1 : 0;
    };
    console.log(filteredProducts[0], "filteredProducts");
    const formattedProducts = await Promise.all(
      filteredProducts.map(async (item) => {
        const wishlistLike = await setWishlistLike(item);
        return {
          id: item.id,
          seller_id: item.seller_id,
          product_brand: item.product_brand,
          product_category: item.product_category,
          product_size: [{ size_top: item.size_top, size_bottom: item.size_bottom, }],
          size_standard: item.size_standard,
          style_top: item.style_top,
          style_bottom: item.style_bottom,
          billing_type: item.billing_type,
          billing_level: item.billing_level,
          billing_condition: item.billing_condition,
          product_padding: item.product_padding,
          location: item.location,
          price_sale_lend_price: item.price_sale_lend_price,
          product_type: item?.product_type,
          product_replacement_price: item.product_replacement_price,
          product_rental_period: item.product_rental_period,
          product_description: item.product_description,
          product_buy_rent: item.product_buy_rent,
          wishlist_like: wishlistLike,
          created_at: item.created_at,
          updated_at: item.updated_at,
          test: item.test,
          product_colors: item.product_color
            ? item.product_color.split(",").filter(Boolean)
            : [],
          product_images: item.product_images
            ? item.product_images
              .split(",")
              .map((image) => `${baseurl}/productImage/${image}`)
              .filter(Boolean)
            : [],
        };
      })
    );

    if (formattedProducts.length > 0) {
      return res.json({
        success: true,
        message: "Products filtered successfully",
        status: 200,
        formattedProducts: formattedProducts,
      });
    } else {
      return res.json({
        success: false,
        message: "No products found with the specified filters",
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error in get_all_products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message,
    });
  }
};

exports.get_all_filter_Productttttt = async (req, res) => {
  try {
    const {
      product_brand,
      product_category,
      product_color,
      size_top,
      size_bottom,
      style_top,
      style_bottom,
      billing_type,
      billing_level,
      billing_condition,
      product_padding,
      location,
      price_sale_lend_price,
      product_replacement_price,
      product_rental_period,
      product_description,
      product_buy_rent,
      size_standard,
    } = req.body;

    // Constructing filters object to pass to getAllProduct_filter function
    const filters = {
      product_brand,
      product_category,
      product_color,
      size_top,
      size_bottom,
      style_top,
      style_bottom,
      billing_type,
      billing_level,
      billing_condition,
      product_padding,
      location,
      price_sale_lend_price,
      product_replacement_price,
      product_rental_period,
      product_description,
      product_buy_rent,
      size_standard,
    };

    const filteredProducts = await getAllProduct_filter(filters);

    const formattedProducts = Object.values(filteredProducts).reduce(
      (acc, curr) => acc.concat(curr),
      []
    );

    if (formattedProducts.length > 0) {
      return res.json({
        success: true,
        message: "Products filtered successfully",
        status: 200,
        filteredProducts: formattedProducts,
      });
    } else {
      return res.json({
        success: false,
        message: "No products found with the specified filters",
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error in get_all_filter_Product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message,
    });
  }
};

exports.All_drop_down = async (req, res) => {
  try {
    const data = {
      "product_categories": [
        "figure",
        "swimsuit",
        "fmg_wbff",
        "themewear",
        "accessories",
        "bikini"
      ],
      "product_brand": [
        "peter england",
        "neo geoglam",
        "the american fashion",
        "UK style",
        "indian classic",
        "the new style",
        "fashionFind insta",
        "new look",
        "hey girl",
        "young fashion",
        "new fashion world",
        "R-en shopout",
        "Angel Competition Bikinis"
      ],
      "productBuy_rent": [
        "buy",
        "rent",
        "Buy"
      ],
      "product_rental_period": [
        " ",
        "12 days",
        "val"
      ],
      "styleTop": [
        "Trendy",
        "on top",
        "Bombshell",
        "Slider"
      ],
      "styleBottom": [
        "Versatile",
        "N/A",
        "curve",
        "Cheeky",
        "Extra Cheeky"
      ],
      "sizeTop": [
        "normal",
        "M",
        "XXL",
        "XL",
        "L",
        "K",
        "A/B",
        "--Select--Top--"
      ],
      "sizeBottom": [
        "M",
        "L",
        "XL",
        "LM",
        "2",
        "4",
        "--Select--Bottom--"
      ],
      "sizeStandard": [
        "Universal",
        "Universal or indian",
        "American size",
        "Universal indian",
        "all new size",
        "--Select--Standard--",
        "0"
      ],
      "productColor": [
        "#0f22d4",
        "#4fdb09",
        "#db09a0",
        "#4432a8",
        "#0a2472",
        "purple new",
        "#d7bb4f",
        "#282828"
      ],
      "billingType": [
        "Installments",
        "Standard Rhinestones"
      ],
      "billingLevel": [
        "Trendsetter",
        "Plain",
        "Basic"
      ],
      "billingCondition": [
        "LikeNew",
        "New",
        "Worn Once"
      ],
      "padding": [
        "On-trend accessories for a fashionable look",
        " accessories for a fashionable look",
        "Single",
        "accessories for a fashionable look"
      ],
      "location": [
        "Chic Emporium",
        "Posts to"
      ]
    }

    return res.json({
      success: false,
      status: 200,
      message: "Categories fetch failed!",
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

//***************product api kaif end here*******************

exports.deleteProductDetails = async (req, res) => {
  try {
    const product_id = req.params.id;

    const data = await deleteProductDetailsById(product_id);
    if (data.length !== 0) {
      return res.json({
        status: 200,
        success: true,
        message: "product deleted successfully!",
        data: data,
      });
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "product  Not Found",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

exports.getProductDetailsById = async (req, res) => {
  try {
    const prodcutId = req.params.id;
    const allProductDetails = await getAllProductByIdd(prodcutId);

    if (allProductDetails.length > 0) {

      await Promise.all(
        data.map(async (item) => {

        })
      );

      return res.json({
        message: "allProduct ",
        status: 200,
        success: true,
        Product: allProductDetails,
      });
    } else {
      return res.json({
        message: "No data found ",
        status: 200,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

//product
exports.get_Product = async (req, res) => {
  try {
    const allProduct = await getProduct();
    if (allProduct !== 0) {
      console.log("==================alll", allProduct);
      return res.json({
        message: "allProduct ",
        status: 200,
        success: true,
        allProduct: allProduct,
      });
    } else {
      return res.json({
        message: "No data found ",
        status: 200,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const productData = {
      productName: req.body.productName,
      categoryId: req.body.categoryId,
    };

    // Validate the input using Joi
    const schema = Joi.object({
      productName: Joi.string().empty().required(),
      categoryId: Joi.number().required(),
    });

    const result = schema.validate({
      ...req.body, // Include text data
    });

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    }

    const data = await createProduct(productData);
    return res.json({
      success: true,
      message: "Product added successfully.",
      status: 200,
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const Data = {
      productName: req.body.productName,
      categoryId: req.body.categoryId,
    };
    const schema = Joi.object({
      productName: Joi.string().empty().required(),
      categoryId: Joi.number().required(),
    });
    const result = schema.validate({
      ...req.body,
    });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 200,
        success: true,
      });
    } else {
      const product_id = req.params.id;
      const productData = await fetchProductById(product_id);
      if (productData.length !== 0) {
        const result = await updateProductById(Data, product_id);
        if (result.affectedRows) {
          const updateData = await fetchProductById(product_id);
          return res.json({
            message: "product details updated successfully!",
            status: 200,
            success: true,
            user_info: updateData[0],
          });
        } else {
          return res.json({
            message: "update product failed ",
            status: 200,
            success: false,
          });
        }
      } else {
        return res.json({
          messgae: "data not found",
          status: 200,
          success: false,
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Internal server error",
      error: err,
      status: 500,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product_id = req.params.id;

    const data = await deleteProductById(product_id);
    if (data.length !== 0) {
      return res.json({
        status: 200,
        success: true,
        message: "product deleted successfully!",
        user_info: data,
      });
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "product  Not Found",
        user_info: [],
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product_id = req.params.id;
    const Product = await fetchProductById(product_id);
    if (Product !== 0) {
      return res.json({
        message: "allProduct ",
        status: 200,
        success: true,
        Product: Product,
      });
    } else {
      return res.json({
        message: "No data found ",
        status: 200,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

exports.updateProductData = async (req, res) => {
  try {
    const {
      product_id,
      size_standard,
      product_buy_rent,
      location,
      product_brand,
      product_category,
      product_name,
      price_sale_lend_price,
      product_replacement_price,
      product_rental_period,
      product_description,
      colour,
      product_type,
      product_size_top,
      product_size_bottom,
      product_style_top,
      product_style_bottom,
      billing_type,
      billing_level,
      billing_condition,
      product_padding
    } = req.body;
    console.log(req.body)

    const schema = Joi.alternatives(
      Joi.object({
        product_id: Joi.string().required(),
        size_standard: Joi.string().optional(),
        product_buy_rent: Joi.string().required(),
        location: Joi.string().required(),
        product_brand: Joi.string().required(),
        product_category: Joi.string().required(),
        product_name: Joi.string().required(),
        price_sale_lend_price: Joi.string().required(),
        product_replacement_price: Joi.string().required(),
        product_rental_period: Joi.string().optional(),
        product_description: Joi.string().required(),
        colour: Joi.string().required(),
        product_type: Joi.string().required(),
        product_size_top: Joi.string().required(),
        product_size_bottom: Joi.string().required(),
        product_style_top: Joi.string().optional(),
        product_style_bottom: Joi.string().optional(),
        billing_type: Joi.string().required(),
        billing_level: Joi.string().required(),
        billing_condition: Joi.string().required(),
        product_padding: Joi.string().required()
      })
    )
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = await get_product_by_id(product_id);
      if (data?.length !== 0) {
        let data12
        if (size_standard) {
          if (product_buy_rent == 'buy') {
            data12 = {
              size_standard: size_standard,
              product_buy_rent: product_buy_rent,
              location: location,
              product_brand: product_brand,
              product_category: product_category,
              product_name: product_name,
              price_sale_lend_price: price_sale_lend_price,
              product_replacement_price: product_replacement_price,
              product_description: product_description,
              product_type: product_type,
              featured_product: product_type == 'featured' ? true : false
            }
          } else {
            data12 = {
              size_standard: size_standard,
              product_buy_rent: product_buy_rent,
              location: location,
              product_brand: product_brand,
              product_category: product_category,
              product_name: product_name,
              price_sale_lend_price: price_sale_lend_price,
              product_replacement_price: product_replacement_price,
              product_rental_period: product_rental_period,
              product_description: product_description,
              product_type: product_type,
              featured_product: product_type == 'featured' ? true : false
            }
          }
        }
        else {
          if (product_buy_rent == 'buy') {
            data12 = {
              product_buy_rent: product_buy_rent,
              location: location,
              product_brand: product_brand,
              product_category: product_category,
              product_name: product_name,
              price_sale_lend_price: price_sale_lend_price,
              product_replacement_price: product_replacement_price,
              product_description: product_description,
              product_type: product_type,
              featured_product: product_type == 'featured' ? true : false
            }
          } else {
            data12 = {
              product_buy_rent: product_buy_rent,
              location: location,
              product_brand: product_brand,
              product_category: product_category,
              product_name: product_name,
              price_sale_lend_price: price_sale_lend_price,
              product_replacement_price: product_replacement_price,
              product_rental_period: product_rental_period,
              product_description: product_description,
              product_type: product_type,
              featured_product: product_type == 'featured' ? true : false
            }
          }
        }
        const result_data = await update_product_value(data12, product_id);
        const colour_change = await update_product_colour(colour, product_id);
        if (!size_standard) {
          const product_size = await update_product_size(product_size_top, product_size_bottom, product_id);
        }
        const product_style = await update_product_style(product_style_top, product_style_bottom, product_id);
        const update_billing_type = await update_billing_data(billing_type, billing_level, billing_condition, product_id);
        const update_padding_vakue = await update_paddingData(product_padding, product_id);
        let filename = "";
        if (req.files) {
          const file = req.files;
          var productImage = [];
          for (let i = 0; i < file.length; i++) {
            productImage.push(req.files[i].filename);
          }
          const update_product = await updateProduct_image_ById(productImage[0], product_id);
          await Promise.all(
            productImage.map(async (item) => {
              let imageData = {
                product_image: item,
                product_id: product_id,
              };
              const insertImageResult = await insert_product_images(imageData);
            })
          );
        }
        if (result_data?.affectedRows > 0 && update_padding_vakue?.affectedRows > 0 && colour_change?.affectedRows > 0 && update_billing_type?.affectedRows > 0 && product_style?.affectedRows > 0) {
          return await res.json({
            success: true,
            message: "Product updated successfully.",
            status: 200,
          });
        } else {
          return res.json({
            success: false,
            message: "Product not updated!",
            status: 200,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Product not found!",
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

exports.updateProductImage = async (req, res) => {
  try {
    let filename = "";
    const file = req.files;
    console.log("request files==>>>", file);
    var productImage = [];
    for (let i = 0; i < file.length; i++) {
      productImage.push(req.files[i].filename);
    }
    const update_product = await updateProduct_image_ById(productImage[0], product_id);
    await Promise.all(
      productImage.map(async (item) => {
        let imageData = {
          product_image: item,
          product_id: product_id,
        };
        const insertImageResult = await insert_product_images(imageData);
      })
    );
  } catch (error) {
    console.log(error);
  }
};

exports.getProductDataById = async (req, res) => {
  try {
    const { product_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        product_id: Joi.string().required()
      })
    )
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = await get_product_by_id(product_id);
      if (data?.length != 0) {
        console.log(data[0]?.id);
        if (data[0].product_image) {
          data[0].product_image = baseurl + "/productImage/" + data[0].product_image;
        }
        const get_prduct_size = await get_product_size(data[0]?.id);
        const get_prduct_color = await get_product_color(data[0]?.id);
        const get_product_images = await get_product_imagesss(data[0]?.id);
        const get_product_image_url_data = await get_product_image_url(data[0]?.id);
        const product_styles = await get_product_style(data[0]?.id);
        const product_billing_data = await product_billing_details(data[0]?.id);
        const product_padding_data = await product_padding_details(data[0]?.id);
        let image_url = []
        for (var i = 0; i < get_product_image_url_data?.length; i++) {
          image_url?.push({
            'id': get_product_image_url_data[i]?.id,
            'product_image': baseurl + "/productImage/" + get_product_image_url_data[i].product_image
          })
        }
        data[0].product_padding = product_padding_data[0]?.product_padding;
        data[0].product_images = image_url;
        data[0].product_size = get_prduct_size[0];
        data[0].product_color = get_prduct_color[0]?.product_color;
        data[0].product_style = product_styles[0];
        data[0].product_billing = product_billing_data[0];
        return await res.json({
          success: true,
          message: "Product found.",
          status: 200,
          data: data[0]
        });
      } else {
        return res.json({
          success: false,
          message: "Product not found!",
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

exports.deleteProductImage = async (req, res) => {
  try {
    const { image_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        image_id: Joi.string().required()
      })
    )
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = await get_product_image_by_id(image_id);
      if (data?.length != 0) {
        const data12 = await delete_rpoduct_image_by_id(image_id);
        if (data12?.affectedRows > 0) {
          return res.json({
            success: true,
            message: "Image deleted successfully.",
            status: 200,
          });
        } else {
          return res.json({
            success: false,
            message: "Unable to delete product image!",
            status: 200,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Image already deleted!",
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};
