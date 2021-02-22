
import Language from '../models/language.js'

const languageController = {
  async getAllLanguages(req, res, next) {
    try {
      const languages = await Language.find()
      res.status(200).send(languages)
    } catch (err) {
      next(err)
    }
  }
}

export default languageController