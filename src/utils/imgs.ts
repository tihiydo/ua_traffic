import nodeFetch from 'node-fetch';

export const urlImgToBase64 = async (img: string) => {
    const req = await nodeFetch(img);

    const base64 = Buffer.from(await req.arrayBuffer()).toString('base64')
    const src = `data:image/jpg;base64,${base64}`

    return src
}