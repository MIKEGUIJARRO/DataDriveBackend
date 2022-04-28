const authCheck = require('../middlewares/auth');
const User = require('../models/User');
const { google } = require('googleapis');
const ErrorResponse = require('../util/errorResponse');

const { getFolderData, getFilePlaceHolders } = require('../util/drive');

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

module.exports.getFilePlaceHolders = async (req, res, next) => {
    try {
        const queryParam = { ...req.query };
        const { fileId } = queryParam;

        if (!fileId) {
            return next(new ErrorResponse('fileId required for query', 400));
        }

        const currentUser = await User.find({ googleId: req.user.googleId });

        const refreshToken = currentUser[0].googleRefreshToken;

        await getFilePlaceHolders(refreshToken, fileId, req.user.googleId);

        res.status(200).json({
            success: true,
            count: 0,
            data: {}
        });
    } catch (e) {
        console.log(e)
    }
}