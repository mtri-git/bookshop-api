// Cloudflare Workers entry: runs the Express app via the Node.js HTTP compat layer.
import { httpServerHandler } from 'cloudflare:node'
import { createApp } from './app'
import { ensureDbConnected } from './configs/dbConfig'

const PORT = 8080

const app = createApp({ beforeRoutes: [ensureDbConnected] })
app.listen(PORT)

export default httpServerHandler({ port: PORT })
