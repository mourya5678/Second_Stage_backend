const express = require("express");
const web_userController = require("../web_controller/user_Controller");
const auth = require("../middleware/auth");
const upload = require("../middleware/ProfileImages.JS");
const router = express.Router();


router.post("/signUp", web_userController.signUp);


router.post("/login_buyer", web_userController.login_buyer);

router.post("/verifyUser", web_userController.verifyUser);

router.get("/verifyUser/:id", web_userController.verifyUserEmail);

router.post("/forgotPassword", web_userController.forgotPassword);

router.get("/verifyPassword/:token", web_userController.verifyPassword);

router.post("/changePassword", web_userController.changePassword);

router.post("/changePassword_by_user", auth, web_userController.changePassword_1);

router.get("/myProfile", auth, web_userController.myProfile);

router.post("/delete_user", auth, web_userController.delete_user);

router.post("/complete_profile", auth, upload.single("file"), web_userController.complete_profile);

router.post("/editProfile", auth, upload.single("file"), web_userController.editProfile);

router.post("/lenderissue", upload.single("file"), web_userController.lenderissue)
router.post("/buyer_issue", upload.single("file"), web_userController.buyer_issue)
router.post("/renter_issue", upload.single("file"), web_userController.renter_issue)

module.exports = router;
