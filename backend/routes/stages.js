const express = require('express');
const { auth } = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const {
  findStage,
  insertRecord,
  updateRecord,
  removeRecord,
  requireFields
} = require('../utils/db');

const router = express.Router();

router.get('/', auth, allowRoles(['hokimiyat', 'monitoring']), async (req, res, next) => {
  try {
    const stages = req.app.locals.db.get('stages').value();
    return res.json(stages);
  } catch (error) {
    return next(error);
  }
});

router.post('/', auth, allowRoles(['hokimiyat']), async (req, res, next) => {
  try {
    const missing = requireFields(req.body, ['name', 'projectId']);

    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
    }

    const now = new Date().toISOString();
    const stage = {
      name: req.body.name,
      startDate: req.body.startDate || '',
      endDate: req.body.endDate || '',
      projectId: req.body.projectId,
      createdAt: now,
      updatedAt: now
    };

    const createdStage = await insertRecord(req, 'stages', stage);
    return res.status(201).json(createdStage);
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id', auth, allowRoles(['hokimiyat']), async (req, res, next) => {
  try {
    const existingStage = await findStage(req, req.params.id);

    if (!existingStage) {
      return res.status(404).json({ message: 'Stage not found' });
    }

    const updates = {};
    ['name', 'startDate', 'endDate', 'projectId'].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedStage = await updateRecord(req, 'stages', req.params.id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return res.json(updatedStage);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', auth, allowRoles(['hokimiyat']), async (req, res, next) => {
  try {
    const existingStage = await findStage(req, req.params.id);

    if (!existingStage) {
      return res.status(404).json({ message: 'Stage not found' });
    }

    await removeRecord(req, 'stages', req.params.id);
    return res.json({ message: 'Stage deleted' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
