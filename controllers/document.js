const axios = require('axios').default;
const { google } = require('googleapis');

const docs = google.docs('v1');
const drive = google.drive('v3');

module.exports.sendDocument = async (req, res, next) => {
    try {
        const documentId = '';
        // Copy template to another instance on google drive
        drive.files.copy({
            fileId: documentId,
            requestBody
        });
        
        docs.documents.batchUpdate()

        //Modify template copy and rename, download to pdf, send to students.
            // Send as an email
            // Send as a pdf
        // Remove trash files?
    } catch (e) {
        next(e);
    }
}