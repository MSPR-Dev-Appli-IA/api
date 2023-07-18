const axios = require('axios');
const { findOneSpeciesByName, createSpecies } = require('../queries/species.queries');
import * as fs from 'fs';

import { ISpecies } from '../interfaces';

export class speciesService {

  async getSpeciesFromImage(fileName: String): Promise<ISpecies | null> {

    const token = process.env.PLANT_KEY
    const url = process.env.PLANT_URL+ "?details=url,description,edible_parts,propagation_methods,image&language=fr"
    const myFile = fs.readFileSync("public/image/" + fileName, {encoding:'base64'}) 
    


    axios.defaults.headers.common = {
      "API-Key": token,
    };

    const response = await axios.post(url, {
      images: myFile,
    },{
      headers: {
        "Content-Type": 'multipart/form-data',
        "API-Key": token,
      }
    } )


    if (response.data.result.is_plant_binary && !response.data.result.classification.suggestions ) {
      return null
    } else {
      
      const species = response.data.result.classification.suggestions[0]
      const foundSpecies = await findOneSpeciesByName(species.name)
      if (foundSpecies) {
        return foundSpecies
      } else {
        

        
        const newSpecies = await createSpecies({ name: species.name, image: species.details.image.value, description: species.details.description.value, edible_parts: species.details.edible_parts, propagation_methods: species.details.propagation_methods })
        return newSpecies
      }


    }

  }

}