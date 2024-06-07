// index.js
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

// Define o diretório raiz do projeto
const rootDir = path.resolve();

// Define o diretório de arquivos estáticos
const publicDir = path.join(rootDir, 'publico');

// Servir arquivos estáticos
app.use(express.static(publicDir));

// Rota para a página de login
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'login.html'));
});

// Rota para o processo de login
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Verifica usuário e senha
    if (username === 'gui' && password === '2305') {
        req.session.username = username;
        res.cookie('lastAccess', new Date().toISOString());
        res.redirect('/Cadastro.html');
    } else {
        res.send('Credenciais incorretas!');
    }
});

// Rota para logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Rota para a página de cadastro
app.get('/Cadastro.html', (req, res) => {
    if (!req.session.username) {
        return res.send('Você precisa realizar o login');
    }
    res.sendFile(path.join(publicDir, 'Cadastro.html'));
});

// Rota para cadastrar um produto
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

// Rota para obter a lista de produtos
app.get('/products', (req, res) => {
    if (!req.session.username) {
        return res.send('Você precisa realizar o login');
    }

    res.json({
        products
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
