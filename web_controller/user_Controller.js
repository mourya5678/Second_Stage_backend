const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const localStorage = require("localStorage");
var base64url = require("base64url");
var crypto = require("crypto");
const moment = require("moment");
const fs = require("fs");
const axios = require("axios");
require("moment-timezone");
const config = require("../config");

const {
  registerUser,
  phone_no_check,
  get_all_users,
  updateUserbyPass_1,
  Delete_otp,
  renter_issue_image,
  delete_User,
  updateUserbyPass,
  updateUserBy_ActToken,
  fetchUserByToken,
  username_Check,
  updatePassword,
  updatePassword_1,
  fetchUserByEmail,
  updateUser,
  updateToken,
  lender_issue_image,
  phone_Check,
  register_seller,
  fetchUserByActToken,
  updateUserByActToken,
  fetchUserById,
  insert_Links,
  fetchsellerByEmail,
  fetchUserBy_Id,
  updateUser_1,
  verify_otp,
  update_guest_cart,
  update_guest_whislist,
  updateUserById,
  verify_status,
  fetchUserByIdtoken,
  createLenderIssue,
  createBuyerIssue,
  createRenterIssue,
  buyer_issue_image
} = require("../web_models/users");
const { Console } = require("console");

const baseurl = config.base_url;

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const saltRounds = 10;

const complexityOptions = {
  min: 8,
  max: 250,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};

