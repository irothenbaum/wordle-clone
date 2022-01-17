const TwigRender = require('../helpers/TwigRender')

class StaticPagesController {
  static async getApp(req, res, next) {
    res.send(await TwigRender('default'))
  }
}

module.exports = StaticPagesController
