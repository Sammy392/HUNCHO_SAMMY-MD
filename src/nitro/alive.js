//alive.js

module.exports = async (context) => {
    const { client, m, prefix } = context;

const botname = process.env.BOTNAME || "HUNCHO-MD";

 await client.sendMessage(m.chat, { image: { url: 'https://files.catbox.moe/c1uyha' }, caption: `Hello ${m.pushName}, Huncho Md is active now.\n\nType ${prefix}menu to see my command list..\n\nSome important links concerning the bot are given below.\n\nOfficial website:\n https://huncho-md.site\n\nPairing site:\n https://hunchosession.onrender.com/pair.\n\nRandom APIs site:\nhttps://api.huncho.site\n\nThis free random APIs are meant for other developers and may not always work.\n\nXd );`, fileLength: "9999999999898989899999999" }, { quoted: m }); 

}
