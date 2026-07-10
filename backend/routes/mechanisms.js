const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const {
  findMechanism,
  findStage,
  findProject,
  insertRecord,
  updateRecord,
  removeRecord,
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

const DECISION_STATUS = { approve: 'AD', reject: 'RD' };
const DECISION_DEFAULT_TEXT = { approve: 'Mexanizm tasdiqlandi', reject: 'Mexanizm rad etildi' };

const HOKIMIYAT_ACTION_STATUS = { start: 'IP', block: 'BL' };
const HOKIMIYAT_ACTION_DEFAULT_TEXT = { start: 'Mexanizm boshlandi', block: 'Mexanizm bloklandi' };
const HOKIMIYAT_ACTION_MESSAGE_TYPE = { start: 'started', block: 'blocked' };

function isWithinRange(dateStr, startStr, endStr) {
  if (!dateStr) return true;
  if (startStr && dateStr < startStr) return false;
  if (endStr && dateStr > endStr) return false;
  return true;
}

router.get('/', auth, allowRoles(['hokimiyat', 'monitoring']), async (req, res, next) => {
  try {
    const mechanisms = req.app.locals.db.get('mechanisms').value();
    return res.json(mechanisms);
  } catch (error) {
    return next(error);
  }
});

router.post('/', auth, allowRoles(['hokimiyat']), async (req, res, next) => {
  try {
    const missing = requireFields(req.body, ['name', 'stageId']);

    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
    }

    const stage = await findStage(req, req.body.stageId);

    if (!stage) {
      return res.status(400).json({ message: 'Bosqich topilmadi' });
    }

    const beforeDate = req.body.beforeDate || '';
    const afterDate = req.body.afterDate || '';

    if (!isWithinRange(beforeDate, stage.startDate, stage.endDate) || !isWithinRange(afterDate, stage.startDate, stage.endDate)) {
      return res.status(400).json({
        message: `Mexanizm sanalari bosqich muddati (${stage.startDate} — ${stage.endDate}) orasida bo'lishi kerak`
      });
    }

    const now = new Date().toISOString();
    const mechanism = {
      name: req.body.name,
      beforeDate,
      afterDate,
      status: 'BM',
      reasons: [],
      stageId: req.body.stageId,
      createdAt: now,
      updatedAt: now
    };

    const createdMechanism = await insertRecord(req, 'mechanisms', mechanism);

    // Bosqichga mexanizm qo'shilsa va loyiha "bajarilmoqda" (IP) holatida bo'lsa,
    // monitoring ko'rib chiqishi uchun loyihani "ko'rib chiqilmoqda" (IR) holatiga o'tkazamiz
    const project = await findProject(req, stage.projectId);
    if (project && project.status === 'IP') {
      await updateRecord(req, 'projects', project.id, {
        status: 'IR',
        updatedAt: new Date().toISOString()
      });
    }

    return res.status(201).json(createdMechanism);
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id', auth, allowRoles(['hokimiyat']), async (req, res, next) => {
  try {
    const existingMechanism = await findMechanism(req, req.params.id);

    if (!existingMechanism) {
      return res.status(404).json({ message: 'Mechanism not found' });
    }

    const updates = {};
    ['name', 'beforeDate', 'afterDate', 'stageId'].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const stageId = updates.stageId !== undefined ? updates.stageId : existingMechanism.stageId;
    const stage = await findStage(req, stageId);

    const beforeDate = updates.beforeDate !== undefined ? updates.beforeDate : existingMechanism.beforeDate;
    const afterDate = updates.afterDate !== undefined ? updates.afterDate : existingMechanism.afterDate;

    if (stage && (!isWithinRange(beforeDate, stage.startDate, stage.endDate) || !isWithinRange(afterDate, stage.startDate, stage.endDate))) {
      return res.status(400).json({
        message: `Mexanizm sanalari bosqich muddati (${stage.startDate} — ${stage.endDate}) orasida bo'lishi kerak`
      });
    }

    const updatedMechanism = await updateRecord(req, 'mechanisms', req.params.id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return res.json(updatedMechanism);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', auth, allowRoles(['hokimiyat']), async (req, res, next) => {
  try {
    const existingMechanism = await findMechanism(req, req.params.id);

    if (!existingMechanism) {
      return res.status(404).json({ message: 'Mechanism not found' });
    }

    await removeRecord(req, 'mechanisms', req.params.id);
    return res.json({ message: 'Mechanism deleted' });
  } catch (error) {
    return next(error);
  }
});

// Mexanizm bo'yicha xabar (matn yoki fayl) qo'shish — faqat loyiha "Bajarilmoqda" (IP) holatida bo'lsa.
// Hokimiyat xabar yuborsa, mexanizm monitoring ko'rib chiqishi uchun "IR" holatiga o'tadi.
router.post('/:id/reasons', auth, allowRoles(['hokimiyat', 'monitoring']), upload.single('file'), async (req, res, next) => {
  try {
    const mechanism = await findMechanism(req, req.params.id);

    if (!mechanism) {
      return res.status(404).json({ message: 'Mechanism not found' });
    }

    const stage = mechanism.stageId ? await findStage(req, mechanism.stageId) : null;
    const project = stage ? await findProject(req, stage.projectId) : null;

    if (!project || project.status !== 'IP') {
      return res.status(400).json({ message: 'Xabar yuborish uchun loyiha "Bajarilmoqda" holatida bo\'lishi kerak' });
    }

    const text = (req.body.text || '').trim();

    if (!text && !req.file) {
      return res.status(400).json({ message: 'Matn yozing yoki fayl biriktiring' });
    }

    const message = {
      id: Date.now(),
      type: req.file ? 'file' : 'text',
      text,
      filePath: req.file ? `/uploads/${req.file.filename}` : '',
      fileName: req.file ? req.file.originalname : '',
      createdBy: req.user.role,
      createdAt: new Date().toISOString()
    };

    const updates = {
      reasons: [...(mechanism.reasons || []), message],
      updatedAt: new Date().toISOString()
    };

    if (req.user.role === 'hokimiyat' && mechanism.status !== 'AD') {
      updates.status = 'IR';
    }

    const updatedMechanism = await updateRecord(req, 'mechanisms', req.params.id, updates);

    return res.status(201).json(updatedMechanism);
  } catch (error) {
    return next(error);
  }
});

// Monitoring mexanizmni tasdiqlaydi (AD) yoki rad etadi (RD) — qaror chatga xabar sifatida qo'shiladi
router.post('/:id/decision', auth, allowRoles(['monitoring']), upload.single('file'), async (req, res, next) => {
  try {
    const mechanism = await findMechanism(req, req.params.id);

    if (!mechanism) {
      return res.status(404).json({ message: 'Mechanism not found' });
    }

    const decision = req.body.decision;

    if (!DECISION_STATUS[decision]) {
      return res.status(400).json({ message: 'decision "approve" yoki "reject" bo\'lishi kerak' });
    }

    const text = (req.body.text || '').trim() || DECISION_DEFAULT_TEXT[decision];

    const message = {
      id: Date.now(),
      type: decision === 'approve' ? 'approved' : 'rejected',
      text,
      filePath: req.file ? `/uploads/${req.file.filename}` : '',
      fileName: req.file ? req.file.originalname : '',
      createdBy: 'monitoring',
      createdAt: new Date().toISOString()
    };

    const updatedMechanism = await updateRecord(req, 'mechanisms', req.params.id, {
      reasons: [...(mechanism.reasons || []), message],
      status: DECISION_STATUS[decision],
      updatedAt: new Date().toISOString()
    });

    return res.json(updatedMechanism);
  } catch (error) {
    return next(error);
  }
});

// Hokimiyat mexanizmni boshlaydi (BM -> IP) yoki bloklaydi (-> BL) — amal chatga xabar sifatida qo'shiladi
router.post('/:id/action', auth, allowRoles(['hokimiyat']), upload.single('file'), async (req, res, next) => {
  try {
    const mechanism = await findMechanism(req, req.params.id);

    if (!mechanism) {
      return res.status(404).json({ message: 'Mechanism not found' });
    }

    const action = req.body.action;

    if (!HOKIMIYAT_ACTION_STATUS[action]) {
      return res.status(400).json({ message: 'action "start" yoki "block" bo\'lishi kerak' });
    }

    const text = (req.body.text || '').trim() || HOKIMIYAT_ACTION_DEFAULT_TEXT[action];

    const message = {
      id: Date.now(),
      type: HOKIMIYAT_ACTION_MESSAGE_TYPE[action],
      text,
      filePath: req.file ? `/uploads/${req.file.filename}` : '',
      fileName: req.file ? req.file.originalname : '',
      createdBy: 'hokimiyat',
      createdAt: new Date().toISOString()
    };

    const updatedMechanism = await updateRecord(req, 'mechanisms', req.params.id, {
      reasons: [...(mechanism.reasons || []), message],
      status: HOKIMIYAT_ACTION_STATUS[action],
      updatedAt: new Date().toISOString()
    });

    return res.json(updatedMechanism);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
