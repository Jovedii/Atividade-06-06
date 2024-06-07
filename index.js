import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

let products = [];

const rootDir = path.resolve();

const publicDir = path.join(rootDir, 'publico');

app.use(express.static(publicDir));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'login.html'));
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === 'gui' && password === '2305') {
        req.session.username = username;
        res.cookie('lastAccess', new Date().toISOString());
        res.redirect('/Cadastro.html');
    } else {
        res.send('Credenciais incorretas!');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/Cadastro.html', (req, res) => {
    if (!req.session.username) {
        return res.send('Você precisa realizar o login');
    }
    res.sendFile(path.join(publicDir, 'Cadastro.html'));
});

app.post('/cadastrarProduto', (req, res) => {
    if (!req.session.username) {
        return res.send('Você precisa realizar o login');
    }

    const product = {
        codigoBarras: req.body.codigoBarras,
        descricao: req.body.descricao,
        precoCusto: req.body.precoCusto,
        precoVenda: req.body.precoVenda,
        dataValidade: req.body.dataValidade,
        qtdEstoque: req.body.qtdEstoque,
        nomeFabricante: req.body.nomeFabricante
    };
    
    products.push(product);
    res.redirect('/Cadastro.html');
});

app.get('/products', (req, res) => {
    if (!req.session.username) {
        return res.send('Você precisa realizar o login');
    }

    res.json({
        products
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
