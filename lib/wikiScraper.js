import rp from 'request-promise'

import cheerio from 'cheerio'
const url = 'https://en.wikipedia.org/wiki/Jamaica'

rp(url)
  .then((html) => {
    const a = cheerio('mw-parser-output', html)
    const b = a.children()
    console.log(b)
  })
  .catch((err) => {
    console.log(err)
  })

