---
title: Inertia
icon: material/axis-z-rotate-counterclockwise
---

# :material-axis-z-rotate-counterclockwise: Inertia

This section introduces the concept of inertia and how it affects the motion of a drone. A multirotor resists changes in both linear and angular motion, and this resistance appears through two quantities: mass, which governs translational dynamics, and the moment of inertia, which governs rotational dynamics. Understanding both is essential for predicting how the drone accelerates and how it responds to control inputs.

---

## Mass

Mass represents how much the drone resists changes in velocity along any translational axis. It depends only on the total amount of matter and is the same in every direction. In other words, it does not matter whether the motion is upward, forward, or sideways, the vehicle has a single mass value.

![Mass](images/mass.svg){: width=60% style="display: block; margin: auto;" }

!!! question "Exercise 3.1"

    We can estimate the total mass of the drone by summing the mass of its components:

    - The [Crazyflie 2.1 Brushless](https://www.bitcraze.io/products/crazyflie-2-1-brushless/){target=_blank}, which already includes battery, PCB, motors, propellers, etc.
    - The [Flow Deck](https://www.bitcraze.io/products/flow-deck-v2/){target=_blank}, mounted underneath

    Determine the total mass by adding the component masses. The values can be obtained from the technical specifications on Bitcraze’s website (links provided above).

    ??? info "Solution"

        The total mass is given by:

        $$
        \begin{align}
            m &= m_{cf} + m_{fd} \\
            m &= 37 + 1.6 \\
            m &= 38.6 \, g
        \end{align}
        $$

        In SI units, the approximate value is:

        $$
        m \approx 0.04 \, ~\text{kg}
        $$

---

## Moment of Inertia

The moment of inertia represents how much the drone resists changes in angular velocity about a particular axis. Unlike mass, it depends not only on the amount of matter but also on how that matter is distributed relative to the axis of rotation.  

Since the drone can rotate around three axes, it has three corresponding moments of inertia.

![Moment of Inertia](images/moment_of_inertia.svg){: width=60% style="display: block; margin: auto;" }

!!! question "Exercise 3.2"

    We can estimate the drone’s moments of inertia using a simplified model[^1]:

    - Treat the [battery](https://store.bitcraze.io/collections/spare-parts-crazyflie-brushless/products/350mah-lipo-battery){target=_blank} as a rectangular block.
    - Treat the [motors](https://store.bitcraze.io/collections/spare-parts-crazyflie-brushless/products/crazyflie-2-1-brushless-08028-10000kv-brushless-motor){target=_blank} with [propellers](https://store.bitcraze.io/collections/spare-parts-crazyflie-brushless/products/propeller-55-35-4ccw-4cw-green){target=_blank} and [mounts](https://store.bitcraze.io/collections/spare-parts-crazyflie-brushless/products/crazyflie-2-1-brushless-5-x-legs-5-x-guards){target=_blank} as point masses.

    [^1]: We are neglecting the PCB structure, as its mass is small compared to the battery and motors, and it lies close to the center of mass.

    Determine the total moment of inertia of the drone about each axis. The dimensions and masses can be obtained from the technical specifications on Bitcraze’s website (links provided above).

    ??? info "Solution"

        The battery has mass $9.10 ~\text{g}$ and dimensions $3.3 \times 2.0 \times 0.8 ~\text{cm}$:

        $$
        \left\{
        \begin{align}
            m_b &= 9.10 ~\text{g}\\
            a &= 3.3 ~\text{cm}\\
            b &= 2.0 ~\text{cm}\\
            c &= 0.8 ~\text{cm}
        \end{align}
        \right.
        $$

        Using the standard formulas for the moment of inertia of a rectangular block, we can calculate the battery moment of inertia around each axis:

        ![Moment of Inertia Battery](images/moment_of_inertia_battery.svg){: width=60% style="display: block; margin: auto;" }

        $$
        \begin{align}
            I_{b_{xx}} &= \frac{m_b}{12} (b^2 + c^2)
            &
            I_{b_{yy}} &= \frac{m_b}{12} (a^2 + c^2)
            &
            I_{b_{zz}} &= \frac{m_b}{12} (a^2 + b^2)
            \\
            I_{b_{xx}} &= \frac{9.1}{12} (2.0^2 + 0.8^2)
            &
            I_{b_{yy}} &= \frac{9.1}{12} (3.3^2 + 0.8^2)
            &
            I_{b_{zz}} &= \frac{9.1}{12} (3.3^2 + 2.0^2)
            \\
            I_{b_{xx}} &= 3.52 ~\text{g·cm}^2
            &
            I_{b_{yy}} &= 8.74 ~\text{g·cm}^2
            &
            I_{b_{zz}} &= 12.29 ~\text{g·cm}^2
        \end{align}
        $$

        The motors ($2.30 ~\text{g}$) with propellers ($1.34 ~\text{g}$) and mounts ($0.33 ~\text{g}$) has a total mass of $3.97 ~\text{g}$ each and are located $10 ~\text{cm}$ apart diagonally:

        $$
        \left\{
        \begin{align}
            m_m &= 3.97 ~\text{g}\\
            l_x &= 5 \frac{\sqrt{2}}{2} ~\text{cm} \\
            l_y &= 5 \frac{\sqrt{2}}{2} ~\text{cm} \\
            l_z &= 5 ~\text{cm}
        \end{align}
        \right.
        $$

        Considering them as point masses, we can calculate its moment of inertia around each axis:

        ![Moment of Inertia Motors](images/moment_of_inertia_motors.svg){: width=60% style="display: block; margin: auto;" }

        $$
        \begin{align}
            I_{m_{xx}} &= m_m l_x^2
            &
            I_{m_{yy}} &= m_m l_y^2
            &
            I_{m_{zz}} &= m_m l_z^2
            \\
            I_{m_{xx}} &= 3.97 \left( 5\frac{\sqrt{2}}{2} \right)^2
            &
            I_{m_{yy}} &= 3.97 \left( 5\frac{\sqrt{2}}{2} \right)^2
            &
            I_{m_{zz}} &= 3.97 \cdot 5^2
            \\
            I_{m_{xx}} &= 49.62 ~\text{g·cm}^2
            &
            I_{m_{yy}} &= 49.62 ~\text{g·cm}^2
            &
            I_{m_{zz}} &= 99.25 ~\text{g·cm}^2
        \end{align}
        $$

        herefore, the total moments of inertia are the sum of the moments of inertia of the battery and the moments of inertia of the four motors:

        $$
        \begin{align}
            I_{xx} &= I_{b_{xx}} + 4 I_{m_{xx}}
            &
            I_{yy} &= I_{b_{yy}} + 4 I_{m_{yy}}
            &
            I_{zz} &= I_{b_{zz}} + 4 I_{m_{zz}}
            \\
            I_{xx} &= 3.52 + 4 \cdot 49.62
            &
            I_{yy} &= 8.74 + 4 \cdot 49.62
            &
            I_{zz} &= 12.29 + 4 \cdot 99.25
            \\
            I_{xx} &= 202.02 ~\text{g·cm}^2
            &
            I_{yy} &= 207.24 ~\text{g·cm}^2
            &
            I_{zz} &= 408.29 ~\text{g·cm}^2
        \end{align}
        $$

        In SI units, the approximate values ​​are:

        $$
        \left\{
        \begin{align}
            I_{xx} &\approx 2 \times 10^{-5} \, ~\text{kg·m}^2 \\
            I_{yy} &\approx 2 \times 10^{-5} \, ~\text{kg·m}^2 \\
            I_{zz} &\approx 4 \times 10^{-5} \, ~\text{kg·m}^2
        \end{align}
        \right.
        $$

<!-- ---
title: Inércia
icon: material/axis-z-rotate-counterclockwise
---

# :material-axis-z-rotate-counterclockwise: Inércia

Todo corpo resiste a mudanças em seu estado de movimento — essa resistência é o que chamamos de inércia.

No caso de um drone, que está livre para se mover e girar no espaço, a inércia se manifesta de duas formas principais, e ambas são fundamentais para entender como ele responde aos comandos de controle:

- Massa — representa a resistência a movimentos lineares (como subir/descer, avançar/recuar ou deslocar-se lateralmente). É a chamada inércia translacional.
- Momento de inércia — representa a resistência a movimentos angulares (como rolar, inclinar ou guinar). É a chamada inércia rotacional.

Controlar bem um drone exige compreender essas duas formas de inércia — e como elas influenciam as acelerações que conseguimos impor a ele.

---

## Massa

A massa representa o quanto o drone resiste a mudanças na velocidade ao longo de um eixo de translação. Ela depende da quantidade de matéria e é a mesma em qualquer direção. Ou seja, não importa se o movimento é para cima, para frente ou para o lado: temos apenas uma única massa.

![Mass](images/mass.svg){: width="500" style="display: block; margin: auto;" }

!!! question "Exercício 1"

    Podemos calcular a massa do drone somando a massa de seus componentes:
    
    - O [drone](https://www.bitcraze.io/products/crazyflie-2-1-brushless/){target=_blank} que já considera bateria, PCB, motores, hélices, etc.
    - O [módulo de expansão](https://www.bitcraze.io/products/flow-deck-v2/){target=_blank} que é acoplado embaixo

    Determine a massa total do drone somando a massa de seus componentes. Elas podem ser obtidas nas especificações técnicas no site da Bitcraze (cujos links foram disponibilizados acima).
            
    ??? info "Resposta"
        $$
        \begin{align}
            m &= m_{cf} + m_{fd} \\
            m &= 37 + 1,6 \\
            m &= 38,6 g
        \end{align}
        $$

---

## Momento de Inércia

O momento de inércia representa o quanto o drone resiste a mudanças na velocidade angular em torno de um eixo de rotação. Ao contrário da massa, ele depende não apenas da quantidade de matéria, mas também de como ela está distribuída em relação ao eixo de rotação. Como o drone pode girar em torno de três eixos (rolagem, inclinação e guinagem), ele possui três momentos de inércia: um para cada eixo.

![Moment of Inertia](images/moment_of_inertia.svg){: width="500" style="display: block; margin: auto;" }

!!! question "Exercício 2"

    Podemos calcular os momentos de inércia do drone considerando um modelo mais simples[^1]:
    
    - A [bateria](https://store.bitcraze.io/collections/spare-parts-crazyflie-brushless/products/350mah-lipo-battery){target=_blank} como um paralelepípedo
    - Os [motores](https://store.bitcraze.io/collections/spare-parts-crazyflie-brushless/products/crazyflie-2-1-brushless-08028-10000kv-brushless-motor){target=_blank} com  [hélices](https://store.bitcraze.io/collections/spare-parts-crazyflie-brushless/products/propeller-55-35-4ccw-4cw-green){target=_blank} e [suportes](https://store.bitcraze.io/collections/spare-parts-crazyflie-brushless/products/crazyflie-2-1-brushless-5-x-legs-5-x-guards){target=_blank} como massas puntiformes

    [^1]: Estamos desprezando a estrutura de PCB do drone, já que sua massa é pequena comparada à da bateria e dos motores, além de estar concentrada próxima ao centro de massa.

    Determine a momento de inércia total do drone em torno de cada um de seus eixos. As dimensões necessárias podem ser obtidas com o auxílio de um paquímetro, já as massas podem ser obtidas nas especificações técnicas no site da Bitcraze (cujos links foram disponibilizados acima).
            
    ??? info "Resposta"
        A bateria possui $9,10 \, g$ de massa e dimensões $3,3 \times 2,0 \times 0,8 \, cm$: 
        
        $$
        \left\{
        \begin{align}
            m_b &= 9,10 \, g\\
            a &= 3,3 \, cm\\
            b &= 2,0 \, cm\\
            c &= 0,8 \, cm\\
        \end{align}
        \right.
        $$

        Assim, usando uma tabela de momentos de inércia de um paralelepípedo temos que:

        ![Moment of Inertia Battery](images/moment_of_inertia_battery.svg){: width="500" style="display: block; margin: auto;" }

        $$
        \begin{align}
            I_{b_{xx}} &= \frac{m_b}{12} (b^2 + c^2) & \quad I_{b_{yy}} &= \frac{m_b}{12} (a^2 + c^2) & \quad I_{b_{zz}} &= \frac{m_b}{12} (a^2 + b^2) \\
            I_{b_{xx}} &= \frac{9,1}{12} (2,0^2 + 0,8^2) & \quad I_{b_{yy}} &= \frac{9,1}{12} (3,3^2 + 0,8^2) & \quad I_{b_{zz}} &= \frac{9,1}{12} (3,3^2 + 2,0^2) \\
            I_{b_{xx}} &= 3,52 \, g.cm^2 & \quad I_{b_{yy}} &= 8,74 \, g.cm^2 & \quad I_{b_{zz}} &= 12,29 \, g.cm^2 \\
        \end{align}
        $$

        Os motores ($2,30 \, g$), com hélices ($1,34 \, g$) e suportes ($0,33 \, g$), possuem $3,97 \, g$ de massa total e estão a $10 \, cm$ de distância na diagonal: 
        
        $$
        \left\{
        \begin{align}
            m_m &= 3,97 \, g\\
            l_x &= 5 \frac{\sqrt{2}}{2} \, cm \\
            l_y &= 5 \frac{\sqrt{2}}{2} \, cm \\
            l_z &= 5 \, cm\\
        \end{align}
        \right.
        $$

        Assim, considerando eles como massas puntiformes temos que:

        ![Moment of Inertia Motors](images/moment_of_inertia_motors.svg){: width="500" style="display: block; margin: auto;" }

        $$
        \begin{align}
            I_{m_{xx}} &= m_m l_x^2 & \quad I_{m_{yy}} &= m_m l_y^2 & \quad I_{m_{zz}} &= m_m l_z^2 \\
            I_{m_{xx}} &= 3,97 \cdot {\left( 5,0 \frac{\sqrt{2}}{2} \right)}^2 & \quad I_{m_{yy}} &= 3,97 \cdot {\left( 5,0 \frac{\sqrt{2}}{2} \right)}^2 & \quad I_{m_{zz}} &= 3,97 \cdot 5,0^2 \\
            I_{m_{xx}} &= 49,62 \, g.cm^2 & \quad I_{m_{yy}} &= 49,62 \, g.cm^2 & \quad I_{m_{zz}} &= 99,25 \, g.cm^2 \\
        \end{align}
        $$

        Dessa forma, os momentos de inércia totais são dados por:

        $$
        \begin{align}
            I_{xx} &= I_{b_{xx}} + 4 I_{m_{xx}} & \quad I_{yy} &= I_{b_{yy}} + 4 I_{m_{yy}} & \quad I_{zz} &= I_{b_{zz}} + 4 I_{m_{zz}} \\
            I_{xx} &= 3,52 + 4 \cdot 49,62 & \quad I_{yy} &= 8,74 + 4 \cdot 49,62 & \quad I_{zz} &= 12,29 + 4 \cdot 99,25 \\
            I_{xx} &= 202,02 \, g.cm^2 & \quad I_{yy} &= 207,24 \, g.cm^2 & \quad I_{zz} &= 408,29 \, g.cm^2 \\
        \end{align}
        $$	

        Ou, de forma aproximada, e no S.I. (Sistema Internacional de Unidades):

        $$
        \begin{align}
            I_{xx} &= 2 \cdot 10^{-5} \, kg.m^2 & \quad I_{yy} &= 2 \cdot 10^{-5} \, kg.m^2 & \quad I_{zz} &= 4 \cdot 10^{-5} \, kg.m^2 \\
        \end{align}
        $$ -->


​