const axios = require('axios').default;


module.exports.getStudents = async (req, res, next) => {
    try {
        // Powerqueries URL
        // https://support.powerschool.com/developer/#/page/powerqueries
        const queryParam = { ...req.query };
        const { pageSize = 100, page = 1 } = queryParam;

        const URL = `${process.env.API_POWERSCHOOL}?pagesize=${pageSize}&page=${page}`;
        const BEARERTOKEN = '9226ce61-a416-4e71-88a8-5a94c8397943';
        const response = await axios({
            method: 'POST',
            url: URL,
            data: {},
            headers: {
                'Authorization': `Bearer ${BEARERTOKEN}`,
                'Access': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const students = response.data?.record;
        console.log('Hello world!');
        res.status(200).json({
            success: true,
            count: students?.length,
            data: students,
        });
    } catch (e) {
        next(e);
    }
}