function generateToken() {
  var length = 6,
    charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

var transporter = nodemailer.createTransport({
  // service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  // secure: true,
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

exports.signUp = async (req, res) => {
  try {
    const {
      buyer_name,
      email,
      phone_number,
      user_name,
      password,
      license_state,
      license_number,
      guest_token,
      seller_sigup,
      seller_card_number,
      buyer_card_number,
    } = req.body;
    const act_token = generateRandomString(8);
    const schema = Joi.alternatives(
      Joi.object({
        buyer_name: [Joi.string().empty().optional()],
        user_name: [Joi.string().empty().optional()],
        license_state: [Joi.string().empty().optional()],
        license_number: [Joi.string().empty().optional()],
        phone_number: [Joi.number().empty().optional()],
        guest_token: [Joi.number().empty().optional()],
        seller_sigup: [Joi.number().empty().optional()],
        seller_card_number: [Joi.string().empty().optional()],
        buyer_card_number: [Joi.string().empty().optional()],
        email: [
          Joi.string()
            .min(5)
            .max(255)
            .email({ tlds: { allow: false } })
            .lowercase()
            .optional(),
        ],
        // password: passwordComplexity(complexityOptions),
        password: Joi.string().min(6).max(15).optional().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 6 value required",
          "string.max": "maximum 15 values allowed",
        }),
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
      if (seller_sigup == 1) {
        const data = await fetchUserByEmail(email);

        if (data.length !== 0) {
          let user_id = data[0].id;

          const update_buyer = await updateUser_1(seller_card_number, user_id);

          return res.json({
            success: true,
            message: " successfull",
            status: 200,
          });
        }
      }
      const data = await fetchUserByEmail(email);
      if (data.length !== 0) {
        return res.json({
          success: false,
          message: "Already have account, Please Login",
          status: 400,
        });
      } else {
        let mailOptions = {
          from: "testing26614@gmail.com",
          to: email,
          subject: "Activate Account",
          template: "signupemail",
          context: {
            href_url: baseurl + `/web/verifyUser/` + `${act_token}`,
            msg: `Please click below link to activate your account.`,
          },
        };
        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            return res.json({
              success: false,
              status: 400,
              message: "Mail Not delivered",
            });
          } else {
            const hash = await bcrypt.hash(password, saltRounds);
            const user = {
              buyer_name: buyer_name,
              user_name: user_name,
              email: email,
              password: hash,
              show_password: password,
              phone_number: phone_number,
              show_password: password,
              license_state: license_state,
              license_number: license_number,
              license_number: license_number,
              buy_card_number: buyer_card_number,
              act_token: act_token,
            };
            const create_user = await registerUser(user);
            console.log(">>>>>>>>", create_user);
            console.log(">>>>>>>>insertId", create_user.insertId);
            let new_user_id = create_user.insertId;
            if (guest_token) {
              const update_guest_user_cart = await update_guest_cart(
                new_user_id,
                guest_token
              );
              const update_guest_user_whislist = await update_guest_whislist(
                new_user_id,
                guest_token
              );
            }
            return res.json({
              success: true,
              message:
                "Please verify your account with the email we have sent to your email address " +
                `${email}`,
              status: 200,
            });
          }
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

exports.verifyUser = async (req, res) => {
  try {
    const { token, act_token } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        token: Joi.string().empty().required().messages({
          "string.required": "token is required",
        }),
        act_token: Joi.string().empty().required().messages({
          "string.required": "act_token is required",
        }),
      })
    );
    const result = schema.validate({ token, act_token });
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
      const data = await fetchUserByActToken(act_token);
      if (data.length !== 0) {
        let datas = {
          act_token: "",
          status: true,
        };

        const result = await updateUserByActToken(
          token,
          datas.act_token,
          data[0]?.id
        );
        return res.json({
          success: true,
          message: "Email verified successfully! You can now log in.",
          status: 200,
        });
      } else {
        return res.json({
          success: false,
          message: "Error verifying email.",
          status: 400,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
    });
  }
};

exports.verifyUserEmail = async (req, res) => {
  try {
    const act_token = req.params.id;
    const token = generateToken();
    if (!act_token) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const data = await fetchUserByActToken(act_token);
      // console.log(req.params.token);
      if (data.length !== 0) {
        let datas = {
          act_token: "",
          status: true,
        };
        const hash = await bcrypt.hash(token, saltRounds);
        const result = await updateUserByActToken(
          hash,
          datas.act_token,
          data[0]?.id
        );

        if (result.affectedRows) {
          res.sendFile(__dirname + "/view/signupSucessPage.html");
        } else {
          res.sendFile(__dirname + "/view/notverify.html");
        }
      } else {
        res.sendFile(__dirname + "/view/notverify.html");
      }
    }
  } catch (error) {
    console.log(error);
    res.send(`<div class="container">
        <p>404 Error, Page Not Found</p>
        </div> `);
  }
};

exports.login_buyer = async (req, res) => {
  try {
    const { email, password, guest_token } = req.body;
    const token = generateToken();
    const schema = Joi.alternatives(
      Joi.object({
        email: [Joi.string().empty().required()],
        password: Joi.string().min(6).max(15).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 6 value required",
          "string.max": "maximum 15 values allowed",
        }),
        guest_token: Joi.string().optional()
      })
    );
    const result = schema.validate({ email, password });
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
      const data = await fetchUserByEmail(email);
      // console.log("data", data[0].id);
      if (data.length !== 0) {
        if (data[0]?.act_token === "" && data[0]?.verify_user === 1) {
          if (email === data[0].email) {
            const match = bcrypt.compareSync(password, data[0]?.password);
            // console.log(">>>>>>>>>", match);
            if (match) {
              const toke = jwt.sign(
                {
                  data: {
                    id: data[0].id,
                  },
                },
                "SecretKey"
                // { expiresIn: "1d" }
              );
              // console.log(toke);
              bcrypt.genSalt(saltRounds, async function (err, salt) {
                bcrypt.hash(token, salt, async function (err, hash) {
                  if (err) throw err;
                  const results = await updateToken(hash, email);
                  if (guest_token) {
                    const update_guest_user_cart = await update_guest_cart(
                      data[0].id,
                      guest_token
                    );
                    const update_guest_user_whislist = await update_guest_whislist(
                      data[0].id,
                      guest_token
                    );
                  }
                  return res.json({
                    status: 200,
                    success: true,
                    message: "Login successful!",
                    token: toke,
                    user_id: data[0].id,
                    user_info: data[0],
                  });
                });
              });
            } else {
              return res.json({
                success: false,
                message: "Invalid password.",
                status: 400,
              });
            }
          } else {
            return res.json({
              message: "Account not found. Please check your details",
              status: 400,
              success: false,
            });
          }
        } else {
          return res.json({
            message: "Login failed. Please verify your account and try again",
            status: 400,
            success: false,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Account not found. Please check your details.",
          status: 400,
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

exports.resetPassword = async (req, res) => {
  const { user_id, password } = req.body;
  try {
    const schema = Joi.alternatives(
      Joi.object({
        password: Joi.string().min(5).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 5 value required",
          "string.max": "maximum 10 values allowed",
        }),
        user_id: Joi.number().empty().required().messages({
          "number.empty": "id can't be empty",
          "number.required": "id  is required",
        }),
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
      const result = await fetchUserById(user_id);
      if (result.length != 0) {
        const hash = await bcrypt.hash(password, saltRounds);
        const result2 = await updateUserbyPass(hash, user_id);

        if (result2) {
          return res.json({
            success: true,
            status: 200,

            message:
              "Password reset successful. You can now log in with your new password",
          });
        } else {
          return res.json({
            success: false,
            status: 200,
            message: "Some error occured. Please try again",
          });
        }
      } else {
        return res.json({
          success: false,
          status: 200,
          message: "User Not Found",
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

function randomStringAsBase64Url(size) {
  return base64url(crypto.randomBytes(size));
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        email: [Joi.string().empty().required()],
      })
    );
    const result = schema.validate({ email });
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
      const data = await fetchUserByEmail(email);
      if (data.length !== 0) {
        const genToken = randomStringAsBase64Url(20);
        await updateUser(genToken, email);

        const result = await fetchUserByEmail(email);

        let token = result[0].token;

        if (!result.error) {
          let mailOptions = {
            from: "coincrazre@gmail.com",
            to: req.body.email,
            subject: "Forget Password",
            template: "forget_template",
            context: {
              href_url: baseurl + `/web/verifyPassword/${token}`,
              msg: `Please click below link to change password.`,
            },
          };
          transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
              return res.json({
                success: false,
                message: error,
              });
            } else {
              return res.json({
                success: true,

                message:
                  "Password reset link sent successfully. Please check your email " +
                  email,
              });
            }
          });
        }
      } else {
        return res.json({
          success: false,

          message: "Email address not found. Please enter a valid email",
          status: 400,
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

exports.verifyPassword = async (req, res) => {
  try {
    const id = req.params.token;

    // console.log(id);

    if (!id) {
      return res.status(400).send("Invalid link");
    } else {
      const result = await fetchUserByIdtoken(id);

      console.log(">>>>>>>>>>", result);

      const token = result[0]?.token;
      if (result.length !== 0) {
        localStorage.setItem("vertoken", JSON.stringify(token));

        res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
          msg: "",
        });
      } else {
        res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
          msg: "This User is not Registered",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.send(`<div class="container">
          <p>404 Error, Page Not Found</p>
          </div> `);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { password, confirm_password } = req.body;
    const token = JSON.parse(localStorage.getItem("vertoken"));
    const schema = Joi.alternatives(
      Joi.object({
        password: Joi.string().min(8).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 8 value required",
          "string.max": "maximum 10 values allowed",
        }),
        confirm_password: Joi.string().min(8).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 8 value required",
          "string.max": "maximum 10 values allowed",
        }),
      })
    );
    const result = schema.validate({ password, confirm_password });
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      res.render(path.join(__dirname + "/view/", "forgetPassword.ejs"), {
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        msg: message,
      });
    } else {
      if (password == confirm_password) {
        const data = await fetchUserByToken(token);

        if (data.length !== 0) {
          const update_show_password = await updatePassword_1(password, token);
          const hash = await bcrypt.hash(password, saltRounds);
          const result2 = await updatePassword(hash, token);

          if (result2) {
            res.sendFile(path.join(__dirname + "/view/message.html"), {
              msg: "",
            });
          } else {
            res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
              msg: "Internal Error Occured, Please contact Support.",
            });
          }
        } else {
          return res.json({
            message: "User not found please sign-up first",
            success: false,
            status: 400,
          });
        }
      } else {
        res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
          msg: "Password and Confirm Password do not match",
        });
      }
    }
  } catch (error) {
    console.log(error);

    res.render(path.join(__dirname, "/view/", "forgetPassword.ejs"), {
      msg: "Internal server error",
    });
  }
};

exports.changePassword_1 = async (req, res) => {
  try {
    const { user_id, new_password, older_password } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.number().empty().required(),
        older_password: Joi.string().empty().required(),
        new_password: Joi.string().min(8).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 8 value required",
          "string.max": "maximum 10 values allowed",
        }),
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
      const userData = await fetchUserBy_Id(user_id);
      console.log("userData==>>>", userData);
      if (userData.length === 0) {
        return res.status(200).json({
          success: false,
          message: "User not found",
        });
      }
      const match = bcrypt.compareSync(older_password, userData[0]?.password);
      if (match) {
        const hash = await bcrypt.hash(new_password, saltRounds);
        const update_user_password = await updateUserbyPass_1(
          hash,
          new_password,
          user_id
        );

        console.log("update>>>>>", update_user_password);
        return res.json({
          success: true,
          message: " Password change successfully",
          status: 200,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: " Old password not match ",
          // status: 400,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      error: error,
    });
  }
};

exports.myProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("authHeader>>>>>>>", authHeader);
    const token_1 = authHeader;
    const token = token_1.replace("Bearer ", "");

    console.log(">>>>>>>>>>>", token);

    const decoded = jwt.decode(token);
    const user_id = decoded.data.id;

    const data = await fetchUserBy_Id(user_id);

    console.log(">>>>>>>>", data);
    if (data.length != 0) {
      await Promise.all(
        data.map(async (item) => {
          if (item.profile_image != 0) {
            // item.profile_image = baseurl + "/profile/" + item.profile_image;
            item.profile_image =
              baseurl + "/ProfileImages/" + item.profile_image;
          } else {
            item.profile_image = "";
          }
        })
      );

      return res.json({
        status: 200,
        success: true,
        message: "User Found Successfull",
        user_info: data,
      });
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "User Not Found",
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

exports.renter_issue = async (req, res, next) => {
  try {
    const {
      user_id,
      issue_claimed,
      date_from,
      date_to,
      damaged_product,
      cleaning_fee,
      additional_not_listed,
      value_of_claim,
      tracking_number,
      add_note
    } = req.body
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.string().required(),
        issue_claimed: Joi.string().required(),
        date_from: Joi.string().required(),
        date_to: Joi.string().required(),
        damaged_product: Joi.string().required(),
        cleaning_fee: Joi.string().required(),
        additional_not_listed: Joi.string().required(),
        value_of_claim: Joi.string().required(),
        tracking_number: Joi.string().required(),
        add_note: Joi.string().required()
      })
    )
    const result = schema.validate(req.body);
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
      const data = {
        user_id,
        issue_claimed,
        date_from,
        date_to,
        damaged_product,
        cleaning_fee,
        additional_not_listed,
        value_of_claim,
        tracking_number,
        add_note
      }
      const productResult = await createRenterIssue(data)
      const product_id = productResult.insertId;
      let filename = ''
      if (req.file) {
        const file = req.file;
        filename = req.file.filename
        console.log(req.file)
      }
      const image_upload = await renter_issue_image(filename, product_id);
      if (productResult?.affectedRows > 0 && image_upload?.affectedRows > 0) {
        const get_seller_email = await fetchUserById(user_id);
        let mailOptions = {
          from: "testing26614@gmail.com",
          to: `${get_seller_email[0]?.email}`,
          subject: "RenterIssueRequest",
          template: "RenterIssueRequest",
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
              message: "renter issue created.",
              user_id: user_id,
              status: 200,
              success: true
            })
          }
        });
      } else {
        return res.json({
          message: "Unble to create renter issue!",
          status: 200,
          success: false
        })
      }
    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error,
      message: "internal server error",
      status: "False"
    });
  }
};

