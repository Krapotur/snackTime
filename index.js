const app = require('./app.js');
const { connectDb } = require('./config/connectDb');

const PORT = process.env.PORT || 5001;

connectDb()
    .then(() => {
        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`API listening on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to start API', err);
        process.exit(1);
    });