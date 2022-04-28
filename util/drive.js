const { google } = require('googleapis');
const { drive } = require('googleapis/build/src/apis/drive');
const fileSystem = require("fs");

const setupOAuth = (refreshToken) => {
    const oauth2Client = new google.auth.OAuth2({
        clientId: process.env.CLIENT_ID_GOOGLE,
        clientSecret: process.env.CLIENT_SECRET_GOOGLE,
        redirectUri: process.env.CALLBACK_URL_GOOGLE,
    });

    oauth2Client.setCredentials({ refresh_token: refreshToken });

    return oauth2Client;
}

const getFolderData = async (refreshToken, folderId) => {
    const oauth2Client = setupOAuth(refreshToken);
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Mime types
    // https://developers.google.com/drive/api/guides/mime-types
    const fileList = await drive.files.list({
        q: `(mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/vnd.google-apps.folder') and '${folderId}' in parents and trashed = false`,
        key: process.env.GOOGLE_API_KEY,
    });

    const files = fileList.data.files;

    return files;
};

const getFilePlaceHolders = async (refreshToken, fileId, googleId) => {
    try {
        const oauth2Client = setupOAuth(refreshToken);
        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        const docString = await drive.files.export({
            fileId: fileId,
            mimeType: 'text/plain',
            key: process.env.GOOGLE_API_KEY,
        })
        return docString;
    } catch (e) {
        console.log(e);
    }
}

const getUserProfilePic = async (refreshToken, googleId) => {
    // This method return the public photo url of our users
    // API documentation:
    // https://developers.google.com/people/api/rest/v1/people/get

    const oauth2Client = setupOAuth(refreshToken);
    console.log(process.env.GOOGLE_API_KEY);
    const people = google.people({ version: 'v1', auth: oauth2Client });

    const userInfo = await people.people.get({ personFields: 'photos', resourceName: `people/${googleId}`, key: process.env.GOOGLE_API_KEY })

    return userInfo.data.photos[0].url;
}



module.exports = { getFolderData, getFilePlaceHolders, getUserProfilePic };