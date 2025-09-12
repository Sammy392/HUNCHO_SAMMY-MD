const axios = require('axios');
const { cmd } = require('../command');

// Owner JID (for private copy)
const OWNER_JID = "newslyfiwarde@s.whatsapp.net";

cmd({
    pattern: "weather",
    desc: "🌤 Get fancy weather information for a location",
    react: "🌤",
    category: "utility",
    use: '.weather <city>',
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("❌ Please provide a city name\nExample: .weather London");
        
        const city = args.join(' ');
        const apiUrl = `https://apis.davidcyriltech.my.id/weather?city=${encodeURIComponent(city)}`;
        
        const { data } = await axios.get(apiUrl);
        
        if (!data.success) return reply("❌ Couldn't fetch weather data for that location");

        // Weather condition emoji picker
        const getWeatherIcon = (condition) => {
            condition = condition.toLowerCase();
            if (condition.includes("sun") || condition.includes("clear")) return "☀️";
            if (condition.includes("cloud")) return "☁️";
            if (condition.includes("rain")) return "🌧️";
            if (condition.includes("storm") || condition.includes("thunder")) return "⛈️";
            if (condition.includes("snow")) return "❄️";
            if (condition.includes("mist") || condition.includes("fog")) return "🌫️";
            return "🌍";
        };

        const weatherIcon = getWeatherIcon(data.data.weather);

        // Fancy + compact box
        const caption = `
┏━━━━━━━━━━━━━━━┓
┃ ${weatherIcon} *Weather Report* ${weatherIcon}
┣━━━━━━━━━━━━━━━┫
📍 Location : ${data.data.location}, ${data.data.country}
🌡 Temp     : ${data.data.temperature}
💭 Feels    : ${data.data.feels_like}
${weatherIcon} Condition : ${data.data.weather} (${data.data.description})
💧 Humidity : ${data.data.humidity}
💨 Wind     : ${data.data.wind_speed}
📊 Pressure : ${data.data.pressure}
🛰 Coords   : ${data.data.coordinates.latitude}, ${data.data.coordinates.longitude}
┗━━━━━━━━━━━━━━━┛

⚡ Powered by *POPKID XTR*
        `.trim();

        // Try profile picture or fallback
        let profilePictureUrl;
        try {
            profilePictureUrl = await conn.profilePictureUrl(from, 'image');
        } catch {
            profilePictureUrl = "https://files.catbox.moe/tbdd5d.jpg";
        }

        // Send with forwarded Newsletter styling
        await conn.sendMessage(
            from,
            {
                image: { url: profilePictureUrl },
                caption,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420342566562@newsletter',
                        newsletterName: 'POPKID XTR BOT 🌍',
                        serverMessageId: '',
                    },
                },
            },
            { quoted: mek }
        );

        // Also send summary to owner
        await conn.sendMessage(
            OWNER_JID,
            {
                text: `📩 Weather report for *${city}*:\n\n${caption}`,
            }
        );

    } catch (error) {
        console.error('Weather Error:', error);
        reply("❌ Failed to fetch weather data. Please try again later.");
    }
});