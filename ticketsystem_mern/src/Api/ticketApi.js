import axios from "axios";

export const getAllTickets = async() => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await axios.get('http://localhost:3001/v1/ticket', {
                headers: {
                    Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkouYXRhaGFub3ZAeWFob28uY29tIiwiaWF0IjoxNjgzNzgxNTI2LCJleHAiOjE2ODM3ODI0MjZ9.5tqQdH3awY_LnBRnhGixHNP81SUO_G6Pgql2ZIwcsWg'
                }
            });
            resolve(result);
        } catch (error) {
            reject(error)
        }
    })
}