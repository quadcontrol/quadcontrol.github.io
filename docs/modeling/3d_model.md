# Modelo 3D

Agora, vamos deduzir as equações diferenciais que descrevem a dinâmica 3D de um quadricóptero. Neste modelo completo, o drone pode se mover e girar livremente no espaço, o que traz toda a riqueza — e também a dificuldade — do problema. Para representá-lo, será necessário recorrer à álgebra vetorial e às matrizes de rotação, que permitem descrever posições, velocidades e orientações em três dimensões.

---

## Introdução

A dinâmica 3D possui 6 graus de liberdade (3 de translação e 3 de rotação) e, portanto, devemos obter 12 equações diferenciais (2 para cada grau de liberdade).

![](images/3d_drone.svg){: width="800" style="display: block; margin: auto;" }

É muito mais fácil trabalhar com a notação vetorial e aplicar as equações de Newton-Euler 2 vezes (uma para translação e outra para rotação) do que 6 vezes com a notação escalar (uma para cada grau de liberdade).

As posições e ângulos serão descritos no sistema de coordenadas inercial, já as velocidades lineares e angulares no sistema de coordenadas móvel. Dessa forma, os vetores de estados do nosso sistema serão ${\color{magenta}\vec{r}}$, ${\color{magenta}\vec{\delta}}$, ${\color{cyan}{\vec{v}}\,'}$ e ${\color{cyan}{\vec{\omega}}\,'}$, onde:

$$
{\color{magenta}\vec{r}}
=
\begin{bmatrix}
    {\color{magenta}x} \\
    {\color{magenta}y} \\
    {\color{magenta}z} \\
\end{bmatrix}
\qquad
{\color{magenta}\vec{\delta}}
=
\begin{bmatrix}
    {\color{magenta}\phi} \\
    {\color{magenta}\theta} \\
    {\color{magenta}\psi} \\
