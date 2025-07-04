# Identificação da constante de arrasto

Nesta secção, você irá determinar experimentalmente a constante de arrasto das hélices $k_d$.

---

## Fundamentos teóricos

As hélices de um quadricoptero atuam como superfícies aerodinâmicas, acelerando o fluxo de ar através delas. Isso consome energia das baterias e produz forças de sustentação e torques de arrasto no quadricoptero. Já [deduzimos](../basic_concepts/aerodynamics.md) que o torque de arrasto de uma hélice $\tau$ é proporcional à velocidade angular da hélice $\omega$ ao quadrado.
    
![Drag Torque](images/drag_torque.pdf){: width="350" style="display: block; margin: auto;" }

$$
    \tau = k_d \omega^2
$$

Onde:

- $k_d$ - Constante de arrasto ($N.m.s^2$)   

---

## Procedimento experimental

As etapas para coletar os dados são as seguintes:

1. Garanta que a bateria do drone está carregada 
2. Prenda o drone no dispositivo e posicione um cronômetro ao seu lado
3. Arme o drone apertando o botão `Arm` no CFClient
4. Comece a filmar com seu celular no modo câmera lenta
5. Ligue os motores com o Command Based Flight Control do CFClient
6. Espere o drone dar duas voltas e pare de filmar
7. Repita as etapas 3-6 três vezes

Após o experimento, você deverá coletar dados para preencher a tabela abaixo.

| $\psi \, (^{\circ})$ | $t_1 \, (s)$ | $t_2 \, (s)$ | $t_3 \, (s)$ |
|-------|----------|----------|----------|
| $0$ |          |          |          |
| $90$ |          |          |          |
| $180$ |          |          |          |
| $270$ |          |          |          |
| $360$ |          |          |          |
| $450$ |          |          |          |
| $540$ |          |          |          |
| $630$ |          |          |          |
| $720$ |          |          |          |


---

## Análise de dados


![Drag Torque](images/drag_torque_graph.svg){: width=100% style="display: block; margin: auto;" }