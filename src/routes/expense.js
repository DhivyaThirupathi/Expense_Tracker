const express = require("express");
const router = express.Router();
const ctrl = require("../controller/expense");

router.post("/", ctrl.add);
router.get("/", ctrl.getAll);
router.get("/total", ctrl.total);
router.get("/:id", ctrl.getOne);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;