# Sistema de coordenadas

No controle de drones, sistemas de coordenadas são utilizados com bastante frequência para descrever a posição e orientação relativa: posição do drone em relação ao chão, orientação da câmera em relação ao drone, velocidade do drone em relação ao vento, etc.
    
Muitos cálculos são muito mais simples se realizados no sistema de coordenada adequado: forças e torques aerodinâmicos em um sistema de coordenadas fixo no drone, aceleração da gravidade em um sistema de coordenadas fixo na terra, etc.

---

## Matriz de rotação

Ao lidar com diferentes sistemas de coordenadas, torna-se necessário descrever em linguagem matemática a orientação entre eles. Isso é feito através de matrizes de rotação, que podem ser usadas tanto no plano (2D) como no espaço (3D).

### 2D

Ao especificar a posição de um drone, torna-se necessário definir uma referência. Um método geral para definir uma referência é utilizar um sistema de coordenadas inercial ${\color{magenta}yz}$ (1).
{.annotate}

1. Fixo na terra, que não acelera nem rotaciona.

![](images/2d_position.svg){: width="600" style="display: block; margin: auto;" }

Ao especificar a atitude (orientação) de um drone, apenas um sistema de coordenadas não é suficiente. Torna-se necessário utilizar um outro sistema de coordenadas móvel ${\color{cyan}y'z'}$ (1).
{.annotate}
    
1. Fixo no drone, que acelera e rotaciona com ele.

![](images/2d_position_attitude.svg){: width="600" style="display: block; margin: auto;" }

Dessa forma, a atitude do drone é dada pela atitude relativa do sistema de coordenadas móvel ${\color{cyan}y'z'}$ em relação ao sistema de coordenadas inercial ${\color{magenta}yz}$. Matematicamente, essa atitude é dada por uma matrix $2 \times 2$ chamada de matrix de rotação $R$:

$$
{\color{cyan}
\begin{bmatrix}
    y' \\
    z'
\end{bmatrix}
}
=
\underbrace{
\begin{bmatrix}
    r_{11} & r_{12} \\
    r_{21} & r_{22}
\end{bmatrix}
}_{R}
{\color{magenta}
\begin{bmatrix}
    y \\
    z
\end{bmatrix}
}
$$

Apesar de possuir $4$ elementos, a matriz de rotação pode ser descrita em função de $1$ único parâmetro, o ângulo de rotação $\phi$:

$$
R(\phi)=
\begin{bmatrix}
    r_{11}(\phi) & r_{12}(\phi)\\
    r_{21}(\phi) & r_{22}(\phi)
\end{bmatrix}
$$

!!! question "Exercício 1"

    Considere que o sistema de coordenadas móvel ${\color{cyan}y'z'}$ está rotacionado de um ângulo $\phi$ em relação o sistema de coordenadas inercial ${\color{magenta}yz}$.

    ![](images/2d_rotation_x.svg){: width="200" style="display: block; margin: auto;" }
    
    ??? info "a) Determine a matriz de rotação em função do ângulo de rotação $\phi$" 
        $$
        R(\phi) = 
        \begin{bmatrix} 
            \cos{\phi} & \sin{\phi} \\ 
            -\sin{\phi} & \cos{\phi} 
        \end{bmatrix}
        $$
    
    ??? info "b) Determine a matriz de rotação quando $\phi = \frac{\pi}{2} \, \text{rad}$ e verifique se o resultado faz sentido."
        $$
        R\left(\frac{\pi}{2}\right) 
        = 
        \begin{bmatrix} 
            \cos{\frac{\pi}{2}} & \sin{\frac{\pi}{2}} \\ 
            -\sin{\frac{\pi}{2}} & \cos{\frac{\pi}{2}} 
        \end{bmatrix} \\
        = 
        \begin{bmatrix} 
            0 & 1 \\ 
            -1 & 0
        \end{bmatrix}
        $$

        Faz sentido, pois ao rotacionar $90^{\circ}$, o eixo ${\color{cyan}y'}$ fica no mesmo sentido de ${\color{magenta}z}$, enquanto o eixo ${\color{cyan}z'}$ fica no sentido contrário de ${\color{magenta}y}$.
 
    ??? info "c) Determine o ângulo de rotação $\phi$ correspondente à matriz de rotação <br> $R = \begin{bmatrix} \frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} \\ -\frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} \end{bmatrix}$"
    
        $$
        \begin{align*}
            \cos \phi &= \frac{\sqrt{2}}{2} \\
            \phi &= \cos^{-1} \left( \frac{\sqrt{2}}{2} \right) \\
            \phi &= \frac{\pi}{4} \text{rad}
        \end{align*}
        $$

