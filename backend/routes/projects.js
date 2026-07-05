const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const {
  findProject,
  insertRecord,
  updateRecord,
  deleteUploadedFile,
  filePathFromUpload,
  requireFields
} = require('../utils/db');

const router = express.Router();
const uploadsPath = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`);
  }
});

const upload = multer({ storage });
const projectFiles = upload.fields([
  { name: 'businessPlan', maxCount: 1 },
  { name: 'passportFile', maxCount: 1 }
]);

const editableFields = [
  'name',
  'type',
  'year',
  'investmentType',
  'organization',
  'country',
  'guarantorBank',
  'insuranceCompany',
  'status',
  'npv',
  'dpp',
  'bcr',
  'eirr'
];

function getUploadedFile(req, field) {
  return req.files && req.files[field] && req.files[field][0];
}

function parseIdArray(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(Number).filter((n) => !Number.isNaN(n)) : [];
  } catch (error) {
    return [];
  }
}

async function cleanupUploadedRequestFiles(req) {
  const files = Object.values(req.files || {}).flat();
  await Promise.all(files.map((file) => deleteUploadedFile(`/uploads/${file.filename}`)));
}

router.get('/', auth, allowRoles(['hokimiyat', 'monitoring']), async (req, res, next) => {
  try {
    const projects = req.app.locals.db.get('projects').value();
    return res.json(projects);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', auth, allowRoles(['hokimiyat', 'monitoring']), async (req, res, next) => {
  try {
    const project = await findProject(req, req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json(project);
  } catch (error) {
    return next(error);
  }
});

router.post('/', auth, allowRoles(['hokimiyat']), projectFiles, async (req, res, next) => {
  try {
    const businessPlanFile = getUploadedFile(req, 'businessPlan');
    const passportFile = getUploadedFile(req, 'passportFile');
    const missing = requireFields(
      {
        ...req.body,
        businessPlan: businessPlanFile,
        passportFile
      },
      [
        'name',
        'type',
        'year',
        'investmentType',
        'organization',
        'country',
        'businessPlan',
        'passportFile'
      ]
    );

    if (missing.length > 0) {
      await cleanupUploadedRequestFiles(req);
      return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
    }

    const now = new Date().toISOString();
    const project = {
      name: req.body.name,
      type: req.body.type,
      year: req.body.year,
      investmentType: req.body.investmentType,
      organization: req.body.organization,
      country: req.body.country,
      guarantorBank: req.body.guarantorBank || '',
      insuranceCompany: req.body.insuranceCompany || '',
      businessPlan: filePathFromUpload(businessPlanFile),
      passportFile: filePathFromUpload(passportFile),
      regions: parseIdArray(req.body.regions),
      districts: parseIdArray(req.body.districts),
      status: 'DR',
      npv: null,
      dpp: null,
      bcr: null,
      eirr: null,
      createdAt: now,
      updatedAt: now
    };

    const createdProject = await insertRecord(req, 'projects', project);
    return res.status(201).json(createdProject);
  } catch (error) {
    await cleanupUploadedRequestFiles(req);
    return next(error);
  }
});

router.patch('/:id', auth, allowRoles(['hokimiyat']), projectFiles, async (req, res, next) => {
  try {
    const existingProject = await findProject(req, req.params.id);

    if (!existingProject) {
      await cleanupUploadedRequestFiles(req);
      return res.status(404).json({ message: 'Project not found' });
    }

    const businessPlanFile = getUploadedFile(req, 'businessPlan');
    const passportFile = getUploadedFile(req, 'passportFile');
    const updates = {};

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.body.regions !== undefined) {
      updates.regions = parseIdArray(req.body.regions);
    }

    if (req.body.districts !== undefined) {
      updates.districts = parseIdArray(req.body.districts);
    }

    if (businessPlanFile) {
      updates.businessPlan = filePathFromUpload(businessPlanFile);
    }

    if (passportFile) {
      updates.passportFile = filePathFromUpload(passportFile);
    }

    const updatedProject = await updateRecord(req, 'projects', req.params.id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    if (businessPlanFile) {
      await deleteUploadedFile(existingProject.businessPlan);
    }

    if (passportFile) {
      await deleteUploadedFile(existingProject.passportFile);
    }

    return res.json(updatedProject);
  } catch (error) {
    await cleanupUploadedRequestFiles(req);
    return next(error);
  }
});

module.exports = router;
