const db = require("../utils/database");

const config = require("../config");
const Joi = require("joi");
const {
  fetchAdminByEmail,
  total_orders,
  seller_earning,
  customers,
  fetchAllCustomers,
  fetchAllProducts,
  getAdminCategory,
  PostAdminCategory,
  deleteAdminCategory,
  fetchProductById,
  update_admin_password,
  putAdminCategory,
  deleteAllProduct,
  postAddProduct,
  getCartDataBYId,
  putAllProduct,
  postAddProductAdmin,
  getAdminOrders,
  deleteAdminOrder,
  fetchCategoryByProductId,
  fetchOrderById,
  updateAdminOrder,
  admin_dashboard,
  total_spend,
  total_spend_data,
  fetchBuyer,
  fetchProductIdById,
  fetchOrderByOrderNumber,
  fetchProductfromCart,
  fetchPriceFromCart,
  fetchAllCart,
  fetchDataYearly,
  fetchFilteredData,
  fetchYearly,
  fetchMonthly,
  fetchWeekly,
  fetchCartIdCount,
  fetchProductCount,
  tableJoin,
  fetchAllProductById,
  SingleProductFetch,
  fetchProductCategoryById,
  update_admin,
  update_admin_profile,
  fetctAdminBy_Id,
} = require("../web_models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { parseTwoDigitYear } = require("moment");
const { all } = require("axios");
const cart = require("../web_models/cart");
const baseurl = config.base_url;

exports.admin_login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        email: [Joi.string().email().empty().required()],
        password: Joi.string().min(6).max(15).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 6 value required",
          "string.max": "maximum 15 values allowed",
        }),
      })
    );
    const result = schema.validate({ email, password });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.status(201).json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: false,
        success: false,
      });
    } else {
      const data = await fetchAdminByEmail(email);

      if (data.length > 0) {
        if (password == data[0].password) {
          await Promise.all(
            data.map(async (item) => {
              if (item.image) {
                // item.profile_image = baseurl + "/profile/" + item.profile_image;
                item.image =
                  baseurl + "/productImage/" + item.image;
              }
            })
          );
          return res.status(200).json({
            message: "user fetched",
            // user: data,
            success: true,
            data: data[0],
          });
        } else {
          return res.status(201).json({
            message: "incorrect email or password",
            status: false,
          });
        }
      } else {
        return res.status(201).json({
          message: "email or password incorrect",
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.changepassword = async (req, res) => {
  try {
    const { oldPassword, password, email } = req.body;
    // const userid = req.authUser;
    const schema = Joi.object({
      password: Joi.string().min(8).required(),
      oldPassword: Joi.string().min(8).required(),
      email: Joi.string().required(),
    });
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      const message = validationResult.error.details
        .map((i) => i.message)
        .join(",");
      return res.status(400).json({
        success: false,
        status: 400,
        message: message,
        error: "Validation error",
      });
    } else {
      const userCheck = await fetchAdminByEmail(email);
      if (userCheck.length != 0) {
        if (userCheck[0]?.password == oldPassword) {
          const update_admin_passwords = await update_admin_password(
            password,
            email
          );
          if (update_admin_passwords?.affectedRows > 0) {
            return res.status(200).json({
              success: true,
              status: 200,
              message: "Changed password successfully.",
            });
          } else {
            return res.status(200).json({
              success: false,
              status: 200,
              message: "Unable to changed password!",
            });
          }
        } else {
          return res.status(200).json({
            success: false,
            status: 200,
            message: "Old password does not matches!",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Error change password. Please try again later",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.admin_editProfile = async (req, res) => {
  try {
    const { id, full_name } = req.body;
    const image = req.file ? req.file.filename : "";
    console.log(req.body);
    console.log(image);
    const schema = Joi.alternatives(
      Joi.object({
        id: [Joi.string().empty().required()],
        full_name: [Joi.string().empty().required()],
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
    const data = await update_admin_profile(full_name, image, id);
    const updated = await fetctAdminBy_Id(id);
    await Promise.all(
      updated.map(async (item) => {
        if (item.image) {
          // item.profile_image = baseurl + "/profile/" + item.profile_image;
          item.image =
            baseurl + "/productImage/" + item.image;
        }
      })
    );
    return res.status(200).json({
      message: "profile updated successfully",
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "wrong credentials",
    });
  }
};

// exports.total_orders = async (req, res) => {
//   try {
//     await total_orders();
//     await console.log(total_orders);
//     const data = await total_orders();
//     return res.status(200).json({
//       message: "total orders fetched",
//       total_orders: data,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.admin_dashboard = async (req, res) => {
  try {
    const [
      seller_data,
      customer_data,
      total_data,
      yearlyResult,
      monthlyResult,
      weeklyResult,
    ] = await Promise.all([
      seller_earning(),
      customers(),
      total_orders(),
      fetchYearly(),
      fetchMonthly(),
      fetchWeekly(),
    ]);

    const date = new Date();

    const yearlyFormatted = yearlyResult.map((row) => ({
      year: row.year,
      count: row.count,
    }));

    const monthlyFormatted = monthlyResult.map((row) => ({
      month: row.month,
      count: row.count,
    }));

    const weeklyFormatted = weeklyResult.map((row) => ({
      week: row.week,
      count: row.count,
    }));

    // Insert monthly data into yearly data
    const yearlyWithMonthly = yearlyFormatted.map((yearly) => ({
      ...yearly,
      monthly: monthlyFormatted.filter((monthly) =>
        monthly.month.startsWith(yearly.year)
      ),
    }));

    // Insert weekly data into monthly data
    const monthlyWithWeekly = monthlyFormatted.map((monthly) => {
      const filteredWeekly = weeklyFormatted.filter((weekly) =>
        monthly.month.includes(weekly.week.toString())
      );

      return {
        ...monthly,
        weekly: filteredWeekly,
      };
    });

    // Calculate weekly data for the entire month
    const weeklyData = monthlyWithWeekly.reduce((acc, monthly) => {
      const weeklyCounts = monthly.weekly.map((weekly) => weekly.count);
      const totalWeeklyCount = weeklyCounts.reduce((a, b) => a + b, 0);
      acc.push({ month: monthly.month, totalWeeklyCount });
      return acc;
    }, []);

    return res.status(200).json({
      data: {
        seller_earning: seller_data[0]?.total_earning,
        customers: customer_data[0]?.total_customers,
        total_orders: total_data[0]?.total_orders,
        yearly: yearlyWithMonthly,
        monthly: monthlyWithWeekly,
        weekly: weeklyFormatted,
      },
      success: true,
    });
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

// exports.seller_earning = async (req, res) => {
//   try {
//     await seller_earning();
//     const sell = await seller_earning();
//     return res.status(200).json({
//       message: "total seller earning",
//       seller_earning: sell,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.customers_data = async (req, res) => {
//   try {
//     await customers();
//     const customers_data = await customers();
//     return res.status(200).json({
//       message: " all customers count fetched",
//       customers: customers_data,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.all_customers = async (req, res) => {
  try {
    const all_customers_data = await fetchAllCustomers();
    if (all_customers_data?.length != 0) {
      for (var i = 0; i < all_customers_data?.length; i++) {
        if (all_customers_data[i].profile_image != 0) {
          all_customers_data[i].profile_image = baseurl + "/ProfileImages/" + all_customers_data[i].profile_image;
        }
        const data12 = await getCartDataBYId(all_customers_data[i]?.id);
        if (data12?.length != 0) {
          all_customers_data[i].total_order = data12?.length;
        } else {
          all_customers_data[i].total_order = 0;
        }
        // total spend
        const spent_data = await total_spend_data(data12[i]?.buyer_id);
        console.log(spent_data, "spent_data");
        if (spent_data?.length != 0 && spent_data[0]?.total_spend != null) {
          all_customers_data[i].total_spend = spent_data[0]?.total_spend;
        } else {
          all_customers_data[i].total_spend = 0;
        }
      }
      return await res.status(200).json({
        message: "all customers data from tbl_buyer",
        success: true,
        customers: all_customers_data,
      });
    } else {
      return res.status(200).json({
        message: "Customers not found!",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getAllProductById = async (req, res) => {
  try {
    const { id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        id: [Joi.string().required()],
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      res.status(201).json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: false,
        success: false,
      });
    } else {
      const fetched_data = await SingleProductFetch(id);
      console.log(fetched_data, id);
      return res.status(200).json({
        message: "product fetched",
        success: true,
        data: fetched_data,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.all_product = async (req, res) => {
  try {
    const all_cart = await fetchAllCart();
    const all_products_data = await fetchAllProducts();
    const all_order_checkout = await getAdminOrders();

    if (all_products_data?.length != 0) {
      for (let i = 0; i < all_products_data?.length; i++) {
        if (all_products_data[i].product_image) {
          all_products_data[i].product_image =
            baseurl + "/productImage/" + all_products_data[i].product_image;
        }

        // Sales
        const total_sales = await fetchProductfromCart(all_cart[i]?.product_id);
        if (total_sales?.length != 0) {
          all_products_data[i].sales = total_sales[0].sales;
        }

        // Price
        // const price = await fetchAllCart(all_cart[i]?.cart_price);
        // if (price?.length != 0) {
        //   all_products_data[i].price = price[0].cart_price;
        // } else {
        //   return res.status(500).json({
        //     message: "Error in price",
        //     success: false,
        //   });
        // }

        // price
        const price = await tableJoin(all_cart[i]?.buyer_id);
        if (price?.length != 0) {
          all_products_data[i].price = price[0].total_cart_price;
        } else {
          all_products_data[i].price = null;
          continue;
        }

        // products
        const buyerId = all_order_checkout[i]?.cart_id;
        const cartCountResult = await fetchProductCount(buyerId);
        console.log(buyerId, "cartCountResult", cartCountResult?.length);
        if (cartCountResult?.length != 0) {
          all_products_data[i].cart_count = cartCountResult?.length;
        } else {
          all_products_data[i].cart_count = 0;
        }
      }
    }

    return res.status(200).json({
      message: "All products data",
      products: all_products_data,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

exports.postProduct = async (req, res) => {
  try {
    const {
      seller_id,
      size_standard,
      product_buy_rent,
      location,
      product_brand,
      product_category,
      featured_product,
      product_name,
      price_sale_lend_price,
      product_replacement_price,
      product_rental_period,
      wishlist_like,
      product_description,
    } = req.body;
    const product_image = req.file ? req.file.filename : "";
    const schema = Joi.alternatives(
      Joi.object({
        seller_id: [Joi.string().empty().required()],
        size_standard: [Joi.string().empty().required()],
        product_buy_rent: [Joi.string().empty().required()],
        location: [Joi.string().empty().required()],
        product_brand: [Joi.string().empty().required()],
        product_category: [Joi.string().empty().required()],
        // product_image: [Joi.string().empty().required()],
        featured_product: [Joi.string().empty().required()],
        product_name: [Joi.string().empty().required()],
        price_sale_lend_price: [Joi.string().empty().required()],
        product_replacement_price: [Joi.string().empty().required()],
        product_rental_period: [Joi.string().empty().required()],
        wishlist_like: [Joi.string().empty().required()],
        product_description: [Joi.string().empty().required()],
      })
    );
    const result = schema.validate({
      seller_id,
      size_standard,
      product_buy_rent,
      location,
      product_brand,
      product_category,
      featured_product,
      product_name,
      price_sale_lend_price,
      product_replacement_price,
      product_rental_period,
      wishlist_like,
      product_description,
    });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      res.status(201).json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: false,
        success: false,
      });
    }
    const data = {
      seller_id,
      size_standard,
      product_buy_rent,
      location,
      product_brand,
      product_category,
      featured_product,
      product_name,
      price_sale_lend_price,
      product_replacement_price,
      product_rental_period,
      wishlist_like,
      product_description,
      product_image,
    };
    await postAddProductAdmin(data);
    res.status(201).json({
      message: "entries created",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.delete_all_product = async (req, res) => {
  try {
    const { id } = req.body;
    const deleted_product = await deleteAllProduct(id);
    console.log(deleted_product);
    return res.status(200).json({
      message: "product deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.product_category = async (req, res) => {
  try {
    const all_product_category = await getAdminCategory();
    const all_cart = await fetchAllCart();
    if (all_product_category?.length != 0) {
      for (let i = 0; i < all_product_category?.length; i++) {
        // sales
        const total_sales = await fetchProductfromCart(
          all_product_category[i].product_id
        );
        if (total_sales?.length != 0) {
          all_product_category[i].sales = total_sales[0].sales;
        }
      }
    }

    // if (all_cart?.length != 0) {
    //   for (var i = 0; i < all_cart?.length; i++) {
    //     // price
    //     const total_price = await fetchPriceFromCart(all_cart[i].cart_price);
    //     console.log(total_price);
    //     if (total_price?.length != 0) {
    //       all_product_category[i].price = total_price?.cart_price;
    //     }
    //   }
    // }

    return res.status(200).json({
      message: "All product categories fetched with sales count",
      product: all_product_category,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

exports.post_product_category = async (req, res) => {
  try {
    const { product_category } = req.body;
    const schema = Joi.object({
      product_category: Joi.string().empty().required(),
    });

    const { error } = schema.validate({ product_category });
    if (error) {
      const message = error.details.map((i) => i.message).join(",");
      return res.status(400).json({
        message: message,
        error: message,
        missingParams: message,
        status: false,
        success: false,
      });
    } else {
      const existing_product_category = await fetchProductCategoryById(
        product_category
      );
      // console.log("existing_product_category>>>>>>>>>>>>>>>>>>" ,existing_product_category)
      if (existing_product_category == 0) {
        // If product category doesn't exist, create it
        await PostAdminCategory(product_category);

        return res.status(201).json({
          message: "Product category created",
          success: true,
          product_category: product_category,
        });
      } else {
        return res.status(400).json({
          message: "Product category already exists",
          success: false,
          product_category: product_category,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

exports.delete_product_category = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedProduct = await deleteAdminCategory(id);
    return res.status(200).json({
      message: "product category deleted",
      product: deletedProduct,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.fetchProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const fetch_product = await fetchProductById(id);
    res.status(200).json({
      message: "single product fetched",
      product: fetch_product,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.update_product_category = async (req, res) => {
  try {
    const { id, product_category } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        id: [Joi.string().empty().required()],
        product_category: [Joi.string().empty().required()],
        // product_description: [Joi.string().empty().required()],
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

    const existingCategory = await fetchProductById(id);
    console.log(existingCategory);
    if (existingCategory.length !== 0) {
      const updated_product = await putAdminCategory(
        id,
        product_category
        // product_description
      );
      return res.status(200).json({
        message: "Product updated",
        product: updated_product,
        success: true,
      });
    } else {
      return res.status(200).json({
        message: "Product not found or id mismatch",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// exports.update_all_product = async (req, res) => {
//   try {
//     const {
//       id,
//       seller_id,
//       size_standard,
//       product_buy_rent,
//       location,
//       product_brand,
//       product_category,
//       product_image,
//       featured_product,
//       product_name,
//       price_sale_lend_price,
//       product_replacement_price,
//       product_rental_period,
//       wishlist_like,
//       product_description,
//     } = req.body;

//     const schema = Joi.alternatives(
//       Joi.object({
//         id: [Joi.string().empty().required()],
//         seller_id: [Joi.string().empty().required()],
//         size_standard: [Joi.string().empty().required()],
//         product_buy_rent: [Joi.string().empty().required()],
//         location: [Joi.string().empty().required()],
//         product_brand: [Joi.string().empty().required()],
//         product_category: [Joi.string().empty().required()],
//         product_image: [Joi.string().empty().required()],
//         featured_product: [Joi.string().empty().required()],
//         product_name: [Joi.string().empty().required()],
//         price_sale_lend_price: [Joi.string().empty().required()],
//         product_replacement_price: [Joi.string().empty().required()],
//         product_rental_period: [Joi.string().empty().required()],
//         wishlist_like: [Joi.string().empty().required()],
//         product_description: [Joi.string().empty().required()],
//       })
//     );
//     const result = schema.validate({
//       id,
//       seller_id,
//       size_standard,
//       product_buy_rent,
//       location,
//       product_brand,
//       product_category,
//       product_image,
//       featured_product,
//       product_name,
//       price_sale_lend_price,
//       product_replacement_price,
//       product_rental_period,
//       wishlist_like,
//       product_description,
//     });
//     if (result.error) {
//       const message = result.error.details.map((i) => i.message).join(",");
//       res.status(201).json({
//         message: result.error.details[0].message,
//         error: message,
//         missingParams: result.error.details[0].message,
//         status: false,
//         success: false,
//       });
//     } else {
//       const updated_product = await putAllProduct(
//         id,
//         seller_id,
//         size_standard,
//         product_buy_rent,
//         location,
//         product_brand,
//         product_category,
//         product_image,
//         featured_product,
//         product_name,
//         price_sale_lend_price,
//         product_replacement_price,
//         product_rental_period,
//         wishlist_like,
//         product_description
//       );

//       return res.status(201).json({
//         message: "entries updated",
//         updated_product: id,
//         success: true,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.putAllProduct = async (req, res) => {
  try {
    const { id, product_category, price_sale_lend_price, updatedAt } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        id: [Joi.string().empty().required()],
        product_category: [Joi.string().empty().required()],
        price_sale_lend_price: [Joi.string().empty().required()],
        updatedAt: [Joi.string().empty().require()],
      })
    );
    const result = schema.validate({
      id,
      product_category,
      price_sale_lend_price,
      updatedAt,
    });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.status(201).json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: false,
        success: false,
      });
    } else {
      const existing_prod = fetchProductById(id);
      if (existing_prod.length !== 0) {
      }
    }
  } catch (error) { }
};

// >>>>>>>>>>>>>>>>>>>> edit all product is left to figure out later
exports.update_all_product = async (req, res) => {
  try {
    const {
      id,
      seller_id,
      size_standard,
      product_buy_rent,
      location,
      product_brand,
      product_category,
      // product_image,
      featured_product,
      product_name,
      price_sale_lend_price,
      product_replacement_price,
      product_rental_period,
      wishlist_like,
      product_description,
    } = req.body;

    // Validate request body using Joi
    const schema = Joi.object({
      id: Joi.string().required(),
      seller_id: Joi.string().required(),
      size_standard: Joi.string().required(),
      product_buy_rent: Joi.string().required(),
      location: Joi.string().required(),
      product_brand: Joi.string().required(),
      product_category: Joi.string().required(),
      // product_image: Joi.string().required(),
      featured_product: Joi.string().required(),
      product_name: Joi.string().required(),
      price_sale_lend_price: Joi.string().required(),
      product_replacement_price: Joi.string().required(),
      product_rental_period: Joi.string().required(),
      wishlist_like: Joi.string().required(),
      product_description: Joi.string().required(),
    });

    // Validate request body against schema
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    upload.single("product_image")(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: err });
      }

      const updated_product_image = req.file.filename;

      const updated_product = await putAllProduct(
        id,
        seller_id,
        size_standard,
        product_buy_rent,
        location,
        product_brand,
        product_category,
        updated_product_image,
        featured_product,
        product_name,
        price_sale_lend_price,
        product_replacement_price,
        product_rental_period,
        wishlist_like,
        product_description
      );

      return res.status(201).json({
        message: "Product entry updated",
        updated_product: id,
        success: true,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllAdminOrders = async (req, res) => {
  try {
    const all_orders = await getAdminOrders();
    if (all_orders?.length != 0) {
      for (var i = 0; i < all_orders?.length; i++) {
        // fetched buyer_name
        const order_name = await fetchBuyer(all_orders[i].buyer_id);
        if (order_name?.length != 0) {
          all_orders[i].buyer_name = order_name[0].buyer_name;
        } else {
          all_orders[i].buyer_name = "";
        }
        // fetch price
        const spent_data = await total_spend(all_orders[i]?.cart_id);
        console.log(spent_data, "spent_data");
        if (spent_data?.length != 0 && spent_data[0]?.total_spend != null) {
          all_orders[i].price = spent_data[0]?.total_spend;
        } else {
          all_orders[i].price = 0;
        }
      }
      return res.status(200).json({
        message: "all orders in admin",
        success: true,
        orders: all_orders,
      });
    } else {
      return res.status(200).json({
        message: "buyer not found",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteAdminOrder = async (req, res) => {
  try {
    const { id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        id: [Joi.string().empty().required()],
      })
    );
    const result = schema.validate({ id });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.status(201).json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: false,
        success: false,
      });
    } else {
      const existingId = await fetchOrderById(id);
      if (existingId.length !== 0) {
        await deleteAdminOrder(id);
        return res.status(201).json({
          message: "order deleted",
          success: true,
        });
      } else {
        return res.status(400).json({
          message: "id not found",
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// exports.update_admin_order = async (req, res) => {
//   try {
//     const {
//       id,
//       buyer_id,
//       order_number,
//       order_date,
//       payment_method,
//       payment_status,
//       cart_id,
//     } = req.body;
//     const schema = Joi.alternatives(
//       Joi.object({
//         id: [Joi.string().empty().required()],
//         buyer_id: [Joi.string().empty().required()],
//         order_number: [Joi.string().empty().required()],
//         order_date: [Joi.string().isoDate().empty().required()],
//         payment_method: [Joi.string().empty().required()],
//         payment_status: [Joi.string().empty().required()],
//         cart_id: [Joi.string().empty().required()],
//       })
//     );
//     const result = schema.validate({
//       id,
//       buyer_id,
//       order_number,
//       order_date,
//       payment_method,
//       payment_status,
//       cart_id,
//     });
//     if (result.error) {
//       const message = result.error.details.map((i) => i.message).join(",");
//       res.status(201).json({
//         message: result.error.details[0].message,

//         error: message,
//         missingParams: result.error.details[0].message,
//         status: false,
//         success: false,
//       });
//     } else {
//       const existingId = await fetchOrderById(id);

//       if (existingId.length !== 0) {
//         await updateAdminOrder(
//           id,
//           buyer_id,
//           order_number,
//           order_date,
//           payment_method,
//           payment_status,
//           cart_id
//         );
//         return res.status(201).json({
//           message: "order updated",
//           success: true,
//           order: updateAdminOrder,
//         });
//       } else {
//         return res.status(400).json({
//           message: "id not found",
//           success: false,
//         });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.update_orders_admin = async (req, res) => {
//   try{

//     const{order_number, buyer_name, price, payment_method, payment_status, order_date} = req.body

//     const existingOrder = await fetchOrderByOrderNumber(order_number)
//     if(existingOrder.length !== 0){
//       await fetchOrderByOrderNumber(
//         buyer_name, price, payment_method, payment_status, order_date
//         )
//         return res.status(201).json({
//           message: "order updated",
//           success: true
//         })
//       }
//       else{
//         return res.status(400).json({
//           message: "error",
//           success: false
//         })
//       }
//     }
//   catch(error){
//     console.log("eternal server error", error)
//   }
// }

// this updates order on the basis of payment status only
exports.update_admin_order_payment = async (req, res) => {
  try {
    const { id, payment_status } = req.body;

    const schema = Joi.object({
      id: Joi.string().required(),
      payment_status: Joi.string().required(),
    });

    const { error } = schema.validate({ id, payment_status });

    if (error) {
      const message = error.details.map((i) => i.message).join(",");
      return res.status(400).json({
        message: error.details[0].message,
        error: message,
        missingParams: error.details[0].message,
        status: false,
        success: false,
      });
    } else {
      await updateAdminOrder(id, payment_status);
      console.log(payment_status);
      return res.status(200).json({
        message: "Payment status updated",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
