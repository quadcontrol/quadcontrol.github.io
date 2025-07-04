# Mixer

Esta seção descreve as forças e torques que atuam em um quadricóptero e como elas influenciam o seu comportamento dinâmico.

---

## Movimentos básicos de um quadricóptero

Um quadricóptero possui 4 hélices que, uma vez em movimento com velocidades angulares $\omega_1$, $\omega_2$, $\omega_3$ e $\omega_4$, produzem 4 forças de sustentação $f_1$, $f_2$, $f_3$ e $f_4$ e 4 torques de arrasto $\tau_1$, $\tau_2$, $\tau_3$ e $\tau_4$, conforme a figura abaixo.

![Quadcopter1](images/quadcopter1.pdf){: width="500" style="display: block; margin: auto;" }

Para um quadricóptero se movimentar verticalmente, basta variar as velocidades angulares das 4 hélices simultaneamente, conforme a figura abaixo.

Enquanto que, para um quadricóptero rotacionar em torno de seus eixos, basta variar as velocidades angulares de 2 hélices simultaneamente, conforme a figura abaixo.


!!! question "Exercício 1"

    Sobre os movimentos de um quadricóptero, determine as respostas a seguir. 
        
    ??? info "a) Quantas formas diferentes é possível transladar um quadricóptero"
        3 (ao longo dos eixos $x$, $y$ e $z$)

    ??? info "b) Quantas formas diferentes é possível rotacionar um quadricóptero"
        3 (em torno dos eixos $x$, $y$ e $z$) 

    ??? info "c) Quantos graus de liberdade possui um quadricóptero"
        6 (3 de translação + 3 de rotação) 

    ??? info "d) Como o quadricóptero realiza movimentos de translação no plano (eixos $x$ e $y$)"
        Através de uma composição de movimentos de translação (ao longo do eixo $z$) e rotação (em torno dos eixos $x$ e $y$) 

---

## Transformação de entradas

As 4 forças $f_i$ e 4 torques $\tau_i$ das hélices podem ser representadas por 1 única força de propulsão total $f_t$ e 3 torques $\tau_x$, $\tau_y$ e $\tau_z$, um em torno de cada eixo do quadricóptero, conforme a figura abaixo.

![Quadcopter2](images/quadcopter2.pdf){: width="500" style="display: block; margin: auto;" }

Na secção de [aerodinâmica](../basic_concepts/aerodynamics.md) verificamos que as forças e torques das hélices são proporcionais ao quadrado de suas velocidades angulares:

$$
\left\{
\begin{array}{l}
    f_i = k_l \omega_i^2 \\
    \tau_i = k_d \omega_i^2 \\
\end{array}
\right.
$$
    
Isso significa que as 4 equações determinadas anteriormente podem ser escritas no formato matricial:

$$
\begin{bmatrix}
    f_t \\
    \tau_x \\
    \tau_y \\
    \tau_z
\end{bmatrix}
= M 
\begin{bmatrix}
    \omega_1^2 \\
    \omega_2^2 \\
    \omega_3^2 \\
    \omega_4^2
\end{bmatrix}
$$

Onde $M$ é uma matriz $4\times4$ que transforma as velocidades angulares das hélices na força total e nos torques de um quadricóptero.

!!! question "Exercício 2"

    Determine a matriz $M$ em função das constantes de sustentação e arrasto da hélice $k_l$ e $k_d$ e do comprimento $l$. 
        
    ??? info "Resposta"
        $$
        M = 
        \begin{bmatrix} 
            k_l & k_l & k_l & k_l \\ 
            -k_l l & -k_l l & k_l l & k_l l \\ 
            -k_l l & k_l l & k_l l & -k_l l  \\ 
            -k_d & k_d & -k_d & k_d 
        \end{bmatrix}
        $$

Para obter as velocidades angulares das hélices em função da força total e dos torques, basta multiplicar a equação anterior pela matriz inversa $M^{-1}$:

$$
\begin{bmatrix}
    \omega_1^2 \\
    \omega_2^2 \\
    \omega_3^2 \\
    \omega_4^2
\end{bmatrix}
= M^{-1} 
\begin{bmatrix}
    f_t \\
    \tau_x \\
    \tau_y \\
    \tau_z
\end{bmatrix}
$$

!!! question "Exercício 3"

    Determine a matriz inversa $M^{-1}$ (dica: utilize o Symbolic Math Toolbox do MATLAB).
        
    ??? info "Resposta"
        $$
        M^{-1} = 
        \begin{bmatrix} 
            \frac{1}{4 k_l} & - \frac{1}{4 k_l l} & - \frac{1}{4 k_l l} & - \frac{1}{4 k_d}  \\ 
            \frac{1}{4 k_l} & - \frac{1}{4 k_l l} & \frac{1}{4 k_l l} & \frac{1}{4 k_d} \\ 
            \frac{1}{4 k_l} & \frac{1}{4 k_l l} & \frac{1}{4 k_l l} & - \frac{1}{4 k_d} \\ 
            \frac{1}{4 k_l} & \frac{1}{4 k_l l} & - \frac{1}{4 k_l l} & \frac{1}{4 k_d} 
        \end{bmatrix}
        $$


    
