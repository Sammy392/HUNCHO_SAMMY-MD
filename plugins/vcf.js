const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "vcf",
    desc: "Generate VCF contact file for all group members",
    category: "tools",
    filename: __filename,
    groupOnly: true,
    usage: `${config.PREFIX}vcf`
}, async (cmd, mek, m, { reply }) => {
    try {
        // Get group metadata
        const groupMetadata = await cmd.groupMetadata(m.chat);
        const participants = groupMetadata.participants || [];
        
        // Validate group size
        if (participants.length < 2) {
            return reply("❌ Group must have at least 2 members");
        }
        if (participants.length > 1000) {
            return reply("❌ Group is too large (max 1000 members)");
        }

        // Generate VCF content
        let vcfContent = '';
        participants.forEach(participant => {
            const phoneNumber = participant.id.split('@')[0];
            const displayName = participant.notify || `User_${phoneNumber}`;
            
            vcfContent += `BEGIN:VCARD\n` +
                          `VERSION:3.0\n` +
                          `FN:${displayName}\n` +
                          `TEL;TYPE=CELL:+${phoneNumber}\n` +
                          `NOTE:From ${groupMetadata.subject}\n` +
                          `END:VCARD\n\n`;
        });

        // Create temp file
        const sanitizedGroupName = groupMetadata.subject.replace(/[^\w]/g, '_');
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        
        const vcfPath = path.join(tempDir, `${sanitizedGroupName}_${Date.now()}.vcf`);
        fs.writeFileSync(vcfPath, vcfContent);

        // Send VCF file
        await cmd.sendMessage(m.chat, {
            document: { url: vcfPath },
            mimetype: 'text/vcard',
            fileName: `${sanitizedGroupName}_contacts.vcf`,
            caption: `📇 *Group Contacts*\n\n` +
                     `• Group: ${groupMetadata.subject}\n` +
                     `• Members: ${participants.length}\n` +
                     `• Generated: ${new Date().toLocaleString()}`
        }, { quoted: m });

        // Cleanup
        fs.unlinkSync(vcfPath);

    } catch (error) {
        console.error('VCF Error:', error);
        reply("❌ Failed to generate VCF file");
    }
});
