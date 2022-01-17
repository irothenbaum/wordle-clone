const express = require('express')
const asyncHandler = require('express-async-handler')
const router = express.Router()
const StaticPagesController = require('./controllers/StaticPagesController')
const GameController = require('./controllers/GameController')

router.get('/', asyncHandler(StaticPagesController.getApp))

router.ws('/game/create', asyncHandler(GameController.socketCreateGame))
router.ws('/game/:gameId/join', asyncHandler(GameController.socketJoinGame))

module.exports = router
