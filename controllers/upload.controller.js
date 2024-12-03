import { Readable } from 'stream';
import cloudinary from '../lib/cloudinary.js';

export const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'user_images' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary error:', error);
                    return res
                        .status(500)
                        .json({ error: 'Image upload failed' });
                }
                res.status(200).json({ url: result.secure_url });
            }
        );

        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(stream);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