exports.buyer_issue = async (req, res) => {
  try {
    const {
      user_id,
      issue_claimed,
      date_from,
      date_to,
      damaged_product,
      cleaning_fee,
      additional_not_listed,
      value_of_claim,
      tracking_number,
      add_note
    } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.string().required(),
        issue_claimed: Joi.string().required(),
        date_from: Joi.string().required(),
        date_to: Joi.string().required(),
        damaged_product: Joi.string().required(),
        cleaning_fee: Joi.string().required(),
        additional_not_listed: Joi.string().required(),
        value_of_claim: Joi.string().required(),
        tracking_number: Joi.string().required(),
        add_note: Joi.string().required(),
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
      const data = {
        user_id,
        issue_claimed,
        date_from,
        date_to,
        damaged_product,
        cleaning_fee,
        additional_not_listed,
        value_of_claim,
        tracking_number,
        add_note
      }
      const productResult = await createBuyerIssue(data);
      const product_id = productResult.insertId;
      let filename = ''
      if (req.file) {
        const file = req.file;
        filename = req.file.filename
        console.log(req.file)
      }
      const image_upload = await buyer_issue_image(filename, product_id);
      if (productResult?.affectedRows > 0 && image_upload?.affectedRows > 0) {
        const get_seller_email = await fetchUserById(user_id);
        let mailOptions = {
          from: "testing26614@gmail.com",
          to: `${get_seller_email[0]?.email}`,
          subject: "BuyerRenterIssueRequest",
          template: "BuyerRenterIssueRequest",
        };
        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            return res.json({
              success: false,
              status: 400,
              message: "Mail Not delivered!",
            });
          } else {
            return await res.json({
              message: 'buyer issue created',
              user_id: user_id,
              status: 200,
              success: true
            });
          }
        });
      } else {
        return res.json({
          message: 'Unable to create issue, Please try again!',
          status: 200,
          success: false
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error,
      message: "internal server error",
      status: "False"
    });
  }
};

