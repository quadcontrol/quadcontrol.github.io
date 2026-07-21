---
title: Modelo 3D
icon: material/video-3d
---

# :material-video-3d: 3D Model

We now derive the differential equations that describe the three-dimensional dynamics of a quadcopter. In this complete model, the drone can translate and rotate freely in space, capturing both the richness and the complexity of the problem. Describing this motion requires vector algebra and rotation matrices, which provide a convenient framework for representing positions, velocities, and orientations in three dimensions.

---

## Introduction

The 3D model has six degrees of freedom (three translational and three rotational). Therefore, we must derive twelve differential equations (two for each degree of freedom)(1).
{.annotate}

1. For clarity, we will use the following colors and notation:
    - ${\color{var(--c1)} x}$ — States (inertial frame)
    - ${\color{var(--c3)} x\,'}$ — States (body-fixed frame)
    - ${\color{var(--c2)} u}$ — Inputs
    - $m$ — Constants

![](images/3d_drone.svg){: width="800" style="display: block; margin: auto;" }

Using vector notation is much simpler than using scalar notation, since the Newton–Euler equations need to be applied only twice, once for translation and once for rotation, instead of six times, once for each degree of freedom.

The positions and Euler angles will be expressed in the inertial frame, while the linear and angular velocities will be expressed in the body-fixed frame. Therefore, the system state vectors are ${\color{var(--c1)}\vec{r}}$, ${\color{var(--c1)}\vec{\delta}}$, ${\color{var(--c3)}\vec{v}\,'}$, and ${\color{var(--c3)}\vec{\omega}\,'}$, where:

$$
{\color{var(--c1)}\vec{r}}
=
\begin{bmatrix}
    {\color{var(--c1)}x} \\
    {\color{var(--c1)}y} \\
    {\color{var(--c1)}z}
\end{bmatrix}
\qquad
{\color{var(--c1)}\vec{\delta}}
=
\begin{bmatrix}
    {\color{var(--c1)}\phi} \\
    {\color{var(--c1)}\theta} \\
    {\color{var(--c1)}\psi}
\end{bmatrix}
\qquad
{\color{var(--c3)}\vec{v}\,'}
=
\begin{bmatrix}
    {\color{var(--c3)}v_x\,'} \\
    {\color{var(--c3)}v_y\,'} \\
    {\color{var(--c3)}v_z\,'}
\end{bmatrix}
\qquad
{\color{var(--c3)}\vec{\omega}\,'}
=
\begin{bmatrix}
    {\color{var(--c3)}\omega_x\,'} \\
    {\color{var(--c3)}\omega_y\,'} \\
    {\color{var(--c3)}\omega_z\,'}
\end{bmatrix}
$$

---

## Kinematics

The rotation matrix based on yaw-pitch-roll Euler-angles was [derived](../fundamentals/reference_frames.md/#exercise_4_6) previously:

$$
\begin{bmatrix}
    {\color{var(--c1)}x} \\
    {\color{var(--c1)}y} \\
    {\color{var(--c1)}z} \\
\end{bmatrix}
=
\underbrace{
\begin{bmatrix}
    \cos{\color{var(--c1)}\theta}\cos{\color{var(--c1)}\psi} & \cos{\color{var(--c1)}\theta}\sin{\color{var(--c1)}\psi} & -\sin{\color{var(--c1)}\theta} \\ 
    \sin{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\cos{\color{var(--c1)}\psi} - \cos{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\psi} & \sin{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\sin{\color{var(--c1)}\psi} + \cos{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\psi} & \sin{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta} \\ 
    \cos{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\cos{\color{var(--c1)}\psi} + \sin{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\psi} & \cos{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\sin{\color{var(--c1)}\psi} - \sin{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\psi} & \cos{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta} 
\end{bmatrix}
}_{R}
\begin{bmatrix}
    {\color{var(--c3)}x\,'} \\
    {\color{var(--c3)}y\,'} \\
    {\color{var(--c3)}z\,'} \\
\end{bmatrix}
$$

### Translation

!!! question "Exercise 9.1"

    Express ${\color{var(--c1)}\dot{\vec{r}}}$ in terms of the system states.
    
    ??? info "Solution"

        $$
        \begin{align*}
            {\color{var(--c1)}\dot{\vec{r}}} &= R^T {\color{var(--c3)}{\vec{v}}\,'} \\
            \begin{bmatrix}
                {\color{var(--c1)}\dot{x}} \\
                {\color{var(--c1)}\dot{y}} \\
                {\color{var(--c1)}\dot{z}} \\
            \end{bmatrix}
            &=
            \begin{bmatrix}
                \cos{\color{var(--c1)}\theta}\cos{\color{var(--c1)}\psi} & \sin{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\cos{\color{var(--c1)}\psi} - \cos{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\psi} & \cos{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\cos{\color{var(--c1)}\psi} + \sin{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\psi} \\
                \cos{\color{var(--c1)}\theta}\sin{\color{var(--c1)}\psi} & \sin{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\sin{\color{var(--c1)}\psi} + \cos{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\psi} & \cos{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\sin{\color{var(--c1)}\psi} - \sin{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\psi} \\
                -\sin{\color{var(--c1)}\theta} & \sin{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta} & \cos{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta}
            \end{bmatrix}
            \begin{bmatrix}
                {\color{var(--c3)}v_x\,'} \\
                {\color{var(--c3)}v_y\,'} \\
                {\color{var(--c3)}v_z\,'} \\
            \end{bmatrix} \\
            \begin{bmatrix}
                {\color{var(--c1)}\dot{x}} \\
                {\color{var(--c1)}\dot{y}} \\
                {\color{var(--c1)}\dot{z}} \\
            \end{bmatrix}
            &=
            \begin{bmatrix}
                {\color{var(--c3)}v_x\,'} \cos{\color{var(--c1)}\theta}\cos{\color{var(--c1)}\psi} + {\color{var(--c3)}v_y\,'} \left( \sin{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\cos{\color{var(--c1)}\psi} - \cos{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\psi} \right) + {\color{var(--c3)}v_z\,'} \left( \cos{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\cos{\color{var(--c1)}\psi} + \sin{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\psi} \right) \\
                {\color{var(--c3)}v_x\,'} \cos{\color{var(--c1)}\theta}\sin{\color{var(--c1)}\psi} + {\color{var(--c3)}v_y\,'} \left( \sin{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\sin{\color{var(--c1)}\psi} + \cos{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\psi} \right) + {\color{var(--c3)}v_z\,'} \left( \cos{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\sin{\color{var(--c1)}\psi} - \sin{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\psi} \right) \\
                - {\color{var(--c3)}v_x\,'} \sin{\color{var(--c1)}\theta} + {\color{var(--c3)}v_y\,'}  \sin{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta} + {\color{var(--c3)}v_z\,'}  \cos{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta}
            \end{bmatrix}
        \end{align*}
        $$


### Rotation

!!! question "Exercise 9.2"

    Express ${\color{var(--c1)}\dot{\vec{\delta}}}$ in terms of the system states.

    ??? info "Solution"

        Consider a body-fixed frame rotating about the origin with angular velocity vector ${\color{var(--c3)}\vec{\omega}\,'}$ given by:

        $$
        {\color{var(--c3)}\vec{\omega}\,'} =
        \begin{bmatrix}
            {\color{var(--c3)}\omega_x\,'} \\
            {\color{var(--c3)}\omega_y\,'} \\
            {\color{var(--c3)}\omega_z\,'}
        \end{bmatrix}
        $$

        Since the vector ${\color{var(--c1)}\vec{r}}$ is fixed in the inertial frame, its time derivative, as observed from the inertial frame, is zero:

        $$
        {\color{var(--c1)}\dot{\vec{r}}} = \vec{0}
        $$

        On the other hand, its time derivative, as observed from the body-fixed frame, depends on the angular velocity of the body-fixed frame(1):
        {.annotate}

        1. The negative sign appears because, if the body-fixed frame rotates in one direction, the vector appears to rotate in the opposite direction when observed from the body-fixed frame.

        $$
        {\color{var(--c3)}\dot{\vec{r}}\,'} = -{\color{var(--c3)}\vec{\omega}\,'}\times{\color{var(--c3)}\vec{r}\,'}
        $$

        This equation can also be written as:

        $$
        {\color{var(--c3)}\dot{\vec{r}}\,'} = -{\color{var(--c3)}\tilde{\omega}\,'}{\color{var(--c3)}\vec{r}\,'}
        $$

        where $\tilde{\omega}\,'$ is the skew-symmetric matrix associated with the cross product by the angular velocity:

        $$
        {\color{var(--c3)}\tilde{\omega}\,'} = {\color{var(--c3)}\vec{\omega}\,'}\times =
        \begin{bmatrix}
            0 & -{\color{var(--c3)}\omega_z\,'} & {\color{var(--c3)}\omega_y\,'} \\
            {\color{var(--c3)}\omega_z\,'} & 0 & -{\color{var(--c3)}\omega_x\,'} \\
            -{\color{var(--c3)}\omega_y\,'} & {\color{var(--c3)}\omega_x\,'} & 0
        \end{bmatrix}
        $$

        Differentiating the coordinate transformation yields:

        \begin{align}
            {\color{var(--c3)}\dot{\vec{r}}\,'} &= \frac{d}{dt}\left({\color{var(--c3)}\vec{r}\,'}\right) \nonumber \\
            {\color{var(--c3)}\dot{\vec{r}}\,'} &= \frac{d}{dt}\left(R{\color{var(--c1)}\vec{r}}\right) \nonumber \\
            {\color{var(--c3)}\dot{\vec{r}}\,'} &= \dot{R}{\color{var(--c1)}\vec{r}} + R\cancelto{\vec{0}}{{\color{var(--c1)}\dot{\vec{r}}}} \nonumber \\
            {\color{var(--c3)}\dot{\vec{r}}\,'} &= \dot{R}\left(R^T{\color{var(--c3)}\vec{r}\,'}\right) \nonumber \\
            {\color{var(--c3)}\dot{\vec{r}}\,'} &= \dot{R}R^T{\color{var(--c3)}\vec{r}\,'}
        \end{align}

        Comparing this result with the previous equation, we obtain the skew-symmetric matrix associated with the angular velocity in terms of the rotation matrix and its time derivative:

        $$
        {\color{var(--c3)}\tilde{\omega}\,'} = -\dot{R}R^T
        $$

        Euler angles do not form a vector and therefore cannot be isolated directly. However, by substituting $R$ and $\dot{R}$, the angular velocities can be expressed in terms of the Euler angles and their time derivatives in matrix form:

        $$
        \begin{bmatrix}
            {\color{var(--c3)}\omega_x\,'} \\
            {\color{var(--c3)}\omega_y\,'} \\
            {\color{var(--c3)}\omega_z\,'}
        \end{bmatrix}
        =
        \begin{bmatrix}
            1 & 0 & -\sin{\color{var(--c1)}\theta} \\
            0 & \cos{\color{var(--c1)}\phi} & \sin{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta} \\
            0 & -\sin{\color{var(--c1)}\phi} & \cos{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta}
        \end{bmatrix}
        \begin{bmatrix}
            {\color{var(--c1)}\dot{\phi}} \\
            {\color{var(--c1)}\dot{\theta}} \\
            {\color{var(--c1)}\dot{\psi}}
        \end{bmatrix}
        $$

        By inverting the matrix above, the time derivatives of the Euler angles can be expressed in terms of the Euler angles themselves and the angular velocities:

        $$
        \begin{bmatrix}
            {\color{var(--c1)}\dot{\phi}} \\
            {\color{var(--c1)}\dot{\theta}} \\
            {\color{var(--c1)}\dot{\psi}}
        \end{bmatrix}
        =
        \begin{bmatrix}
            1 & \sin{\color{var(--c1)}\phi}\tan{\color{var(--c1)}\theta} & \cos{\color{var(--c1)}\phi}\tan{\color{var(--c1)}\theta} \\
            0 & \cos{\color{var(--c1)}\phi} & -\sin{\color{var(--c1)}\phi} \\
            0 & \sin{\color{var(--c1)}\phi}\sec{\color{var(--c1)}\theta} & \cos{\color{var(--c1)}\phi}\sec{\color{var(--c1)}\theta}
        \end{bmatrix}
        \begin{bmatrix}
            {\color{var(--c3)}\omega_x\,'} \\
            {\color{var(--c3)}\omega_y\,'} \\
            {\color{var(--c3)}\omega_z\,'}
        \end{bmatrix}
        $$

        This equation is the kinematic equation of a rigid body expressed using yaw–pitch–roll Euler angles.

        Since the matrix contains the terms $\tan{\color{var(--c1)}\theta}$ and $\sec{\color{var(--c1)}\theta}$, we can factor out $\frac{1}{\cos{\color{var(--c1)}\theta}}$:

        $$
        \begin{bmatrix}
            {\color{var(--c1)}\dot{\phi}} \\
            {\color{var(--c1)}\dot{\theta}} \\
            {\color{var(--c1)}\dot{\psi}}
        \end{bmatrix}
        =
        \frac{1}{\cos{\color{var(--c1)}\theta}}
        \begin{bmatrix}
            \cos{\color{var(--c1)}\theta} & \sin{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta} & \cos{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta} \\
            0 & \cos{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta} & -\sin{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta} \\
            0 & \sin{\color{var(--c1)}\phi} & \cos{\color{var(--c1)}\phi}
        \end{bmatrix}
        \begin{bmatrix}
            {\color{var(--c3)}\omega_x\,'} \\
            {\color{var(--c3)}\omega_y\,'} \\
            {\color{var(--c3)}\omega_z\,'}
        \end{bmatrix}
        $$

        This expression clearly reveals the singularity that occurs when $\theta=\pm90^\circ$, where the denominator $\cos{\color{var(--c1)}\theta}$ becomes zero.

---

## Kinetics

The Newton–Euler equations were [derived](2d_model.md/#newton_euler_equations) previously:
        
$$
\left\{
\begin{array}{l}
        {\color{var(--c3)}\dot{\vec{v}}\,'} = - {\color{var(--c3)}\vec{\omega}\,'} \times {\color{var(--c3)}\vec{v}\,'} + \frac{1}{m} \sum {\color{var(--c3)}\vec{f}\,'} \\ 
        {\color{var(--c3)}\dot{\vec{\omega}}\,'} = - I^{-1} \left( {\color{var(--c3)}\vec{\omega}\,'} \times I {\color{var(--c3)}\vec{\omega}\,'} \right) + I^{-1} \sum {\color{var(--c3)}\vec{\tau}\,'}
\end{array}
\right.
$$

### Translation

The drone thrust vector ${\color{var(--c3)}\vec{f}_d\,'}$ is most conveniently expressed in the body-fixed frame, whereas the gravity ${\color{var(--c1)}\vec{g}}$ in the inertial frame:

$$
{\color{var(--c3)}\vec{f_d}\,'} = 
\begin{bmatrix}
    0 \\
    0 \\
    {\color{var(--c2)}f_t} 
\end{bmatrix}
\qquad
{\color{var(--c1)}\vec{g}} =
\begin{bmatrix}
    0 \\
    0 \\
    g
\end{bmatrix}
$$

!!! question "Exercise 9.3"

    Express ${\color{var(--c3)}\dot{\vec{v}}\,'}$ in terms of the system states.

    Hint: Substitute the force summation $\sum {\color{var(--c3)}\vec{f}\,'}$ into the translational Newton–Euler equation.

    ??? info "Solution"

        $$
        \begin{align*}
            {\color{var(--c3)}\dot{\vec{v}}\,'} &= - {\color{var(--c3)}\vec{\omega}\,'} \times {\color{var(--c3)}\vec{v}\,'} + \frac{1}{m} \sum {\color{var(--c3)}\vec{f}\,'} \\ 
            {\color{var(--c3)}\dot{\vec{v}}\,'} &= - {\color{var(--c3)}\vec{\omega}\,'} \times {\color{var(--c3)}\vec{v}\,'} + \frac{1}{m} \left( - m {\color{var(--c3)}\vec{g}\,'} + {\color{var(--c3)}\vec{f}_d\,'} \right) \\
            {\color{var(--c3)}\dot{\vec{v}}\,'} &= - {\color{var(--c3)}\vec{\omega}\,'} \times {\color{var(--c3)}\vec{v}\,'} - R {\color{var(--c1)}\vec{g}} + \frac{1}{m} {\color{var(--c3)}\vec{f}_d\,'} \\ 
            \begin{bmatrix}
                {\color{var(--c3)}\dot{v}_x\,'} \\
                {\color{var(--c3)}\dot{v}_y\,'} \\
                {\color{var(--c3)}\dot{v}_z\,'}
            \end{bmatrix}
            &=
            -
            \begin{bmatrix}
                {\color{var(--c3)}\omega_x\,'} \\
                {\color{var(--c3)}\omega_y\,'} \\
                {\color{var(--c3)}\omega_z\,'}
            \end{bmatrix}
            \times
            \begin{bmatrix}
                {\color{var(--c3)}v_x\,'} \\
                {\color{var(--c3)}v_y\,'} \\
                {\color{var(--c3)}v_z\,'}
            \end{bmatrix}
            -
            \begin{bmatrix} 
                    \text{c}{\color{var(--c1)}\theta}\text{c}{\color{var(--c1)}\psi} & \text{c}{\color{var(--c1)}\theta}\text{s}{\color{var(--c1)}\psi} & -\text{s}{\color{var(--c1)}\theta} \\ 
                    - \text{c}{\color{var(--c1)}\phi}\text{s}{\color{var(--c1)}\psi} + \text{s}{\color{var(--c1)}\phi}\text{s}{\color{var(--c1)}\theta}\text{c}{\color{var(--c1)}\psi}  & \text{c}{\color{var(--c1)}\phi}\text{c}{\color{var(--c1)}\psi} + \text{s}{\color{var(--c1)}\phi}\text{s}{\color{var(--c1)}\theta}\text{s}{\color{var(--c1)}\psi} & \text{s}{\color{var(--c1)}\phi}\text{c}{\color{var(--c1)}\theta} \\ 
                    \text{s}{\color{var(--c1)}\phi}\text{s}{\color{var(--c1)}\psi} + \text{c}{\color{var(--c1)}\phi}\text{s}{\color{var(--c1)}\theta}\text{c}{\color{var(--c1)}\psi} & - \text{s}{\color{var(--c1)}\phi}\text{c}{\color{var(--c1)}\psi} + \text{c}{\color{var(--c1)}\phi}\text{s}{\color{var(--c1)}\theta}\text{s}{\color{var(--c1)}\psi}  & \text{c}{\color{var(--c1)}\phi}\text{c}{\color{var(--c1)}\theta} \end{bmatrix}
            \begin{bmatrix}
                0 \\
                0 \\
                g
            \end{bmatrix}
            + \frac{1}{m}
            \begin{bmatrix}
                0 \\
                0 \\
                {\color{var(--c2)}f_t}
            \end{bmatrix} \\
            \begin{bmatrix}
                {\color{var(--c3)}\dot{v}_x\,'} \\
                {\color{var(--c3)}\dot{v}_y\,'} \\
                {\color{var(--c3)}\dot{v}_z\,'}
            \end{bmatrix}
            &=
            \begin{bmatrix}
                - {\color{var(--c3)}\omega_y\,' v_z\,'} + {\color{var(--c3)}\omega_z\,' v_y\,'} + g \sin{\color{var(--c1)}\theta} \\
                - {\color{var(--c3)}\omega_z\,' v_x\,'} + {\color{var(--c3)}\omega_x\,' v_z\,'} - g \sin{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta} \\
                - {\color{var(--c3)}\omega_x\,' v_y\,'} + {\color{var(--c3)}\omega_y\,' v_x\,'} - g \cos{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta} + \frac{1}{m} {\color{var(--c2)}f_t}
            \end{bmatrix}
        \end{align*}
        $$

### Rotation

The drone torque vector ${\color{var(--c3)}\vec{\tau}_d\,'}$ is most conveniently expressed in the body-fixed frame:

$$
{\color{var(--c3)}\vec{\tau_d}\,'} = 
\begin{bmatrix}
    {\color{var(--c2)}\tau_x} \\
    {\color{var(--c2)}\tau_y} \\
    {\color{var(--c2)}\tau_z}
\end{bmatrix}
$$

!!! question "Exercise 9.4"

    Express ${\color{var(--c3)}\dot{\vec{\omega}}\,'}$ in terms of the system states.

    Hint: Substitute the torque summation $\sum {\color{var(--c3)}\vec{\tau}\,'}$ into the rotational Newton–Euler equation.

    ??? info "Solution"

        $$
        \begin{align*}
            {\color{var(--c3)}\dot{\vec{\omega}}\,'} &= - I^{-1} \left( {\color{var(--c3)}\omega\,'} \times I {\color{var(--c3)}\vec{\omega}\,'} \right) + I^{-1} \sum {\color{var(--c3)}\vec{\tau}\,'} \\ 
            {\color{var(--c3)}\dot{\vec{\omega}}\,'} &= - I^{-1} \left( {\color{var(--c3)}\omega\,'} \times I {\color{var(--c3)}\vec{\omega}\,'} \right) + I^{-1} {\color{var(--c3)}\vec{\tau}_d\,'} \\ 
            \begin{bmatrix}
                {\color{var(--c3)}\dot{\omega}_x\,'} \\
                {\color{var(--c3)}\dot{\omega}_y\,'} \\
                {\color{var(--c3)}\dot{\omega}_z\,'}
            \end{bmatrix}
            &= -
            \begin{bmatrix}
                I_{xx} & 0 & 0 \\
                0 & I_{yy} & 0 \\
                0 & 0 & I_{zz}
            \end{bmatrix}^{-1}
            \left( 
            \begin{bmatrix}
                {\color{var(--c3)}\omega_x\,'} \\
                {\color{var(--c3)}\omega_y\,'} \\
                {\color{var(--c3)}\omega_z\,'}
            \end{bmatrix}
            \times
            \begin{bmatrix}
                I_{xx} & 0 & 0 \\
                0 & I_{yy} & 0 \\
                0 & 0 & I_{zz}
            \end{bmatrix}
            \begin{bmatrix}
                {\color{var(--c3)}\omega_x\,'} \\
                {\color{var(--c3)}\omega_y\,'} \\
                {\color{var(--c3)}\omega_z\,'}
            \end{bmatrix}
            \right)
            +
            \begin{bmatrix}
                I_{xx} & 0 & 0 \\
                0 & I_{yy} & 0 \\
                0 & 0 & I_{zz}
            \end{bmatrix}^{-1}
            \begin{bmatrix}
                {\color{var(--c2)}\tau_x} \\
                {\color{var(--c2)}\tau_y} \\
                {\color{var(--c2)}\tau_z}
            \end{bmatrix} \\
            \begin{bmatrix}
                {\color{var(--c3)}\dot{\omega}_x\,'} \\
                {\color{var(--c3)}\dot{\omega}_y\,'} \\
                {\color{var(--c3)}\dot{\omega}_z\,'}
            \end{bmatrix}
            &= -
            \begin{bmatrix}
                \frac{1}{I_{xx}} & 0 & 0 \\
                0 & \frac{1}{I_{yy}} & 0 \\
                0 & 0 & \frac{1}{I_{zz}}
            \end{bmatrix}
            \left( 
            \begin{bmatrix}
                {\color{var(--c3)}\omega_x\,'} \\
                {\color{var(--c3)}\omega_y\,'} \\
                {\color{var(--c3)}\omega_z\,'}
            \end{bmatrix}
            \times
            \begin{bmatrix}
                I_{xx} {\color{var(--c3)}\omega_x\,'} \\
                I_{yy} {\color{var(--c3)}\omega_y\,'} \\
                I_{zz} {\color{var(--c3)}\omega_z\,'}
            \end{bmatrix}
            \right)
            +
            \begin{bmatrix}
                \frac{1}{I_{xx}} & 0 & 0 \\
                0 & \frac{1}{I_{yy}} & 0 \\
                0 & 0 & \frac{1}{I_{zz}}
            \end{bmatrix}
            \begin{bmatrix}
                {\color{var(--c2)}\tau_x} \\
                {\color{var(--c2)}\tau_y} \\
                {\color{var(--c2)}\tau_z}
            \end{bmatrix} \\
            \begin{bmatrix}
                {\color{var(--c3)}\dot{\omega}_x\,'} \\
                {\color{var(--c3)}\dot{\omega}_y\,'} \\
                {\color{var(--c3)}\dot{\omega}_z\,'}
            \end{bmatrix}
            &= 
            \begin{bmatrix}
                - \frac{I_{zz}-I_{yy}}{I_{xx}} {\color{var(--c3)}\omega_y\,' \omega_z\,'} + \frac{1}{I_{xx}} {\color{var(--c2)}\tau_x} \\
                - \frac{I_{xx}-I_{zz}}{I_{yy}} {\color{var(--c3)}\omega_x\,' \omega_z\,'} + \frac{1}{I_{yy}} {\color{var(--c2)}\tau_y} \\
                - \frac{I_{yy}-I_{xx}}{I_{zz}} {\color{var(--c3)}\omega_x\,' \omega_y\,'} + \frac{1}{I_{zz}} {\color{var(--c2)}\tau_z}
            \end{bmatrix}
        \end{align*}
        $$

---

## Linearization

By combining the kinematic and kinetic equations, we obtain the complete dynamics of the system:
        
$$
\left\{
\begin{array}{l}
    {\color{var(--c1)}\dot{x}} = {\color{var(--c3)}v_x\,'} \cos{\color{var(--c1)}\theta}\cos{\color{var(--c1)}\psi} + {\color{var(--c3)}v_y\,'} \left( \sin{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\cos{\color{var(--c1)}\psi} - \cos{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\psi} \right) + {\color{var(--c3)}v_z\,'} \left( \cos{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\cos{\color{var(--c1)}\psi} + \sin{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\psi} \right) \\
    {\color{var(--c1)}\dot{y}} = {\color{var(--c3)}v_x\,'} \cos{\color{var(--c1)}\theta}\sin{\color{var(--c1)}\psi} + {\color{var(--c3)}v_y\,'} \left( \sin{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\sin{\color{var(--c1)}\psi} + \cos{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\psi} \right) + {\color{var(--c3)}v_z\,'} \left( \cos{\color{var(--c1)}\phi}\sin{\color{var(--c1)}\theta}\sin{\color{var(--c1)}\psi} - \sin{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\psi} \right) \\
    {\color{var(--c1)}\dot{z}} = - {\color{var(--c3)}v_x\,'} \sin{\color{var(--c1)}\theta} + {\color{var(--c3)}v_y\,'}  \sin{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta} + {\color{var(--c3)}v_z\,'}  \cos{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta} \\
    {\color{var(--c1)}\dot{\phi}} = {\color{var(--c3)}\omega_x\,'} + {\color{var(--c3)}\omega_y\,'} \sin{\color{var(--c1)}\phi} \tan{\color{var(--c1)}\theta} + {\color{var(--c3)}\omega_z\,'} \cos{\color{var(--c1)}\phi} \tan{\color{var(--c1)}\theta} \\
    {\color{var(--c1)}\dot{\theta}} = {\color{var(--c3)}\omega_y\,'} \cos{\color{var(--c1)}\phi} - {\color{var(--c3)}\omega_z\,'} \sin{\color{var(--c1)}\phi} \\
    {\color{var(--c1)}\dot{\psi}} = {\color{var(--c3)}\omega_y\,'} \sin{\color{var(--c1)}\phi} \sec{\color{var(--c1)}\theta} + {\color{var(--c3)}\omega_z\,'} \cos{\color{var(--c1)}\phi} \sec{\color{var(--c1)}\theta} \\
        {\color{var(--c3)}\dot{v}_x\,'} =  - {\color{var(--c3)}\omega_y\,' v_z\,'} + {\color{var(--c3)}\omega_z\,' v_y\,'} + g \sin{\color{var(--c1)}\theta} \\
        {\color{var(--c3)}\dot{v}_y\,'} = - {\color{var(--c3)}\omega_z\,' v_x\,'} + {\color{var(--c3)}\omega_x\,' v_z\,'} - g \sin{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta} \\
        {\color{var(--c3)}\dot{v}_z\,'} = - {\color{var(--c3)}\omega_x\,' v_y\,'} + {\color{var(--c3)}\omega_y\,' v_x\,'} - g \cos{\color{var(--c1)}\phi}\cos{\color{var(--c1)}\theta} + \frac{1}{m} {\color{var(--c2)}f_t} \\
        {\color{var(--c3)}\dot{\omega}_x\,'} = - \frac{I_{zz}-I_{yy}}{I_{xx}} {\color{var(--c3)}\omega_y\,' \omega_z\,'} + \frac{1}{I_{xx}} {\color{var(--c2)}\tau_x} \\
        {\color{var(--c3)}\dot{\omega}_y\,'} = - \frac{I_{xx}-I_{zz}}{I_{yy}} {\color{var(--c3)}\omega_x\,' \omega_z\,'} + \frac{1}{I_{yy}} {\color{var(--c2)}\tau_\theta} \\
        {\color{var(--c3)}\dot{\omega}_z\,'} = - \frac{I_{yy}-I_{xx}}{I_{zz}} {\color{var(--c3)}\omega_x\,' \omega_y\,'} + \frac{1}{I_{zz}} {\color{var(--c2)}\tau_\psi}
\end{array}
\right.  
$$

The equations above are fully nonlinear. Besides being considerably more complex, their analysis is beyond the scope of this course.

To linearize the system, we assume that the states remain close to their equilibrium values. Under this assumption, trigonometric functions can be approximated (e.g., $\cos{\color{var(--c1)}\phi} \approx 1$ and $\sin{\color{var(--c1)}\phi} \approx {\color{var(--c1)}\phi}$)(1). Likewise, products of two state variables can be neglected (e.g., ${\color{var(--c3)}v_z\,' \omega_x\,'} \approx 0$).
{.annotate}

1. These approximations are valid only for angles (in radians) smaller than approximately $10^\circ$.

!!! question "Exercise 9.5"

    Derive the dynamic equations of the linearized system.
    
    ??? info "Solution"
        $$
        \left\{
        \begin{array}{l}
            {\color{var(--c1)}\dot{x}} = {\color{var(--c3)}v_x\,'} \cancelto{1}{\cos{\color{var(--c1)}\theta}}\cancelto{1}{\cos{\color{var(--c1)}\psi}} + {\color{var(--c3)}v_y\,'}  \left(\cancelto{{\color{var(--c1)}\phi}}{\sin{\color{var(--c1)}\phi}}\cancelto{{\color{var(--c1)}\theta}}{\sin{\color{var(--c1)}\theta}}\cancelto{1}{\cos{\color{var(--c1)}\psi}} - \cancelto{1}{\cos{\color{var(--c1)}\phi}}\cancelto{{\color{var(--c1)}\psi}}{\sin{\color{var(--c1)}\psi}}\right) + {\color{var(--c3)}v_z\,'} \left( \cancelto{1}{\cos{\color{var(--c1)}\phi}}\cancelto{{\color{var(--c1)}\theta}}{\sin{\color{var(--c1)}\theta}}\cancelto{1}{\cos{\color{var(--c1)}\psi}} + \cancelto{{\color{var(--c1)}\phi}}{\sin{\color{var(--c1)}\phi}}\cancelto{{\color{var(--c1)}\psi}}{\sin{\color{var(--c1)}\psi}}\right) \\
            {\color{var(--c1)}\dot{y}} = {\color{var(--c3)}v_x\,'} \cancelto{1}{\cos{\color{var(--c1)}\theta}}\cancelto{{\color{var(--c1)}\psi}}{\sin{\color{var(--c1)}\psi}} + {\color{var(--c3)}v_y\,'} \left( \cancelto{{\color{var(--c1)}\phi}}{\sin{\color{var(--c1)}\phi}}\cancelto{{\color{var(--c1)}\theta}}{\sin{\color{var(--c1)}\theta}}\cancelto{{\color{var(--c1)}\psi}}{\sin{\color{var(--c1)}\psi}} + \cancelto{1}{\cos{\color{var(--c1)}\phi}}\cancelto{1}{\cos{\color{var(--c1)}\psi}} \right) + {\color{var(--c3)}v_z\,'} \left( \cancelto{1}{\cos{\color{var(--c1)}\phi}}\cancelto{{\color{var(--c1)}\theta}}{\sin{\color{var(--c1)}\theta}}\cancelto{{\color{var(--c1)}\psi}}{\sin{\color{var(--c1)}\psi}} - \cancelto{{\color{var(--c1)}\phi}}{\sin{\color{var(--c1)}\phi}}\cancelto{1}{\cos{\color{var(--c1)}\psi}} \right) \\
            {\color{var(--c1)}\dot{z}} = - {\color{var(--c3)}v_x\,'} \cancelto{{\color{var(--c1)}\theta}}{\sin{\color{var(--c1)}\theta}} + {\color{var(--c3)}v_y\,'} \cancelto{{\color{var(--c1)}\phi}}{\sin{\color{var(--c1)}\phi}}\cancelto{1}{\cos{\color{var(--c1)}\theta}} + {\color{var(--c3)}v_z\,'} \cancelto{1}{\cos{\color{var(--c1)}\phi}}\cancelto{1}{\cos{\color{var(--c1)}\theta}} \\
            {\color{var(--c1)}\dot{\phi}} = {\color{var(--c3)}\omega_x\,'} + {\color{var(--c3)}\omega_y\,'} \cancelto{{\color{var(--c1)}\phi}}{\sin{\color{var(--c1)}\phi}} \cancelto{{\color{var(--c1)}\theta}}{\tan{\color{var(--c1)}\theta}} + {\color{var(--c3)}\omega_z\,'} \cancelto{1}{\cos{\color{var(--c1)}\phi}} \cancelto{{\color{var(--c1)}\theta}}{\tan{\color{var(--c1)}\theta}} \\
            {\color{var(--c1)}\dot{\theta}} = {\color{var(--c3)}\omega_y\,'} \cancelto{1}{\cos{\color{var(--c1)}\phi}} - {\color{var(--c3)}\omega_z\,'} \cancelto{{\color{var(--c1)}\phi}}{\sin{\color{var(--c1)}\phi}} \\
            {\color{var(--c1)}\dot{\psi}} = {\color{var(--c3)}\omega_y\,'} \cancelto{{\color{var(--c1)}\phi}}{\sin{\color{var(--c1)}\phi}} \cancelto{1}{\sec{\color{var(--c1)}\theta}} + {\color{var(--c3)}\omega_z\,'} \cancelto{1}{\cos{\color{var(--c1)}\phi}} \cancelto{1}{\sec{\color{var(--c1)}\theta}} \\
                {\color{var(--c3)}\dot{v}_x\,'} =  - \cancelto{0}{\color{var(--c3)}\omega_y\,' v_z\,'} + \cancelto{0}{\color{var(--c3)}\omega_z\,' v_y\,'} + g \cancelto{{\color{var(--c1)}\theta}}{\sin{\color{var(--c1)}\theta}} \\
                {\color{var(--c3)}\dot{v}_y\,'} = - \cancelto{0}{\color{var(--c3)}\omega_z\,' v_x\,'} + \cancelto{0}{\color{var(--c3)}\omega_x\,' v_z\,'} - g \cancelto{{\color{var(--c1)}\phi}}{\sin{\color{var(--c1)}\phi}}\cancelto{1}{\cos{\color{var(--c1)}\theta}} \\
                {\color{var(--c3)}\dot{v}_z\,'} = - \cancelto{0}{\color{var(--c3)}\omega_x\,' v_y\,'} + \cancelto{0}{\color{var(--c3)}\omega_y\,' v_x\,'} - g \cancelto{1}{\cos{\color{var(--c1)}\phi}}\cancelto{1}{\cos{\color{var(--c1)}\theta}} + \frac{1}{m} {\color{var(--c2)}f_t} \\
                {\color{var(--c3)}\dot{\omega}_x\,'} = - \frac{I_{zz}-I_{yy}}{I_{xx}} \cancelto{0}{\color{var(--c3)}\omega_y\,' \omega_z\,'} + \frac{1}{I_{xx}} {\color{var(--c2)}\tau_x} \\
                {\color{var(--c3)}\dot{\omega}_y\,'} = - \frac{I_{xx}-I_{zz}}{I_{yy}} \cancelto{0}{\color{var(--c3)}\omega_x\,' \omega_z\,'} + \frac{1}{I_{yy}} {\color{var(--c2)}\tau_\theta} \\
                {\color{var(--c3)}\dot{\omega}_z\,'} = - \frac{I_{yy}-I_{xx}}{I_{zz}} \cancelto{0}{\color{var(--c3)}\omega_x\,' \omega_y\,'} + \frac{1}{I_{zz}} {\color{var(--c2)}\tau_\psi}
        \end{array}
        \right. 
        \qquad \longrightarrow \qquad
        \left\{
        \begin{array}{l}
            {\color{var(--c1)}\dot{x}} =  {\color{var(--c3)}v_x\,'} + \cancelto{0}{{\color{var(--c3)}v_y\,'} \left( {\color{var(--c1)}\phi\theta} - {\color{var(--c1)}\psi} \right)} + \cancelto{0}{{\color{var(--c3)}v_z\,'} \left( {\color{var(--c1)}\theta} + {\color{var(--c1)}\phi\psi} \right)} \\
            {\color{var(--c1)}\dot{y}} =  \cancelto{0}{{\color{var(--c3)}v_x\,'}{\color{var(--c1)}\psi}}  + {\color{var(--c3)}v_y\,'} \left( \cancelto{0}{{\color{var(--c1)}\phi\theta\psi}} + 1 \right) +  \cancelto{0}{{\color{var(--c3)}v_z\,'} \left( {\color{var(--c1)}\theta\psi} - {\color{var(--c1)}\phi} \right)} \\
            {\color{var(--c1)}\dot{z}} =  \cancelto{0}{{\color{var(--c3)}v_x\,'}{\color{var(--c1)}\theta}} + \cancelto{0}{{\color{var(--c3)}v_y\,'}{\color{var(--c1)}\phi}} + {\color{var(--c3)}v_z\,'} \\
            {\color{var(--c1)}\dot{\phi}} =  {\color{var(--c3)}\omega_x\,'} +  \cancelto{0}{{\color{var(--c3)}\omega_y\,'}{\color{var(--c1)}\phi\theta}} +  \cancelto{0}{{\color{var(--c3)}\omega_z\,'}{\color{var(--c1)}\theta}} \\ 
            {\color{var(--c1)}\dot{\theta}} =  {\color{var(--c3)}\omega_y\,'} -  \cancelto{0}{{\color{var(--c3)}\omega_z\,'}{\color{var(--c1)}\phi}} \\ 
            {\color{var(--c1)}\dot{\psi}} =  \cancelto{0}{{\color{var(--c3)}\omega_y\,'}{\color{var(--c1)}\phi}} + {\color{var(--c3)}\omega_z\,'} \\ 
            {\color{var(--c3)}\dot{v}_x\,'} = g {\color{var(--c1)}\theta} \\ 
            {\color{var(--c3)}\dot{v}_y\,'} = - g {\color{var(--c1)}\phi} \\ 
            {\color{var(--c3)}\dot{v}_z\,'} = -g + \frac{1}{m} {\color{var(--c2)}f_t} \\ 
            {\color{var(--c3)}\dot{\omega}_x\,'} = \frac{1}{I_{xx}} {\color{var(--c2)}\tau_x} \\
            {\color{var(--c3)}\dot{\omega}_y\,'} = \frac{1}{I_{yy}} {\color{var(--c2)}\tau_y} \\
            {\color{var(--c3)}\dot{\omega}_z\,'} = \frac{1}{I_{zz}} {\color{var(--c2)}\tau_z}
        \end{array}
        \right.  
        \qquad \longrightarrow \qquad
        \left\{
        \begin{array}{l}
            {\color{var(--c1)}\dot{x}} =  {\color{var(--c3)}v_x\,'} \\
            {\color{var(--c1)}\dot{y}} =  {\color{var(--c3)}v_y\,'} \\
            {\color{var(--c1)}\dot{z}} =  {\color{var(--c3)}v_z\,'} \\
            {\color{var(--c1)}\dot{\phi}} =  {\color{var(--c3)}\omega_x\,'} \\ 
            {\color{var(--c1)}\dot{\theta}} =  {\color{var(--c3)}\omega_y\,'} \\ 
            {\color{var(--c1)}\dot{\psi}} =  {\color{var(--c3)}\omega_z\,'} \\ 
            {\color{var(--c3)}\dot{v}_x\,'} = g {\color{var(--c1)}\theta} \\ 
            {\color{var(--c3)}\dot{v}_y\,'} = - g {\color{var(--c1)}\phi} \\ 
            {\color{var(--c3)}\dot{v}_z\,'} = -g + \frac{1}{m} {\color{var(--c2)}f_t} \\ 
            {\color{var(--c3)}\dot{\omega}_x\,'} = \frac{1}{I_{xx}} {\color{var(--c2)}\tau_x} \\
            {\color{var(--c3)}\dot{\omega}_y\,'} = \frac{1}{I_{yy}} {\color{var(--c2)}\tau_y} \\
            {\color{var(--c3)}\dot{\omega}_z\,'} = \frac{1}{I_{zz}} {\color{var(--c2)}\tau_z}
        \end{array}
        \right.    
        $$

You should have obtained:

$$
\left\{
\begin{array}{l}
    {\color{var(--c1)}\dot{x}} =  {\color{var(--c3)}v_x\,'} \\
    {\color{var(--c1)}\dot{y}} =  {\color{var(--c3)}v_y\,'} \\
    {\color{var(--c1)}\dot{z}} =  {\color{var(--c3)}v_z\,'} \\
    {\color{var(--c1)}\dot{\phi}} =  {\color{var(--c3)}\omega_x\,'} \\ 
    {\color{var(--c1)}\dot{\theta}} =  {\color{var(--c3)}\omega_y\,'} \\ 
    {\color{var(--c1)}\dot{\psi}} =  {\color{var(--c3)}\omega_z\,'} \\ 
    {\color{var(--c3)}\dot{v}_x\,'} = g {\color{var(--c1)}\theta} \\ 
    {\color{var(--c3)}\dot{v}_y\,'} = - g {\color{var(--c1)}\phi} \\ 
    {\color{var(--c3)}\dot{v}_z\,'} = -g + \frac{1}{m} {\color{var(--c2)}f_t} \\ 
    {\color{var(--c3)}\dot{\omega}_x\,'} = \frac{1}{I_{xx}} {\color{var(--c2)}\tau_x} \\
    {\color{var(--c3)}\dot{\omega}_y\,'} = \frac{1}{I_{yy}} {\color{var(--c2)}\tau_y} \\
    {\color{var(--c3)}\dot{\omega}_z\,'} = \frac{1}{I_{zz}} {\color{var(--c2)}\tau_z}
\end{array}
\right.    
$$

These differential equations can be represented more intuitively using the following block diagram:

![](images/3d_plant.svg){: width=100% style="display: block; margin: auto;" }

Notice the following:

- The force ${\color{var(--c2)}f_t}$ is integrated twice to obtain the vertical position ${\color{var(--c1)}z}$ (Newton's second law for translation), acting independently of the horizontal dynamics.

- The torque ${\color{var(--c2)}\tau_x}$ is integrated twice to obtain the roll angle ${\color{var(--c1)}\phi}$ (Newton's second law for rotation), and integrating twice more yields the lateral position ${\color{var(--c1)}y}$(1). Therefore, the transfer from ${\color{var(--c2)}\tau_x}$ to ${\color{var(--c1)}y}$ contains four integrators in series, resulting from the coupling between the rotational dynamics and the horizontal translational dynamics.
    {.annotate}

    1. The negative sign in $-g$ results from the adopted axis convention (a positive rotation about the ${\color{var(--c1)}x}$ axis produces a negative displacement along the ${\color{var(--c1)}y}$ axis).

- The torque ${\color{var(--c2)}\tau_y}$ is integrated twice to obtain the pitch angle ${\color{var(--c1)}\theta}$ (Newton's second law for rotation), and integrating twice more yields the horizontal position ${\color{var(--c1)}x}$(1). Therefore, the transfer from ${\color{var(--c2)}\tau_y}$ to ${\color{var(--c1)}x}$ contains four integrators in series, resulting from the coupling between the rotational dynamics and the horizontal translational dynamics.
    {.annotate}

    1. The positive sign in $g$ results from the adopted axis convention (a positive rotation about the ${\color{var(--c1)}y}$ axis produces a positive displacement along the ${\color{var(--c1)}x}$ axis).

- The torque ${\color{var(--c2)}\tau_z}$ is integrated twice to obtain the yaw angle ${\color{var(--c1)}\psi}$ (Newton's second law for rotation), acting independently of the vertical and horizontal dynamics.


