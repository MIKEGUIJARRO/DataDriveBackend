const { google } = require('googleapis');
const textSearchAlgo = require('./textSearchAlgo');

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

const getUserProfilePic = async (refreshToken, googleId) => {
    // This method return the public photo url of our users
    // API documentation:
    // https://developers.google.com/people/api/rest/v1/people/get

    const oauth2Client = setupOAuth(refreshToken);
    const people = google.people({ version: 'v1', auth: oauth2Client });

    const userInfo = await people.people.get({ personFields: 'photos', resourceName: `people/${googleId}`, key: process.env.GOOGLE_API_KEY })

    return userInfo.data.photos[0].url;
}

const getFilePlaceHolders = async (refreshToken, fileId) => {
    // This method validates if the doc contains the {{}} that 
    // will be used to replace the content
    try {
        const oauth2Client = setupOAuth(refreshToken);
        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        const docResponse = await drive.files.export({
            fileId: fileId,
            key: process.env.GOOGLE_API_KEY,
            mimeType: 'text/plain',
        });
        const docString = docResponse.data;
        const result = textSearchAlgo(docString);
        return result;
    } catch (e) {
        console.log(e);
    }
}

const getFileData = async (refreshToken, fileId) => {
    const oauth2Client = setupOAuth(refreshToken);
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const file = await drive.files.get({
        fileId: fileId,
        key: process.env.GOOGLE_API_KEY,
        fields: 'kind,id,name,mimeType,thumbnailLink',

    });
    console.log(file.data.thumbnailLink);

    file.data.thumbnailLink = file.data.thumbnailLink.replace('sz=s220', 'sz=s1600');
    return file.data;
}

const getBufferPDF = async (refreshToken, fileId) => {
    const oauth2Client = setupOAuth(refreshToken);
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const res = await drive.files.export({
        fileId: fileId,
        mimeType: 'application/pdf',
        key: process.env.GOOGLE_API_KEY,
    }, {
        responseType: 'arraybuffer'
    })
    return Buffer.from(res.data).toString('base64');
}

const copyFile = async (refreshToken, fileId) => {
    try {
        const oauth2Client = setupOAuth(refreshToken);
        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        const res = await drive.files.copy({
            fileId: fileId,
            key: process.env.GOOGLE_API_KEY,
        });

        console.log(res);
        return res.data;
    } catch (e) {
        console.log(e);
    }

}

const deleteFile = async (refreshToken, fileId) => {
    try {
        const oauth2Client = setupOAuth(refreshToken);
        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        const res = await drive.files.delete({
            fileId: fileId,
            key: process.env.GOOGLE_API_KEY
        })
        console.log(res)
        return res.data;
    } catch (e) {
        console.log(e)
    }
}

const replaceTextFile = async (refreshToken, fileId, keywords) => {
    // https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate
    // https://stackoverflow.com/questions/67756059/how-to-update-specific-text-in-google-drive-docs-with-node-js-name
    try {
        const oauth2Client = setupOAuth(refreshToken);
        const docs = google.docs({ version: 'v1', auth: oauth2Client });

        const requests = [];
        for (const key in keywords) {
            requests.push({
                replaceAllText: {
                    containsText: {
                        text: `{{${key}}}`,
                        matchCase: true,
                    },
                    replaceText: keywords[key],
                },
            })
        }

        const res = await docs.documents.batchUpdate({
            documentId: fileId,

            // Request body metadata
            requestBody: {
                // request body parameters
                'requests': requests,
                'writeControl': {}
            },

        });

        console.log(res)
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    getFolderData,
    getFilePlaceHolders,
    getUserProfilePic,
    getFileData,
    getBufferPDF,
    copyFile,
    deleteFile,
    replaceTextFile
};