exports.lenderissue = async (req, res) => {
  try {
    const {
      user_id,
      issue_claimed,
      date_from,
      date_to,
      damage_fee,
      total,
      standard,
      complex,
      cleaning_fee,
      additional_not_listed,
      value_of_claim,
      tracking_number,
      reason,
    } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.string().required(),
        issue_claimed: Joi.string().required(),
        date_from: Joi.string().required(),
        date_to: Joi.string().required(),
        damage_fee: Joi.string().required(),
        total: Joi.string().required(),
        standard: Joi.string().required(),
        complex: Joi.string().required(),
        cleaning_fee: Joi.string().required(),
        additional_not_listed: Joi.string().required(),
        value_of_claim: Joi.string().required(),
        tracking_number: Joi.string().required(),
        reason: Joi.string().required(),
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
      const data = {
        user_id,
        issue_claimed,
        date_from,
        date_to,
        damage_fee,
        total,
        standard,
        complex,
        cleaning_fee,
        additional_not_listed,
        value_of_claim,
        tracking_number,
        reason,
      }
      const productResult = await createLenderIssue(data);
      const product_id = productResult.insertId;
      let filename = ''
      if (req.file) {
        const file = req.file;
        filename = req.file.filename
        console.log(req.file)
      }
      const image_upload = await lender_issue_image(filename, product_id);
      if (productResult?.affectedRows > 0 && image_upload?.affectedRows > 0) {
        const get_seller_email = await fetchUserById(user_id);
        let mailOptions = {
          from: "testing26614@gmail.com",
          to: `${get_seller_email[0]?.email}`,
          subject: "LenderIssueRequestConfirmation",
          template: "LenderIssueRequestConfirmation",
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
              message: "lender issue created.",
              user_id: user_id,
              status: 200,
              success: true
            })
          }
        });
      } else {
        return res.json({
          message: "Unble to create lender issue!",
          status: 200,
          success: false
        })
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error,
      message: "internal server error",
      status: "False"
    });
  }
};


