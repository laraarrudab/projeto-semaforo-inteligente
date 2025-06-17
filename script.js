document.addEventListener('DOMContentLoaded', function () {
   
  const nomeUsuarioInput = document.getElementById('nomeUsuario');
  const botaoIniciar = document.getElementById('botaoIniciar');
  const luzVermelha = document.getElementById('luzVermelha');
  const luzAmarela = document.getElementById('luzAmarela');
  const luzVerde = document.getElementById('luzVerde');
  const exibeMensagem = document.getElementById('exibeMensagem');
  const botaoPedestre = document.getElementById('botaoPedestre');
  const contador = document.getElementById('contador');
  const status = document.getElementById('status');
  const infoFase = document.getElementById('infoFase');
  const botaoPausar = document.getElementById('botaoPausar');
  const botaoEmergencia = document.getElementById('botaoEmergencia');
  const botaoReiniciar = document.getElementById('botaoReiniciar');

  // Tempos de cada cor
  const TEMPO_VERDE = 20;
  const TEMPO_AMARELO = 4;
  const TEMPO_VERMELHO = 16; 

  let tempo = 0;
  let intervalo;
  let emPausa = false;
  let emergencia = false;
  let faseAtual = '';
  let pedidoDeTravessia = false;
  let sistemaIniciado = false;

  // Som da travessia
  const somTravessia = new Audio('assets/pedestrian-crossing-77181.mp3');
  somTravessia.loop = true;

  function tocarSomTravessia() {
    somTravessia.currentTime = 0;
    somTravessia.play();
  }

  function pararSomTravessia() {
    somTravessia.pause();
    somTravessia.currentTime = 0;
  }

  function atualizarSemaforo() {
    luzVermelha.classList.remove('ativa');
    luzAmarela.classList.remove('ativa');
    luzVerde.classList.remove('ativa');

    if (!sistemaIniciado) {
      exibeMensagem.textContent = '🚦 Sistema parado. Digite seu nome e clique em Iniciar.';
      exibeMensagem.className = 'exibe-mensagem mostrar info';
      contador.textContent = '0';
      status.textContent = 'Aguardando';
      infoFase.textContent = 'Fase: --';
      botaoPedestre.disabled = true;
      botaoPausar.disabled = true;
      botaoEmergencia.disabled = true;
      botaoReiniciar.disabled = true;
      return;
    }

    if (emergencia) {
      luzVermelha.classList.add('ativa');
      status.textContent = "Emergência Ativada";
      infoFase.textContent = "Fase: Emergência";
      contador.textContent = "--";
      exibeMensagem.textContent = "🚨 Modo emergência ativado!";
      exibeMensagem.className = "exibe-mensagem mostrar perigo";
      botaoPedestre.disabled = true;
      return;
    }

    switch (faseAtual) {
      case 'vermelho':
        luzVermelha.classList.add('ativa');
        status.textContent = "Carros Parados";
        infoFase.textContent = "Fase: Sinal Vermelho";
        botaoPedestre.disabled = true;
        if (pedidoDeTravessia) {
          exibeMensagem.textContent = `Olá, ${nomeUsuarioInput.value}! Pode atravessar!`;
          exibeMensagem.className = "exibe-mensagem mostrar info entrar";
          tocarSomTravessia();
          pedidoDeTravessia = false;
        } else {
          exibeMensagem.textContent = "🛑 Sinal Vermelho - Carros Parados. Pedestre pode atravessar.";
          exibeMensagem.className = "exibe-mensagem mostrar info";
          pararSomTravessia();
        }
        break;

      case 'amarelo':
        luzAmarela.classList.add('ativa');
        status.textContent = "Carros Atenção";
        infoFase.textContent = "Fase: Sinal Amarelo";
        botaoPedestre.disabled = true;
        exibeMensagem.textContent = "⚠️ Sinal Amarelo - Atenção!";
        exibeMensagem.className = "exibe-mensagem mostrar alerta entrar";
        pararSomTravessia();
        break;

      case 'verde':
        luzVerde.classList.add('ativa');
        status.textContent = "Carros Andando";
        infoFase.textContent = "Fase: Sinal Verde";
        botaoPedestre.disabled = false;
        exibeMensagem.textContent = "🚦 Sinal Verde - Carros Andando. Pressione o botão para pedir travessia.";
        exibeMensagem.className = "exibe-mensagem mostrar info entrar";
        pararSomTravessia();
        break;
    }
  }

  function iniciarContagem() {
    contador.textContent = tempo;
    intervalo = setInterval(() => {
      if (emPausa || !sistemaIniciado) return;

      if (tempo <= 0) {
        trocarFase();
      } else {
        tempo--;
        contador.textContent = tempo;
      }
    }, 1000);
  }

  function trocarFase() {
    if (faseAtual === 'vermelho') {
      faseAtual = 'verde';
      tempo = TEMPO_VERDE;
    } else if (faseAtual === 'verde') {
      faseAtual = 'amarelo';
      tempo = TEMPO_AMARELO;
    } else if (faseAtual === 'amarelo') {
      faseAtual = 'vermelho';
      tempo = TEMPO_VERMELHO;
    }

    atualizarSemaforo();
    contador.textContent = tempo;
  }

  // Evento do botão iniciar
  botaoIniciar.addEventListener('click', () => {
    const nome = nomeUsuarioInput.value.trim();

    if (nome.length < 3) {
      alert('Por favor, digite um nome com pelo menos 3 caracteres.');
      return;
    }

    sistemaIniciado = true;
    tempo = TEMPO_VERDE;
    faseAtual = 'verde';
    emPausa = false;
    emergencia = false;
    pedidoDeTravessia = false;

    botaoPedestre.disabled = false;
    botaoPausar.disabled = false;
    botaoEmergencia.disabled = false;
    botaoReiniciar.disabled = false;

    botaoIniciar.disabled = true;
    nomeUsuarioInput.disabled = true;

    atualizarSemaforo();
    iniciarContagem();
  }); 

  botaoPedestre.addEventListener('click', () => {
    if (botaoPedestre.disabled) return;

    if (faseAtual === 'verde') {
      pedidoDeTravessia = true;
      botaoPedestre.classList.add('solicitado');
      exibeMensagem.textContent = "🚶‍♂️ Pedido de travessia recebido. Aguarde o sinal vermelho...";
      exibeMensagem.className = "exibe-mensagem mostrar info entrar";
    }
  });

  botaoPausar.addEventListener('click', () => {
    emPausa = !emPausa;
    botaoPausar.textContent = emPausa ? '▶️ Retomar' : '⏸️ Pausar';
    exibeMensagem.textContent = emPausa ? '⏸️ Sistema pausado' : '▶️ Sistema em execução';
    exibeMensagem.className = "exibe-mensagem mostrar info entrar";
  });

  botaoEmergencia.addEventListener('click', () => {
    emergencia = !emergencia;
    if (emergencia) {
      clearInterval(intervalo);
      atualizarSemaforo();
    } else {
      exibeMensagem.textContent = "🚦 Emergência desativada. Reiniciando sistema...";
      exibeMensagem.className = "exibe-mensagem mostrar info entrar";
      tempo = TEMPO_VERMELHO;
      faseAtual = 'vermelho';
      botaoPedestre.disabled = true;
      pedidoDeTravessia = false;
      iniciarContagem();
      atualizarSemaforo();
    }
  });

  botaoReiniciar.addEventListener('click', () => {
    clearInterval(intervalo);
    emPausa = false;
    emergencia = false;
    sistemaIniciado = false;
    faseAtual = '';
    tempo = 0;
    pedidoDeTravessia = false;

    botaoPedestre.disabled = true;
    botaoPausar.disabled = true;
    botaoEmergencia.disabled = true;
    botaoReiniciar.disabled = true;

    botaoIniciar.disabled = false;
    nomeUsuarioInput.disabled = false;
    nomeUsuarioInput.value = '';

    exibeMensagem.textContent = "🚦 Sistema parado. Digite seu nome e clique em Iniciar.";
    exibeMensagem.className = "exibe-mensagem mostrar info entrar";

    atualizarSemaforo();
  });

  // Inicializa sistema parado
  atualizarSemaforo();
});
 