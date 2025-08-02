# Inércia

Todo corpo resiste a mudanças em seu estado de movimento — essa resistência é o que chamamos de inércia.

No caso de um drone, que está livre para se mover e girar no espaço, a inércia se manifesta de duas formas principais, e ambas são fundamentais para entender como ele responde aos comandos de controle:

- Massa — representa a resistência a movimentos lineares (como subir/descer, avançar/recuar ou deslocar-se lateralmente). É a chamada inércia translacional.
- Momento de inércia — representa a resistência a movimentos angulares (como rolar, inclinar ou guinar). É a chamada inércia rotacional.

Controlar bem um drone exige compreender essas duas formas de inércia — e como elas influenciam as acelerações que conseguimos impor a ele.

---

## Massa

A massa representa o quanto o drone resiste a acelerar ou desacelerar ao longo de um eixo de translação. Ela depende da quantidade de matéria e é a mesma em qualquer direção. Ou seja, não importa se o movimento é para cima, para frente ou para o lado: temos apenas uma única massa.


!!! question "Exercício 1"

    Podemos calcular a massa do drone somando a massa de seus componentes:
    
    - O [drone](https://www.bitcraze.io/products/crazyflie-2-1-brushless/){target=_blank} que já considera bateria, PCB, motores, hélices, etc.
    - O [módulo de expansão](https://www.bitcraze.io/products/flow-deck-v2/){target=_blank} que é acoplado embaixo

    Determine a massa total do drone somando a massa de seus componentes. Elas podem ser obtidas nas especificações técnicas no site da Bitcraze (cujos links foram disponibilizados acima).
            
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

O momento de inércia representa o quanto o drone resiste a acelerar ou desacelerar em torno de um eixo de rotação. Ao contrário da massa, ele depende não apenas da quantidade de matéria, mas também de como ela está distribuída em relação ao eixo de rotação. Como o drone pode girar em torno de três eixos (rolagem, inclinação e guinagem), ele possui três momentos de inércia: um para cada eixo.

Vamos considerar um modelo simples para estimar os momentos de inércia:





!!! question "Exercício 2"

    Podemos calcular os momentos de inércia do drone considerando um modelo mais simples[^1]:
    
    - A [bateria](https://store.bitcraze.io/collections/spare-parts-crazyflie-brushless/products/350mah-lipo-battery){target=_blank} como bloco retangular central
    - Os [motores](https://store.bitcraze.io/collections/spare-parts-crazyflie-brushless/products/crazyflie-2-1-brushless-08028-10000kv-brushless-motor){target=_blank} com  [hélices](https://store.bitcraze.io/collections/spare-parts-crazyflie-brushless/products/propeller-55-35-4ccw-4cw-green){target=_blank} e [suportes](https://store.bitcraze.io/collections/spare-parts-crazyflie-brushless/products/crazyflie-2-1-brushless-5-x-legs-5-x-guards){target=_blank} como massas puntiformes nas extremidades dos braços

    [^1]: Estamos desprezando a estrutura de PCB do drone, já que sua massa é pequena comparada à da bateria e dos motores, além de estar concentrada próxima ao centro de massa.

    Determine a momento de inércia total do drone em torno de cada um de seus eixos. As dimensões necessárias podem ser obtidas com o auxílio de um paquímetro, já as massas podem ser obtidas nas especificações técnicas no site da Bitcraze (cujos links foram disponibilizados acima).
            
    ??? info "Resposta"


​