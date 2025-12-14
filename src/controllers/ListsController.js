import List, { createListWithEntries } from "../models/listModel.js";

export const getUserLists = async (req, res) => {
  try {
    const { id_user } = req.params;
    if (!Number(id_user)) {
      return res
        .status(400)
        .json({ success: falssíe, message: "Invalid user id" });
    }
    const allLists = await List.getAllLists(id_user);
    res.json({ success: true, data: allLists });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetching all list failed (╯°□°）╯ ",
      error: error.message,
    });
  }
};

export const getAllUserListsWithEntries = async (req, res) => {
  try {
    const { id_user } = req.params;
    //obtengo solo las listas
    console.log("cargo el id,", id_user);

    const lists = await List.getAllLists(id_user);
    if (lists.length === 0) {
      return res.json({ success: true, data: [] });
    }

    //obtengo los entries por estas listas
    const listIds = lists.map((l) => l.id);
    const entries = await List.getEntries(listIds);

    //Agrupar entries dentro de sus listas
    const entriesByList = {};
    for (const entry of entries) {
      if (!entriesByList[entry.id_item_list]) {
        entriesByList[entry.id_item_list] = [];
      }
      entriesByList[entry.id_item_list].push({
        id: entry.id,
        id_mubi_tmdb: entry.id_mubi_tmdb,
        note: entry.note,
        rating: entry.rating,
        position: entry.position,
      });
    }

    // Unir listas con sus entries
    const result = lists.map((list) => ({
      ...list,
      entries: entriesByList[list.id] || [],
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetching lists with entries failed",
      error: error.message,
    });
  }
};

export const getListById = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.getListById(id);
    return res.status(201).json({
      success: true,
      message: "esto es la lista",
      data: list,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error while fetching list",
      error: error.message,
    });
  }
};
export const addList = async (req, res) => {
  const {
    id_user,
    title,
    brief_description = null,
    is_public = 1,
    entries = [],
  } = req.body;
  if (!id_user || !title || !Array.isArray(entries)) {
    return res.status(400).json({
      success: false,
      message: "Incomplete data for creating list",
    });
  }
  try {
    const newList = await createListWithEntries({
      id_user,
      title,
      brief_description,
      is_public,
      entries,
    });

    return res.status(201).json({
      success: true,
      message: "List created successfully :)",
      data: newList,
    });
  } catch (error) {
    console.error("Error creating list:", error);

    return res.status(500).json({
      success: false,
      message: "error while creting list",
      error: error.message,
    });
  }
};
export const updateListById = (req, res) => {
  const { id } = req.params;
};
export const deleteListById = async (req, res) => {
  try {
    const { id_list } = req.params;
    const list = await List.getListById(id_list);
    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List doesn't exist ❌",
      });
    }

    await List.deleteList(id_list);
    res.json({
      success: true,
      message: "The list was deleted succesfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "we couldn't delete the list, try again later! please",
      error: error.message,
    });
  }
};
