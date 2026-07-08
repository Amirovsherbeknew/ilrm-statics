const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');
const uploadsPath = path.join(__dirname, '..', 'uploads');

async function readDb() {
  const content = await fs.promises.readFile(dbPath, 'utf8');
  return JSON.parse(content);
}

async function writeDb(data) {
  await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2));
}

function collection(req, name) {
  return req.app.locals.db.get(name);
}

async function findProject(req, id) {
  return collection(req, 'projects').getById(id).value();
}

async function findStage(req, id) {
  return collection(req, 'stages').getById(id).value();
}

async function findProjectIdInStages(req, projectId) {
  return collection(req, 'stages').filter(stage => stage.projectId === Number(projectId)).value();
}

async function insertRecord(req, name, data) {
  return collection(req, name).insert(data).write();
}

async function updateRecord(req, name, id, data) {
  return collection(req, name).updateById(id, data).write();
}

async function removeRecord(req, name, id) {
  return collection(req, name).removeById(id).write();
}

async function deleteUploadedFile(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return;
  }

  const fullPath = path.join(uploadsPath, path.basename(filePath));

  try {
    await fs.promises.unlink(fullPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

function filePathFromUpload(file) {
  return file ? `/uploads/${file.filename}` : undefined;
}

function requireFields(source, fields) {
  return fields.filter((field) => {
    const value = source[field];
    return value === undefined || value === null || String(value).trim() === '';
  });
}

module.exports = {
  readDb,
  writeDb,
  findProject,
  findProjectIdInStages,
  findStage,
  insertRecord,
  updateRecord,
  removeRecord,
  deleteUploadedFile,
  filePathFromUpload,
  requireFields
};
