import { Request, Response } from 'express';


interface inicioRequest extends Request {
    params: {
        name: string;
    };
}

interface inicioResponse extends Response {
    json: (body: { message: string }) => this;
}


export const inicio = (req: inicioRequest, res: inicioResponse):void => {
    const { name } = req.body;
   
    res.status(200).json({ message: `Hola ${name}` });
};
