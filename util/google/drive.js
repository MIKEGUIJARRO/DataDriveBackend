const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

const drive = google.drive({version: 'v3', auth: OAuth2Client});

const copyGoogleDrive = async (newName, sourceId, targetFolderId) => {
    // https://developers.google.com/drive/api/v3/reference/files/copy
    if (!newName || !sourceId || !targetFolderId) return;

    const params = {
        title: newName,

    };

    drive.files.copy({
        
    }, {});
};

const listGoogleDrive = async () => {
    drive.files.list()
}


modules.exports = { copyGoogleDrive };