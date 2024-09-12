// Selecionando elementos DOM
const form = document.getElementById('product-form');
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productDescription = document.getElementById('product-description');
const productStock = document.getElementById('product-stock');
const productId = document.getElementById('product-id');
const productList = document.getElementById('product-list');
const submitBtn = document.getElementById('submit-btn');

// Elementos DOM adicionais
const productManagementSection = document.getElementById('product-management');
const dashboardSection = document.getElementById('dashboard');
const productManagementTab = document.getElementById('product-management-tab');
const dashboardTab = document.getElementById('dashboard-tab');

// Função para alternar entre seções
function showSection(section) {
    if (section === 'productManagement') {
        productManagementSection.style.display = 'block';
        dashboardSection.style.display = 'none';
    } else if (section === 'dashboard') {
        productManagementSection.style.display = 'none';
        dashboardSection.style.display = 'block';


        renderCharts();
    }
}

// Eventos de clique na navegação
productManagementTab.addEventListener('click', () => showSection('productManagement'));
dashboardTab.addEventListener('click', () => showSection('dashboard'));

// Função para salvar o produto no localStorage
function saveProduct(e) {
    e.preventDefault();
    
    const id = productId.value ? parseInt(productId.value) : Date.now();
    const newProduct = {
        id,
        name: productName.value,
        price: parseFloat(productPrice.value),
        description: productDescription.value,
        stock: parseInt(productStock.value)
    };

    let products = getProductsFromLocalStorage();
    
    if (productId.value) {
        // Editar produto existente
        products = products.map(product => product.id === id ? newProduct : product);
        submitBtn.textContent = 'Salvar Produto';
    } else {
        // Adicionar novo produto
        products.push(newProduct);
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    form.reset();
    productId.value = '';

    //usar reload para atualizar os gráficos
    location.reload();

    renderProducts();
}

// Função para obter produtos do localStorage
function getProductsFromLocalStorage() {
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
}

// Função para renderizar a lista de produtos
function renderProducts() {
    const products = getProductsFromLocalStorage();
    productList.innerHTML = '';

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>R$ ${product.price.toFixed(2)}</td>
            <td>${product.description}</td>
            <td>${product.stock}</td>
            <td class="actions">
                <button onclick="editProduct(${product.id})">Editar</button>
                <button onclick="deleteProduct(${product.id})">Excluir</button>
            </td>
        `;
        productList.appendChild(tr);
    });
}

// Função para editar produto
function editProduct(id) {
    const products = getProductsFromLocalStorage();
    const productToEdit = products.find(product => product.id === id);

    productId.value = productToEdit.id;
    productName.value = productToEdit.name;
    productPrice.value = productToEdit.price;
    productDescription.value = productToEdit.description;
    productStock.value = productToEdit.stock;

    submitBtn.textContent = 'Atualizar Produto';
}

// Função para excluir produto
function deleteProduct(id) {
    let products = getProductsFromLocalStorage();
    products = products.filter(product => product.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
}

// Função para renderizar os gráficos
function renderCharts() {
    const products = getProductsFromLocalStorage();

    // Verificar se há produtos cadastrados
    if (products.length === 0) {
        alert('Nenhum produto cadastrado para exibir no dashboard.');
        return;
    }

    // Exemplo de gráfico de preços dos produtos
    const productNames = products.map(product => product.name);
    const productPrices = products.map(product => product.price);

    const ctx1 = document.getElementById('productChart').getContext('2d');
    new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Preço dos Produtos (R$)',
                data: productPrices,
                backgroundColor: 'rgba(64, 224, 208, 0.5)',
                borderColor: 'rgba(64, 224, 208, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Exemplo de gráfico de quantidade em estoque
    const productStocks = products.map(product => product.stock);

    const ctx2 = document.getElementById('stockChart').getContext('2d');
    new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Quantidade em Estoque',
                data: productStocks,
                backgroundColor: generateColors(productStocks.length),
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
        }
    });
}

// Função para gerar cores aleatórias para os gráficos
function generateColors(num) {
    const colors = [];
    for (let i = 0; i < num; i++) {
        colors.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`);
    }
    return colors;
}

// Carregar produtos na inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    showSection('productManagement');
});

// Adicionar evento de submit ao formulário
form.addEventListener('submit', saveProduct);
