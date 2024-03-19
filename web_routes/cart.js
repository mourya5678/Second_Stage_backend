const express = require("express");
const web_cartController = require("../web_controller/cart_Controller");
const auth = require("../middleware/auth");
const router = express.Router();
// add cart functionality

router.post("/add_cart", web_cartController.addTocart);
router.post("/getCartData", web_cartController.getCartByUserId);
router.post("/upDateCartData", web_cartController.editCart);
router.delete("/deleteCartData/:id", web_cartController.deleteCart);

// for rent user
router.post("/add_cart_rent", auth, web_cartController.addToRentCart);

// wishlist functionality

router.post("/add_wishlist", web_cartController.add_product_wishlist);
router.post("/get_wishlist", web_cartController.get_wishlist_by_id);
router.delete("/remove_wishlist/:product_id", auth, web_cartController.remove__wishlist)



module.exports = router;
