# Aerodynamics - Basic concepts

---
    
## Aerofólio

O modelo matemático de um drone, qualquer que seja seu tipo, contém diversos parâmetros aerodinâmicos. No entanto, para obter o conhecimento necessário, começaremos examinando as forças aerodinâmicas em um aerofólio.

---

### Forças aerodinâmicas

A figura abaixo mostra a secção transversal de um aerofólio, um corpo teórico moldado para produzir sustentação quando colocado em um fluxo de ar. 

![Aerofólio](images/aerofolio.png)
    
Apesar de um aerofólio ser projetado para produzir uma força desejada de sustentação $f_l$ (perpendicular à velocidade $v$), ele também produz uma força indesejada e arrasto $f_d$ (paralela à velocidade $v$). 

As forças de sustentação e arrasto são dadas por:

$$
f_l = \frac{1}{2} \rho A C_l v^2 
\hspace{5cm}
f_d = \frac{1}{2} \rho A C_d v^2 
$$

Onde:

- $\rho$ - Densidade do ar ($kg/m^3$)
- $A$ - Área de superfície ($m^2$)
- $C_l$ - Coeficiente de sustentação (adimensional)
- $C_d$ - Coeficiente de arrasto (adimensional)
- $v$ - Velocidade linear do aerofólio ($m/s$)

---

### Coeficientes aerodinâmicos

Os coeficientes aerodinâmicos não são constantes, eles variam conforme as seguintes condições aerodinâmicas:

- Ângulo de ataque ($\alpha$), que é o ângulo que a linha média do aerofólio (também chamada de ``corda'') faz com o vetor velocidade
- Número de Reynolds ($\frac{\rho v D}{\mu}$), que é uma medida adimensional e define o regime de escoamento do ar (laminar ou turbulento)
- Número Mach ($\frac{v}{v_s}$), que é a razão entre a velocidade e a velocidade do som e define o regime de velocidade (subsônica, supersônica e hipersônica)

Para aerofólios que se movem a velocidades subsônicas ($<1.000km/h$), apenas o ângulo de ataque $\alpha$, representado na figura abaixo, acaba apresentando uma influência significativa.

![Aerofólio com ângulo de ataque](images/aerofolio_com_angulo_ataque.png)

Há diversos perfils diferentes para um aerfofólio. Um bastante conhecido e utilizado é o perfil Clark Y, cujos coeficientes de arrasto e sustentação em função do ângulo de ataque são bem conhecidos e dados\footnote{Assumindo que o número de Reynolds e o número Mach permaneçam dentro de uma determinada faixa de valores} pelo gráfico da Figura \ref{fig/graficos/grafico_coeficientes_aerodinamicos_perfil_clark_y}.


![Coeficientes aerodinâmicos de um aerofólio com perfil Clark Y](images/coeficientes_aerodinamicos_perfil_clark_y.png)

Enquanto o coeficiente de arrasto só aumenta com o ângulo de ataque, o coeficiente de sustentação tem um ponto máximo (aproximadamente em $\alpha=18^{\circ}$). Esse ponto é conhecido como ``estol'' ou simplesmente ``perda de sustentação'', e ele ocorre quando o fluxo de ar descola da asa (deixa de seguir o contorno superior da asa gerando uma turbulência).

---

### Drone de asas fixas