\end{bmatrix}
\qquad
{\color{cyan}{\vec{v}}\,'}
=
\begin{bmatrix}
    {\color{cyan}v_x\,'} \\
    {\color{cyan}v_y\,'} \\
    {\color{cyan}v_z\,'} \\
\end{bmatrix}
\qquad
{\color{cyan}{\vec{\omega}}\,'}
=
\begin{bmatrix}
    {\color{cyan}\omega_x\,'} \\
    {\color{cyan}\omega_y\,'} \\
    {\color{cyan}\omega_z\,'} \\
\end{bmatrix}
\qquad
$$

---

## Cinemática

Já deduzimos a matriz de rotação utilizando os ângulos de Euler:

$$
\begin{bmatrix}
    {\color{magenta}x} \\
    {\color{magenta}y} \\
    {\color{magenta}z} \\
\end{bmatrix}
=
\underbrace{
\begin{bmatrix}
    \cos{\color{magenta}\theta}\cos{\color{magenta}\psi} & \cos{\color{magenta}\theta}\sin{\color{magenta}\psi} & -\sin{\color{magenta}\theta} \\ 
    - \cos{\color{magenta}\phi}\sin{\color{magenta}\psi} + \sin{\color{magenta}\phi}\sin{\color{magenta}\theta}\cos{\color{magenta}\psi}  & \cos{\color{magenta}\phi}\cos{\color{magenta}\psi} + \sin{\color{magenta}\phi}\sin{\color{magenta}\theta}\sin{\color{magenta}\psi} & \sin{\color{magenta}\phi}\cos{\color{magenta}\theta} \\ 
    \sin{\color{magenta}\phi}\sin{\color{magenta}\psi} + \cos{\color{magenta}\phi}\sin{\color{magenta}\theta}\cos{\color{magenta}\psi} & - \sin{\color{magenta}\phi}\cos{\color{magenta}\psi} + \cos{\color{magenta}\phi}\sin{\color{magenta}\theta}\sin{\color{magenta}\psi}  & \cos{\color{magenta}\phi}\cos{\color{magenta}\theta} 
\end{bmatrix}
}_{R}
\begin{bmatrix}
    {\color{cyan}x\,'} \\
    {\color{cyan}y\,'} \\
    {\color{cyan}z\,'} \\
\end{bmatrix}
$$

### Translação

!!! question "Exercício 1"

    Determine ${\color{magenta}\dot{\vec{r}}}$ em função dos estados do sistema.
    
    ??? info "Resposta"

        $$
        \begin{align*}
            {\color{magenta}\dot{\vec{r}}} &= R {\color{cyan}{\vec{v}}\,'} \\
            \begin{bmatrix}
                {\color{magenta}\dot{x}} \\
                {\color{magenta}\dot{y}} \\
                {\color{magenta}\dot{z}} \\
            \end{bmatrix}
            &=
            \begin{bmatrix}
                \cos{\color{magenta}\theta}\cos{\color{magenta}\psi} & \cos{\color{magenta}\theta}\sin{\color{magenta}\psi} & -\sin{\color{magenta}\theta} \\ 
                - \cos{\color{magenta}\phi}\sin{\color{magenta}\psi} + \sin{\color{magenta}\phi}\sin{\color{magenta}\theta}\cos{\color{magenta}\psi}  & \cos{\color{magenta}\phi}\cos{\color{magenta}\psi} + \sin{\color{magenta}\phi}\sin{\color{magenta}\theta}\sin{\color{magenta}\psi} & \sin{\color{magenta}\phi}\cos{\color{magenta}\theta} \\ 
                \sin{\color{magenta}\phi}\sin{\color{magenta}\psi} + \cos{\color{magenta}\phi}\sin{\color{magenta}\theta}\cos{\color{magenta}\psi} & - \sin{\color{magenta}\phi}\cos{\color{magenta}\psi} + \cos{\color{magenta}\phi}\sin{\color{magenta}\theta}\sin{\color{magenta}\psi}  & \cos{\color{magenta}\phi}\cos{\color{magenta}\theta} 
            \end{bmatrix}
            \begin{bmatrix}
                {\color{cyan}v_x\,'} \\
                {\color{cyan}v_y\,'} \\
                {\color{cyan}v_z\,'} \\
            \end{bmatrix} \\
            \begin{bmatrix}
                {\color{magenta}\dot{x}} \\
                {\color{magenta}\dot{y}} \\
                {\color{magenta}\dot{z}} \\
            \end{bmatrix}
            &=
            \begin{bmatrix}
                {\color{cyan}v_x\,'} \cos{\color{magenta}\theta}\cos{\color{magenta}\psi} + {\color{cyan}v_y\,'} \cos{\color{magenta}\theta}\sin{\color{magenta}\psi} - {\color{cyan}v_z\,'} \sin{\color{magenta}\theta} \\
                {\color{cyan}v_x\,'} \left( - \cos{\color{magenta}\phi}\sin{\color{magenta}\psi} + \sin{\color{magenta}\phi}\sin{\color{magenta}\theta}\cos{\color{magenta}\psi} \right) + {\color{cyan}v_y\,'} \left( \cos{\color{magenta}\phi}\cos{\color{magenta}\psi} + \sin{\color{magenta}\phi}\sin{\color{magenta}\theta}\sin{\color{magenta}\psi} \right) + {\color{cyan}v_z\,'} \sin{\color{magenta}\phi}\cos{\color{magenta}\theta} \\
                {\color{cyan}v_x\,'} \left( \sin{\color{magenta}\phi}\sin{\color{magenta}\psi} + \cos{\color{magenta}\phi}\sin{\color{magenta}\theta}\cos{\color{magenta}\psi} \right) + {\color{cyan}v_y\,'} \left( - \sin{\color{magenta}\phi}\cos{\color{magenta}\psi} + \cos{\color{magenta}\phi}\sin{\color{magenta}\theta}\sin{\color{magenta}\psi} \right) + {\color{cyan}v_z\,'} \cos{\color{magenta}\phi}\cos{\color{magenta}\theta} \\
            \end{bmatrix}
        \end{align*}
        $$


### Rotação

!!! question "Exercício 2"

    Determine ${\color{magenta}\dot{\vec{\delta}}}$ em função dos estados do sistema.
    
    ??? info "Resposta"

        Suponhamos que o referencial móvel esteja em movimento rotacional em torno da origem, cujo vetor velocidade angular ${\color{cyan}\vec{\omega}\,'}$ é dado por:
        
        $$
        {\color{cyan}\vec{\omega}\,'} = 
        \begin{bmatrix}
            {\color{cyan}\omega_x\,'} \\
            {\color{cyan}\omega_y\,'} \\
            {\color{cyan}\omega_z\,'}
        \end{bmatrix}
        $$

        Como o vetor ${\color{magenta}\vec{r}}$ é fixo no sistema de coordenadas inercial, sua derivada temporal, vista pelo sistema inercial, é nula:
        
        $$
            {\color{magenta}\dot{\vec{r}}} = \vec{0}
        $$

        Por outro lado, sua derivada temporal, vista pelo sistema fixo ao corpo, depende do vetor velocidade angular do sistema fixo ao corpo(1):
        {.annotate}

        1. O sinal negativo aparece porque, se o sistema de coordenadas do corpo gira em uma direção, o vetor será visto pelo sistema fixo ao corpo como girando na direção oposta.
                
        $$
            {\color{cyan}\dot{\vec{r}}\,'} = -{\color{cyan}\vec{\omega}\,'}\times{\color{cyan}\vec{r}\,'}
        $$
    
        Outra forma de representar essa equação é:
        
        $$
            {\color{cyan}\dot{\vec{r}}\,'} = -{\color{cyan}\tilde{\omega}\,'}{\color{cyan}\vec{r}\,'}
        $$

        Onde $\tilde{\omega},'$ é a velocidade angular representada como uma matriz antissimétrica correspondente ao seu produto vetorial:
        
        $$
            {\color{cyan}\tilde{\omega}\,'} = {\color{cyan}\vec{\omega}\,'} \times =
            \begin{bmatrix}
                0 & -{\color{cyan}\omega_z\,'} & {\color{cyan}\omega_y\,'} \\
                {\color{cyan}\omega_z\,'} & 0 & -{\color{cyan}\omega_x\,'} \\
                -{\color{cyan}\omega_y\,'} & {\color{cyan}\omega_x\,'} & 0
            \end{bmatrix}
        $$

        Diferenciando a equação anterior e utilizando essa propriedade, obtém-se:
        
        \begin{align}
            {\color{cyan}\dot{\vec{r}}\,'} &= \frac{d}{dt} \left( {\color{cyan}\vec{r}\,'} \right) \nonumber \\
            {\color{cyan}\dot{\vec{r}}\,'} &= \frac{d}{dt} \left( R {\color{magenta}\vec{r}} \right) \nonumber \\ 
            {\color{cyan}\dot{\vec{r}}\,'} &= \dot{R}{\color{magenta}\vec{r}} + R \cancelto{\vec{0}}{{\color{magenta}\dot{\vec{r}}}} \nonumber \\ 
            {\color{cyan}\dot{\vec{r}}\,'} &= \dot{R} \left(R^T {\color{cyan}\vec{r}\,'}\right) \nonumber \\ 
            {\color{cyan}\dot{\vec{r}}\,'} &= \dot{R}R^T {\color{cyan}\vec{r}\,'}
        \end{align}

        Comparando essa equação com a anterior, é possível obter a matriz antissimétrica da velocidade angular em termos da matriz de rotação e sua derivada temporal:
        
        $$ 
            {\color{cyan}\tilde{\omega}\,'} = -\dot{R}R^T 
        $$
        
        Os ângulos de Euler não são um vetor e não podem ser facilmente isolados. Entretanto, substituindo $R$ e $\dot{R}$, as velocidades angulares podem ser escritas em função dos ângulos de Euler e de suas derivadas temporais em notação matricial:
        
        $$
            \begin{bmatrix}
                {\color{cyan}\omega_x\,'} \\
                {\color{cyan}\omega_y\,'} \\
                {\color{cyan}\omega_z\,'}
            \end{bmatrix}
            = 
            \begin{bmatrix}
                0 & \sin{\color{magenta}\phi} & -\cos{\color{magenta}\phi}\sin{\color{magenta}\theta} \\
                0 & \cos{\color{magenta}\phi} & \sin{\color{magenta}\phi}\sin{\color{magenta}\theta} \\
                1 & 0 & \cos{\color{magenta}\theta}
            \end{bmatrix}
            \begin{bmatrix}
                {\color{magenta}\dot{\phi}} \\
                {\color{magenta}\dot{\theta}} \\
                {\color{magenta}\dot{\psi}}
            \end{bmatrix}
        $$
        
        Invertendo a matriz acima, as derivadas temporais dos ângulos de Euler podem ser escritas em função deles próprios e das velocidades angulares:
        
        $$
            \begin{bmatrix}
                {\color{magenta}\dot{\phi}} \\
                {\color{magenta}\dot{\theta}} \\
                {\color{magenta}\dot{\psi}}
            \end{bmatrix}
            = 
            \frac{1}{\sin{\color{magenta}\theta}}
            \begin{bmatrix}
                \cos{\color{magenta}\phi}\cos{\color{magenta}\theta} & -\sin{\color{magenta}\phi}\cos{\color{magenta}\theta} & \sin{\color{magenta}\theta} \\
                \sin{\color{magenta}\phi}\sin{\color{magenta}\theta} & \cos{\color{magenta}\phi}\sin{\color{magenta}\theta} & 0 \\
                -\cos{\color{magenta}\phi} & \sin{\color{magenta}\phi} & 0
            \end{bmatrix}
            \begin{bmatrix}
                {\color{cyan}\omega_x\,'} \\
                {\color{cyan}\omega_y\,'} \\
                {\color{cyan}\omega_z\,'}
            \end{bmatrix}
        $$

        Esta última equação é a equação cinemática de um corpo rígido utilizando ângulos de Euler com a sequência de rotações $z-y-z$. Ela evidencia a singularidade que ocorre quando $\theta = 90^{\circ}$.

---

## Cinética

Já deduzimos as equações de Newton-Euler:
        
$$
\left\{
\begin{array}{l}
        {\color{cyan}\dot{\vec{v}}\,'} = - {\color{cyan}\vec{\omega}\,'} \times {\color{cyan}\vec{v}\,'} + \frac{1}{m} \sum {\color{cyan}\vec{f}\,'} \\ 
        {\color{cyan}\dot{\vec{\omega}}\,'} = - I^{-1} \left( {\color{cyan}\vec{\omega}\,'} \times I {\color{cyan}\vec{\omega}\,'} \right) + I^{-1} \sum {\color{cyan}\vec{\tau}\,'}
\end{array}
\right.
$$

### Translação

O vetor de forças do drone ${\color{cyan}\vec{f}_d\,'}$ é mais fácil de ser escrito no sistema de coordenadas móvel:

$$
{\color{cyan}\vec{f_d}\,'} = 
\begin{bmatrix}
    0 \\
    0 \\
    {\color{#65DD18}f_t} 
\end{bmatrix}
$$

!!! question "Exercício 3"

    Determine ${\color{cyan}\dot{\vec{v}}\,'}$ em função dos estados do sistema.

    Dics: substitua as somatórias de forças $\sum {\color{cyan}\vec{f}\,'}$ na equação de Newton-Euler de translação.
    
    ??? info "Resposta"

        $$
        \begin{align*}
            {\color{cyan}\dot{\vec{v}}\,'} &= - {\color{cyan}\vec{\omega}\,'} \times {\color{cyan}\vec{v}\,'} + \frac{1}{m} \sum {\color{cyan}\vec{f}\,'} \\ 
            {\color{cyan}\dot{\vec{v}}\,'} &= - {\color{cyan}\vec{\omega}\,'} \times {\color{cyan}\vec{v}\,'} + \frac{1}{m} \left( - m {\color{cyan}\vec{g}\,'} + {\color{cyan}\vec{f}_d\,'} \right) \\
            {\color{cyan}\dot{\vec{v}}\,'} &= - {\color{cyan}\vec{\omega}\,'} \times {\color{cyan}\vec{v}\,'} - R {\color{magenta}\vec{g}} + \frac{1}{m} {\color{cyan}\vec{f}_d\,'} \\ 
            \begin{bmatrix}
                {\color{cyan}\dot{v}_x\,'} \\
                {\color{cyan}\dot{v}_y\,'} \\
                {\color{cyan}\dot{v}_z\,'}
            \end{bmatrix}
            &=
            -
            \begin{bmatrix}
                {\color{cyan}\omega_x\,'} \\
                {\color{cyan}\omega_y\,'} \\
                {\color{cyan}\omega_z\,'}
            \end{bmatrix}
            \times
            \begin{bmatrix}
                {\color{cyan}v_x\,'} \\
                {\color{cyan}v_y\,'} \\
                {\color{cyan}v_z\,'}
            \end{bmatrix}
            -
            \begin{bmatrix} 
                    \text{c}{\color{magenta}\theta}\text{c}{\color{magenta}\psi} & \text{c}{\color{magenta}\theta}\text{s}{\color{magenta}\psi} & -\text{s}{\color{magenta}\theta} \\ 
                    - \text{c}{\color{magenta}\phi}\text{s}{\color{magenta}\psi} + \text{s}{\color{magenta}\phi}\text{s}{\color{magenta}\theta}\text{c}{\color{magenta}\psi}  & \text{c}{\color{magenta}\phi}\text{c}{\color{magenta}\psi} + \text{s}{\color{magenta}\phi}\text{s}{\color{magenta}\theta}\text{s}{\color{magenta}\psi} & \text{s}{\color{magenta}\phi}\text{c}{\color{magenta}\theta} \\ 
                    \text{s}{\color{magenta}\phi}\text{s}{\color{magenta}\psi} + \text{c}{\color{magenta}\phi}\text{s}{\color{magenta}\theta}\text{c}{\color{magenta}\psi} & - \text{s}{\color{magenta}\phi}\text{c}{\color{magenta}\psi} + \text{c}{\color{magenta}\phi}\text{s}{\color{magenta}\theta}\text{s}{\color{magenta}\psi}  & \text{c}{\color{magenta}\phi}\text{c}{\color{magenta}\theta} \end{bmatrix}
            \begin{bmatrix}
                0 \\
                0 \\
                g
            \end{bmatrix}
            + \frac{1}{m}
            \begin{bmatrix}
                0 \\
                0 \\
                {\color{#65DD18}f_t}
            \end{bmatrix} \\
            \begin{bmatrix}
                {\color{cyan}\dot{v}_x\,'} \\
                {\color{cyan}\dot{v}_y\,'} \\
                {\color{cyan}\dot{v}_z\,'}
            \end{bmatrix}
            &=
            \begin{bmatrix}
                - {\color{cyan}\omega_y\,' v_z\,'} + {\color{cyan}\omega_z\,' v_y\,'} + g \sin{\color{magenta}\theta} \\
                - {\color{cyan}\omega_z\,' v_x\,'} + {\color{cyan}\omega_x\,' v_z\,'} - g \sin{\color{magenta}\phi}\cos{\color{magenta}\theta} \\
                - {\color{cyan}\omega_x\,' v_y\,'} + {\color{cyan}\omega_y\,' v_x\,'} - g \cos{\color{magenta}\phi}\cos{\color{magenta}\theta} + \frac{1}{m} {\color{#65DD18}f_t}
            \end{bmatrix}
        \end{align*}
        $$

### Rotação

O vetor de torques do drone ${\color{cyan}\vec{\tau}_d\,'}$ é mais fácil de ser escrito no sistema de coordenadas móvel:

$$
{\color{cyan}\vec{\tau_d}\,'} = 
\begin{bmatrix}
    {\color{#65DD18}\tau_x} \\
    0 \\
    0
\end{bmatrix}
$$

!!! question "Exercício 4"

    Determine ${\color{cyan}\dot{\vec{\omega}}\,'}$ em função dos estados do sistema.

    Dics: substitua as somatórias de torques $\sum {\color{cyan}\vec{\tau}\,'}$ na equação de Newton-Euler de rotação.
    
    ??? info "Resposta"

        $$
        \begin{align*}
            {\color{cyan}\dot{\vec{\omega}}\,'} &= - I^{-1} \left( {\color{cyan}\omega\,'} \times I {\color{cyan}\vec{\omega}\,'} \right) + I^{-1} \sum {\color{cyan}\vec{\tau}\,'} \\ 
            {\color{cyan}\dot{\vec{\omega}}\,'} &= - I^{-1} \left( {\color{cyan}\omega\,'} \times I {\color{cyan}\vec{\omega}\,'} \right) + I^{-1} {\color{cyan}\vec{\tau}_d\,'} \\ 
            \begin{bmatrix}
                {\color{cyan}\dot{\omega}_x\,'} \\
                {\color{cyan}\dot{\omega}_y\,'} \\
                {\color{cyan}\dot{\omega}_z\,'}
            \end{bmatrix}
            &= -
            \begin{bmatrix}
                I_{xx} & 0 & 0 \\
                0 & I_{yy} & 0 \\
                0 & 0 & I_{zz}
            \end{bmatrix}^{-1}
            \left( 
            \begin{bmatrix}
                {\color{cyan}\omega_x\,'} \\
                {\color{cyan}\omega_y\,'} \\
                {\color{cyan}\omega_z\,'}
            \end{bmatrix}
            \times
            \begin{bmatrix}
                I_{xx} & 0 & 0 \\
                0 & I_{yy} & 0 \\
                0 & 0 & I_{zz}
            \end{bmatrix}
            \begin{bmatrix}
                {\color{cyan}\omega_x\,'} \\
                {\color{cyan}\omega_y\,'} \\
                {\color{cyan}\omega_z\,'}
            \end{bmatrix}
            \right)
            +
            \begin{bmatrix}
                I_{xx} & 0 & 0 \\
                0 & I_{yy} & 0 \\
                0 & 0 & I_{zz}
            \end{bmatrix}^{-1}
            \begin{bmatrix}
                {\color{#65DD18}\tau_x} \\
                {\color{#65DD18}\tau_y} \\
                {\color{#65DD18}\tau_z}
            \end{bmatrix} \\
            \begin{bmatrix}
                {\color{cyan}\dot{\omega}_x\,'} \\
                {\color{cyan}\dot{\omega}_y\,'} \\
                {\color{cyan}\dot{\omega}_z\,'}
            \end{bmatrix}
            &= -
            \begin{bmatrix}
                \frac{1}{I_{xx}} & 0 & 0 \\
                0 & \frac{1}{I_{yy}} & 0 \\
                0 & 0 & \frac{1}{I_{zz}}
            \end{bmatrix}
            \left( 
            \begin{bmatrix}
                {\color{cyan}\omega_x\,'} \\
                {\color{cyan}\omega_y\,'} \\
                {\color{cyan}\omega_z\,'}
            \end{bmatrix}
            \times
            \begin{bmatrix}
                I_{xx} {\color{cyan}\omega_x\,'} \\
                I_{yy} {\color{cyan}\omega_y\,'} \\
                I_{zz} {\color{cyan}\omega_z\,'}
            \end{bmatrix}
            \right)
            +
            \begin{bmatrix}
                \frac{1}{I_{xx}} & 0 & 0 \\
                0 & \frac{1}{I_{yy}} & 0 \\
                0 & 0 & \frac{1}{I_{zz}}
            \end{bmatrix}
            \begin{bmatrix}
                {\color{#65DD18}\tau_x} \\
                {\color{#65DD18}\tau_y} \\
                {\color{#65DD18}\tau_z}
            \end{bmatrix} \\
            \begin{bmatrix}
                {\color{cyan}\dot{\omega}_x\,'} \\
                {\color{cyan}\dot{\omega}_y\,'} \\
                {\color{cyan}\dot{\omega}_z\,'}
            \end{bmatrix}
            &= 
            \begin{bmatrix}
                - \frac{I_{zz}-I_{yy}}{I_{xx}} {\color{cyan}\omega_y\,' \omega_z\,'} + \frac{1}{I_{xx}} {\color{#65DD18}\tau_x} \\
                - \frac{I_{xx}-I_{zz}}{I_{yy}} {\color{cyan}\omega_x\,' \omega_z\,'} + \frac{1}{I_{yy}} {\color{#65DD18}\tau_y} \\
                - \frac{I_{yy}-I_{xx}}{I_{zz}} {\color{cyan}\omega_x\,' \omega_y\,'} + \frac{1}{I_{zz}} {\color{#65DD18}\tau_z}
            \end{bmatrix}
        \end{align*}
        $$

---

## Linearização

Se juntarmos as equações cinemática e cinéticas, obtemos a dinâmica completa do sistema:
        
$$
\left\{
\begin{array}{l}
    {\color{magenta}\dot{x}} = {\color{cyan}v_x\,'} \cos{\color{magenta}\theta}\cos{\color{magenta}\psi} + {\color{cyan}v_y\,'} \cos{\color{magenta}\theta}\sin{\color{magenta}\psi} - {\color{cyan}v_z\,'} \sin{\color{magenta}\theta} \\
    {\color{magenta}\dot{y}} = {\color{cyan}v_x\,'} \left( - \cos{\color{magenta}\phi}\sin{\color{magenta}\psi} + \sin{\color{magenta}\phi}\sin{\color{magenta}\theta}\cos{\color{magenta}\psi} \right) + {\color{cyan}v_y\,'} \left( \cos{\color{magenta}\phi}\cos{\color{magenta}\psi} + \sin{\color{magenta}\phi}\sin{\color{magenta}\theta}\sin{\color{magenta}\psi} \right) + {\color{cyan}v_z\,'} \sin{\color{magenta}\phi}\cos{\color{magenta}\theta} \\
    {\color{magenta}\dot{z}} = {\color{cyan}v_x\,'} \left( \sin{\color{magenta}\phi}\sin{\color{magenta}\psi} + \cos{\color{magenta}\phi}\sin{\color{magenta}\theta}\cos{\color{magenta}\psi} \right) + {\color{cyan}v_y\,'} \left( - \sin{\color{magenta}\phi}\cos{\color{magenta}\psi} + \cos{\color{magenta}\phi}\sin{\color{magenta}\theta}\sin{\color{magenta}\psi} \right) + {\color{cyan}v_z\,'} \cos{\color{magenta}\phi}\cos{\color{magenta}\theta} \\
    {\color{magenta}\dot{\phi}} = {\color{cyan}\omega_x\,'} + {\color{cyan}\omega_y\,'} \sin{\color{magenta}\phi} \tan{\color{magenta}\theta} + {\color{cyan}\omega_z\,'} \cos{\color{magenta}\phi} \tan{\color{magenta}\theta} \\
    {\color{magenta}\dot{\theta}} = {\color{cyan}\omega_y\,'} \cos{\color{magenta}\phi} - {\color{cyan}\omega_z\,'} \sin{\color{magenta}\phi} \\
    {\color{magenta}\dot{\psi}} = {\color{cyan}\omega_y\,'} \sin{\color{magenta}\phi} \sec{\color{magenta}\theta} + {\color{cyan}\omega_z\,'} \cos{\color{magenta}\phi} \sec{\color{magenta}\theta} \\
        {\color{cyan}\dot{v}_x\,'} =  - {\color{cyan}\omega_y\,' v_z\,'} + {\color{cyan}\omega_z\,' v_y\,'} + g \sin{\color{magenta}\theta} \\
        {\color{cyan}\dot{v}_y\,'} = - {\color{cyan}\omega_z\,' v_x\,'} + {\color{cyan}\omega_x\,' v_z\,'} - g \sin{\color{magenta}\phi}\cos{\color{magenta}\theta} \\
        {\color{cyan}\dot{v}_z\,'} = - {\color{cyan}\omega_x\,' v_y\,'} + {\color{cyan}\omega_y\,' v_x\,'} - g \cos{\color{magenta}\phi}\cos{\color{magenta}\theta} + \frac{1}{m} {\color{#65DD18}f_t} \\
        {\color{cyan}\dot{\omega}_x\,'} = - \frac{I_{zz}-I_{yy}}{I_{xx}} {\color{cyan}\omega_y\,' \omega_z\,'} + \frac{1}{I_{xx}} {\color{#65DD18}\tau_x} \\
        {\color{cyan}\dot{\omega}_y\,'} = - \frac{I_{xx}-I_{zz}}{I_{yy}} {\color{cyan}\omega_x\,' \omega_z\,'} + \frac{1}{I_{yy}} {\color{#65DD18}\tau_\theta} \\
        {\color{cyan}\dot{\omega}_z\,'} = - \frac{I_{yy}-I_{xx}}{I_{zz}} {\color{cyan}\omega_x\,' \omega_y\,'} + \frac{1}{I_{zz}} {\color{#65DD18}\tau_\psi}
\end{array}
\right.  
$$

As equações acima são completamente não-lineares, o que, além de ser extremamente complexo, foge do escopo do nosso curso.

Para linearizar o sistema, podemos considerar aproximações quando os estados estão bem próximos de suas posições de equilíbrio. Neste caso, funções trigonométricas podem ser aproximadas (ex: $\cos{\color{magenta}\phi} \approx 1$ e $\sin{\color{magenta}\phi} \approx {\color{magenta}\phi}$) (1), assim como o produto entre dois estados (ex: ${\color{cyan}v_z\,' \omega_x\,'} \approx 0$).
{.annotate}

1. Essas aproximações valem apenas para ângulos em radianos menores que $10^{\circ}$.

!!! question "Exercício 5"

    Determine as equações dinâmicas do sistema linearizado.
    
    ??? info "Resposta"
        $$
        \left\{
        \begin{array}{l}
            {\color{magenta}\dot{x}} = {\color{cyan}v_x\,'} \cancelto{1}{\cos{\color{magenta}\theta}}\cancelto{1}{\cos{\color{magenta}\psi}} + {\color{cyan}v_y\,'} \cancelto{1}{\cos{\color{magenta}\theta}}\cancelto{{\color{magenta}\psi}}{\sin{\color{magenta}\psi}} - {\color{cyan}v_z\,'} \cancelto{{\color{magenta}\theta}}{\sin{\color{magenta}\theta}} \\
            {\color{magenta}\dot{y}} = {\color{cyan}v_x\,'} \left( - \cancelto{1}{\cos{\color{magenta}\phi}}\cancelto{{\color{magenta}\psi}}{\sin{\color{magenta}\psi}} + \cancelto{{\color{magenta}\phi}}{\sin{\color{magenta}\phi}}\cancelto{{\color{magenta}\theta}}{\sin{\color{magenta}\theta}}\cancelto{1}{\cos{\color{magenta}\psi}} \right) + {\color{cyan}v_y\,'} \left( \cancelto{1}{\cos{\color{magenta}\phi}}\cancelto{1}{\cos{\color{magenta}\psi}} + \cancelto{{\color{magenta}\phi}}{\sin{\color{magenta}\phi}}\cancelto{{\color{magenta}\theta}}{\sin{\color{magenta}\theta}}\cancelto{{\color{magenta}\psi}}{\sin{\color{magenta}\psi}} \right) + {\color{cyan}v_z\,'} \cancelto{{\color{magenta}\phi}}{\sin{\color{magenta}\phi}}\cancelto{1}{\cos{\color{magenta}\theta}} \\
            {\color{magenta}\dot{z}} = {\color{cyan}v_x\,'} \left( \cancelto{{\color{magenta}\phi}}{\sin{\color{magenta}\phi}}\cancelto{{\color{magenta}\psi}}{\sin{\color{magenta}\psi}} + \cancelto{1}{\cos{\color{magenta}\phi}}\cancelto{{\color{magenta}\theta}}{\sin{\color{magenta}\theta}}\cancelto{1}{\cos{\color{magenta}\psi}} \right) + {\color{cyan}v_y\,'} \left( - \cancelto{{\color{magenta}\phi}}{\sin{\color{magenta}\phi}}\cancelto{1}{\cos{\color{magenta}\psi}} + \cancelto{1}{\cos{\color{magenta}\phi}}\cancelto{{\color{magenta}\theta}}{\sin{\color{magenta}\theta}}\cancelto{{\color{magenta}\psi}}{\sin{\color{magenta}\psi}} \right) + {\color{cyan}v_z\,'} \cancelto{1}{\cos{\color{magenta}\phi}}\cancelto{1}{\cos{\color{magenta}\theta}} \\
            {\color{magenta}\dot{\phi}} = {\color{cyan}\omega_x\,'} + {\color{cyan}\omega_y\,'} \cancelto{{\color{magenta}\phi}}{\sin{\color{magenta}\phi}} \cancelto{{\color{magenta}\theta}}{\tan{\color{magenta}\theta}} + {\color{cyan}\omega_z\,'} \cancelto{1}{\cos{\color{magenta}\phi}} \cancelto{{\color{magenta}\theta}}{\tan{\color{magenta}\theta}} \\
            {\color{magenta}\dot{\theta}} = {\color{cyan}\omega_y\,'} \cancelto{1}{\cos{\color{magenta}\phi}} - {\color{cyan}\omega_z\,'} \cancelto{{\color{magenta}\phi}}{\sin{\color{magenta}\phi}} \\
            {\color{magenta}\dot{\psi}} = {\color{cyan}\omega_y\,'} \cancelto{{\color{magenta}\phi}}{\sin{\color{magenta}\phi}} \cancelto{1}{\sec{\color{magenta}\theta}} + {\color{cyan}\omega_z\,'} \cancelto{1}{\cos{\color{magenta}\phi}} \cancelto{1}{\sec{\color{magenta}\theta}} \\
                {\color{cyan}\dot{v}_x\,'} =  - \cancelto{0}{\color{cyan}\omega_y\,' v_z\,'} + \cancelto{0}{\color{cyan}\omega_z\,' v_y\,'} + g \cancelto{{\color{magenta}\theta}}{\sin{\color{magenta}\theta}} \\
                {\color{cyan}\dot{v}_y\,'} = - \cancelto{0}{\color{cyan}\omega_z\,' v_x\,'} + \cancelto{0}{\color{cyan}\omega_x\,' v_z\,'} - g \cancelto{{\color{magenta}\phi}}{\sin{\color{magenta}\phi}}\cancelto{1}{\cos{\color{magenta}\theta}} \\
                {\color{cyan}\dot{v}_z\,'} = - \cancelto{0}{\color{cyan}\omega_x\,' v_y\,'} + \cancelto{0}{\color{cyan}\omega_y\,' v_x\,'} - g \cancelto{1}{\cos{\color{magenta}\phi}}\cancelto{1}{\cos{\color{magenta}\theta}} + \frac{1}{m} {\color{#65DD18}f_t} \\
                {\color{cyan}\dot{\omega}_x\,'} = - \frac{I_{zz}-I_{yy}}{I_{xx}} \cancelto{0}{\color{cyan}\omega_y\,' \omega_z\,'} + \frac{1}{I_{xx}} {\color{#65DD18}\tau_x} \\
                {\color{cyan}\dot{\omega}_y\,'} = - \frac{I_{xx}-I_{zz}}{I_{yy}} \cancelto{0}{\color{cyan}\omega_x\,' \omega_z\,'} + \frac{1}{I_{yy}} {\color{#65DD18}\tau_\theta} \\
                {\color{cyan}\dot{\omega}_z\,'} = - \frac{I_{yy}-I_{xx}}{I_{zz}} \cancelto{0}{\color{cyan}\omega_x\,' \omega_y\,'} + \frac{1}{I_{zz}} {\color{#65DD18}\tau_\psi}
        \end{array}
        \right. 
        \qquad \longrightarrow \qquad
        \left\{
        \begin{array}{l}
            {\color{magenta}\dot{x}} =  {\color{cyan}v_x\,'} + \cancelto{0}{{\color{cyan}v_y\,'}{\color{magenta}\psi}} + \cancelto{0}{{\color{cyan}v_z\,'}{\color{magenta}\theta}} \\
            {\color{magenta}\dot{y}} =   \cancelto{0}{{\color{cyan}v_x\,'} \left( - {\color{magenta}\psi} + {\color{magenta}\phi\theta} \right)} + {\color{cyan}v_y\,'} \left( 1 + \cancelto{0}{{\color{magenta}\phi\theta\psi}} \right) + \cancelto{0}{{\color{cyan}v_z\,'}{\color{magenta}\phi}} \\
            {\color{magenta}\dot{z}} =  \cancelto{0}{{\color{cyan}v_x\,'} \left( {\color{magenta}\phi\psi} + {\color{magenta}\theta} \right)} + \cancelto{0}{{\color{cyan}v_y\,'} \left( - {\color{magenta}\phi} + {\color{magenta}\theta\psi} \right)} + {\color{cyan}v_z\,'} \\
            {\color{magenta}\dot{\phi}} =  {\color{cyan}\omega_x\,'} +  \cancelto{0}{{\color{cyan}\omega_y\,'}{\color{magenta}\phi\theta}} +  \cancelto{0}{{\color{cyan}\omega_z\,'}{\color{magenta}\theta}} \\ 
            {\color{magenta}\dot{\theta}} =  {\color{cyan}\omega_y\,'} -  \cancelto{0}{{\color{cyan}\omega_z\,'}{\color{magenta}\phi}} \\ 
            {\color{magenta}\dot{\psi}} =  \cancelto{0}{{\color{cyan}\omega_y\,'}{\color{magenta}\phi}} + {\color{cyan}\omega_z\,'} \\ 
            {\color{cyan}\dot{v}_x\,'} = g {\color{magenta}\theta} \\ 
            {\color{cyan}\dot{v}_y\,'} = - g {\color{magenta}\phi} \\ 
            {\color{cyan}\dot{v}_z\,'} = -g + \frac{1}{m} {\color{#65DD18}f_t} \\ 
            {\color{cyan}\dot{\omega}_x\,'} = \frac{1}{I_{xx}} {\color{#65DD18}\tau_x} \\
            {\color{cyan}\dot{\omega}_y\,'} = \frac{1}{I_{yy}} {\color{#65DD18}\tau_y} \\
            {\color{cyan}\dot{\omega}_z\,'} = \frac{1}{I_{zz}} {\color{#65DD18}\tau_z}
        \end{array}
        \right.  
        \qquad \longrightarrow \qquad
        \left\{
        \begin{array}{l}
            {\color{magenta}\dot{x}} =  {\color{cyan}v_x\,'} \\
            {\color{magenta}\dot{y}} =  {\color{cyan}v_y\,'} \\
            {\color{magenta}\dot{z}} =  {\color{cyan}v_z\,'} \\
            {\color{magenta}\dot{\phi}} =  {\color{cyan}\omega_x\,'} \\ 
            {\color{magenta}\dot{\theta}} =  {\color{cyan}\omega_y\,'} \\ 
            {\color{magenta}\dot{\psi}} =  {\color{cyan}\omega_z\,'} \\ 
            {\color{cyan}\dot{v}_x\,'} = g {\color{magenta}\theta} \\ 
            {\color{cyan}\dot{v}_y\,'} = - g {\color{magenta}\phi} \\ 
            {\color{cyan}\dot{v}_z\,'} = -g + \frac{1}{m} {\color{#65DD18}f_t} \\ 
            {\color{cyan}\dot{\omega}_x\,'} = \frac{1}{I_{xx}} {\color{#65DD18}\tau_x} \\
            {\color{cyan}\dot{\omega}_y\,'} = \frac{1}{I_{yy}} {\color{#65DD18}\tau_y} \\
            {\color{cyan}\dot{\omega}_z\,'} = \frac{1}{I_{zz}} {\color{#65DD18}\tau_z}
        \end{array}
        \right.    
        $$

Você deve ter chegado a:

$$
\left\{
\begin{array}{l}
    {\color{magenta}\dot{x}} =  {\color{cyan}v_x\,'} \\
    {\color{magenta}\dot{y}} =  {\color{cyan}v_y\,'} \\
    {\color{magenta}\dot{z}} =  {\color{cyan}v_z\,'} \\
    {\color{magenta}\dot{\phi}} =  {\color{cyan}\omega_x\,'} \\ 
    {\color{magenta}\dot{\theta}} =  {\color{cyan}\omega_y\,'} \\ 
    {\color{magenta}\dot{\psi}} =  {\color{cyan}\omega_z\,'} \\ 
    {\color{cyan}\dot{v}_x\,'} = g {\color{magenta}\theta} \\ 
    {\color{cyan}\dot{v}_y\,'} = - g {\color{magenta}\phi} \\ 
    {\color{cyan}\dot{v}_z\,'} = -g + \frac{1}{m} {\color{#65DD18}f_t} \\ 
    {\color{cyan}\dot{\omega}_x\,'} = \frac{1}{I_{xx}} {\color{#65DD18}\tau_x} \\
    {\color{cyan}\dot{\omega}_y\,'} = \frac{1}{I_{yy}} {\color{#65DD18}\tau_y} \\
    {\color{cyan}\dot{\omega}_z\,'} = \frac{1}{I_{zz}} {\color{#65DD18}\tau_z}
\end{array}
\right.    
$$

Essas equações diferenciais podem ser representadas de forma mais simples em um diagrama de blocos:

![](images/3d_plant.svg){: width=100% style="display: block; margin: auto;" }

Observe o seguinte:

- A força ${\color{#65DD18}f_t}$ integra duas vezes até a posição ${\color{magenta}z}$ (2ª lei de Newton para translação), atuando de forma desacoplada na dinâmica de posição vertical.
- O torque ${\color{#65DD18}\tau_x}$ integra duas vezes até o ângulo ${\color{magenta}\phi}$ (2ª lei de Newton para rotação), e, integrando mais duas vezes, chega-se a posição ${\color{magenta}y}$(1). Portanto, de ${\color{#65DD18}\tau_x}$ a ${\color{magenta}y}$ há um integrador quádruplo, resultado do acoplamento entre a dinâmica de rotação e a dinâmica de posição horizontal. 
    {.annotate}

    1. O sinal negativo em $- g$ decorre da convenção de eixos adotada (uma rotação positiva em torno de ${\color{magenta}x}$ implica em um deslocamento negativo ao longo de ${\color{magenta}y}$).

- O torque ${\color{#65DD18}\tau_y}$ integra duas vezes até o ângulo ${\color{magenta}\theta}$ (2ª lei de Newton para rotação), e, integrando mais duas vezes, chega-se a posição ${\color{magenta}x}$(1). Portanto, de ${\color{#65DD18}\tau_y}$ a ${\color{magenta}x}$ há um integrador quádruplo, resultado do acoplamento entre a dinâmica de rotação e a dinâmica de posição horizontal. 
    {.annotate}

    1. O sinal positivo em $g$ decorre da convenção de eixos adotada (uma rotação positiva em torno de ${\color{magenta}y}$ implica em um deslocamento positivo ao longo de ${\color{magenta}x}$).

- O torque ${\color{#65DD18}\tau_z}$ integra duas vezes até o ângulo ${\color{magenta}\psi}$ (2ª lei de Newton para rotação), atuando de forma desacoplada na dinâmica de rotação de guinagem.


