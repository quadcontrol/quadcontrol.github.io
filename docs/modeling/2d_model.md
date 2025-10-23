---
icon: material/video-2d
---

# Modelo 2D

Inicialmente, vamos deduzir as equações diferenciais que descrevem a dinâmica 2D de um quadricóptero. Partiremos de um caso simplificado em duas dimensões, o que reduz a complexidade matemática e facilita uma compreensão mais intuitiva. Esse modelo funciona como um primeiro passo essencial para visualizar como as entradas influenciam as saídas.

---

## Introdução

A dinâmica 2D possui 3 graus de liberdade (2 de translação e 1 de rotação) e, portanto, devemos obter 6 equações diferenciais (2 para cada grau de liberdade)(1).
{.annotate}

1. Para facilitar o entendimento, utilizaremos as seguintes cores e notações:
    - ${\color{magenta} x}$ - Estados (sistema de coordenadas inercial)
    - ${\color{cyan} x\,'}$ - Estados (sistema de coordenadas móvel)
    - ${\color{#65DD18} u}$ - Entradas
    - $m$ - Constantes

![](images/2d_drone.svg){: width="600" style="display: block; margin: auto;" }

Vamos modelar esse sistema sob quatro perspectivas diferentes, na seguinte ordem:

<style>
  /* Tabela com visual do tema e centralização */
  table.rotacoes {
    width: 100%;
    border-collapse: collapse;
    margin: .75rem 0;
  }
  table.rotacoes th, table.rotacoes td {
    border: 1px solid var(--md-typeset-table-color, rgba(0,0,0,.12));
    padding: .4rem .6rem;
    text-align: center;
    vertical-align: middle; /* centraliza verticalmente com rowspan */
  }
  /* Cor ciano apenas para os eixos */
  .axis { color: #00BCD4; }
  .axis_inertial { color: #FF00FF; }
</style>

<table class="rotacoes">
  <thead>
    <tr>
      <th>Ordem</th>
      <th>Notação</th>
      <th>Posições</th>
      <th>Velocidades</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td rowspan="2">Escalar</td>
      <td><span class="arithmatex axis_inertial">\( y \quad z \quad \phi \)</span></td>
      <td><span class="arithmatex axis_inertial">\( v_y \quad v_z \quad \omega_x \)</span></td>
    </tr>
    <tr>
      <td>2</td>
      <td><span class="arithmatex axis_inertial">\( y \quad z \quad \phi \)</span></td>
      <td><span class="arithmatex axis">\( v^{'}_y \quad v^{'}_z \quad \omega^{'}_x \)</span></td>
    </tr>
    <tr>
      <td>3</td>
      <td rowspan="2">Vetorial</td>
      <td><span class="arithmatex axis_inertial">\( y \quad z \quad \phi \)</span></td>
      <td><span class="arithmatex axis_inertial">\( v_y \quad v_z \quad \omega_x \)</span></td>
    </tr>
    <tr>
      <td>4</td>
      <td><span class="arithmatex axis_inertial">\( y \quad z \quad \phi \)</span></td>
      <td><span class="arithmatex axis">\( v^{'}_y \quad v^{'}_z \quad \omega^{'}_x \)</span></td>
    </tr>
  </tbody>
</table>

Apesar de ir ficando cada vez mais complicado, quando passarmos para a dinâmica 3D, a quarta (e última) perspectiva acaba sendo a mais simples.

---

## Notação escalar

A 2ª lei de Newton para translação e rotação, utilizando a notação escalar, é dada por:
    
$$
\left\{
\begin{array}{l}
        \sum f = m a \\ 
        \sum \tau = I \alpha
\end{array}
\right.
$$
    
Ela deverá ser aplicada individualmente para cada grau de liberdade.

### Sistema inercial

Inicialmente, a ideia é que tanto as posições como as velocidades sejam descritas no sistema de coordenadas inercial, de modo que os estados do sistema sejam ${\color{magenta}y}$, ${\color{magenta}z}$, ${\color{magenta}\phi}$, ${\color{magenta}v_y}$, ${\color{magenta}v_z}$ e ${\color{magenta}\omega_x}$. 

!!! question "Exercício 1"

    Determine as equações cinemáticas, isto é, as equações das derivadas das posições (${\color{magenta}y}$, ${\color{magenta}z}$ e ${\color{magenta}\phi}$) em função dos estados do sistema.
    
    ??? info "a) Escreva ${\color{magenta}\dot{y}}$ em função dos estados do sistema."
        $$
        {\color{magenta}\dot{y}} = {\color{magenta}v_y}
        $$
    
    ??? info "b) Escreva ${\color{magenta}\dot{z}}$ em função dos estados do sistema."
        $$
        {\color{magenta}\dot{z}} = {\color{magenta}v_z}
        $$
    
    ??? info "c) Escreva ${\color{magenta}\dot{\phi}}$ em função dos estados do sistema."
        $$
        {\color{magenta}\dot{\phi}} = {\color{magenta}\omega_x}
        $$

!!! question "Exercício 2"

    Determine as equações cinéticas, isto é, as equações das derivadas das velocidades (${\color{magenta}v_y}$, ${\color{magenta}v_z}$ e ${\color{magenta}\omega_x}$) em função dos estados do sistema.
    
    Dica: você deve aplicar a 2ª lei de Newton para cada grau de liberdade do sistema de coordenadas inercial.
    
    ??? info "a) Escreva ${\color{magenta}\dot{v}_y}$ em função dos estados do sistema."
        $$
        \begin{align*}
            \sum  {\color{magenta}f_y} &= m {\color{magenta}a_y} \\
            - {\color{#65DD18}f_t} \sin {\color{magenta}\phi} &= m {\color{magenta}\dot{v}_y} \\
            {\color{magenta}\dot{v}_y} &= - \frac{1}{m} \sin {\color{magenta}\phi} {\color{#65DD18}f_t}
        \end{align*}
        $$
    
    ??? info "b) Escreva ${\color{magenta}\dot{v}_z}$ em função dos estados do sistema."
        $$
        \begin{align*}
            \sum {\color{magenta}f_z} &= m {\color{magenta}a_z} \\
            {\color{#65DD18}f_t} \cos {\color{magenta}\phi} - mg &= m {\color{magenta}\dot{v}_z} \\
                {\color{magenta}\dot{v}_z} &= -g + \frac{1}{m} \cos {\color{magenta}\phi} {\color{#65DD18}f_t}
        \end{align*}
        $$
    
    ??? info "c) Escreva ${\color{magenta}\dot{\omega}_x}$ em função dos estados do sistema."
        $$
        \begin{align*}
            \sum {\color{magenta}\tau_x} &= I_{xx} {\color{magenta}\alpha_x} \\
            {\color{#65DD18}\tau_x} &= I_{xx} {\color{magenta}\dot{\omega}_x} \\
            {\color{magenta}\dot{\omega}_x} &= \frac{1}{I_{xx}} {\color{#65DD18}\tau_x}
        \end{align*}
        $$


Se juntarmos as equações cinéticas e cinemáticas, obtemos a dinâmica completa do sistema:
        
$$
\left\{
\begin{array}{l}
    {\color{magenta}\dot{y}} = {\color{magenta}v_y} \\ 
    {\color{magenta}\dot{z}} = {\color{magenta}v_z} \\
    {\color{magenta}\dot{\phi}} = {\color{magenta}\omega_x} \\ 
    {\color{magenta}\dot{v}_y} = - \frac{1}{m} \sin {\color{magenta}\phi} {\color{#65DD18}f_t} \\ 
    {\color{magenta}\dot{v}_z} = -g + \frac{1}{m} \cos {\color{magenta}\phi} {\color{#65DD18}f_t} \\ 
    {\color{magenta}\dot{\omega}_x} = \frac{1}{I_{xx}} {\color{#65DD18}\tau_x}
\end{array}
\right.
$$

### Sistema móvel

Outra forma de abordar esse problema é descrevendo as posições no sistema de coordenadas inercial mas as velocidades no sistema de coordenadas móvel, de modo que os estados agora sejam ${\color{magenta}y}$, ${\color{magenta}z}$, ${\color{magenta}\phi}$, ${\color{cyan}v_y\,'}$, ${\color{cyan}v_z\,'}$ e ${\color{cyan}\omega_x\,'}$. 

Isso normalmente é feito pois faz muito mais sentido descrever as velocidades no sistema de coordenadas fixo no drone, além de que a maioria dos sensores (acelerômetro, giroscópio, proximidade, fluxo óptico, etc.) estão presos nele e alinhados com esse sistema de coordenadas. No entanto, conforme veremos, as equações agora ficam um pouco mais complexas e menos intuitivas.

!!! question "Exercício 3"

    Determine as equações cinemáticas, isto é, as equações das derivadas das posições (${\color{magenta}y}$, ${\color{magenta}z}$ e ${\color{magenta}\phi}$) em função dos estados do sistema.

    Dica: lembre-se das matrizes de rotação [vistas](../coordinate_system) anteriormente e que os eixos ${\color{magenta}x}$ e ${\color{cyan}x\,'}$ estão alinhados.
    
    ??? info "a) Escreva ${\color{magenta}\dot{y}}$ em função dos estados do sistema."
        $$
        \begin{bmatrix}
            {\color{cyan}v_y\,'} \\
            {\color{cyan}v_z\,'}
            \end{bmatrix}
            =
            \underbrace{
            \begin{bmatrix} 
            \cos{\color{magenta}\phi} & \sin{\color{magenta}\phi} \\ 
            -\sin{\color{magenta}\phi} & \cos{\color{magenta}\phi} 
        \end{bmatrix}
            }_{R}
            \begin{bmatrix}
            {\color{magenta}\dot{y}} \\
            {\color{magenta}\dot{z}}
        \end{bmatrix}
        \qquad \longrightarrow \qquad
            \begin{bmatrix}
            {\color{magenta}\dot{y}} \\
            {\color{magenta}\dot{z}}
            \end{bmatrix}
            =
            \underbrace{
            \begin{bmatrix} 
            \cos{\color{magenta}\phi} & -\sin{\color{magenta}\phi} \\ 
            \sin{\color{magenta}\phi} & \cos{\color{magenta}\phi} 
        \end{bmatrix}
            }_{R^{-1}}
            \begin{bmatrix}
            {\color{cyan}v_y\,'} \\
            {\color{cyan}v_z\,'}
        \end{bmatrix}
        $$

        $$
        {\color{magenta}\dot{y}} =  {\color{cyan}v_y\,'} \cos {\color{magenta}\phi} -  {\color{cyan}v_z\,'} \sin {\color{magenta}\phi}
        $$
    
    ??? info "b) Escreva ${\color{magenta}\dot{z}}$ em função dos estados do sistema."
        $$
        \begin{bmatrix}
            {\color{cyan}v_y\,'} \\
            {\color{cyan}v_z\,'}
            \end{bmatrix}
            =
            \underbrace{
            \begin{bmatrix} 
            \cos{\color{magenta}\phi} & \sin{\color{magenta}\phi} \\ 
            -\sin{\color{magenta}\phi} & \cos{\color{magenta}\phi} 
        \end{bmatrix}
            }_{R}
            \begin{bmatrix}
            {\color{magenta}\dot{y}} \\
            {\color{magenta}\dot{z}}
        \end{bmatrix}
        \qquad \longrightarrow \qquad
            \begin{bmatrix}
            {\color{magenta}\dot{y}} \\
            {\color{magenta}\dot{z}}
            \end{bmatrix}
            =
            \underbrace{
            \begin{bmatrix} 
            \cos{\color{magenta}\phi} & -\sin{\color{magenta}\phi} \\ 
            \sin{\color{magenta}\phi} & \cos{\color{magenta}\phi} 
        \end{bmatrix}
            }_{R^{-1}}
            \begin{bmatrix}
            {\color{cyan}v_y\,'} \\
            {\color{cyan}v_z\,'}
        \end{bmatrix}
        $$

        $$
        {\color{magenta}\dot{z}} =  {\color{cyan}v_y\,'} \sin {\color{magenta}\phi} +  {\color{cyan}v_z\,'} \cos {\color{magenta}\phi}
        $$
    
    ??? info "c) Escreva ${\color{magenta}\dot{\phi}}$ em função dos estados do sistema."
        $$
        {\color{magenta}\dot{\phi}} = {\color{cyan}\omega_x\,'}
        $$

!!! question "Exercício 4"

    Determine as equações cinéticas, isto é, as equações das derivadas das velocidades (${\color{cyan}v_y\,'}$, ${\color{cyan}v_z\,'}$ e ${\color{cyan}\omega_x\,'}$) em função dos estados do sistema.
    
    Dica: você deve aplicar a 2ª lei de Newton para cada grau de liberdade do sistema de coordenadas inercial.
    
    ??? info "a) Escreva ${\color{cyan}\dot{v}_y\,'}$ em função dos estados do sistema."
        $$
        \begin{align*}
            \sum {\color{cyan}f_y\,'} &= m {\color{cyan}a_y\,'} \\
            - m g \sin {\color{magenta}\phi} &= m \left( {\color{cyan}\dot{v}_y\,'} - {\color{cyan}v_z\,' \omega_x\,'} \right) \\
            {\color{cyan}\dot{v}_y\,'} &= {\color{cyan}v_z\,' \omega_x\,'} - g \sin {\color{magenta}\phi}
        \end{align*}
        $$
    
    ??? info "b) Escreva ${\color{cyan}\dot{v}_z\,'}$ em função dos estados do sistema."
        $$
        \begin{align*}
            \sum {\color{cyan}f_z\,'} &= m {\color{cyan}a_z\,'} \\
            {\color{#65DD18}f_t} - m g {\color{magenta}\cos \phi} &= m \left( {\color{cyan}\dot{v}_z\,'} + {\color{cyan}v_y\,' \omega_x\,'} \right) \\
            {\color{cyan}\dot{v}_z\,'} &= - {\color{cyan}v_y\,' \omega_x\,'} - g \cos {\color{magenta}\phi} + \frac{1}{m} {\color{#65DD18}f_t}
        \end{align*}
        $$
    
    ??? info "c) Escreva ${\color{cyan}\dot{\omega}_x\,'}$ em função dos estados do sistema."
        $$
        \begin{align*}
            \sum {\color{cyan}\tau_x\,'} &= I_{xx} {\color{cyan}\alpha_x\,'} \\
            {\color{#65DD18}\tau_x} &= I_{xx} {\color{cyan}\dot{\omega}_x\,'} \\
            {\color{cyan}\dot{\omega}_x\,'} &= \frac{1}{I_{xx}} {\color{#65DD18}\tau_x}
        \end{align*}
        $$

Se juntarmos as equações cinéticas e cinemáticas, obtemos a dinâmica completa do sistema:
        
$$
\left\{
\begin{array}{l}
    {\color{magenta}\dot{y}} =  {\color{cyan}v_y\,'} \cos {\color{magenta}\phi} -  {\color{cyan}v_z\,'} \sin {\color{magenta}\phi} \\ 
    {\color{magenta}\dot{z}} =  {\color{cyan}v_y\,'} \sin {\color{magenta}\phi} +  {\color{cyan}v_z\,'} \cos {\color{magenta}\phi} \\
    {\color{magenta}\dot{\phi}} =  {\color{cyan}\omega_x\,'} \\ 
    {\color{cyan}\dot{v}_y\,'} = {\color{cyan}v_z\,' \omega_x\,'} - g \sin {\color{magenta}\phi} \\ 
    {\color{cyan}\dot{v}_z\,'} = - {\color{cyan}v_y\,' \omega_x\,'} - g \cos {\color{magenta}\phi} + \frac{1}{m} {\color{#65DD18}f_t} \\ 
    {\color{cyan}\dot{\omega}_x\,'} = \frac{1}{I_{xx}} {\color{#65DD18}\tau_x}
\end{array}
\right.
$$

Os termos ${\color{cyan}v_z\,' \omega_x\,'}$ e ${\color{cyan}v_y\,' \omega_x\,'}$ correspondem às pseudo-acelerações centrífugas, que surgem ao descrever o movimento no referencial não inercial do drone (sistema de coordenadas móvel).

---

## Notação vetorial

A 2ª lei de Newton para translação e rotação utilizando notação vetorial é dada por:

$$
\left\{
\begin{array}{l}
        \sum \vec{f} = \frac{d}{dt} \vec{p} \\ 
        \sum \vec{\tau} = \frac{d}{dt} \vec{h}
\end{array}
\right.
$$

Onde $\vec{p}$ e $\vec{h}$ são, respectivamente, os vetores de momentos lineares e angulares:

$$
\left\{
\begin{array}{l}
        \vec{p} = m \vec{v} \\ 
        \vec{h} = I \vec{\omega}
\end{array}
\right.
$$

Apesar de $m$ continuar sendo um escalar que representa a massa do corpo, $I$ agora é uma matriz que representa os momentos de inércia em torno dos 3 eixos de rotação:

$$
I = 
\begin{bmatrix}
    I_{xx} & 0 & 0 \\
    0 & I_{yy} & 0 \\
    0 & 0 & I_{zz}
\end{bmatrix}
$$

Como estamos trabalhando agora com vetores, estas equações podem ser aplicadas de uma única vez para todos os graus de liberdade.

### Sistema inercial

Inicialmente, vamos definir o vetor aceleração da gravidade ${\color{magenta}\vec{g}}$ no sistema de coordenadas inercial e os vetores de forças ${\color{cyan}\vec{f}_d\,'}$ e torques ${\color{cyan}\vec{\tau}_d\,'}$ do drone no sistema de coordenadas móvel:

$$
{\color{magenta}\vec{g}} = 
\begin{bmatrix}
    0 \\
    0 \\
    g
\end{bmatrix}
\qquad
{\color{cyan}\vec{f_d}\,'} = 
\begin{bmatrix}
    0 \\
    0 \\
    {\color{#65DD18}f_t} 
\end{bmatrix}
\qquad
{\color{cyan}\vec{\tau_d}\,'} = 
\begin{bmatrix}
    {\color{#65DD18}\tau_x} \\
    0 \\
    0
\end{bmatrix}
$$

Fazemos isso pois eles estão alinhados com estes sistemas de coordenadas e portanto é muito mais fácil descrevê-los assim.

!!! question "Exercício 5"

!!! question "Exercício 6"

    Determine as equações cinéticas vetoriais, isto é, as equações das derivadas dos vetores de velocidades (${\color{magenta}\vec{v}}$ e ${\color{magenta}\vec{\omega}}$) em função das somatórias de forças e torques.
    
    ??? info "a) Escreva ${\color{magenta}\dot{\vec{v}}}$ em função de $\sum{\color{magenta}\vec{f}}$."
        $$
        \begin{align*}
            \sum {\color{magenta}\vec{f}} &= \frac{d}{dt} {\color{magenta}\vec{p}} \\
            \sum {\color{magenta}\vec{f}} &= \frac{d}{dt} \left( m {\color{magenta}\vec{v}} \right) \\
            \sum {\color{magenta}\vec{f}} &= m {\color{magenta}\dot{\vec{v}}} \\
            {\color{magenta}\dot{\vec{v}}} &= \frac{1}{m} \sum {\color{magenta}\vec{f}}
        \end{align*}
        $$
    
    ??? info "b) Escreva ${\color{magenta}\dot{\vec{\omega}}}$ em função de $\sum{\color{magenta}\vec{\tau}}$."
        $$
        \begin{align*}
            \sum {\color{magenta}\vec{\tau}} &= \frac{d}{dt} {\color{magenta}\vec{h}} \\
            \sum {\color{magenta}\vec{\tau}} &= \frac{d}{dt} \left( I {\color{magenta}\vec{\omega}} \right) \\
            \sum {\color{magenta}\vec{\tau}} &= I {\color{magenta}\dot{\vec{\omega}}} \\
            {\color{magenta}\dot{\vec{\omega}}} &= I^{-1} \sum {\color{magenta}\vec{\tau}}
        \end{align*}
        $$

Você deve ter chegado a:
                
$$
    \left\{
    \begin{array}{l}
            {\color{magenta}\dot{\vec{v}}} = \frac{1}{m} \sum {\color{magenta}\vec{f}} \\ 
            {\color{magenta}\dot{\vec{\omega}}} = I^{-1} \sum {\color{magenta}\vec{\tau}}
    \end{array}
    \right.
$$

Essas equações são genéricas, ou seja, valem pro movimento de translação e rotação de qualquer corpo rígido, basta substituir o valor das somatórias de forças e torques.

!!! question "Exercício 7"

    Substitua as somatórias de forças e torques definidos inicialmente e determine as equações cinéticas.
        
    Dica: cuidado com os sistemas de coordenadas em que eles estão descritos.
    
    ??? info "a) Escreva ${\color{magenta}\dot{\vec{v}}}$ em função dos estados do sistema."
        $$
        \begin{align*}
            {\color{magenta}\dot{\vec{v}}} &= \frac{1}{m} \sum {\color{magenta}\vec{f}} \\
            {\color{magenta}\dot{\vec{v}}} &= \frac{1}{m} \left( - m {\color{magenta}\vec{g}} + {\color{magenta}\vec{f}_t} \right) \\
            {\color{magenta}\dot{\vec{v}}} &= - {\color{magenta}\vec{g}} + \frac{1}{m} {\color{magenta}\vec{f}_t} \\
            {\color{magenta}\dot{\vec{v}}} &= - {\color{magenta}\vec{g}} + \frac{1}{m} R^T {\color{cyan}\vec{f}_t\,'} \\
            \begin{bmatrix}
                0 \\
                {\color{magenta}\dot{v}_y} \\
                {\color{magenta}\dot{v}_z}
            \end{bmatrix}
            &= -
            \begin{bmatrix}
                0 \\
                0 \\
                g
            \end{bmatrix} 
            + \frac{1}{m}
            \begin{bmatrix}
                1 & 0 & 0 \\
                0 & \cos{\color{magenta}\phi} & -\sin{\color{magenta}\phi} \\
                0 & \sin{\color{magenta}\phi} & \cos{\color{magenta}\phi}
            \end{bmatrix}
            \begin{bmatrix}
                0 \\
                0 \\
                {\color{#65DD18}f_t}
            \end{bmatrix} \\
            \begin{bmatrix}
                0 \\
                {\color{magenta}\dot{v}_y} \\
                {\color{magenta}\dot{v}_z}
            \end{bmatrix}
            &=
            \begin{bmatrix}
                0 \\
                - \frac{1}{m} \sin{\color{magenta}\phi} {\color{#65DD18}f_t} \\
                - g + \frac{1}{m} \cos{\color{magenta}\phi} {\color{#65DD18}f_t}
            \end{bmatrix} 
        \end{align*}  
        $$
    
    ??? info "b) Escreva ${\color{magenta}\dot{\vec{\omega}}}$ em função dos estados do sistema."
        $$
        \begin{align*}
            {\color{magenta}\dot{\vec{\omega}}} &= I^{-1} \sum {\color{magenta}\vec{\tau}} \\
            {\color{magenta}\dot{\vec{\omega}}} &= I^{-1} {\color{magenta}\vec{\tau}_x} \\
            \begin{bmatrix}
                {\color{magenta}\dot{\omega}_x} \\
                0 \\
                0
            \end{bmatrix}
            &= 
            \begin{bmatrix}
                I_{xx} & 0 & 0 \\
                0 & I_{yy} & 0 \\
                0 & 0 & I_{zz}
            \end{bmatrix}^{-1}
            \begin{bmatrix}
                {\color{#65DD18}\tau_x} \\
                0 \\
                0
            \end{bmatrix} \\
            \begin{bmatrix}
                {\color{magenta}\dot{\omega}_x} \\
                0 \\
                0
            \end{bmatrix}
            &= 
            \begin{bmatrix}
                \frac{1}{I_{xx}} & 0 & 0 \\
                0 & \frac{1}{I_{yy}} & 0 \\
                0 & 0 & \frac{1}{I_{zz}}
            \end{bmatrix}
            \begin{bmatrix}
                {\color{#65DD18}\tau_x} \\
                0 \\
                0
            \end{bmatrix} \\
            \begin{bmatrix}
                {\color{magenta}\dot{\omega}_x} \\
                0 \\
                0
            \end{bmatrix}
            &= 
            \begin{bmatrix}
                \frac{1}{I_{xx}} {\color{#65DD18}\tau_x} \\
                0 \\
                0
            \end{bmatrix}
        \end{align*}
        $$

Se juntarmos as equações cinéticas e cinemáticas, obtemos a dinâmica completa do sistema:
        
$$
\left\{
\begin{array}{l}
    {\color{magenta}\dot{y}} = {\color{magenta}v_y} \\ 
    {\color{magenta}\dot{z}} = {\color{magenta}v_z} \\
    {\color{magenta}\dot{\phi}} = {\color{magenta}\omega_x} \\ 
    {\color{magenta}\dot{v}_y} = - \frac{1}{m} \sin {\color{magenta}\phi} {\color{#65DD18}f_t} \\ 
    {\color{magenta}\dot{v}_z} = -g + \frac{1}{m} \cos {\color{magenta}\phi} {\color{#65DD18}f_t} \\ 
    {\color{magenta}\dot{\omega}_x} = \frac{1}{I_{xx}} {\color{#65DD18}\tau_x}
\end{array}
\right.
$$

Note que as equações acima são exatamente iguais às obtidas utilizando a notação escalar. 

### Sistema móvel

Não podemos aplicar a 2ª lei de Newton no sistema de coordenadas móvel pois ele não é um sistema de coordenadas inercial(1):
{.annotate}

1. Que não acelera ou rotaciona.
    
$$
\xcancel{
\left\{
\begin{array}{l}
        \sum {\color{cyan}\vec{f}\,'} = \frac{d}{dt} {\color{cyan}\vec{p}\,'} \\ 
        \sum {\color{cyan}\vec{\tau}\,'} = \frac{d}{dt} {\color{cyan}\vec{h}\,'}
\end{array}
\right.
}
$$

No entanto, é possível aplicar ela no sistema de coordenadas inercial e efetuar algumas transformações para o sistema de coordenadas móvel.

!!! question "Exercício 8"

!!! question "Exercício 9"

    Determine as equações cinéticas vetoriais, isto é, as equações das derivadas dos vetores de velocidades (${\color{cyan}\dot{\vec{v}}\,'}$ e ${\color{cyan}\dot{\vec{\omega}}\,'}$) em função das somatórias de forças e torques(1).
    {.annotate}

    1. O produto vetorial ${\color{cyan}\vec{\omega}\,'} \times$:

        $$
        \begin{align}
            {\color{cyan}\vec{\omega}\,'} \times \vec{v} &= 
            \begin{bmatrix}
            {\color{cyan}\omega_x\,'} \\
            0 \\
            0
            \end{bmatrix} 
            \times
            \begin{bmatrix}
            v_1 \\
            v_2 \\
            v_3
            \end{bmatrix} \\
            {\color{cyan}\vec{\omega}\,'} \times \vec{v} &= 
            \begin{bmatrix}
            0 \\
            - {\color{cyan}\omega_x\,'} v_3 \\
            {\color{cyan}\omega_x\,'} v_2 
            \end{bmatrix}
        \end{align}
        $$

        Também pode ser representado pelo produto de uma matriz anti-simétrica ${\color{cyan}\tilde{\omega}\,'}$:

        $$
        \begin{align}
            {\color{cyan}\tilde{\omega}\,'} \vec{v} &= 
            \begin{bmatrix}
                0 & 0 & 0 \\
                0 & 0 & -{\color{cyan}\omega_x\,'} \\
                0 & {\color{cyan}\omega_x\,'} & 0
            \end{bmatrix}  
            \begin{bmatrix}
            v_1 \\
            v_2 \\
            v_3
            \end{bmatrix} \\
            {\color{cyan}\tilde{\omega}\,'} \vec{v} &= 
            \begin{bmatrix}
            0 \\
            - {\color{cyan}\omega_x\,'} v_3 \\
            {\color{cyan}\omega_x\,'} v_2 
            \end{bmatrix}
        \end{align}
        $$

        Se expandirmos o termo $R \dot{R}^T$:

        $$
        \begin{align}
            R \dot{R}^T &= 
            \begin{bmatrix}
                1 & 0 & 0 \\
                0 & \cos{\color{magenta}\phi} & \sin{\color{magenta}\phi} \\
                0 & -\sin{\color{magenta}\phi} & \cos{\color{magenta}\phi}
            \end{bmatrix}   
            {
            \left(
            \frac{d}{dt}
            \begin{bmatrix}
                1 & 0 & 0 \\
                0 & \cos{\color{magenta}\phi} & \sin{\color{magenta}\phi} \\
                0 & -\sin{\color{magenta}\phi} & \cos{\color{magenta}\phi}
            \end{bmatrix} 
            \right)
            }^{T} \\
            R \dot{R}^T &= 
            \begin{bmatrix}
                1 & 0 & 0 \\
                0 & \cos{\color{magenta}\phi} & \sin{\color{magenta}\phi} \\
                0 & -\sin{\color{magenta}\phi} & \cos{\color{magenta}\phi}
            \end{bmatrix}   
            {
            \begin{bmatrix}
                0 & 0 & 0 \\
                0 & -\sin{\color{magenta}\phi}{\color{cyan}\omega_x\,'} & \cos{\color{magenta}\phi}{\color{cyan}\omega_x\,'} \\
                0 & -\cos{\color{magenta}\phi}{\color{cyan}\omega_x\,'} & -\sin{\color{magenta}\phi}{\color{cyan}\omega_x\,'}
            \end{bmatrix} 
            }^{T} \\
            R \dot{R}^T &= 
            \begin{bmatrix}
                1 & 0 & 0 \\
                0 & \cos{\color{magenta}\phi} & \sin{\color{magenta}\phi} \\
                0 & -\sin{\color{magenta}\phi} & \cos{\color{magenta}\phi}
            \end{bmatrix}   
            \begin{bmatrix}
                0 & 0 & 0 \\
                0 & -\sin{\color{magenta}\phi}{\color{cyan}\omega_x\,'} & -\cos{\color{magenta}\phi}{\color{cyan}\omega_x\,'} \\
                0 & \cos{\color{magenta}\phi}{\color{cyan}\omega_x\,'} & -\sin{\color{magenta}\phi}{\color{cyan}\omega_x\,'}
            \end{bmatrix} \\
            R \dot{R}^T &= 
            \begin{bmatrix}
                0 & 0 & 0 \\
                0 & -\cancel{\cos{\color{magenta}\phi}\sin{\color{magenta}\phi}{\color{cyan}\omega_x\,'}} + \cancel{\sin{\color{magenta}\phi}\cos{\color{magenta}\phi}{\color{cyan}\omega_x\,'}} & -\cos^2{\color{magenta}\phi}{\color{cyan}\omega_x\,'} -\sin^2{\color{magenta}\phi}{\color{cyan}\omega_x\,'}\\
                0 & \sin^2{\color{magenta}\phi}{\color{cyan}\omega_x\,'} + \cos^2{\color{magenta}\phi}{\color{cyan}\omega_x\,'} & \cancel{\sin{\color{magenta}\phi}\cos{\color{magenta}\phi}{\color{cyan}\omega_x\,'}} - \cancel{\cos{\color{magenta}\phi}\sin{\color{magenta}\phi}{\color{cyan}\omega_x\,'}}
            \end{bmatrix}  \\
            R \dot{R}^T &= 
            \begin{bmatrix}
                0 & 0 & 0 \\
                0 & 0 & -{\color{cyan}\omega_x\,'} \cancelto{1}{\left(\cos^2{\color{magenta}\phi} + \sin^2{\color{magenta}\phi} \right)} \\
                0 & {\color{cyan}\omega_x\,'} \cancelto{1}{\left(\sin^2{\color{magenta}\phi} + \cos^2{\color{magenta}\phi} \right)} & 0
            \end{bmatrix} \\
            R \dot{R}^T &= 
            \begin{bmatrix}
                0 & 0 & 0 \\
                0 & 0 & -{\color{cyan}\omega_x\,'} \\
                0 & {\color{cyan}\omega_x\,'} & 0
            \end{bmatrix} 
        \end{align}
        $$

        Concluimos que $R \dot{R}^T = {\color{cyan}\vec{\omega}\,'} \times$.
    
    ??? info "a) Escreva ${\color{cyan}\dot{\vec{v}}\,'}$ em função de $\sum{\color{cyan}\vec{f}\,'}$."
        $$
        \begin{align*}
            \sum {\color{magenta}\vec{f}} &= \frac{d}{dt} {\color{magenta}\vec{p}} \\
            \sum {\color{magenta}\vec{f}} &= \frac{d}{dt} \left( R^T {\color{cyan}\vec{p}\,'} \right) \\
            \sum {\color{magenta}\vec{f}} &= \dot{R}^T {\color{cyan}\vec{p}\,'} + R^T {\color{cyan}\dot{\vec{p}}\,'} \\
            R \sum {\color{magenta}\vec{f}} &= R \dot{R}^T {\color{cyan}\vec{p}\,'} + \cancel{R R^T} {\color{cyan}\dot{\vec{p}}\,'} \\
            \sum R {\color{magenta}\vec{f}} &= {\color{cyan}\vec{\omega}\,'} \times {\color{cyan}\vec{p}\,'} + {\color{cyan}\dot{\vec{p}}\,'} \\
            \sum {\color{cyan}\vec{f}\,'} &= {\color{cyan}\vec{\omega}\,'} \times m {\color{cyan}\vec{v}\,'} + m {\color{cyan}\dot{\vec{v}}\,'} \\
            {\color{cyan}\dot{\vec{v}}\,'} &= - {\color{cyan}\vec{\omega}\,'} \times {\color{cyan}\vec{v}\,'} + \frac{1}{m} \sum {\color{cyan}\vec{f}\,'}
        \end{align*} 
        $$
    
    ??? info "b) Escreva ${\color{cyan}\dot{\vec{\omega}}\,'}$ em função de $\sum{\color{cyan}\vec{\tau}\,'}$."
        $$
        \begin{align*}
            \sum {\color{magenta}\vec{\tau}} &= \frac{d}{dt} {\color{magenta}\vec{h}} \\
            \sum {\color{magenta}\vec{\tau}} &= \frac{d}{dt} \left( R^T {\color{cyan}\vec{h}\,'} \right) \\
            \sum {\color{magenta}\vec{\tau}} &= \dot{R}^T {\color{cyan}\vec{h}\,'} + R^T {\color{cyan}\dot{\vec{h}}\,'} \\
            R \sum {\color{magenta}\vec{\tau}} &= R \dot{R}^T {\color{cyan}\vec{h}\,'} + \cancel{R R^T} {\color{cyan}\dot{\vec{h}}\,'} \\
            \sum R {\color{magenta}\vec{\tau}} &= {\color{cyan}\vec{\omega}\,'} \times {\color{cyan}\vec{h}\,'} + {\color{cyan}\dot{\vec{h}}\,'} \\
            \sum {\color{cyan}\vec{\tau}\,'} &= {\color{cyan}\vec{\omega}\,'} \times I {\color{cyan}\vec{\omega}\,'} + I {\color{cyan}\dot{\vec{\omega}}\,'} \\
            {\color{cyan}\dot{\vec{\omega}}\,'} &= - I^{-1} \left( {\color{cyan}\vec{\omega}\,'} \times I {\color{cyan}\vec{\omega}\,'} \right) + I^{-1} \sum {\color{cyan}\vec{\tau}\,'}
        \end{align*}
        $$

Você deve ter chegado a:

$$
\left\{
\begin{array}{l}
        {\color{cyan}\dot{\vec{v}}\,'} = - {\color{cyan}\vec{\omega}\,'} \times {\color{cyan}\vec{v}\,'} + \frac{1}{m} \sum {\color{cyan}\vec{f}\,'} \\ 
        {\color{cyan}\dot{\vec{\omega}}\,'} = - I^{-1} \left( {\color{cyan}\vec{\omega}\,'} \times I {\color{cyan}\vec{\omega}\,'} \right) + I^{-1} \sum {\color{cyan}\vec{\tau}\,'}
\end{array}
\right.
$$

Essas equações são genéricas, ou seja, valem pro movimento de translação e rotação de qualquer corpo rígido em qualquer sistema de coordenadas (seja ele inercial ou não), basta substituir o valor das somatórias de forças e torques. 

Elas também são chamadas de equações de Newton-Euler, que foi quem generalizou a 2ª lei de Newton de um ponto material em um sistema de coordenadas inercial para um corpo rígido em um sistema de coordenadas não inercial.

!!! question "Exercício 10"

    Substitua as somatórias de forças e torques definidos inicialmente e determine as equações cinéticas.
        
    Dica: cuidado com os sistemas de coordenadas em que eles estão descritos.
    
    ??? info "a) Escreva ${\color{cyan}\dot{\vec{v}}\,'}$ em função dos estados do sistema."
        $$
        \begin{align*}
            {\color{cyan}\dot{\vec{v}}\,'} &= - {\color{cyan}\vec{\omega}\,'} \times {\color{cyan}\vec{v}\,'} + \frac{1}{m} \sum {\color{cyan}\vec{f}\,'} \\ 
            {\color{cyan}\dot{\vec{v}}\,'} &= - {\color{cyan}\vec{\omega}\,'} \times {\color{cyan}\vec{v}\,'} + \frac{1}{m} \left( - m {\color{cyan}\vec{g}\,'} + {\color{cyan}\vec{f}\,'} \right) \\
            {\color{cyan}\dot{\vec{v}}\,'} &= - {\color{cyan}\vec{\omega}\,'} \times {\color{cyan}\vec{v}\,'} - R {\color{magenta}\vec{g}} + \frac{1}{m} {\color{cyan}\vec{f}\,'} \\ 
            \begin{bmatrix}
                0 \\
                {\color{cyan}\dot{v}_y\,'} \\
                {\color{cyan}\dot{v}_z\,'}
            \end{bmatrix}
            &=
            -
            \begin{bmatrix}
                {\color{cyan}\omega_x\,'} \\
                0 \\
                0
            \end{bmatrix}
            \times
            \begin{bmatrix}
                0 \\
                {\color{cyan}v_y\,'} \\
                {\color{cyan}v_z\,'}
            \end{bmatrix}
            -
            \begin{bmatrix}
                1 & 0 & 0 \\
                0 & \cos{\color{magenta}\phi} & \sin{\color{magenta}\phi} \\
                0 & -\sin{\color{magenta}\phi} & \cos{\color{magenta}\phi}
            \end{bmatrix}
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
                0 \\
                {\color{cyan}\dot{v}_y\,'} \\
                {\color{cyan}\dot{v}_z\,'}
            \end{bmatrix}
            &=
            \begin{bmatrix}
                0 \\
                {\color{cyan}\omega_x\,' v_z\,'} - g \sin{\color{magenta}\phi} \\
                -{\color{cyan}\omega_x\,' v_y\,'} - g \cos{\color{magenta}\phi} + \frac{1}{m} {\color{#65DD18}f_t}
            \end{bmatrix}
        \end{align*}  
        $$
    
    ??? info "b) Escreva ${\color{cyan}\dot{\vec{\omega}}\,'}$ em função dos estados do sistema."
        $$
        \begin{align*}
            {\color{cyan}\dot{\vec{\omega}}\,'} &= - I^{-1} \left( {\color{cyan}\omega\,'} \times I {\color{cyan}\vec{\omega}\,'} \right) + I^{-1} \sum {\color{cyan}\vec{\tau}\,'} \\ 
            {\color{cyan}\dot{\vec{\omega}}\,'} &= - I^{-1} \left( {\color{cyan}\omega\,'} \times I {\color{cyan}\vec{\omega}\,'} \right) + I^{-1} {\color{cyan}\vec{\tau}_x\,'} \\ 
            \begin{bmatrix}
                {\color{cyan}\dot{\omega}_x\,'} \\
                0 \\
                0
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
                0 \\
                0
            \end{bmatrix}
            \times
            \begin{bmatrix}
                I_{xx} & 0 & 0 \\
                0 & I_{yy} & 0 \\
                0 & 0 & I_{zz}
            \end{bmatrix}
            \begin{bmatrix}
                {\color{cyan}\omega_x\,'} \\
                0 \\
                0
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
                0 \\
                0
            \end{bmatrix} \\
            \begin{bmatrix}
                {\color{cyan}\dot{\omega}_x\,'} \\
                0 \\
                0
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
                0 \\
                0
            \end{bmatrix}
            \times
            \begin{bmatrix}
                I_{xx} {\color{cyan}\omega_x\,'} \\
                0 \\
                0
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
                0 \\
                0
            \end{bmatrix} \\
            \begin{bmatrix}
                {\color{cyan}\dot{\omega}_x\,'} \\
                0 \\
                0
            \end{bmatrix}
            &= 
            \begin{bmatrix}
                \frac{1}{I_{xx}} {\color{#65DD18}\tau_x} \\
                0 \\
                0
            \end{bmatrix}
        \end{align*}
        $$

Se juntarmos as equações cinéticas e cinemáticas, obtemos a dinâmica completa do sistema:
        
$$
\left\{
\begin{array}{l}
    {\color{magenta}\dot{y}} =  {\color{cyan}v_y\,'} \cos {\color{magenta}\phi} -  {\color{cyan}v_z\,'} \sin {\color{magenta}\phi} \\ 
    {\color{magenta}\dot{z}} =  {\color{cyan}v_y\,'} \sin {\color{magenta}\phi} +  {\color{cyan}v_z\,'} \cos {\color{magenta}\phi} \\
    {\color{magenta}\dot{\phi}} =  {\color{cyan}\omega_x\,'} \\ 
    {\color{cyan}\dot{v}_y\,'} = {\color{cyan}v_z\,' \omega_x\,'} - g \sin {\color{magenta}\phi} \\ 
    {\color{cyan}\dot{v}_z\,'} = - {\color{cyan}v_y\,' \omega_x\,'} - g \cos {\color{magenta}\phi} + \frac{1}{m} {\color{#65DD18}f_t} \\ 
    {\color{cyan}\dot{\omega}_x\,'} = \frac{1}{I_{xx}} {\color{#65DD18}\tau_x}
\end{array}
\right.
$$

Note que as equações acima são exatamente iguais às obtidas utilizando a notação escalar. 

---

## Linearização

O sistema obtido é não-linear. Para linearizá-lo, podemos considerar aproximações quando os estados estão bem próximos de suas posições de equilíbrio. Neste caso, funções trigonométricas podem ser aproximadas (ex: $\cos{\color{magenta}\phi} \approx 1$ e $\sin{\color{magenta}\phi} \approx {\color{magenta}\phi}$) (1), assim como o produto entre dois estados (ex: ${\color{cyan}v_z\,' \omega_x\,'} \approx 0$).
{.annotate}

1. Essas aproximações valem apenas para ângulos em radianos menores que $10^{\circ}$.

!!! question "Exercício 11"

    Determine as equações dinâmicas do sistema linearizado.
    
    ??? info "Resposta"
        $$
        \left\{
        \begin{array}{l}
            {\color{magenta}\dot{y}} =  {\color{cyan}v_y\,'} \cancelto{1}{\cos {\color{magenta}\phi}} -  {\color{cyan}v_z\,'} \cancelto{{\color{magenta}\phi}}{\sin {\color{magenta}\phi}} \\ 
            {\color{magenta}\dot{z}} =  {\color{cyan}v_y\,'} \cancelto{{\color{magenta}\phi}}{\sin {\color{magenta}\phi}} +  {\color{cyan}v_z\,'} \cancelto{1}{\cos {\color{magenta}\phi}} \\
            {\color{magenta}\dot{\phi}} =  {\color{cyan}\omega_x\,'} \\ 
            {\color{cyan}\dot{v}_y\,'} = \cancelto{0}{\color{cyan}v_z\,' \omega_x\,'} - g \cancelto{{\color{magenta}\phi}}{\sin {\color{magenta}\phi}} \\ 
            {\color{cyan}\dot{v}_z\,'} = - \cancelto{0}{\color{cyan}v_y\,' \omega_x\,'} - g \cancelto{1}{\cos {\color{magenta}\phi}} + \frac{1}{m} {\color{#65DD18}f_t} \\ 
            {\color{cyan}\dot{\omega}_x\,'} = \frac{1}{I_{xx}} {\color{#65DD18}\tau_x}
        \end{array}
        \right.
        \qquad \longrightarrow \qquad
        \left\{
        \begin{array}{l}
            {\color{magenta}\dot{y}} =  {\color{cyan}v_y\,'} - \cancelto{0}{{\color{cyan}v_z\,'} {\color{magenta}\phi}} \\
            {\color{magenta}\dot{z}} =  \cancelto{0}{{\color{cyan}v_y\,'} {\color{magenta}\phi}} + {\color{cyan}v_z\,'} \\
            {\color{magenta}\dot{\phi}} =  {\color{cyan}\omega_x\,'} \\ 
            {\color{cyan}\dot{v}_y\,'} = - g {\color{magenta}\phi} \\ 
            {\color{cyan}\dot{v}_z\,'} = -g + \frac{1}{m} {\color{#65DD18}f_t} \\ 
            {\color{cyan}\dot{\omega}_x\,'} = \frac{1}{I_{xx}} {\color{#65DD18}\tau_x}
        \end{array}
        \right.
        \qquad \longrightarrow \qquad
        \left\{
        \begin{array}{l}
            {\color{magenta}\dot{y}} =  {\color{cyan}v_y\,'} \\
            {\color{magenta}\dot{z}} =  {\color{cyan}v_z\,'} \\
            {\color{magenta}\dot{\phi}} =  {\color{cyan}\omega_x\,'} \\ 
            {\color{cyan}\dot{v}_y\,'} = - g {\color{magenta}\phi} \\ 
            {\color{cyan}\dot{v}_z\,'} = -g + \frac{1}{m} {\color{#65DD18}f_t} \\ 
            {\color{cyan}\dot{\omega}_x\,'} = \frac{1}{I_{xx}} {\color{#65DD18}\tau_x}
        \end{array}
        \right.
        $$

Você deve ter chegado a:

$$
\left\{
\begin{array}{l}
    {\color{magenta}\dot{y}} =  {\color{cyan}v_y\,'} \\
    {\color{magenta}\dot{z}} =  {\color{cyan}v_z\,'} \\
    {\color{magenta}\dot{\phi}} =  {\color{cyan}\omega_x\,'} \\ 
    {\color{cyan}\dot{v}_y\,'} = - g {\color{magenta}\phi} \\ 
    {\color{cyan}\dot{v}_z\,'} = -g + \frac{1}{m} {\color{#65DD18}f_t} \\ 
    {\color{cyan}\dot{\omega}_x\,'} = \frac{1}{I_{xx}} {\color{#65DD18}\tau_x}
\end{array}
\right.    
$$

Apesar lembrar as equações diferenciais obtidas no sistema de coordenadas inercial, ela possui uma diferença muito importante, que aparece exatamente na dinâmica horizontal: a aceleração ${\color{cyan}\dot{v}_y\,'}$ não depende da força ${\color{#65DD18}f_t}$ mas sim do ângulo ${\color{magenta}\phi}$.

Isso fica evidente ao representarmos as equações diferenciais em um diagrama de blocos:

![](images/2d_plant.svg){: width=100% style="display: block; margin: auto;" }

Observe o seguinte:

- A força ${\color{#65DD18}f_t}$ integra duas vezes até a posição ${\color{magenta}z}$ (2ª lei de Newton para translação), atuando de forma desacoplada na dinâmica de posição vertical.
- O torque ${\color{#65DD18}\tau_x}$ integra duas vezes até o ângulo ${\color{magenta}\phi}$ (2ª lei de Newton para rotação), e, integrando mais duas vezes, chega-se a posição ${\color{magenta}y}$. 
- Portanto, de ${\color{#65DD18}\tau_x}$ a ${\color{magenta}y}$ há um integrador quádruplo, resultado do acoplamento entre a dinâmica de rotação e a dinâmica de posição horizontal. 
- O sinal negativo em $- g$ decorre da convenção de eixos adotada (uma rotação positiva em torqno de ${\color{magenta}x}$ implica em um deslocamento negativo ao longo de ${\color{magenta}y}$).