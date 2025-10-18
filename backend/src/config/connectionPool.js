import 'dotenv/config'
import mongoose from 'mongoose'

export const connectionPool = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        showcase('Host', conn.connection.host)
        showcase('Name', conn.connection.name)
        showcase('Models', conn.connection.modelNames())
        showcase('Port', conn.connection.port)
        showcase('State', connectionState(conn.connection.readyState))
    } catch (error) {
        console.error('Error: ' + error)
    }
}

function showcase(name, data) {
    let concatenation = `\x1b[34m${name}\x1b[0m \t: ${data}`;
    console.log(concatenation);
}

function connectionState(state) {
    switch (state) {
        case 0:
            return 'Desconectado'
        case 1:
            return 'Conectado'
        case 2:
            return 'Conectando...'
        case 3:
            return 'Desconectado'
        case 99:
            return 'Sin Inicializar'
        default:
            return 'Desconocido'
    }
}