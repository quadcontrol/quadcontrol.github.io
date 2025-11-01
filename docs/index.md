---
title: Início
icon: material/home-outline
---

# QuadControl

Um **curso inovador** sobre teoria de controle — totalmente prático, acessível e baseado em um sistema real.

---

## Hardware real

![Crazyflie 2.1 Brushless, vista superior](images/crazyflie.png){ width="400" style="display:block;margin:auto" }

Utilizamos um **quadricóptero de verdade** - o [**Bitcraze Crazyflie 2.1 Brushless**](https://www.bitcraze.io/products/crazyflie-2-1-brushless/){target=_blank} - compacto, open source e projetado especificamente para ensino e pesquisa, esse pequeno dispositivo é o coração do curso. É nele que você vai implementar e testar **todo o algoritmo de estimação e controle**, do sensor ao motor.

---

## O que você aprende

<div class="grid cards" markdown>

- :material-school-outline:{ .lg .middle } **Fundamentos de aeronáutica**
  
    ---
    
    Conceitos essenciais de **aerodinâmica** e **dinâmica de corpo rígido**, explicados de forma direta e aplicados no drone.

- :material-memory:{ .lg .middle } **Programação embarcada**
  
    ---
    
    Você programa um microcontrolador **ARM** em **C** utilizando **FreeRTOS** e integra sensores (IMU, ToF e fluxo óptico) via **I²C/SPI**.


- :material-flask:{ .lg .middle } **Controle aplicado**
  
    ---
    
    Do **PID** e **filtro complementar** ao **LQR** e **Kalman** — diferentes conceitos de controle clássico e moderno testados **em voo**, na planta real.

- :material-layers-triple-outline:{ .lg .middle } **Arquitetura em camadas**
  
    ---
    
    Três níveis de controle: **atitude** (fusão sensorial + P–P), **posição vertical** (observadores 1ª/2ª ordem + PD/PID) e **posição horizontal** (LQE + LQR = LQG).

- :material-hammer-wrench:{ .lg .middle } **100% prático**
  
    ---
    
    **Sem simulação**: você observa **na prática** como cada ganho altera o comportamento do drone — estabilidade, ultrapassagem percentual, tempo de resposta.

- :material-magnify-scan:{ .lg .middle } **Identificação**
  
    ---
    
    Usamos **dispositivos de teste e suportes físicos** que restringem graus de liberdade e permitem **identificar parâmetros físicos e aerodinâmicos com precisão**.

</div>

---

## Veja o curso em ação

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px">
  <iframe src="https://www.youtube-nocookie.com/embed/BWKetwaHiyc?si=Z6z0i3ECyBbCU5V8"
          title="QuadControl demo"
          style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"
          allowfullscreen></iframe>
</div>


<!-- Enquanto os cursos convencionais abordam apenas sistemas lineares de uma entrada e uma saída, quase sempre em ambiente de simulação, aqui você trabalha com um sistema real, não linear e multivariável: o [Bitcraze Crazyflie 2.1 Brushless](https://www.bitcraze.io/products/crazyflie-2-1-brushless/){target=_blank} — um quadricóptero open source voltado para ensino e pesquisa.

O objetivo é romper a barreira entre teoria e prática, mostrando que é possível compreender e aplicar conceitos avançados de controle de forma simples, didática e acessível. A famosa frase “a teoria na prática é outra” cai por terra aqui.

Diferente da maior parte dos cursos de controle, tudo aqui é feito diretamente na planta final, sem a etapa de simulação.
Você observa na prática como estabilidade, tempo de resposta e saturação são influenciados pelos ganhos de cada controlador e estimador.

Com o apoio de dispositivos especialmente projetados para restringir graus de liberdade e permitir a identificação precisa de parâmetros físicos e aerodinâmicos, o aprendizado deixa de ser teórico e se torna experimental, visual e concreto — exatamente como o controle deve ser. -->


<!-- A arquitetura de controle, que abrange diversos conceitos da teoria de controle clássico e moderno, é organizada em três camadas principais:

!!! question "Controle de atitude"

    Estudamos filtros passa-baixa, passa-alta e o filtro complementar para fusão sensorial. A estabilização é feita com um controlador P–P em cascata, que atua sobre velocidade e deslocamento angular, formando a base da malha mais rápida do sistema.

!!! question "Controle vertical"

    Introduzimos o uso de observadores de estados de 1ª e 2ª ordem para estimar velocidade e posição. Partimos de um controlador PD, que se transforma naturalmente em um PID ao lidar com o erro em regime permanente causado por distúrbios constantes, como a gravidade.

!!! question "Controle horizontal"

    Avançamos para um observador e regulador de estados ótimo. Mostramos que o LQE nada mais é do que um filtro de Kalman linear, enquanto o LQR equivale a um controlador PD com ganhos ideais. Quando utilizados em conjunto, integrando estimação e controle de maneira otimizada, formam o famoso LQG. -->

<!-- ---
template: home.html
title: Início
icon: material/home-outline
hide:
  - navigation
  - toc
title: ""   # deixa o título limpo; o hero vai dominar a página
--- --

<!-- # Bem-vindo!

Este site reúne toda a documentação da eletiva de Drones do Insper — uma espécie de apostila online, cuidadosamente organizada com:

- 📚 Explicações teóricas e fórmulas fundamentais
- 💻 Códigos em C, Python e MATLAB
- 🖼️ Figuras, diagramas e vídeos demonstrativos
- 🛸 Exemplos de aplicações práticas

Nosso objetivo é ensinar conceitos de controle e programação embarcada de forma prática e acessível, usando um quadricoptero real. Explore os tópicos no menu lateral — e boa jornada! 🚀

---

# Sobre a eletiva

Nesta eletiva, os alunos desenvolvem do zero todo o algoritmo de estimação e controle de um quadricóptero — o [Bitcraze Crazyflie 2.1 Brushless](https://www.bitcraze.io/products/crazyflie-2-1-brushless/){target=_blank}.

![Crazyflie](images/crazyflie.png){: width="400" style="display: block; margin: auto;" }

A jornada começa com os clássicos `led_blink.c` e `hello_world.c`, e termina com o drone voando sozinho. Ao longo do curso, o aluno:

<div class="annotate" markdown>
- 🧠 Programa um microcontrolador ARM(1) usando FreeRTOS(2)
- 📡 Trabalha com sensores embarcados (IMU(3), proximidade e fluxo óptico) via I²C(4) e SPI(5)
- 🔧 Controla motores BLDC(6) por meio de ESCs(7)
- 💻 Implementa em C(8) algoritmos de estimação e controle
</div>

1. Chips compactos e eficientes, usados como "cérebro" de muitos dispositivos embarcados, como drones, celulares e eletrodomésticos.
2. Sistema operacional leve e em tempo real (Real-Time Operating System), que permite rodar várias tarefas no microcontrolador de forma organizada e com alta precisão de tempo.
3. Unidade de Medição Inercial (Inertial Measurement Unit), composta por acelerômetros e giroscópios, usada para medir a orientação.
4. Protocolo de comunicação digital simples, que conecta sensores ao microcontrolador usando apenas dois fios.
5. Protocolo de comunicação digital mais rápido que o I²C, usado quando há necessidade de maior desempenho mas necessitando de quatro fios.
6. Motores elétrico sem escovas (Brushless DC Motor), mais eficientes e duráveis.
7. Controlador Eletrônico de Velocidade (Electronic Speed Controller), que regula a potência enviada aos motores e faz a comutação eletrônica na frequência correta.
8. Linguagem de programação de baixo nível, muito utilizada em sistemas embarcados.

A avaliação é 100% prática: ao final do curso, o drone deve voar até um dos helipontos, cada um com uma nota associada à sua dificuldade - quanto mais longe ou de difícil acesso o heliponto, maior sua média final na disciplina.

![Alvos](images/alvos.svg){: width=100% style="display: block; margin: auto;" }

Quer ver um pouco disso na prática? Assista o vídeo abaixo!

<div align="center">
  <iframe width="560" height="315" 
          src="https://www.youtube.com/embed/BWKetwaHiyc?si=Z6z0i3ECyBbCU5V8" 
          frameborder="0" 
          allowfullscreen>
  </iframe>
</div>

---

<div class="grid cards" markdown>

-   :material-cog:{ .lg .middle } **Controle de atitude**

    ---

    Estudamos filtros passa-baixa, passa-alta e o filtro complementar para fusão sensorial. A estabilização é feita com um controlador P–P em cascata, que atua sobre velocidade e ângulo, formando a base da malha mais rápida do sistema.

-   :material-power:{ .lg .middle } **Controle vertical**

    ---

    Introduzimos o uso de observadores de estados de 1ª e 2ª ordem para estimar velocidade e posição vertical. Partimos de um controlador PD, que se transforma naturalmente em um PID ao lidar com o erro em regime permanente causado por distúrbios constantes, como a gravidade.

-   :material-school-outline:{ .lg .middle } **Controle horizontal**

    ---

    Avançamos para um observador e regulador de estados ótimo. Mostramos que o LQE nada mais é do que um filtro de Kalman linear, enquanto o LQR equivale a um controlador PD com ganhos ideais. Quando utilizado em conjunto, integrando estimação e controle de maneira otimizada, temos o famoso LQG.

</div> -->


