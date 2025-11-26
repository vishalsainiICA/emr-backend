import mongoose from "mongoose";
import { GridFSBucket } from 'mongodb';
import grid from 'gridfs-stream'
import multer from "multer";

let gridFsBucket, gfs;

mongoose.connection.once('open', () => {
    gridFsBucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'reports'
    });
    gfs = grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('reports');
});

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 30 * 1024 * 1024, //  30 MB is a good sweet spot
    },
});


export const uploadToGridFs = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return next();
        }

        // ek array banayenge jisme saare file ids store hongi
        req.savedFiles = [];

        let pending = req.files.length;

        req.files.forEach((file) => {
            const filename = `${Date.now()}-${file.originalname}`;
            const writestream = gridFsBucket.openUploadStream(filename, {
                contentType: file.mimetype,
            });

            writestream.end(file.buffer);

            writestream.on("finish", () => {
                req.savedFiles.push({
                    id: writestream.id,
                    filename: filename,
                    contentType: file.mimetype,
                });

                pending -= 1;
                if (pending === 0) {
                    next(); // sab files upload hone ke baad hi next()
                }
            });

            writestream.on("error", (err) => {
                return res.status(500).json({ error: err.message });
            });
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


export const getProfilePic = async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readstream = gridFsBucket.openDownloadStream(file._id);
        readstream.pipe(res);
    } catch (error) {
        console.log("error while getting image", error)
    }
}