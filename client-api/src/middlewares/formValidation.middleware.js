const Joi = require("joi");

const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: false },
});

const pin = Joi.number().min(100000).max(999999).required();
const shortStr = Joi.string().min(1).max(80);
const longStr = Joi.string().min(1).max(1000);

const newPassword = Joi.string().min(8).max(100).required();

const resetPasswordRequestValidation = (req, res, next) => {
  const schema = Joi.object({ email });
  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

const updatePasswordValidation = (req, res, next) => {
  const schema = Joi.object({ email, pin, newPassword });
  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

// Reply is a JSON body (no file upload) so it can be validated up front.
const replyMessageValidation = (req, res, next) => {
  const schema = Joi.object({
    sender: shortStr.required(),
    message: longStr.required(),
  });
  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    name: shortStr.required(),
    email: email.required(),
    role: Joi.string()
      .valid("tenant", "superintendent", "management", "landlord")
      .required(),
    building: shortStr.required(),
    // Only tenants must supply an apartment; others may leave it blank.
    apartment: Joi.string().allow("").max(20),
    address: Joi.string().allow("").max(100),
    phone: Joi.string().allow("").max(20),
    password: Joi.string().min(8).max(100).required(),
  });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  if (req.body.role === "tenant" && !req.body.apartment) {
    return res.json({
      status: "error",
      message: "Apartment/unit is required for tenants",
    });
  }
  next();
};

module.exports = {
  resetPasswordRequestValidation,
  updatePasswordValidation,
  replyMessageValidation,
  newUserValidation,
};
