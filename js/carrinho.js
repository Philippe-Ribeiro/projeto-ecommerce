tv/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
    - atualizar o contador
    - adicionar o produto no localStorage
    - atualizar a tabela HTML do carrinho

Objetivo 2 - remover produtos do carrinho:
    - ouvir o botão de deletar
    - remover do localStorage
    - atualizar o DOM e o total

Objetivo 3 - atualizar valores do carrinho:
    - ouvir mudanças de quantidade
    - recalcular total individual
    - recalcular total geral
*/

// Objetivo 1 - quando clicar no botão de adicionar ao carrinho temos que atualizar o contador, adicionar o produto no localStorage e atualizar a tabela HTML do carrinho
//       passo 1 - pegar os botões de adicionar ao carrinho do html

const botoesAdicionarAoCarrinho = document.querySelectorAll('.adicionar-ao-carrinho');

// passo 2 - adicionar um evento de escuta nesses botões pra quando clicar disparar uma ação
botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener("click", (evento) => {

        //passo 3 - pega as informações do produto clicado e 

        // adicionar ao localStorage
        const elementoProduto = evento.target.closest('.produto');
        const produtoId = elementoProduto.dataset.id;
        const ProdutoNome = elementoProduto.querySelector('.nome').textContent;
        const produtoImagem = elementoProduto.querySelector('img').getAttribute('src');
        const produtoPreco = parseFloat(elementoProduto.querySelector('.preco').textContent.replace("R$ ", "").replace(".", "").replace(",", "."));

        //buscar a lista de produtos do localStorage
        const carrinho = obterProdutosDoCarrinho();
        //testar se o produto já existe no carrinho
        const existeProduto = carrinho.find(produto => produto.id === produtoId);
        //se existe produto, incrementar a quantidade
        if (existeProduto) {
            existeProduto.quantidade += 1;
        } else {
            //se não existe, adicionar o produto com quantidade 1
            const produto = {
                id: produtoId,
                nome: ProdutoNome,
                imagem: produtoImagem,
                preco: produtoPreco,
                quantidade: 1
            };
            carrinho.push(produto);
        }

        salvarProdutosNoCarrinho(carrinho);
        atualizarCarrinhoETabela();
    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

// passo 4 - atualizar o contador do carrinho de compras
function atualizarContadorCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.quantidade;
    });

    document.getElementById("contador-carrinho").textContent = total;
}

// passo 5 redenrizar a tabela do carrinho de compras
function renderizarTabelaCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector('#modal-1-content table tbody');
    if (!corpoTabela) return;

    corpoTabela.innerHTML = ""; // limpar tabela antes de renderizar

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = ` <td class="td-produto">
            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
            />
        </td>
        <td>${produto.nome}</td>
        <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
        <td class="id-quantidade">
        <input type="number" class="input-quantidade" data-id="${produto-id}"  value="${produto.quantidade}" min="1" />
        </td>
        <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</td>
        <td><button class="btn-remover" data-id="${produto.id}" id="deletar"></button></td> `;
corpoTabela.appendChild(tr);
    });

}


// objetivo 2 - remover produtos do carrinho
//    passo 1 - pegar o botão de deletar do carrinho
const corpotabela = document.querySelector("#modal-1-content table tbody");

// passo 2 adicionar evento de escuta no tbody
corpoTabela.addEventListener("click", evento => {
    console.log("entrou aqui");
    console.log(evento.target, classlist.contains("btn-remover"));

    if (evento.target.classlist.contains("btn-remover")) {
        const id = evento.target.dataset.id;
        //passo 3 - remover o evento do localStorage
        removerProdutoDoCarrinho(id);

    }

});

// passo 1 - adicionar evento de escuta no input do tbody
corpoTabela.addEventListener("input", evento => {
    // passo - 2 atualizar o valor total do produto
    if (evento.target.classlist.contains("input-quantidade")) {
        const produtos = obterProdutosDoCarrinho();
        const produto = produtos.find(produto => produto.id === evento.target.dataset.id);
        let novaQuantidade = parseInt(evento.target.value);
        if (produto){
            produto.quantidade = novaQuantidade;  
        }
        salvarProdutosNoCarrinho(produtos);
        atualizarCarrinhoETabela();
    }
});



// passo 4 - atualizar o html do carrinho retirando o produto
function removerProdutoDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();

    // filtrar os produtos que não tem o id passado por parametro
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);

    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela();
}

// passo 3 - atualizar o valor total do carrinho
function atualizarValorTotalCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.preco * produto.quantidade;
    });

    document.querySelector("#total-carrinho").textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

function atualizarCarrinhoRTabela(){
    atualizarContadorCarrinho();
    renderizarTabelaCarrinho();
    atualizarValorTotalCarrinho();

}

atualizarCarrinhoETabela();