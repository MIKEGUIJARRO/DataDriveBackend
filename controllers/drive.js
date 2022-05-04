const authCheck = require('../middlewares/auth');
const User = require('../models/User');
const { google } = require('googleapis');
const ErrorResponse = require('../util/errorResponse');

const { getFolderData, getFilePlaceHolders, getFileData, getFilePDF } = require('../util/drive');

module.exports.getFiles = async (req, res, next) => {
    try {
        const queryParam = { ...req.query };
        const { folderId } = queryParam;

        if (!folderId) {
            return next(new ErrorResponse('folderId required for query', 400));
        }
        const currentUser = await User.find({ googleId: req.user.googleId });

        const refreshToken = currentUser[0].googleRefreshToken;

        const folderData = await getFolderData(refreshToken, folderId);

        res.status(200).json({
            success: true,
            count: folderData.length,
            data: folderData,
        });

    } catch (e) {
        console.log(e);
    }
};

module.exports.getKeywordTemplates = async (req, res, next) => {
    try {
        const { id: fileId } = req.params;

        if (!fileId) {
            return next(new ErrorResponse('fileId required for query', 400));
        }

        const currentUser = await User.find({ googleId: req.user.googleId });

        const refreshToken = currentUser[0].googleRefreshToken;

        const { keywords, isDuplicate } = await getFilePlaceHolders(refreshToken, fileId, req.user.googleId);
        const fileData = await getFileData(refreshToken, fileId)
        if (isDuplicate) {
            return next(new ErrorResponse('Duplicate Template Word', 400))
        }

        res.status(200).json({
            success: true,
            count: keywords.length,
            data: {
                keywords,
                ...fileData
            }
        });

    } catch (e) {
        console.log(e)
    }
}

module.exports.getPDFFile = async (req, res, next) => {
    try {
        const { keywords } = req.body;
        const { id: fileId } = req.params;

        if (!keywords) {
            return next(new ErrorResponse('Incorrect body request', 400));
        }

        const currentUser = await User.find({ googleId: req.user.googleId });
        const refreshToken = currentUser[0].googleRefreshToken;

        await getFilePDF(refreshToken, fileId, req.user.googleId);


        res.status(200).json({
            success: true,
            count: 0,
            data: {}
        });
    } catch (e) {
        console.log(e);
    }
}