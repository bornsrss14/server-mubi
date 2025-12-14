/*A lo que llaman la lógica de negocio

Se encarga de aplicar todas las reglas de negocio y validaciones,
 pero no le interesa como recuperar los datos, guardarlos o borrarlos,
  ya que para eso tiene una capa de persistencia
  1.- Aquí no hay reglas ni queries, solo coordinación y respuesta HTTP.*/

import User from "../models/userModel.js";
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong fetching data (╯°□°）╯ ",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "This user does't exist ~404~",
      });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
};

// Agregar un nuevo usuario; create new user
export const addNewUser = async (req, res) => {
  try {
    const {
      username,
      given_name,
      family_name,
      email,
      password_hash,
      profile_pic_url,
      bio,
      website,
      pronoun,
      location,
    } = req.body;
    //validación de campos NOT NULL
    if (!username || !given_name || !family_name || !email || !password_hash) {
      return res
        .status(400)
        .json({ success: false, message: "Estos campos son requeridos" });
    }

    //validación de e mail para evitar duplicidad
    const existingUser = await User.findByEmail(email);
    const existingUsername = await User.findByUsername(username);
    if (existingUser || existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: "(・・ )? two of me!?" });
    }
    const userId = await User.addUser(req.body);
    const newUser = await User.getUserById(userId);

    res.status(201).json({
      success: true,
      message: "User added successfully (＾▽＾)",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el usuario",
      error: error.message,
    });
  }
};

//Actualizar un usuario existente
export const updateUser = async (req, res) => {
  try {
    console.log("1. Petición recibida para actualizar usuario");
    console.log("2. Params ID:", req.params.id);
    console.log("3. Body recibido:", req.body);
    const { id } = req.params;
    const {
      username,
      given_name,
      family_name,
      email,
      password_hash,
      profile_pic_url,
      bio,
      website,
      pronoun,
      location,
    } = req.body;

    //Voy a validar si el usuario que hace la petición existe
    const existingUser = await User.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User Not found (ツ)",
      });
    }
    //verifico que este email no exista en otro usuario
    /*if the current user is trying to update their email, and the new email is different from the one they had prior 
    to the update request, check if this new email already belongs to another user */
    if (email && email !== existingUser.email) {
      const emailExists = await User.findByEmail(email);
      if (emailExists && emailExists.id != id) {
        return res.status(400).json({
          success: false,
          message: "This is email owns another user",
        });
      }
    }
    /*If the username is already taken by another person (not the same person i'm updating),
     the validation returns an state error 400. */
    if (username && username !== existingUser.username) {
      const emailExists = await User.findByUsername(username);
      if (emailExists && emailExists.id != id) {
        return res.status(400).json({
          success: false,
          message: "This is username already belongs another user",
        });
      }
    }
    await User.updateUser(id, req.body);
    const updatedUser = await User.getUserById(id);

    res.json({
      success: true,
      message: "updated succesfully ( •_•)ノ🎉 ",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = User.getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found ❌",
      });
    }
    await User.deleteUser(id);
    res.json({
      success: true,
      message: "Usuario eliminado para siempre, siempre, siempre, siempre.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong, try with another user",
      error: error.message,
    });
  }
};
