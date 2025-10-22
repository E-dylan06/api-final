const app = require('./app');

const PORT = app.get('port');

app.listen(PORT, () => {
    console.log(`API conectada en ${PORT}`);
    console.log('Disponible en la red');
});