!!! question "Exercício 1"

    Vamos considerar um drone de asa fixa (asa voadora) em cruzeiro, isto é, voando no plano com velocidade constante. Considere que esse drone possui as seguintes características[^1]:
    
    [^1]: Considere $g = 9,81\text{m/s}^2$ e $\rho = 1,225\text{kg/m}^3$
    
    - Massa de $30g$ e comprimento de $9cm$
    - Asas perfil Clark Y com $9cm$ de envergadura
    - Propulsores com $60\%$ de eficiência 
    - Bateria de $3,7V$ e $250mAh$
        
    ??? info "a) Desenhe o diagrama de corpo livre das forças que atuam nesse drone"

    ??? info "b) Determine a área total das asas do drone assumindo que seu corpo é triangular"
        $$
        \begin{align*}
            A &= \frac{9 \cdot 9}{2} \\
            A &= 40,5 \text{cm}^2
        \end{align*}
        $$

    ??? info "c) Determine os coeficientes de arrasto e sustentação das asas do drone"
        $$
        \begin{align*}
            C_l &= 0,35 \\
            C_d &= 0,02
        \end{align*}
        $$

    ??? info "d) Determine a velocidade do drone"
        $$
        \begin{align*}
            \sum f_y &= 0 \\
            f_l - f_p &= 0 \\
            \frac{1}{2} \rho A C_l v^2 - mg &= 0 \\
            v &= \sqrt{\frac{2mg}{\rho AC_l}} \\
            v &= \sqrt{\frac{2 \cdot 0,03 \cdot 9,81}{1,225 \cdot 40,5 \times 10^{-4} \cdot 0,35}} \\
            v &= 18,41 \text{m/s} \quad (\approx 66\text{km/h})
        \end{align*}
        $$

    ??? info "e) Determine a força de empuxo dos propulsores do drone"
        $$
        \begin{align*}
            \sum f_x &= 0 \\
            f_e - f_d &= 0 \\
            f_e - \frac{1}{2} \rho A C_d v^2  &= 0 \\
            f_e &= \frac{1}{2} \rho A C_d v^2 \\
            f_e &= \frac{1}{2} 1,225 \cdot 40,5 \times 10^{-4} \cdot 0,02 \cdot 18,41^2 \\
            f_e &= 0,0168 \text{N}
        \end{align*}
        $$
    
    ??? info "f) Determine o consumo energético do drone"
        $$
        \begin{align*}
            P_m &= f_e v \\
            P_m &= 0,0168 \cdot 18,41 \\
            P_m &= 0,310 \text{W}
        \end{align*}
        $$

        $$
        \begin{align*}
            \eta &= \frac{P_m}{P_e} \\
            P_e &= \frac{P_m}{\eta} \\
            P_e &= \frac{0,310}{0,6} \\
            P_e &= 0,516 \text{W}
        \end{align*}
        $$

    ??? info "g) Determine quanto tempo que o drone consegue permanecer no ar"
        $$
        \begin{align*}
            E &= P_e \Delta t \\
            e_s i_s &= P_e \Delta t \\
            \Delta t &= \frac{e_s i_s}{P_e} \\
            \Delta t &= \frac{3,7 (\cdot 0,25 \cdot 3600)}{0,516} \\
            \Delta t &= 6.453\text{s} \quad (\approx 1\text{h}48\text{min})
        \end{align*}
        $$
 
---

## Hélice

Uma hélice é composta por $n$ pás, onde cada pá pode ser interpretada como um aerofólio.

---

### Forças e torques aerodinâmicos

Quando a hélice rotaciona, surgem forças de sustentação e arrasto em cada uma de suas pás, conforme a figura abaixo:

![Hélice com forças de sustentação e arrasto nas pás](images/helice_1.png)

Onde:

- $d$ - Distância do centro de pressão ao eixo de rotação ($m$)
- $\omega$ - Velocidade angular da hélice ($rad/s$)

!!! question "Exercício 2"
    Escreva as forças de sustentação e arrasto nas pás da hélice em função de sua velocidade angular
    ??? info "Resposta"
        $$
        \begin{align*}
            f_{l_{1,2}} &= \frac{1}{2} \rho A C_l v^2 \\ 
            f_{l_{1,2}} &= \frac{1}{2} \rho A C_l (\omega d )^2 \\
            f_{l_{1,2}} &= \frac{1}{2} \rho A C_l d^2 \omega^2 
        \end{align*}
        $$

        $$
        \begin{align*}
            f_{d_{1,2}} &= \frac{1}{2} \rho A C_d v^2 \\ 
            f_{d_{1,2}} &= \frac{1}{2} \rho A C_d (\omega d )^2 \\
            f_{d_{1,2}} &= \frac{1}{2} \rho A C_d d^2 \omega^2 
        \end{align*}
        $$

