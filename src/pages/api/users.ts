import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response: NextApiResponse) => {

    const users = [
        { id: 1, name: 'Julio' },
        { id: 2, name: 'João' },
        { id: 3, name: 'Rafa' },
    ]

    return response.json(users);
}


