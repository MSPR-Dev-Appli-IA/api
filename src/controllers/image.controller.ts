import {createImage} from "../queries/image.queries";


export const newImage = async (file:Express.Multer.File) => {

    try {
        const  newImage = await createImage({path:file.filename})   
        return newImage
    } catch (e) {
        throw e
    }
    
  };