As forças de sustentação e arrasto em cada uma das pás podem ser representadas por uma única força de sustentação e torque de arrasto total, conforme a figura abaixo.

![Hélice com força de sustentação e torque de arrasto total](images/helice_2.png)

!!! question "Exercício 3"
    Determine a força de sustentação e torque de arrasto total
    ??? info "Resposta"
        $$
        \begin{align*}
            f_l &= 2 f_{l_{1,2}} \\
            f_l &= 2 \left( \frac{1}{2} \rho A C_l d^2 \omega^2  \right) \\
            f_l &= \rho A C_l d^2 \omega^2 
        \end{align*}
        $$

        $$
        \begin{align*}
            \tau_d &= 2 \left( d f_{d_{1,2}} \right) \\ 
            \tau_d &= 2 \left( d \left( \frac{1}{2} \rho A C_d d^2 \omega^2 \right) \right) \\
            \tau_d &= \rho A C_d d^3 \omega^2 
        \end{align*}
        $$

Como todos os parâmetros são constantes e apenas a velocidade angular $\omega$ varia, a força de sustentação e o torque de arrasto total podem ser simplificados por:

$$
f_l = \underbrace{\rho A C_l d^2}_{k_l} \omega^2 
\hspace{5cm}
\tau_d = \underbrace{\rho A C_d d^3}_{k_d} \omega^2 
$$

Onde:

- $k_l$ - Coeficiente de sustentação da hélice ($N.s^2/rad^2$)
- $k_d$ - Coeficiente de arrasto da hélice ($N.m.s^2/rad^2$)

---

### Constantes aerodinâmicas

Ou seja, apenas dois parâmetros definem a força e o torque que uma hélice produz, que dependem do quadrado de sua velocidade angular:
$$
f_l = k_l \omega^2 
\hspace{5cm}
\tau_d = k_d \omega^2 
$$

!!! question "Exercício 4"
    Com o auxílio de uma régua, estime\footnote{Estamos preocupados apenas com a ordem de grandeza dos resultados} as constantes aerodinâmicas das hélices do Bitcraze Crazyflie e anote elas abaixo. Assuma que a hélice pode ser aproximada a um perfil Clark Y com ângulo de ataque $\alpha = 5^\circ$, sendo a constante de sustentação igual porém a constante de arrasto 10x maior devido à turbulência gerada pela hélice.
    ??? info "Resposta"
        $$
        \begin{align*}
            k_l &= 2 \left( \frac{1}{2} \rho A C_l d^2 \right) \\
            k_l &= 2 \left( \frac{1}{2} 1,225 \cdot (2,1 \times 10^{-2} \cdot 0,6 \times 10^{-2}) \cdot 0,7 \cdot (1,5 \times 10^{-2})^2 \right) \\
            k_l &= 2,43 \times10^{-8} \text{N.s}^2\text{/rad}^2
        \end{align*}
        $$

        $$
        \begin{align*}
            k_d &= 2 \left( \frac{1}{2} \rho A C_d d^2 \right) d \\
            k_d &= 2 \left( \frac{1}{2} 1,225 \cdot (2,1 \times 10^{-2} \cdot 0,6 \times 10^{-2}) \cdot 0,4 \cdot (1,5 \times 10^{-2})^2 \right) \cdot 1,5 \times 10^{-2} \\
            k_d &= 2,08 \times10^{-10} \text{N.m.s}^2\text{/rad}^2
        \end{align*}
        $$

Nos próximos capítulos iremos determinar essas mesmas constantes aerodinâmicas experimentalmente e a ordem de grandeza deve ser a mesma.

---

