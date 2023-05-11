const axios = require('axios');
const {Type} = require('../db');

const cargarTypes = async () => {
    const infoDB = await Type.findAll()
    if (!infoDB.length) {
        try {
            const {data} = await axios('https://pokeapi.co/api/v2/type');
            let info = data.results.map(e=>e.name)
            info.forEach( e => {
                Type.findOrCreate({
                    where: {
                        name: e
                    }
                })
            });
        } catch (error) {
            console.log(error.message)
        }
    }
    
}

module.exports = {
  cargarTypes
}