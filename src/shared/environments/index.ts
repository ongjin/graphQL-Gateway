/**
 * @description environments
 * @description 환경변수 설정
 */
import * as dotenv from 'dotenv';

const NODE_ENV: string = process.env.NODE_ENV
if (NODE_ENV) {
    dotenv.config()
}

const WEBKIOSK_NAME: string = process.env.WEBKIOSK_NAME || 'Local'
const WEBKIOSK_URL: string = process.env.WEBKIOSK_URL || 'http://localhost:3030/graphql'

const GQLAPI_NAME: string = process.env.GQLAPI_NAME || 'GQLAPI'
const GQLAPI_URL: string = process.env.GQLAPI_URL || 'http://www.astems.co.kr:15000/graphql'

// const LOCATION_NAME: string = process.env.LOCATION_NAME || 'Local'
// const LOCATION_URL: string = process.env.LOCATION_URL || 'http://localhost:3030/graphql'

// node port
const NODE_PORT: number = Number(process.env.NODE_PORT) || 3001



export {
    // node port
    NODE_PORT,

    WEBKIOSK_NAME,
    WEBKIOSK_URL,

    GQLAPI_NAME,
    GQLAPI_URL,

    // LOCATION_NAME,
    // LOCATION_URL,
}