---

### 3D

Assim como no plano, no espaço a atitude do drone também é dada pela atitude relativa do sistema de coordenadas móvel ${\color{cyan}x'y'z'}$ em relação ao sistema de coordenadas inercial ${\color{magenta}xyz}$.

![](images/3d_position_attitude.svg){: width="600" style="display: block; margin: auto;" }

No entanto, como agora estamos lidando com $3$ dimensões, a matriz de rotação $R$ passa a possuir dimensão $3 \times 3$:

$$
{\color{cyan}
\begin{bmatrix}
    x'\\y'\\z'
\end{bmatrix}
}
=
\underbrace{
\begin{bmatrix}
    r_{11} & r_{12} & r_{13}\\
    r_{21} & r_{22} & r_{23}\\
    r_{31} & r_{32} & r_{33}
\end{bmatrix}
}_{R}
{\color{magenta}
\begin{bmatrix}
    x \\
    y \\
    z
\end{bmatrix}
}
$$

De acordo com Leonard Euler, qualquer atitude no espaço pode ser descrita através de três rotações sucessivas em torno de eixos pré-definidos e linearmente independentes.
        
Dessa forma, os 9 elementos da matriz de rotação podem ser descritos em função de 3 parâmetros, os ângulos de Euler $\phi$, $\theta$ e $\psi$:

\begin{equation*}
        R({\phi},{\theta},{\psi})
        =
        \begin{bmatrix}
        r_{11}({\phi},{\theta},{\psi}) & r_{12}({\phi},{\theta},{\psi}) & r_{13}({\phi},{\theta},{\psi}) \\
        r_{21}({\phi},{\theta},{\psi}) & r_{22}({\phi},{\theta},{\psi}) & r_{23}({\phi},{\theta},{\psi}) \\
        r_{31}({\phi},{\theta},{\psi}) & r_{32}({\phi},{\theta},{\psi}) & r_{33}({\phi},{\theta},{\psi})
        \end{bmatrix}
\end{equation*}

!!! question "Exercício 2"

    Considere que o sistema de coordenadas móvel ${\color{cyan}x'y'z'}$ está rotacionado de um ângulo $\phi$ em relação o sistema de coordenadas inercial ${\color{magenta}xyz}$ e em torno do eixo ${\color{magenta}x}$.

    ![](images/3d_rotation_x.svg){: width="200" style="display: block; margin: auto;" }
    
    ??? info "a) Determine a matriz de rotação em função do ângulo de rotação $\phi$" 
        $$
        R_x(\phi) = 
        \begin{bmatrix} 
            1 & 0 & 0 \\
            0 & \cos\phi & \sin\phi \\ 
            0 & -\sin\phi & \cos\phi 
        \end{bmatrix}
        $$
    
    ??? info "b) Determine a matriz de rotação quando $\phi = \pi \, \text{rad}$ e verifique se o resultado faz sentido."
        $$
        \begin{align*}
            R_x\left(\pi\right) 
            = 
            \begin{bmatrix} 
                1 & 0 & 0 \\
                0 & \cos \pi & \sin \pi \\ 
                0 & -\sin \pi & \cos \pi
            \end{bmatrix} 
            = 
            \begin{bmatrix} 
                1 & 0 & 0 \\
                0 & -1 & 0 \\ 
                0 & 0 & -1
            \end{bmatrix}
        \end{align*}
        $$

        Faz sentido, pois ao rotacionar $180^{\circ}$, o eixo ${\color{cyan}y'}$ fica no sentido contrário de ${\color{magenta}y}$, enquanto o eixo ${\color{cyan}z'}$ fica no sentido contrário de ${\color{magenta}z}$.

!!! question "Exercício 3"

    Considere que o sistema de coordenadas móvel ${\color{cyan}x'y'z'}$ está rotacionado de um ângulo $\theta$ em relação o sistema de coordenadas inercial ${\color{magenta}xyz}$ e em torno do eixo ${\color{magenta}y}$.

    ![](images/3d_rotation_y.svg){: width="200" style="display: block; margin: auto;" }
    
    ??? info "a) Determine a matriz de rotação em função do ângulo de rotação $\theta$" 
        $$
        R_y(\theta) = 
        \begin{bmatrix} 
            \cos\theta & 0 & -\sin\theta \\ 
            0 & 1 & 0 \\ 
            \sin\theta & 0 & \cos\theta
        \end{bmatrix}
        $$
    
    ??? info "b) Determine a matriz de rotação quando $\theta = \frac{\pi}{2} \, \text{rad}$ e verifique se o resultado faz sentido."
        $$
        \begin{align*}
            R_x\left(\pi\right) 
            = 
            \begin{bmatrix} 
                \cos\frac{\pi}{2} & 0 & -\sin\frac{\pi}{2} \\ 
                0 & 1 & 0 \\ 
                \sin\frac{\pi}{2} & 0 & \cos\frac{\pi}{2}
            \end{bmatrix} 
            = 
            \begin{bmatrix} 
                0 & 0 & -1 \\ 
                0 & 1 & 0 \\ 
                1 & 0 & 0
            \end{bmatrix}
        \end{align*}
        $$

        Faz sentido, pois ao rotacionar $90^{\circ}$, o eixo ${\color{cyan}x'}$ fica no sentido contrário de ${\color{magenta}z}$, enquanto o eixo ${\color{cyan}z'}$ fica no mesmo sentido de ${\color{magenta}x}$.

!!! question "Exercício 4"

    Considere que o sistema de coordenadas móvel ${\color{cyan}x'y'z'}$ está rotacionado de um ângulo $\psi$ em relação o sistema de coordenadas inercial ${\color{magenta}xyz}$ e em torno do eixo ${\color{magenta}z}$.

    ![](images/3d_rotation_z.svg){: width="200" style="display: block; margin: auto;" }
    
    ??? info "a) Determine a matriz de rotação em função do ângulo de rotação $\psi$" 
        $$
        R_z(\psi) = 
        \begin{bmatrix} 
            \cos\psi & \sin\psi & 0 \\ 
            -\sin\psi & \cos\psi & 0 \\ 
            0 & 0 & 1
        \end{bmatrix}
        $$
    
    ??? info "b) Determine a matriz de rotação quando $\psi = 2 \pi \, \text{rad}$ e verifique se o resultado faz sentido."
        $$
        \begin{align*}
            R_x\left(\pi\right) 
            = 
            \begin{bmatrix}  
                \cos 2\pi & \sin 2\pi & 0 \\ 
                -\sin 2\pi & \cos 2\pi & 0 \\ 
                0 & 0 & 1
            \end{bmatrix} 
            = 
            \begin{bmatrix} 
                1 & 0 & 0 \\
                0 & 1 & 0 \\ 
                0 & 0 & 1
            \end{bmatrix}
        \end{align*}
        $$

        Faz sentido, pois ao rotacionar $360^{\circ}$, o eixo ${\color{cyan}x'}$ fica no mesmo sentido de ${\color{magenta}x}$, enquanto o eixo ${\color{cyan}y'}$ fica no mesmo sentido contrário de ${\color{magenta}y}$.

### Propriedades

Matrizes de rotação possuem algumas propriedades interessantes:
       
- Linhas e colunas tem módulo unitário
- Linhas e colunas são perpendiculares entre si (produto escalar entre elas é zero)
- São matrizes ortonormais (sua inversa é igual à sua transposta), isto é, $R^{-1} = R^T$
- Possuem determinante unitária, isto é, $\det (R) = 1$

!!! question "Exercício 5"

    Dada a matriz de rotação abaixo, que relaciona o sistema de coordenadas móvel ${\color{cyan}x'y'z'}$ com o sistema de coordenadas inercial ${\color{magenta}xyz}$:

    $$
    R = 
    \begin{bmatrix} 
        \frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} & 0 \\ 
        -\frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} & 0 \\ 
        0 & 0 & 1 
    \end{bmatrix}	
    $$
    
    Determine a matriz de rotação inversa $R^{-1}$, isto é, que relaciona o sistema de coordenadas inercial ${\color{magenta}xyz}$ com o sistema de coordenadas móvel ${\color{cyan}x'y'z'}$.
    
    ??? info "Resposta" 
        $$
        R^{-1} =
        R^{T} =
        \begin{bmatrix} 
            \frac{\sqrt{2}}{2} & -\frac{\sqrt{2}}{2} & 0 \\ 
            \frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} & 0 \\ 
            0 & 0 & 1 
        \end{bmatrix}
        $$

---

## Ângulos de Euler

Os ângulos de Euler são um conjunto de três transformações lineares consecutivas, cada uma sobre um eixo distinto e com um ângulo distinto, que podem levar um sistema de coordenadas inercial ${\color{magenta}xyz}$ a um sistema de coordenadas móvel ${\color{cyan}x'y'z'}$.

A matriz de rotação total nada mais é do que a composição das matrizes de rotação individuais
    
$$
R(\phi,\theta,\psi) = 
\underbrace{
\begin{bmatrix} 
    1 & 0 & 0 \\
    0 & \cos\phi & \sin\phi \\ 
    0 & -\sin\phi & \cos\phi
\end{bmatrix}
}_{R_x(\phi)}
\underbrace{
\begin{bmatrix} 
    \cos\theta & 0 & -\sin\theta \\ 
    0 & 1 & 0 \\ 
    \sin\theta & 0 & \cos\theta 
\end{bmatrix}
}_{R_y(\theta)}
\underbrace{
\begin{bmatrix} 
    \cos\psi & \sin\psi & 0 \\ 
    -\sin\psi & \cos\psi & 0 \\ 
    0 & 0 & 1 
\end{bmatrix}	
}_{R_z(\psi)}
$$
    
Note que a matriz associada a primeira rotação $R_z(\psi)$ está mais a direita, enquanto que a matriz associada a última rotação $R_x(\phi)$ está mais a esquerda. Isso ocorre pois operações matriciais são realizadas da direita para à esquerda.

!!! question "Exercício 6"

    Determine a matriz de rotação total $R(\phi,\theta,\psi)$ que relaciona o sistema de coordenadas móvel ${\color{cyan}x'y'z'}$ com o sistema de coordenadas inercial ${\color{magenta}xyz}$ em função dos ângulos de Euler $\phi$, $\theta$ e $\psi$.
    
    Dica: utilize o Symbolic Math Toolbox do MATLAB.
    
    ??? info "Resposta" 
        $$
        R (\phi,\theta,\psi) = 
        \begin{bmatrix} \cos\theta\cos\psi & \cos\theta\sin\psi & -\sin\theta \\ 
        - \cos\phi\sin\psi + \sin\phi\sin\theta\cos\psi  & \cos\phi\cos\psi + \sin\phi\sin\theta\sin\psi & \sin\phi\cos\theta \\ 
        \sin\phi\sin\psi + \cos\phi\sin\theta\cos\psi & - \sin\phi\cos\psi + \cos\phi\sin\theta\sin\psi  & \cos\phi\cos\theta 
        \end{bmatrix}
        $$

### Singularidades

Singularidades são pontos nos quais uma variável matemática torna-se indefinida. No caso dos ângulos de Euler, é uma orientação na qual há mais de uma única sequência de rotações possíveis. 

Quando a segunda rotação é igual a $\theta = \frac{\pi}{2}$ rad, o sentido dos eixos da primeira ($z'$) e terceira ($x'$) rotação coincidem, tornando-se impossível discernir os valores de $\psi$ e $\phi$.

Não há acordo sobre a notação (sequência de rotações) utilizada pelos ângulos de Euler. Existe um total de 12 combinações, pois a rotação seguinte deve sempre ocorrer em um eixo distinto da anterior, conforme a tabela abaixo:

<style>
  /* Opcional: coloque isso no topo da página ou no extra.css */
  table.rotacoes {
    width: 100%;
    border-collapse: collapse;
    margin: 0.75rem 0;
  }
  table.rotacoes th, table.rotacoes td {
    border: 1px solid var(--md-typeset-table-color, rgba(0,0,0,.12));
    padding: .4rem .6rem;
    text-align: center;
    vertical-align: middle;
  }
  .axis-x { color: #d32f2f; } /* vermelho */
  .axis-y { color: #1976d2; } /* azul (se quiser manter cores distintas) */
  .axis-z { color: #388e3c; } /* verde */
</style>

<table class="rotacoes">
  <thead>
    <tr>
      <th>Notação</th>
      <th>Eixo da 1ª rotação</th>
      <th>Eixo da 2ª rotação</th>
      <th>Eixo da 3ª rotação</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>x-y-x</td>
      <td rowspan="4"><span class="axis-x">x&#8242;</span></td>
      <td rowspan="2"><span class="axis-y">y&#8242;</span></td>
      <td><span class="axis-x">x&#8242;</span></td>
    </tr>
    <tr>
      <td>x-y-z</td>
      <td><span class="axis-z">z&#8242;</span></td>
    </tr>
    <tr>
      <td>x-z-x</td>
      <td rowspan="2"><span class="axis-z">z&#8242;</span></td>
      <td><span class="axis-x">x&#8242;</span></td>
    </tr>
    <tr>
      <td>x-z-y</td>
      <td><span class="axis-y">y&#8242;</span></td>
    </tr>
    <tr>
      <td>y-x-y</td>
      <td rowspan="4"><span class="axis-y">y&#8242;</span></td>
      <td rowspan="2"><span class="axis-x">x&#8242;</span></td>
      <td><span class="axis-y">y&#8242;</span></td>
    </tr>
    <tr>
      <td>y-x-z</td>
      <td><span class="axis-z">z&#8242;</span></td>
    </tr>
    <tr>
      <td>y-z-y</td>
      <td rowspan="2"><span class="axis-z">z&#8242;</span></td>
      <td><span class="axis-y">y&#8242;</span></td>
    </tr>
    <tr>
      <td>y-z-x</td>
      <td><span class="axis-x">x&#8242;</span></td>
    </tr>
    <tr>
      <td>z-x-z</td>
      <td rowspan="4"><span class="axis-z">z&#8242;</span></td>
      <td rowspan="2"><span class="axis-x">x&#8242;</span></td>
      <td><span class="axis-z">z&#8242;</span></td>
    </tr>
    <tr>
      <td>z-x-y</td>
      <td><span class="axis-y">y&#8242;</span></td>
    </tr>
    <tr>
      <td>z-y-z</td>
      <td rowspan="2"><span class="axis-y">y&#8242;</span></td>
      <td><span class="axis-z">z&#8242;</span></td>
    </tr>
    <tr>
      <td>z-y-x</td>
      <td><span class="axis-x">x&#8242;</span></td>
    </tr>
  </tbody>
</table>

Note que todas as combinações possuem singularidades; a única diferença é o ângulo no qual elas ocorrem:

- Quando o eixo da primeira e terceira rotação são iguais, as singularidades ocorrem quando a segunda rotação é igual a $0$ rad.
- Quando o eixo da primeira e terceira rotação são distintos, as singularidades ocorrem quando a segunda rotação é igual a $\frac{\pi}{2}$ rad. 

Como a posição de equilíbrio do drone ocorre quando a segunda rotação é igual a $0$ rad, utiliza-se a notação em que o eixo da primeira e terceira rotação são distintos ($z-y-x$).  Assim, a singularidade fica distante de ocorrer (apesar de ainda ser uma possibilidade).

Uma alternativa aos ângulos de Euler, que não possuem singularidades, são os quatérnios.
