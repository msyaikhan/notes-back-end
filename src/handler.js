const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (req, h) => {
  const { title, tags, body } = req.payload;

  const id = nanoid(16);
  const createAt = new Date().toISOString();
  const updateAt = createAt;

  const newNote = { title, tags, body, id, createAt, updateAt };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const res = h.response({
      status: "success",
      message: "Catatan Berhasil Ditambahkan",
      data: { noteId: id },
    });
    res.code(201);
    return res;
  }

  return handleErrorRequest("Catatan Gagal Ditambahkan");
};

const getAllNotesHandler = () => ({ status: "success", data: { notes } });

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const note = notes.filter((note) => note.id === id)[0];

  if (note != undefined) {
    return {
      status: "success",
      data: {
        note,
      },
    };
  }

  return handleErrorRequest("Catatan tidak ditemukan");
};

const editNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const { title, tags, body } = req.payload;
  const updateAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index != -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updateAt,
    };

    const res = h.response({
      status: "success",
      message: "Catatan Berhasil Diperbaharui",
    });
    res.code(200);
    return res;
  }

  return handleErrorRequest("Gagal memperbarui catatan. Id tidak ditemukan");
};

const deleteNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index != -1) {
    notes.splice(index, 1);
    const res = h.response({
      status: "success",
      message: "Catatan Berhasil Dihapus",
    });
    res.code(200);
    return res;
  }

  return handleErrorRequest("Gagal menghapus catatan. Id tidak ditemukan");
};

const handleErrorRequest = (message, status = "fail", code = 404, h) => {
  const res = h.response({
    status: status,
    message: message,
  });
  res.code(code);
  return res;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
