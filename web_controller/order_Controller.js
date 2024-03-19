const Joi = require("joi");
const config = require("../config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");

const {
  insert_into_order_shipping,
  get_order_shipping,
  fetchShipping_by_id,
  fetchBuyerBy_Id, fetch_shipping_by_id,
  check_order,
  insert_checkOut,
  checkBuyerExistence, getAllProduct_by_id,
  get_orderDetailsBy_cart_id,
  getSaller_data_by_id,
  getProductData_ById,
  get_checkOut, fetchOrderById_1,
  getChekOutById, get_product_brandd, get_product_size, get_product_category, get_product_color,
  getCartDetails_by_id, getCartDetails_by_id_1,
  updateCartT,
  updatePaymentStatus, fetch_all_Order,
  updateCartPaymentStatus,
  fetchOrderById,
  fetchOrderListById,
} = require("../web_models/orderModels");
const { charLength } = require("random-hash/dist/baseN");
const { getProductDataById } = require("./productController");

const baseurl = config.base_url;

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
}

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

function calculatePercentage(number, percentage) {
  if (typeof number !== "number" || typeof percentage !== "number") {
    return "Please provide valid numbers";
  }

  if (percentage < 0 || percentage > 100) {
    return "Percentage should be between 0 and 100";
  }

  return (number * percentage) / 100;
}

exports.get_shipping_details = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token_1 = authHeader;
    const token = token_1.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const userId = decoded.data.id;

    const userData = await fetchBuyerBy_Id(userId);

    if (userData.length == 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const get_shipping_details = await fetch_shipping_by_id(userId);

    if (get_shipping_details.length != 0) {

      return res.json({
        success: true,
        status: 200,
        message: "Shipping details successfully!",
        data: get_shipping_details,
      });
    } else {
      return res.json({
        success: false,
        status: 400,
        message: "Shipping details not found ",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message,
    });
  }
};

