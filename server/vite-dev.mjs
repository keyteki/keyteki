import path from 'path';
import { createServer as createViteServer } from 'vite';

export async function createViteMiddleware({ root }) {
    const vite = await createViteServer({
        root,
        server: { middlewareMode: true },
        appType: 'custom'
    });

    return {
        vite,
        templatePath: path.join(root, 'index.html')
    };
}