exports.editProfile = async (req, res) => {
  try {
    const {
      buyer_name,
      phone_number,
      user_name,
      license_state,
      license_number,
    } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        buyer_name: [Joi.string().empty().required()],
        user_name: [Joi.string().empty().required()],
        license_state: [Joi.string().empty().required()],
        license_number: [Joi.string().empty().required()],
        user_name: [Joi.string().empty().required()],
        phone_number: [Joi.number().empty().required()],
      })
    );
    const result = schema.validate(req.body);
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
      const authHeader = req.headers.authorization;

      // console.log("authHeader>>>>>>>", authHeader)
      const token_1 = authHeader;
      const token = token_1.replace("Bearer ", "");

      // console.log(">>>>>>>>>>>", token);

      const decoded = jwt.decode(token);
      const user_id = decoded.data.id;

      // console.log(">>>>>>>", user_id);
      let filename = "";
      if (req.file) {
        const file = req.file;
        filename = file.filename;
      }

      console.log(">>>>>>>>>", filename);

      const userInfo = await fetchUserBy_Id(user_id);
      // console.log("userInfo>>>>>>>>>>", userInfo);
      if (userInfo.length !== 0) {
        const usernmae_check = await username_Check(user_name, user_id);
        if (usernmae_check != 0) {
          return res.json({
            success: false,
            message:
              "Usernmae is already taken. Please use a different username.",
            status: 400,
          });
        }
        let user = {
          profile_image: filename ? filename : userInfo[0].profile_image,
          user_name: user_name ? user_name : userInfo[0].user_name,
          buyer_name: buyer_name ? buyer_name : userInfo[0].buyer_name,
          phone_number: phone_number ? phone_number : userInfo[0].phone_number,
          license_state: license_state
            ? license_state
            : userInfo[0].license_state,
          license_number: license_number
            ? license_number
            : userInfo[0].license_number,
        };
        console.log(">>>>>>>>>>>>", user);
        const result = await updateUserById(user, user_id);
        if (result.affectedRows) {
          const userInfo = await fetchUserBy_Id(user_id);

          return res.json({
            message: "update user successfully",
            status: 200,
            success: true,
            userInfo: userInfo,
          });
        } else {
          return res.json({
            message: "update user failed ",
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

exports.complete_profile = async (req, res) => {
  try {
    const { display_name, DOB, gender } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        display_name: [Joi.string().empty().required()],
        DOB: [Joi.string().empty().required()],
        gender: [Joi.string().empty().required()],
      })
    );
    const result = schema.validate(req.body);
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
      const authHeader = req.headers.authorization;

      // console.log("authHeader>>>>>>>", authHeader)
      const token_1 = authHeader;
      const token = token_1.replace("Bearer ", "");

      // console.log(">>>>>>>>>>>", token);

      const decoded = jwt.decode(token);
      const user_id = decoded.data.id;

      // console.log(">>>>>>>", user_id);
      let filename = "";
      if (req.file) {
        const file = req.file;
        filename = file.filename;
      }
      const userInfo = await fetchUserBy_Id(user_id);
      // console.log("userInfo>>>>>>>>>>", userInfo);
      if (userInfo.length !== 0) {
        const display_name_check = await username_Check(display_name, user_id);
        if (display_name_check != 0) {
          return res.json({
            success: false,
            message:
              "Display name is already taken. Please use a different display name.",
            status: 400,
          });
        }
        let user = {
          gender: gender,
          DOB: DOB,
          display_name: display_name,
          profile_image: filename,
        };
        const result = await updateUserById(user, user_id);
        if (result.affectedRows) {
          return res.json({
            message: "update user successfully",
            status: 200,
            success: true,
          });
        } else {
          return res.json({
            message: "update user failed ",
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

exports.delete_user = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("authHeader>>>>>>>", authHeader);
    const token_1 = authHeader;
    const token = token_1.replace("Bearer ", "");

    console.log(">>>>>>>>>>>", token);

    const decoded = jwt.decode(token);
    const user_id = decoded.data.id;

    const Delete_user = await delete_User(user_id);

    console.log(">>>>>", Delete_user);

    return res.json({
      message: "User deleted successfully!",
      status: 200,
      success: true,
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
