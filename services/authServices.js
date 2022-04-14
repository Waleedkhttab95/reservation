const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signin = async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  const { employeeNumber, password } = req.body;

  let user = await User.findOne({
    where: {
      employeeNumber: employeeNumber,
      password: password,
    },
  });
  if (!user) return res.status(400).send("invalid Number or password !");

  const token = generateAuthToken(user);

  res.status(200).json({
    token: token,
  });
};

function generateAuthToken(user) {
  const token = jwt.sign({ id: user.id, role: user.roles }, process.env.jwtKey);

  return token;
}

exports.signup = async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  const { employeeNumber, password, employeeName, roles } = req.body;

  let user = await User.findOne({
    where: {
      employeeNumber: employeeNumber,
    },
  });

  if (user) return res.status(400).send("this user is already exist !");

  if (employeeNumber.toString().length != 4) {
    return res
      .status(400)
      .send("the employee number should be 4 digits only  !");
  }

  if (!/^(?=.*[0-9])(?=.{6,})/.test(password)) {
    return res
      .status(400)
      .send("the password should be 6 characters at least  !");
  }

  user = new User({
    employeeNumber,
    employeeName,
    password, // should encrypt password,
    roles,
  });

  await user.save();

  const token = generateAuthToken(user);

  res.status(201).json({
    token: token,
  });
};
