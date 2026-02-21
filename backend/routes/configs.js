const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/configController');

router.get('/',      ctrl.listConfigs);
router.get('/:id',   ctrl.getConfig);
router.post('/',     ctrl.createConfig);
router.put('/:id',   ctrl.updateConfig);

module.exports = router;
