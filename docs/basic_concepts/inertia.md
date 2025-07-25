# Inércia

Todo corpo resiste a mudanças em seu estado de movimento — essa resistência é o que chamamos de inércia.

No caso de um drone, existem dois tipos principais de inércia (translacional e rotacional) que precisamos conhecer para entender e controlar seu comportamento:

- Massa — resistência a mudanças de velocidade linear (movimento para frente, para os lados e para cima)
- Momento de inércia — resistência a mudanças de velocidade angular (giro em torno dos seus eixos)

---

## Massa

A massa representa o quanto o drone resiste a acelerar ou desacelerar ao longo de um eixo.

Podemos calcular a massa total do drones simplesmente somando a massa de seus componentes.

!!! question "Exercício 1"

    Estime a massa total do drone somando a massa de seus componentes (que está disponível na aba `Specifications` no site da Bitcraze):
    
    - [Crazyflie 2.1 Brushless](https://www.bitcraze.io/products/crazyflie-2-1-brushless/){target=_blank}
    - [Flow deck v2](https://www.bitcraze.io/products/flow-deck-v2/){target=_blank}
            
    ??? info "Resposta"
        $$
        \begin{align*}
            m &= m_{cf} + m_{fd} \\
            m &= 37 + 1,6 \\
            m &= 38,6 g
        \end{align*}
        $$

---

## Momento de Inércia

O momento de inércia representa o quanto o drone resiste a acelerar ou desacelerar em torno de um eixo de rotação.

O cálculo do momento de inércia é um pouco mais complexo que o da massa, pois depende também da distribuição dessa massa em relação aos eixos de rotação. Além disso, como o drone pode girar em torno de três eixos, ele possui três momentos de inércia — um para cada eixo.

Vamos considerar um modelo simples para estimar os momentos de inércia:

- A bateria como bloco retangular central
- Os motores com hélices como massas puntiformes nas extremidades dos braços

Estamos desprezando a estrutura de PCB do drone, já que sua massa é pequena comparada à da bateria e dos motores, além de estar concentrada próxima ao centro de massa.

!!! question "Exercício 2"

    Estime a momento de inércia total do drone em torno de cada um de seus eixos.
            
    ??? info "Resposta"


​