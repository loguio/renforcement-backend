const { User, dbInstance } = require("../models");
const { Op } = require("sequelize");

const getAllUsers = async (req, res) => {
  let queryParam = {};
  if (req.query?.search) {
    queryParam = {
      where: {
        email: {
          [Op.like]: `%${req.query.search}%`,
        },
      },
    };
  }
  const users = await User.findAll(queryParam);
  res.status(200).json(users);
};

const getUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(200).json(user);
};

const createUser = async (req, res) => {
  const transaction = await dbInstance.transaction();
  try {
    const { email, password_hash, refresh_token, two_step_code, role, is_active, phone } = req.body;
    const user = await User.create(
      { email, password_hash, refresh_token, two_step_code, role, is_active, phone },
      { transaction },
    );
    await transaction.commit();
    return res.status(201).json(user);
  } catch (err) {
    await transaction.rollback();
    return res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  const transaction = await dbInstance.transaction();
  try {
    const { email, password_hash, refresh_token, two_step_code, role, is_active, phone } = req.body;
    const id = req.params.id;
    const [updated] = await User.update(
      { email, password_hash, refresh_token, two_step_code, role, is_active, phone },
      { where: { id }, transaction }
    );
    await transaction.commit();
    
    if (!updated) return res.status(404).json({ error: "User not found" });
    const user = await User.findByPk(id);
    return res.status(200).json(user);
  } catch (err) {
    await transaction.rollback();
    return res.status(400).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  const transaction = await dbInstance.transaction();
  try {
    const id = req.params.id;
    const deleted = await User.destroy({ where: { id }, transaction });
    await transaction.commit();

    if (!deleted) return res.status(404).json({ error: "User not found" });
    return res.status(204).send();
  } catch (err) {
    await transaction.rollback();
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };
