const BigPromise = require("../midleware/BigPromise");
const User = require("../model/user");
const cookieToken = require("../util/cookieToken");
const cloudinary = require("cloudinary");
const mailHelper = require("../util/emailhelepr");
const crypto = require("crypto");

exports.signup = BigPromise(async (req, res, next) => {
  let result;
  if (req.files) {
    console.log(req.files);
    let file = req.files.photo;
    result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });
  }
  const { email, name, password } = req.body;
  if (!(email && name && password))
    return res.status(400).json({ error: "Enter all Fields" });

  const newUser = await User.create({
    email,
    name,
    password,
    photo: {
      id: result?.public_id,
      url: result?.secure_url,
    },
  });
  cookieToken(newUser, res);
});

exports.login = BigPromise(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Enter Email/Password" });

  const userFound = await User.findOne({ email }).select("+password");

  if (!userFound)
    return res.status(400).json({ error: "Invalid Email/Password" });

  const isValidpassword = await userFound.isValidpassword(password);

  if (!isValidpassword)
    return res.status(400).json({ error: "Invalid Email/Password" });

  cookieToken(userFound, res);
});
exports.forgotPassword = BigPromise(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Email not found" });
  const forgotToken = user.getForgotPasswordToken();
  await user.save({ validateBeforeSave: false });
  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/password/reset/${forgotToken}`;
  const msg = `Hit Enter \n\n ${url}`;
  try {
    await mailHelper({
      email: user.email,
      subject: "Dev-store password Reset email",
      message: msg,
    });
    res.json({
      sucess: true,
      msg: "email send sucessfuly",
    });
  } catch (err) {
    console.log(err);
    user.forgotPasswordExp = undefined;
    user.forgotPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.resetpassword = BigPromise(async (req, res) => {
  const token = req.params.token;
  const encryptToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    forgotPasswordToken: encryptToken,
    forgotPasswordExp: {
      $gt: Date.now(),
    },
  });
  if (!user) return res.status(400).json({ error: "Token is Expired/Invalid" });
  const { password, confPassword } = req.body;
  if (!password || !confPassword)
    return res.status(400).json({ error: "Please Enter Password" });
  if (password !== confPassword)
    return res
      .status(400)
      .json({ error: "Password/conform password is diffrent" });

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExp = undefined;
  await user.save();

  cookieToken(user, res);
});

exports.changePassword = BigPromise(async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id).select("+password");

  const { password, prevPassword } = req.body;
  if (!password || !prevPassword)
    return res.status(400).json({ error: "Please Enter All The Fields" });
  const isvalidPassword = await user.isValidpassword(prevPassword);

  if (!isvalidPassword)
    return res.status(400).json({ error: "Invalid Password" });
  user.password = password;
  await user.save();
  res.json({
    sucess: true,
    msg: "Password Updated",
  });
});
exports.updateDashboard = BigPromise(async (req, res) => {
  const { name, email } = req.body;
  const newData = {
    name,
    email,
  };

  if (req.files) {
    try {
      const user = await User.findById(req.user.id);
      const imageId = user.photo.id;
      if (imageId) {
        //dlt photo
        const resp = await cloudinary.v2.uploader.destroy(imageId);
      }

      result = await cloudinary.v2.uploader.upload(
        req.files.photo.tempFilePath,
        {
          folder: "users",
          width: 150,
          crop: "scale",
        }
      );
      console.log(result);
      newData.photo = {
        id: result.public_id,
        url: result.secure_url,
      };
    } catch (err) {
      console.log(err);
    }
  }
  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
  });

  res.json(user);
});

exports.logout = BigPromise((req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.json("logot Sucess");
});
