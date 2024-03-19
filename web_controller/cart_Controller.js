const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("../config");

const {
  createCart,
  fetchCartByUserId,
  fetchCartById,
  getAllProduct_by_id,
  updateCartById,
  deleteCartById, check_cart,
  fetchUserBy_Id,
  deleteCartByuserId,
  getCartByProductIdAndUserId,
  deleteCartByProductIdAndUserId,
  fetchBuyerBy_Id,
  get_product_color,
  getCartByProductIdAndBuyerId,
  deleteCartByProductIdAndBuyerId,
  checkBuyerExistence,
  checkProductExistence,
  get_cart_id,
  fetchCartByBuyerId,
  getProductById,
  getCartById,
  fetchProductById,
  get_product_brandd,
  get_product_size,
  get_product_imagesss,
  get_product_category,
  get__cart,
  insert_wishlist,
  get_wishlist,
  getWishlistById,
  getAllProduct_wishlist_by_id,
  check_product_in_wishlist,
  remove_from_wishlist,
  updateWishListLike,
  removeWishListLikeCount,
  updateCartCount,
  add_text,
  fetch_text,
  delete_text,
} = require("../web_models/cart");


const baseurl = config.base_url;

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
}

exports.addTocart = async (req, res) => {
  try {
    let { product_id, cart_quantity, start_date, end_date, size_bottom, size_top, total_rend_days, rent_cart, color, userId, guest_user } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        product_id: Joi.number().empty().required(),
        cart_quantity: Joi.number().empty().required(),
        userId: Joi.number().empty().required(),
        guest_user: Joi.number().empty().required(),
        size_bottom: Joi.string().empty().required(),
        size_top: Joi.string().empty().required(),
        color: Joi.string().empty().required(),
        start_date: Joi.string().empty().optional(),
        end_date: Joi.string().empty().optional(),
        total_rend_days: Joi.string().empty().optional(),
        rent_cart: Joi.number().empty().optional(),
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
      if (guest_user != 1) {
        const userData = await fetchBuyerBy_Id(userId);
        console.log("userData==>>>", userData);
        if (userData.length === 0) {
          return res.status(200).json({
            success: false,
            message: "User not found",
          });
        }
      }
      const productExists = await checkProductExistence(product_id);
      // console.log("======>>>>>>>", productExists[0]?.seller_id == userId, userId, productExists[0])
      if (productExists[0]?.seller_id != userId) {
        if (productExists.length === 0) {
          return res.status(200).json({
            success: false,
            message: " Product not found",
          });
        }
        if (rent_cart == 1) {
          if (productExists[0].product_buy_rent !== "rent") {
            return res.status(400).json({
              success: false,
              message: "Product is not available for rent",
            });
          }
        }
        // Check if the item is already present in the cart
        const existingitem = await getCartByProductIdAndBuyerId(product_id, userId);
        if (existingitem.length !== 0) {
          return res.status(200).json({
            success: false,
            message: "Item already in the cart",
          });
        }
        var cart_number = generateRandomNumber(4, 6);
        const checkCart = await check_cart(userId)
        // Add the item to the cart
        const cartData = {
          product_id: product_id,
          buyer_id: userId,
          cart_price: productExists[0].price_sale_lend_price,
          cart_quantity: cart_quantity ? cart_quantity : 1,
          size_bottom: size_bottom ? size_bottom : 0,
          size_top: size_top ? size_top : 0,
          color: color ? color : 0,
          cart_id: (checkCart.length != 0) ? checkCart[0].cart_id : cart_number,
          total_rend_days: total_rend_days ? total_rend_days : 0,
          start_date: start_date ? start_date : null,
          end_date: end_date ? end_date : null
        };
        const addCart = await createCart(cartData);
        // Retrieve the updated cart
        const getCart = await get__cart(userId);
        return res.status(200).json({
          success: true,
          message: "Item added to the cart successfully",
          data: getCart,
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "You can not order your own products!",
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

exports.getCartByUserId = async (req, res) => {
  try {
    let { userId } = req.body;
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
      const allProduct = await getCartById(userId);
      if (allProduct.length > 0) {
        await Promise.all(
          allProduct.map(async (item) => {
            item.new_cart_id = item.id
            let prodcut_Id = item.product_id
            const Product_details = await getAllProduct_by_id(prodcut_Id);
            const product_image_by_id = await get_product_imagesss(Product_details[0]?.id);
            if (product_image_by_id != 0) {
              item.profile_images = product_image_by_id[0];
            }
            item.seller_id = Product_details[0]?.seller_id;
            item.size_standard = Product_details[0]?.size_standard;
            item.product_name = Product_details[0]?.product_name;
            item.product_rental_period = Product_details[0]?.product_rental_period;
            item.product_buy_rent = Product_details[0].product_buy_rent;
            item.sub_total = item.cart_price * item.cart_quantity;
            const get_prduct_brands = await get_product_brandd(prodcut_Id);
            const product_brand_1 = get_prduct_brands.map(imageObj => imageObj.product_brand ? imageObj.product_brand : " ");
            item.product_brand = product_brand_1[0];
            const get_prduct_size = await get_product_size(prodcut_Id);
            const get_prduct_color = await get_product_color(prodcut_Id);
            item.product_color = get_prduct_color.map(imageObj => imageObj.product_color ? imageObj.product_color : " ");
            if (get_prduct_size?.length != 0) {
              item.product_size = get_prduct_size;
            }
            if (item.size_standard) {
              item.size_standard = item.size_standard
            }
            item.product_rental_period = item.product_rental_period
          })
        );
        function calculateTotalPrice(allProduct) {
          var totalPrice = 0;
          for (var i = 0; i < allProduct.length; i++) {
            totalPrice += allProduct[i].sub_total;
          }
          return totalPrice;
        }
        // Calculate total price_sale_lend_price
        // console.log(allProduct, "allProduct==>>")
        let all_product_data = [];
        let dublicateData = [];
        for (var i = 0; i < allProduct?.length; i++) {
          if (!dublicateData?.includes(allProduct[i]?.product_id) && allProduct[i].seller_id != userId) {
            all_product_data?.push(allProduct[i]),
              dublicateData?.push(allProduct[i]?.product_id)
          }
        }
        var totalPrice = await calculateTotalPrice(all_product_data);
        return await res.json({
          message: "All product details",
          status: 200,
          success: true,
          cart: all_product_data,
          totalPrice: totalPrice,
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
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || "Unknown error",
    });
  }
};

exports.editCart = async (req, res) => {
  try {

    const { user_id, card_id, cart_quantity, size_bottom, size_top, color, start_date, end_date, total_rend_days } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.number().empty().required(),
        card_id: Joi.number().empty().required(),
        cart_quantity: Joi.number().empty().optional(),
        size_bottom: Joi.string().empty().optional(),
        size_top: Joi.string().empty().optional(),
        color: Joi.string().empty().optional(),
        start_date: Joi.string().empty().optional(),
        end_date: Joi.string().empty().optional(),
        total_rend_days: Joi.number().empty().optional(),
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

      const cartData = await fetchCartById(card_id, user_id);

      if (cartData.length == 0) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Cart data not found",
        });
      }

      const cart_data = {
        cart_quantity: cart_quantity ? cart_quantity : cartData[0].cart_quantity,
        size_bottom: size_bottom ? size_bottom : cartData[0].size_bottom,
        size_top: size_top ? size_top : cartData[0].size_top,
        color: color ? color : cartData[0].color,
        start_date: start_date ? start_date : cartData[0].start_date,
        end_date: end_date ? end_date : cartData[0].end_date,
        total_rend_days: total_rend_days ? total_rend_days : cartData[0].total_rend_days,
      };


      const update_cart_Data = await updateCartById(cart_data, card_id);
      const updated_cart_Data = await fetchCartById(card_id, user_id);

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Cart details updated successfully!",
        updated_cart_Data: updated_cart_Data,
      });

    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const CartId = req.params.id;

    // Check if the cart exists before attempting to delete
    const existingCart = await get_cart_id(CartId);
    if (!existingCart || existingCart.length === 0) {
      return res.json({
        status: 400,
        success: false,
        message: "Cart Not Found. It may have already been deleted.",
      });
    }

    // Delete the cart
    const data = await deleteCartById(CartId);
    if (data.length !== 0) {
      return res.json({
        status: 200,
        success: true,
        message: "Cart deleted successfully!",
      });
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "Failed to delete cart",
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

exports.addToRentCart = async (req, res) => {
  try {
    let { product_id, cart_quantity, start_date, end_date, size_bottom, size_top, total_rend_days, rent_price } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        product_id: Joi.number().empty().required(),
        cart_quantity: Joi.number().empty().required(),
        rent_price: Joi.number().empty().required(),
        size_bottom: Joi.string().empty().required(),
        size_top: Joi.string().empty().required(),
        start_date: Joi.string().empty().required(),
        end_date: Joi.string().empty().required(),
        color: Joi.string().empty().required(),
        total_rend_days: Joi.number().empty().required(),
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
      const token_1 = authHeader;
      const token = token_1.replace("Bearer ", "");
      const decoded = jwt.decode(token);
      const userId = decoded.data.id;

      const userData = await fetchBuyerBy_Id(userId);
      console.log("userData==>>>", userData);

      if (userData.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      console.log("product_id ==>>>", product_id);

      // Check if buyer and product exist
      const buyerExists = await checkBuyerExistence(userId);
      console.log("buyerExists==>>>", buyerExists);
      const productExists = await checkProductExistence(product_id);
      console.log("productExists==>>>", productExists);

      if (buyerExists.length === 0 || productExists.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Buyer or product not found",
        });
      }


      // Check if the item is already present in the cart
      const existingItem = await getCartByProductIdAndBuyerId(product_id, userId);

      if (existingItem.length !== 0) {
        return res.status(400).json({
          success: false,
          message: "Item already in the cart",
        });
      }


      // Fetch product details by product ID

      const productDetails = await checkProductExistence(product_id);

      // if (!productDetails || isNaN(productDetails[0].price_sale_lend_price)) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Invalid product details or price",
      //   });
      // }

      // Check if product is available for rent

      if (productDetails[0].product_buy_rent !== "rent") {
        return res.status(400).json({
          success: false,
          message: "Product is not available for rent",
        });
      }

      var cart_number = generateRandomNumber(4, 6);
      const checkCart = await check_cart(userId)

      // Add the item to the cart

      const cartData = {
        product_id: product_id,
        buyer_id: userId,
        rent_price: rent_price,
        cart_quantity: cart_quantity,
        start_date: start_date,
        end_date: end_date,
        size_top: size_top,
        size_bottom: size_bottom,
        rent_cart: 1,
        total_rend_days: total_rend_days,
        cart_id: (checkCart.length != 0) ? checkCart[0].cart_id : cart_number
      };


      const add_rent_Cart = await createCart(cartData);

      console.log(">>>>>>>add_rent_Cart>>>>>", add_rent_Cart)

      return res.status(200).json({
        success: true,
        message: "Item added to the rent cart successfully",
        // data: updatedCart,
      });
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

// wishlist functionality

exports.add_product_wishlist = async (req, res) => {
  try {
    let { userId, product_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        userId: Joi.number().empty().required(),
        product_id: Joi.number().empty().required(),
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
      const getProductData_By_Id = await checkProductExistence(product_id);
      if (getProductData_By_Id[0]?.seller_id == userId) {
        return res.json({
          success: false,
          status: 200,
          message: "You can not add you own product to the wishlist.",
        });
      } else {
        let buyer_id = userId
        const isProductInWishlist = await check_product_in_wishlist(
          buyer_id,
          product_id
        );
        if (isProductInWishlist.length > 0) {
          const deleteWishList = await remove_from_wishlist(buyer_id, product_id);
          if (deleteWishList) {
            return res.json({
              success: true,
              status: 200,
              message: " Product deleted from Wishlist  successfully!",
            });
          }
        } else {
          const data = {
            buyer_id,
            product_id,
          };
          const result = await insert_wishlist(data);
          // const getWishList = await get_wishlist();
          // console.log(getWishList, "getWishList")
          if (result.affectedRows > 0) {
            return res.json({
              success: true,
              status: 200,
              message: "Item added successfully to wishlist.",
              data: result,
            });
          } else {
            return res.json({
              success: false,
              status: 200,
              message: "Operation failed!",
            });
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

exports.get_wishlist_by_id = async (req, res) => {
  try {
    let { userId } = req.body;
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
      let buyer_id = userId
      const wish_list_data = [];
      const dublicateData = [];
      const wishListDetails = await getWishlistById(buyer_id);
      if (wishListDetails.length > 0) {
        await Promise.all(
          wishListDetails.map(async (item) => {
            let prodcutId = item?.product_id
            const Product_details = await getAllProduct_by_id(prodcutId);
            if (Product_details[0]?.product_image != 0) {
              item.product_image =
                baseurl + "/productImage/" + Product_details[0]?.product_image;
            }
            item.product_rental_period = Product_details[0]?.product_rental_period;
            item.size_standard = Product_details[0]?.size_standard;
            item.seller_id = Product_details[0]?.seller_id;
            item.product_buy_rent = Product_details[0]?.product_buy_rent;
            item.product_name = Product_details[0]?.product_name;
            item.price_sale_lend_price = Product_details[0]?.price_sale_lend_price
            item.product_description = Product_details[0]?.product_description
            const get_prduct_size = await get_product_size(prodcutId)
            const get_prduct_brands = await get_product_brandd(prodcutId)
            const get_product_Category = await get_product_category(prodcutId)
            const get_prduct_color = await get_product_color(prodcutId)
            const get_product_images = await get_product_imagesss(prodcutId)
            item.product_images = get_product_images.map(imageObj => imageObj.product_image ? imageObj.product_image : " ")
            item.product_brand = get_prduct_brands[0]?.product_brand
            item.product_color = get_prduct_color.map(imageObj => imageObj.product_color ? imageObj.product_color : " ")
            item.product_Categories = (get_product_Category.length != 0) ? get_product_Category[0]?.product_category : ""
            item.product_size = get_prduct_size
            item.wishlist_like = 1
          })
        );
        for (var j = 0; j < wishListDetails?.length; j++) {
          if (!dublicateData?.includes(wishListDetails[j]?.product_id) && wishListDetails[j].seller_id != userId) {
            wish_list_data?.push(wishListDetails[j])
            dublicateData?.push(wishListDetails[j]?.product_id)
            console.log(wishListDetails[j]?.product_id, "allPro_id", wishListDetails[j].seller_id, userId)
          }
        }

        return await res.json({
          message: "All wishlist items",
          status: 200,
          success: true,
          wishlist: wish_list_data,
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
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

exports.remove__wishlist = async (req, res) => {
  try {
    const buyer_id = req.user;
    const product_id = req.params.product_id;


    const isProductInWishlist = await check_product_in_wishlist(
      buyer_id,
      product_id
    );

    if (isProductInWishlist.length > 0) {

      deleteWishList = await remove_from_wishlist(buyer_id, product_id);

      if (deleteWishList) {
        return res.json({
          success: true,
          status: 200,
          message: "Wishlist deleted successfully!",
        });
      }


    } else {

      return res.json({
        success: false,
        status: 400,
        message: "Product not exist in whislist",
      });
    }


  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || "Unknown error",
    });
  }
};

