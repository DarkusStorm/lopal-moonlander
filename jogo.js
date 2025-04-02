// Moonlander;
// Tiago Alves da Silva (https://github.com/DarkusStorm);
// 28/03/25;
// Versão 0.1.0.

/** @type {HTMLCanvasElement} */

// Modelagem de Dados:
let canvas = document.querySelector("#jogo");
let contexto = canvas.getContext("2d");


let moduloLunar = {
    posição: {
        x: Math.random() * 700,
        y: 100
    },
    ângulo: -Math.PI / 2,
    largura: 20,
    altura: 20,
    cor: "lightgray",
    motorLigado: false,
    velocidade: {
        x: 0,
        y: 0
    },
    combustível: 1000,
    rotaçãoAntiHorário: false,
    rotaçãoHorário: false
}

let estrelas = [];
for (let i = 0; i < 500; i++) {
    estrelas[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        raio: Math.sqrt(Math.random() * 2),
        transparência: 1.0,
        diminuicao: true,
        razaoDeCintilacao: Math.random() * 0.05
    }
}

// Visualização:
function desenharModuloLunar() {
    contexto.save();
    // Salva o contexto atual, visto que será alterado deopis.
    contexto.beginPath();
    contexto.translate(moduloLunar.posição.x, moduloLunar.posição.y);
    contexto.rotate(moduloLunar.ângulo);
    contexto.rect(moduloLunar.largura * -0.5, moduloLunar.altura * -0.5, moduloLunar.largura, moduloLunar.altura);
    contexto.fillStyle = moduloLunar.cor;
    contexto.fill();
    contexto.closePath();

    if (moduloLunar.motorLigado && moduloLunar.combustível > 0) {
        desenharChama();
    }

    contexto.restore();
    // Restaura o contexto salvo.
}

function desenharChama() {
    contexto.beginPath();
    contexto.moveTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(moduloLunar.largura * 0.5, moduloLunar.altura * 0.5);
    // Determina o tamanho da chama.
    contexto.lineTo(0, moduloLunar.altura * 0.5 + Math.random() * 10);
    contexto.closePath();
    contexto.fillStyle = "orange";
    contexto.fill();
}

function mostrarVelocidadeY() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let y = `Velocidade Y: ${(10 * moduloLunar.velocidade.y).toFixed(1)}`;
    contexto.fillText(y, 200, 60);
}

function mostrarVelocidadeX() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let x = `Velocidade X: ${(10 * moduloLunar.velocidade.x).toFixed(1)}`;
    contexto.fillText(x, 200, 80);
}

function mostrarÂngulo() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let ângulo = `Ângulo: ${((180 / Math.PI) * moduloLunar.ângulo).toFixed(0)}°`;
    contexto.fillText(ângulo, 500, 60);
}

function mostrarAltitude() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let altitude = `Altitude: ${((moduloLunar.posição.y - canvas.height) * -0.5).toFixed(0)}`;
    contexto.fillText(altitude, 500, 80);
}

function mostrarCombustível() {
    contexto.font = "bold 18px Arial"
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let combustível = `Combustível: ${(moduloLunar.combustível / 10).toFixed(1)}%`;
    contexto.fillText(combustível, 200, 100);
}

function acidente() {
    contexto.font = "bold 18px Arial"
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "red";
    let acidente = "Houve um acidente! Você teve uma aterrissagem brusca.";
    contexto.fillText(acidente, 400, 160);
}

function sucesso() {
    contexto.font = "bold 18px Arial"
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "green";
    let sucesso = "Você conseguiu pousar! O jogo acabou.";
    contexto.fillText(sucesso, 300, 160);
}

function desenharEstrelas() {
    for (let i; i < estrelas.length; i++) {
        let estrela = estrelas[i];
        contexto.beginPath();
        contexto.arc(estrela.x, estrela.y, estrela.raio, 0, 2 * Math.PI);
        contexto.closePath();
        contexto.fillStyle = "rgba(255, 255, 255, " + estrelas.transparência + ")";
        contexto.restore;
    }
}
function desenhar() {
    // Limpa o que há na tela.
    contexto.clearRect(0, 0, canvas.width, canvas.height);

    // Devem estar nessa ordem.
    atracaoGravitacional();
    mostrarVelocidadeY();
    mostrarVelocidadeX();
    mostrarÂngulo();
    mostrarAltitude();
    mostrarCombustível();
    desenharEstrelas();
    desenharModuloLunar();
    // "RequestAnimationFrame" repete a execução da função "desenhar" a cada quadro.
    if (moduloLunar.posição.y >= (canvas.height - 0.5 * moduloLunar.altura)) {

        if (moduloLunar.velocidade.y >= 2.0 || 5 < moduloLunar.ângulo) {
            return acidente();
        } else {
            return sucesso();
        }
    }
    requestAnimationFrame(desenhar);
}

// Seção de Controle:

// O programa compreende como "motorLigado" quando a tecla para cima está pressionada.
document.addEventListener("keydown", teclaPressionada);
function teclaPressionada(evento) {
    if (evento.keyCode == 38 && moduloLunar.combustível > 0) {
        moduloLunar.motorLigado = true;
    }
    if (evento.keyCode == 39) {
        // Comando para girar no sentido anti-horário;
        console.log("Seta para direita pressionada.");
        moduloLunar.rotaçãoAntiHorário = true;
    }
    if (evento.keyCode == 37) {
        // Comando para girar no sentido horário;
        console.log("Seta para esquerda pressionada.");
        moduloLunar.rotaçãoHorário = true;
    }
}
// O programa compreende como "motorLigado = false" quando a tecla de seta para cima não está pressionada.
document.addEventListener("keyup", teclaSolta);
function teclaSolta(evento) {
    if (evento.keyCode == 38) {
        moduloLunar.motorLigado = false;
    }
    if (evento.keyCode == 39) {
        // Comando para parar de girar no sentido anti-horário;
        console.log("Seta para direita solta.");
        moduloLunar.rotaçãoAntiHorário = false;
    }
    if (evento.keyCode == 37) {
        // Comando para parar de girar no sentido horário;
        console.log("Seta para esquerda solta.");
        moduloLunar.rotaçãoHorário = false;
    }
}
let gravidade = 0.03;
function atracaoGravitacional() {
    moduloLunar.posição.x += moduloLunar.velocidade.x;
    moduloLunar.posição.y += moduloLunar.velocidade.y;
    if (moduloLunar.rotaçãoAntiHorário) {
        moduloLunar.ângulo += Math.PI / 180;
    } else if (moduloLunar.rotaçãoHorário) {
        moduloLunar.ângulo -= Math.PI / 180;
    }

    if (moduloLunar.motorLigado) {
        if (moduloLunar.combustível > 0) {
            moduloLunar.velocidade.y -= 0.04 * Math.cos(moduloLunar.ângulo);
            moduloLunar.velocidade.x += 0.04 * Math.sin(moduloLunar.ângulo);
            moduloLunar.combustível--;
        } else {
            moduloLunar.combustível = 0;
        }
    }
    moduloLunar.velocidade.y += gravidade;
}

desenhar();