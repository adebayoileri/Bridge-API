import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


/********
 * @class Upload
 *
 * @description Picture Upload
 *
 ***********/

class Upload{


    /*****
     * @static
     *
     * @param {object} request - {file named image}
     *
     * @returns {object} - status, data, size
     *
     *
     * @description This method is used to upload a picture to cloudinary
     * @memberOf Upload
     *****/


    static async upLoadphoto (req, res){
        const image = req.files.image;
        console.log(image)
        jwt.verify(req.token, process.env.AUTHKEY, async (err, authorizedData)=>{
            if(err){
                return res.status(403).json(err)
            }else{
                    if(!image){
                        return res.status(400).json({message: 'image file needed'})
                    }
                try {
                    const imageSize = formatBytes(image.size, 3)
                    cloudinary.v2.uploader.upload(image.tempFilePath, { resourse_type: 'auto' })
                    .then(async (result) => {
                        if(!result) return res.status(400).json({message: 'upload error'})
                        // image response
                        return res.status(200).json({
                            status: "Ok",
                            data: result,
                            size: imageSize
                        })
                    })
                    .catch((err) =>
                     console.log('Error from : src/contollers/upload.controller.js - uploadphoto ' + err)
                    )

                }catch(err){
                    console.log('Error from : src/contollers/upload.controller.js - uploadphoto ' + err)
                }}})
        }
}

// function to calculate the size of the image
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}



// response {
//     "status": "Ok",
//     "data": {
//         "asset_id": "2a45a45d85e9dc4a233a2a129b3854e0",
//         "public_id": "i871sxbqtg8ifgfuskew",
//         "version": 1593387447,
//         "version_id": "3427966aa5a86373ba91c21de7b27223",
//         "signature": "b20c24478249a161b48e1df955c251706f1fe0f8",
//         "width": 1391,
//         "height": 1401,
//         "format": "jpg",
//         "resource_type": "image",
//         "created_at": "2020-06-28T23:37:27Z",
//         "tags": [],
//         "bytes": 228229,
//         "type": "upload",
//         "etag": "7360e818ad0aecd736b0674c9e8a5ea9",
//         "placeholder": false,
//         "url": "http://res.cloudinary.com/bridgeng/image/upload/v1593387447/i871sxbqtg8ifgfuskew.jpg",
//         "secure_url": "https://res.cloudinary.com/bridgeng/image/upload/v1593387447/i871sxbqtg8ifgfuskew.jpg",
//         "original_filename": "tmp-1-1593387440531"
//     },
//     "size": "222.88 KB"
// }

export default Upload;