exports.order_shipping_details = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token_1 = authHeader;
    const token = token_1.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const userId = decoded.data.id;
    const userData = await fetchBuyerBy_Id(userId);
    if (userData.length == 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const {
      first_name,
      last_name,
      company_name,
      country_region,
      street_address,
      town_city,
      postcode_zip,
      province,
      phone,
      mail,
      order_notes,
      shipping_id,
    } = req.body;

    const commonSchema = Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      company_name: Joi.string().optional(),
      country_region: Joi.string().required(),
      street_address: Joi.string().required(),
      town_city: Joi.string().required(),
      postcode_zip: Joi.number().required(),
      province: Joi.string().required(),
      phone: Joi.number().required(),
      mail: Joi.string().required(),
      order_notes: Joi.string().optional(),
      shipping_id: Joi.string().optional()
    });

    const commonValidationResult = commonSchema.validate({
      first_name,
      last_name,
      country_region,
      street_address,
      town_city,
      postcode_zip,
      province,
      phone,
      mail,
    });

    if (commonValidationResult.error) {
      const errorMessage = commonValidationResult.error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.json({
        message: commonValidationResult.error.details[0].message,
        error: errorMessage,
        missingParams: commonValidationResult.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      if (!shipping_id) {
        const data = {
          buyer_id: userId,
          first_name,
          last_name,
          company_name,
          country_region,
          street_address,
          town_city,
          postcode_zip,
          province,
          phone,
          mail,
          order_notes,
        };
        const result = await insert_into_order_shipping(data);
        if (result.affectedRows > 0) {
          const getOrderShipping = await get_order_shipping();
          return res.json({
            success: true,
            status: 200,
            message: "Shipping details added successfully!",
            data: getOrderShipping,
          });
        } else {
          return res.json({
            success: false,
            status: 400,
            message: "Shipping details added failed!",
          });
        }
      } else {
        return res.json({
          success: true,
          status: 200,
          message: "Shipping details added successfully!",
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message,
    });
  }
};

exports.get_shipping_details = async (req, res) => {
  try {
    const buyer_id = req.user;
    const fetchBuyer = await fetchBuyerBy_Id(buyer_id);
    if (fetchBuyer.length == 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      const fetch_shipping = await fetchShipping_by_id(buyer_id);
      if (fetch_shipping.length !== 0) {
        return res.json({
          success: true,
          status: 200,
          message: `fetch shipping details of buyer_id='${buyer_id}' successful`,
          shipping_details: fetch_shipping,
        });
      } else {
        return res.json({
          success: true,
          status: 400,
          message: `no shipping details found`,
          shipping_details: []
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || "Unknown error",
    });
  }
};

exports.order_checkout = async (req, res) => {
  try {
    const { payment_method, cart_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        cart_id: Joi.number().empty().required(),
        payment_method: Joi.string().empty().required(),
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
      const authHeader = req.headers.authorization;
      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.decode(token);
      const userId = decoded.data.id;
      const userData = await checkBuyerExistence(userId);
      if (userData.length === 0) {
        return res.status(200).json({
          success: false,
          message: "User not found",
        });
      }
      var order_number = generateRandomNumber(4, 6);
      const checkCartDetails = await getCartDetails_by_id(userId, cart_id);
      if (checkCartDetails.length != 0) {
        const checkOrder = await check_order(userId, cart_id);
        if (checkOrder.length == 0) {
          const checkOutData = {
            buyer_id: userId,
            payment_method,
            order_number: order_number,
            cart_id: cart_id,
          };
          const addCheckOut = await insert_checkOut(checkOutData);
          console.log("addCheckout==>>>", addCheckOut);
          const checkOutId = addCheckOut.insertId;
          if (addCheckOut.affectedRows > 0) {
            const updatePaymentStatuss = await updatePaymentStatus(cart_id, userId);
            const updateCartPaymentStatuss = await updateCartPaymentStatus(
              cart_id,
              userId
            );
            const getCheckout = await get_checkOut(checkOutId, cart_id);
            const getOrderData = await get_orderDetailsBy_cart_id(cart_id);
            const getProductData = await getProductData_ById(getOrderData[0]?.product_id);
            const getBuyerData = await getSaller_data_by_id(getOrderData[0]?.buyer_id);
            const getSellerData = await getSaller_data_by_id(getProductData[0]?.seller_id);
            console.log(getBuyerData[0]?.email, getOrderData[0]?.buyer_id, getSellerData[0]?.email, getProductData[0]?.seller_id, "=========>>>>>>>")
            for (var i = 0; i < 3; i++) {
              if (i == 0) {
                let mailOptions = {
                  from: "testing26614@gmail.com",
                  to: `${getBuyerData[0]?.email}`,
                  subject: "Second Stage – Congratulations!!!",
                  template: "buyer_confirmation",
                  context: {
                    product_buy_rent: getProductData[0]?.product_buy_rent,
                    product_category: getProductData[0]?.product_category,
                  },
                };
                transporter.sendMail(mailOptions, async function (error, info) {
                  console.log(error, info);
                });
              } else if (i == 1) {
                let mailOptions = {
                  from: "testing26614@gmail.com",
                  to: `${getSellerData[0]?.email}`,
                  subject: "ProductOrderConfirmation",
                  template: "ProductOrderConfirmation",
                  context: {
                    product_buy_rent: getProductData[0]?.product_name,
                    cart_id: cart_id,
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
                    return await res.status(200).json({
                      success: true,
                      message: "Order submit successfully!",
                      data: getCheckout,
                    });
                  }
                })
              }
            }
          } else {
            return res.json({
              success: false,
              status: 200,
              message: "Unable to order!",
            });
          }
        } else {
          return res.json({
            success: false,
            status: 200,
            message: "Order already exist",
          });
        }
      } else {
        return res.json({
          success: false,
          status: 200,
          message: " card does't exist ",
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      error: error.message,
    });
  }
};

exports.get_checkout = async (req, res) => {
  try {
    const { userId } = req.body;
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
      const allProducts = await fetchOrderById_1(userId);
      if (allProducts.length > 0) {
        await Promise.all(
          allProducts.map(async (item) => {
            let prodcut_Id = item.product_id
            const Product_details = await getAllProduct_by_id(prodcut_Id);
            if (Product_details[0].product_image != 0) {
              item.product_image = baseurl + "/productImage/" + Product_details[0].product_image;
            }
            item.seller_id = Product_details[0].seller_id;
            item.product_buy_rent = Product_details[0].product_buy_rent;
            item.product_name = Product_details[0].product_name;
            item.size_standard = Product_details[0].size_standard;
            item.sub_total = item.cart_price * item.cart_quantity
            const get_prduct_brands = await get_product_brandd(prodcut_Id)
            const product_brand_1 = get_prduct_brands.map(imageObj => imageObj.product_brand ? imageObj.product_brand : " ")
            item.product_brand = product_brand_1[0]
            const get_prduct_size = await get_product_size(prodcut_Id)
            const get_prduct_color = await get_product_color(prodcut_Id)
            item.product_color = get_prduct_color.map(imageObj => imageObj.product_color ? imageObj.product_color : " ")
            item.product_size = get_prduct_size
          })
        );
        function calculateTotalPrice(allProducts) {
          var totalPrice = 0;
          for (var i = 0; i < allProducts.length; i++) {
            totalPrice += allProducts[i].sub_total;
          }
          return totalPrice;
        }
        const all_product_data = [];
        const dublicateData = [];
        for (var j = 0; j < allProducts?.length; j++) {
          if (!dublicateData?.includes(allProducts[j]?.product_id) && allProducts[j].seller_id != userId) {
            all_product_data?.push(allProducts[j])
            dublicateData?.push(allProducts[j]?.product_id)
            console.log(allProducts[j]?.product_id, "allPro_id", allProducts[j].seller_id, userId)
          }
        }
        // for (var i = 0; i < allProducts?.length; i++) {
        //   if (!dublicateData?.includes(allProducts[i]?.product_id) && allProducts[i].seller_id != userId) {
        //     all_product_data?.push(allProducts[i]),
        //       dublicateData?.push(allProducts[i]?.product_id)
        //   }
        // }
        var totalPrice = await calculateTotalPrice(all_product_data);
        console.log("Total price_sale_lend_price:", totalPrice);
        let vat_percentage = "16%";
        let vat_sub_total = calculatePercentage(totalPrice, 16) + totalPrice;
        return res.json({
          message: "All product details",
          status: 200,
          success: true,
          cart: all_product_data,
          vat_percentage: vat_percentage,
          vat_sub_total: vat_sub_total,
          totalPrice: totalPrice,
          free_shipping: "free_shipping",
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || "Unknown error",
    });
  }
};

exports.order_list = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const userID = decoded.data.id;
    const fetch_All_Order = await fetch_all_Order(userID);
    console.log("allProd==>>", fetch_All_Order);
    if (fetch_All_Order.length > 0) {
      await Promise.all(
        fetch_All_Order.map(async (item_1) => {
          const Cart_details = await getCartDetails_by_id_1(userID, item_1.cart_id);
          await Promise.all(
            Cart_details.map(async (item) => {
              let prodcut_Id = item.product_id
              const Product_details = await getAllProduct_by_id(prodcut_Id);
              if (Product_details[0].product_image != 0) {
                item.product_image = baseurl + "/productImage/" + Product_details[0].product_image;
              }
              item.product_name = Product_details[0].product_name
              item.product_buy_rent = Product_details[0].product_buy_rent
              item.size_standard = Product_details[0].size_standard
              item.product_rental_period = Product_details[0].product_rental_period
              item.sub_total = item.cart_price * item.cart_quantity
              const get_prduct_brands = await get_product_brandd(prodcut_Id)
              const product_brand_1 = get_prduct_brands.map(imageObj => imageObj.product_brand ? imageObj.product_brand : " ")
              item.product_brand = product_brand_1[0]
              const get_prduct_color = await get_product_color(prodcut_Id)
              item.product_color = get_prduct_color.map(imageObj => imageObj.product_color ? imageObj.product_color : " ")
            })
          );
          item_1.Cart_details = Cart_details
        })
      );
      return res.json({
        message: "All product details",
        status: 200,
        success: true,
        fetch_All_Order: fetch_All_Order,
      });
    } else {
      return res.json({
        message: "No data found",
        status: 200,
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

exports.fetch_order = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const userID = decoded.data.id;
    const { cart_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        cart_id: Joi.string().required()
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
      const order_details = await getChekOutById(userID, cart_id);
      if (order_details.length > 0) {
        const Card_details = await fetchOrderById(userID, cart_id);
        for (var i = 0; i < Card_details?.length; i++) {
          let prodcut_Id = Card_details[i].product_id;
          const Product_details = await getAllProduct_by_id(prodcut_Id);
          Card_details[i].product_details = Product_details[0];
          Card_details[i].sub_total = Card_details[i]?.cart_price * Card_details[i]?.cart_quantity;
          const get_prduct_size = await get_product_size(prodcut_Id);
          const get_prduct_color = await get_product_color(prodcut_Id);
          Card_details[i].product_color = get_prduct_color.map(imageObj => imageObj.product_color ? imageObj.product_color : " ");
          Card_details[i].product_size = get_prduct_size;
        }
        function calculateTotalPrice(Card_details) {
          var totalPrice = 0;
          for (var i = 0; i < Card_details.length; i++) {
            totalPrice += Card_details[i]?.sub_total;
          }
          return totalPrice;
        }
        var totalPrice = calculateTotalPrice(Card_details);
        console.log("Total price_sale_lend_price:", totalPrice);
        let vat_percentage = "16%";
        let vat_sub_total = calculatePercentage(totalPrice, 16) + totalPrice;
        console.log(Card_details, '===>>>Card_details');
        return res.json({
          message: "All product detailsss",
          status: 200,
          success: true,
          order_details: order_details,
          Card_details: Card_details,
          vat_percentage: vat_percentage,
          vat_sub_total: vat_sub_total,
          totalPrice: totalPrice,
          free_shipping: "free_shipping",
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || "Unknown error",
    });
  }
};

// exports.fetch_order = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader.replace("Bearer ", "");
//     const decoded = jwt.decode(token);
//     const userID = decoded.data.id;

//     const allProducts = await getChekOutById(userID);
//     console.log("allProd==>>", allProducts);

//     if (allProducts.length > 0) {

//       await Promise.all(
//         allProducts.map(async (item_1) => {

//           const Cart_details = await getCartDetails_by_id_1(userID, item_1.cart_id);

//           await Promise.all(
//             Cart_details.map(async (item) => {



//               let prodcut_Id = item.product_id

//               // const Product_details = await getAllProduct_by_id(prodcut_Id);


//               // if (Product_details[0].product_image != 0) {
//               //   // item.profile_image = baseurl + "/profile/" + item.profile_image;
//               //   item.profile_images = baseurl + "/productImage/" + Product_details[0].product_image;
//               // }


//               item.sub_total = item.cart_price * item.cart_quantity

//               const get_prduct_brands = await get_product_brandd(prodcut_Id)
//               const product_brand_1 = get_prduct_brands.map(imageObj => imageObj.product_brand ? imageObj.product_brand : " ")
//               item.product_brand = product_brand_1[0]

//               // const get_prduct_size = await get_product_size(prodcut_Id)
//               // const get_prduct_color = await get_product_color(prodcut_Id)


//               // item.product_color = get_prduct_color.map(imageObj => imageObj.product_color ? imageObj.product_color : " ")
//               // item.product_size = get_prduct_size

//             })
//           );

//           item_1.Cart_details = Cart_details

//         })
//       );

//       function calculateTotalPrice(allProducts) {
//         var totalPrice = 0;
//         for (var i = 0; i < allProducts.length; i++) {
//           totalPrice += allProducts[i].sub_total;
//         }
//         return totalPrice;
//       }

//       // Calculate total price_sale_lend_price
//       var totalPrice = calculateTotalPrice(allProducts);

//       console.log("Total price_sale_lend_price:", totalPrice);


//       let vat_percentage = "16%";

//       let vat_sub_total = calculatePercentage(totalPrice, 16) + totalPrice;

//       return res.json({
//         message: "All product details",
//         status: 200,
//         success: true,
//         cart: allProducts,
//         vat_percentage: vat_percentage,
//         vat_sub_total: vat_sub_total,
//         totalPrice: totalPrice,
//         free_shipping: "free_shipping",
//       });
//     } else {
//       return res.json({
//         message: "No data found",
//         status: 200,
//         success: false,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       status: 500,
//       error: error.message || "Unknown error",
//     });
//   }
// };
