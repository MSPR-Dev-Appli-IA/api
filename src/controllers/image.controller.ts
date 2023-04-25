import { IImage } from "../interfaces";
import { createImage } from "../queries/image.queries";



export const newImages = async (files:Express.Multer.File[]) => {
    const imageArray:IImage[] = []
    try {
        for (const file of files) {
            const  newImage = await createImage({path:file.filename})
            imageArray.push(newImage)
        }
    } catch (e) {
        throw e
    }finally{
        return imageArray
    }
    
  };