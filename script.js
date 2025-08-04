const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const historyList = document.getElementById('history-list');

let currentInput = '';
let resultShown = false;
let history = [];

// Atualiza o display
function updateDisplay() {
    display.textContent = currentInput || '0';
}

// Adiciona ao histórico
function addToHistory(expression, result) {
    history.unshift(`${expression} = ${result}`);
    if (history.length > 15) history.pop();
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

// Função para calcular o resultado
function calculate() {
    try {
        // Substitui × e ÷ por * e / para eval
        let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        // Remove operadores no final
        expression = expression.replace(/[\+\-\*\/\.]$/, '');
        const result = eval(expression);
        if (result !== undefined) {
            addToHistory(currentInput, result);
            currentInput = result.toString();
            resultShown = true;
            updateDisplay();
        }
    } catch (e) {
        display.textContent = 'Erro';
        currentInput = '';
        resultShown = true;
    }
}

// Lida com o clique dos botões
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        handleInput(action);
    });
});

// Lida com entrada pelo teclado
document.addEventListener('keydown', (e) => {
    let key = e.key;
    if (key === 'Enter') key = '=';
    if (key === 'Backspace') key = 'backspace';
    if (key === 'Escape') key = 'clear';
    if (['+', '-', '*', '/', '.', '=', 'clear', 'backspace'].includes(key) || (!isNaN(key) && key !== ' ')) {
        e.preventDefault();
        handleInput(key);
    }
});

function handleInput(input) {
    if (resultShown && !isOperator(input) && input !== '=' && input !== 'backspace' && input !== 'clear') {
        // Se resultado foi mostrado e o usuário digita um número, começa novo cálculo
        currentInput = '';
        resultShown = false;
    }

    switch(input) {
        case 'clear':
            currentInput = '';
            updateDisplay();
            break;
        case 'backspace':
            currentInput = currentInput.slice(0, -1);
            updateDisplay();
            break;
        case '=':
            calculate();
            break;
        case '+': case '-': case '*': case '/': case '×': case '÷': case '−':
            if (currentInput === '' && (input === '-' || input === '−')) {
                currentInput = '-';
            } else if (currentInput && !isOperator(lastChar(currentInput))) {
                currentInput += input.replace('×','*').replace('÷','/').replace('−','-');
            } else if (currentInput && isOperator(lastChar(currentInput))) {
                // Substitui o último operador
                currentInput = currentInput.slice(0, -1) + input.replace('×','*').replace('÷','/').replace('−','-');
            }
            updateDisplay();
            break;
        case '.':
            // Não permite dois pontos seguidos ou dois pontos no mesmo número
            if (canAddDot()) {
                currentInput += '.';
                updateDisplay();
            }
            break;
        default:
            // Números
            if (!isNaN(input)) {
                currentInput += input;
                updateDisplay();
            }
    }
}

function isOperator(char) {
    return ['+', '-', '*', '/', '×', '÷', '−'].includes(char);
}

function lastChar(str) {
    return str[str.length - 1];
}

function canAddDot() {
    // Não permite dois pontos seguidos ou dois pontos no mesmo número
    const parts = currentInput.split(/[\+\-\*\/]/);
    const lastNumber = parts[parts.length - 1];
    return !lastNumber.includes('.');
}

// Inicialização
updateDisplay();
renderHistory();