### Drone multi-rotor

    Vamos considerar um drone multi-rotor (quadricoptero) pariando no ar, isto é, parado no espaço. Considere que esse drone possui as seguintes características\footnote{Considere $g = 9,81\text{m/s}^2$ e $\rho = 1,225\text{kg/m}^3$}:
    \begin{itemize}
        - Massa de $30$g
        - Hélices com constante de sustentação de $1,5\times10^{-8} \text{N}.\text{s}^2/\text{rad}^2$ e constante de arrasto de $1,5\times10^{-10} \text{N}.\text{m}.\text{s}^2\text{/rad}^2$
        - Motores elétricos com $80$\% de eficiência 
        - Bateria de $3,7$V e $250$mAh
    \end{itemize}

    Desenhe o diagrama de corpo livre das forças que atuam nesse drone:
    
    \noindent\fbox
    {
        \begin{minipage}[c][4cm]{\textwidth}
        \ifgabarito
            \hspace{0.5cm}
        \else
            \hspace{0.5cm}
        \fi
        \end{minipage}
    } 
    \vspace{0.25cm}

    Determine a velocidade angular das hélices do drone:
    
    \noindent\fbox
    {
        \begin{minipage}[c][6cm]{\textwidth}
        \ifgabarito
            
            \begin{align*}
               \sum f_y &= 0 \\
                4 f_l - f_p &= 0 \\
                4 k_l \omega^2 - mg &= 0 \\
               \omega &= \sqrt{\frac{mg}{4 k_l}} \\
               \omega &= \sqrt{\frac{0,03 \cdot 9,81}{4 \cdot 1,5\times10^{-8}}} \\
               \omega &= 2.215 \text{rad/s} \quad (\approx 21.149\text{rpm})
            \end{align*}
        \else
            \hspace{0.5cm}
        \fi
        \end{minipage}
    } 
    \vspace{0.25cm}

    \newpage
    Determine o torque dos motores do drone:
    
    \noindent\fbox
    {
        \begin{minipage}[c][6cm]{\textwidth}
        \ifgabarito
            
            \begin{align*}
               \sum \tau &= 0 \\
               \tau_m - \tau_d &= 0 \\
                \tau_m - k_d \omega^2 &= 0 \\
                \tau_m &= k_d \omega^2 \\
                \tau_m &= 1,5 \times 10 ^{-10} \cdot 2215^2 \\
                \tau_m &= 0,000736 \text{N.m} \\
            \end{align*}
        \else
            \hspace{0.5cm}
        \fi
        \end{minipage}
    } 
    \vspace{0.25cm}
    
    Determine o consumo energético do drone:
    
    \noindent\fbox
    {
        \begin{minipage}[c][6cm]{\textwidth}
        \ifgabarito
            
            \begin{multicols}{2}
                \noindent
                \begin{align*}
                   P_m &= 4 \tau_m \omega \\
                   P_m &= 4 \cdot 0,000736 \cdot 2215 \\
                   P_m &= 6,52 \text{W}
                \end{align*}
                \begin{align*}
                   \eta &= \frac{P_m}{P_e} \\
                   P_e &= \frac{P_m}{\eta} \\
                   P_e &= \frac{7,33}{0,8} \\
                   P_e &= 8,15 \text{W}
                \end{align*}
            \end{multicols}
        \else
            \hspace{0.5cm}
        \fi
        \end{minipage}
    } 
    \vspace{0.25cm}

    Determine quanto tempo que o drone consegue permanecer no ar:
    
    \noindent\fbox
    {
        \begin{minipage}[c][6cm]{\textwidth}
        \ifgabarito
            
            \begin{align*}
               E &= P_e \Delta t \\
                e_s i_s &= P_e \Delta t \\
                \Delta t &= \frac{e_s i_s}{P_e} \\
                \Delta t &= \frac{3,7 (\cdot 0,25 \cdot 3600)}{8,15} \\
                \Delta t &= 409\text{s} \quad (\approx 7\text{min})
            \end{align*}
        \else
            \hspace{0.5cm}
        \fi
        \end{minipage}
    } 
    \vspace{0.25cm}

    Compare este resultado, do drone multi rotor, com o anterior, do drone de asas fixa. Note como o drone de asa fixa consegue permanecer muito mais tempo no ar (quase 15x mais), com a desvatagem de não conseguir permanecer parado e nem decolar/pousar na vertical como um drone multi-rotor.