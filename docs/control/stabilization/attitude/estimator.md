---
title: Attitude Estimator
icon: material/radar
---

# :material-rotate-orbit: Attitude Estimator

In this section, you will implement the attitude estimator, which estimates the Euler angles $\phi$, $\theta$, and $\psi$, as well as the angular velocities $\omega_x$, $\omega_y$, and $\omega_z$, from the accelerometer measurements $a_x$, $a_y$, and $a_z$ and the gyroscope measurements $g_x$, $g_y$, and $g_z$.

![Architecture - Attitude Estimator](../../images/architecture_attitude_estimator.svg){: width=100% style="display: block; margin: auto;" }
---

## Overview

Initially, you will consider only the 2D dynamics and estimate a single Euler angle. Only at the end of this section will you extend the estimator to the full 3D dynamics, estimating all Euler angles and angular velocities.

The Crazyflie 2.1 Brushless IMU (*"Inertial Measurement Unit"*) is the [BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088.html){target=_blank} from Bosch. It is located on the top side of the drone, underneath the battery.

![](images/bmi088.png){: width=30% style="display: block; margin: auto;" }

This sensor uses MEMS (*"Micro-Electro-Mechanical Systems"*) technology to measure linear acceleration and angular velocity through the motion of microscopic mechanical structures integrated into the chip. These measurements are acquired entirely electronically at a high sampling rate, making it possible to estimate the drone's motion and orientation in real time.

You will begin by implementing an estimator based solely on the accelerometer, followed by another that relies only on the gyroscope. After understanding the strengths and limitations of each sensor individually, you will combine them into a complementary estimator that is both more robust and more accurate, taking advantage of the best characteristics of each sensor.

## Accelerometer

Inertial accelerometers are sensors that measure linear acceleration. They consist of a proof mass connected to a housing by a spring and a damper:

![](images/sensor_accelerometer.svg){: width=300 style="display: block; margin: auto;" }

When the housing experiences an acceleration ${\color{magenta}\ddot{x}}$, the proof mass inside the housing undergoes a displacement ${\color{cyan}x'}$. By measuring the displacement of the proof mass ${\color{cyan}x'}$, it is possible to infer the acceleration experienced by the housing ${\color{magenta}\ddot{x}}$.

![](images/sensor_accelerometer_3axis.svg){: width=300 style="display: block; margin: auto;" }

By mounting three accelerometers orthogonally to one another—one aligned with each axis—we obtain what is known as a three-axis accelerometer, capable of measuring linear acceleration in all directions.

### Trigonometry

The accelerometer is fixed to the drone's body-fixed reference frame. Since gravity always points downward in the inertial reference frame, the accelerations $a_y$ and $a_z$ as functions of the gravitational acceleration $g$ and the angle $\phi$ are given by:
{.annotate}

![](images/readings_accelerometer_2d.svg){: width=250 style="display: block; margin: auto;" }

$$
\begin{align}
    \begin{bmatrix}
        a_y \\
        a_z 
    \end{bmatrix} &= R \vec{g} \\
    \begin{bmatrix}
        a_y \\
        a_z 
    \end{bmatrix}
    &=
    \begin{bmatrix} 
        \cos \phi & \sin \phi \\
        -\sin \phi & \cos \phi
    \end{bmatrix}
    \begin{bmatrix}
        0 \\
        -g
    \end{bmatrix} \\
    \begin{bmatrix}
        a_y \\
        a_z 
    \end{bmatrix}
    &=
    \begin{bmatrix}
        -g\sin\phi	\\
        -g\cos\phi
    \end{bmatrix}
\end{align}
$$

By dividing one equation by the other, we can compute the angle $\phi_a$(1) from the accelerometer measurements $a_y$ and $a_z$(2):
{.annotate}

1. We use the subscript $_a$ to indicate that this angle was computed from the accelerometer measurements.
2. The negative signs are intentionally kept, since you will use the `atan2f` function in your code to correctly determine the quadrant of the angle.

$$
\begin{align}
    \frac{a_y}{a_z} &= \frac{-\cancel{g}\sin\phi_a}{-\cancel{g}\cos\phi_a} \\
    \frac{-a_y}{-a_z} &= \tan\phi_a \\
    \phi_a &= \tan^{-1} \left( \dfrac{-a_y}{-a_z} \right)
\end{align}
$$

Let's begin by implementing a very simple attitude estimator, in which the estimated angle $\phi$ is simply equal to the angle $\phi_a$ computed from the accelerometer measurements $a_y$ and $a_z$, as illustrated in the block diagram below:

![](images/estimator_accelerometer.svg){: width=600 style="display: block; margin: auto;" }

In the `attitudeEstimator()` function, create a local variable $\phi_a$ corresponding to the angle computed from the accelerometer measurements $a_y$ and $a_z$, and then assign it to the estimated angle $\phi$. We will also store this estimate in a logging variable so that it can be visualized in the Crazyflie Client.

```c hl_lines="5 8"
// Estimate orientation from IMU sensor
void attitudeEstimator()
{
    // Measured angle from accelerometer
    float phi_a = 

    // Estimated angle (accelerometer)
    phi = 

    // Auxiliary variables for logging Euler angles (CFClient uses degrees instead of radians)
    log_phi = phi * 180.0f / pi;
}
```

Verify how your estimator performs by uploading the program to the drone and visualizing the result in the Crazyflie Client.

!!! example "Expected result"
    You should notice that this estimator performs well only under static conditions (low-frequency motion). This is because, when the drone moves, additional accelerations besides gravity are measured by the accelerometer. These accelerations act as noise in the estimator, and one way to suppress them is by applying a low-pass filter.

### Low-pass filter

A low-pass filter attenuates signals above a given cutoff frequency $\omega_c$. It is commonly used to remove noise, since noise typically contains higher-frequency components than the signal of interest.

To obtain a less noisy estimate of the angle $\phi$, we pass the accelerometer measurement $\phi_a$ through a low-pass filter. In the frequency domain, this can be represented by the following block diagram:

![](images/low_pass_filter.svg){: width=350 style="display: block; margin: auto;" }

Since this filter will be implemented on a microcontroller, we first need to derive its discrete-time equivalent. We begin by obtaining the corresponding differential equation using the inverse Laplace transform:

$$
\begin{align*}
    \frac{\phi(s)}{\phi_a(s)} &= \frac{\omega_c}{s+\omega_c} \\
    \left( s + \omega_c \right) \phi(s) &= \omega_c\phi_a(s) \\
    s\phi(s) + \omega_c\phi(s) &= \omega_c\phi_a(s) \\
    &\Downarrow ^\text{Inverse Laplace}_\text{transform} \\
    \frac{d}{dt}{\phi}(t) + \omega_c\phi(t) &= \omega_c\phi_a(t)
\end{align*}
$$

Next, we discretize the differential equation using the implicit Euler method(1):
{.annotate}

1. The explicit (forward) Euler method uses the approximation $\frac{d}{dt}x(t) \approx \frac{x(t+\Delta t)-x(t)}{\Delta t}$, whereas the implicit (backward) Euler method uses the approximation $\frac{d}{dt}x(t) \approx \frac{x(t)-x(t-\Delta t)}{\Delta t}$.

$$
\begin{align*}
    \frac{d}{dt}{\phi}(t) + \omega_c\phi(t) &= \omega_c\phi_a(t) \\
    &\Downarrow ^\text{Implicit}_\text{Euler} \\
    \frac{\phi[k]-\phi[k-1]}{\Delta t} + \omega_c\phi[k] &= \omega_c\phi_a[k] \\
    \phi[k]-\phi[k-1] + \omega_c\Delta t\phi[k] &= \omega_c\Delta t\phi_a[k] \\
    \left( 1+\omega_c\Delta t\right) \phi[k] &= \phi[k-1] + \omega_c\Delta t\phi_a[k] \\
    \phi[k] &= \underbrace{\frac{1}{1+\omega_c\Delta t}}_{\left(1-\alpha\right)} \phi[k-1] + \underbrace{\frac{\omega_c\Delta t}{1+\omega_c\Delta t}}_{\alpha} \phi_a[k] \\
    \phi[k] &= \left( 1-\alpha \right)\phi[k-1]+\alpha\phi_a[k]
\end{align*}
$$

Notice that a discrete-time low-pass filter is simply a weighted average between the previous value of $\phi$ and the measured value $\phi_a$, where $\alpha$ is the weighting factor. This can be represented by the following block diagram:

![](images/estimator_accelerometer_low_pass_filter.svg){: width=600 style="display: block; margin: auto;" }

The parameter $\alpha$ is called the smoothing factor. It depends on the cutoff frequency $\omega_c$ and the sampling interval $\Delta t$:

$$
\alpha = \frac{\omega_c\Delta t}{1+\omega_c\Delta t}
$$

- The higher the cutoff frequency $\omega_c$, the closer the smoothing factor $\alpha$ is to 1. As a result, more weight is given to the measured values. This allows the estimate to converge more quickly, but also lets more noise pass through.
- The lower the cutoff frequency $\omega_c$, the closer the smoothing factor $\alpha$ is to 0. As a result, more weight is given to previous values. This reduces noise, but causes the estimate to converge more slowly.

Choosing the ideal cutoff frequency $\omega_c$, which provides a good trade-off between noise reduction and estimation delay, is the main challenge when designing a low-pass filter.

<!-- [Figure] -->

Modify your `attitudeEstimator()` function so that the estimated angle $\phi$ is obtained by applying a low-pass filter to the accelerometer measurement $\phi_a$.

```c hl_lines="5 6 9 12"
// Estimate orientation from IMU sensor
void attitudeEstimator()
{
    // Estimator parameters
    static const float wc = 
    static const float alpha = 

    // Measured angle from accelerometer
    float phi_a = 

    // Estimated angle (accelerometer with low-pass filter)
    phi = 

    // Auxiliary variables for logging Euler angles (CFClient uses degrees instead of radians)
    log_phi = phi * 180.0f / pi;
}
```

Try cutoff frequencies of 1 rad/s, 10 rad/s, and 100 rad/s, and observe how they affect the estimated angle. To do so, upload the program to the drone and visualize the result in the Crazyflie Client.

!!! example "Expected result"
    You should notice that, even in the best case, this estimator is not suitable for dynamic conditions (high-frequency motion). Let's now set the accelerometer aside for a moment and estimate the attitude using only the gyroscope.

## Gyroscope

Inertial gyroscopes are sensors that measure angular velocity. They consist of a proof mass connected to a housing by two springs and two dampers:

![](images/sensor_gyroscope.svg){: width=300 style="display: block; margin: auto;" }

A vibration ${\color{#65DD18}f}=f_0\sin(\omega_0t)$ is induced along the ${\color{cyan}x'}$ axis. When the housing rotates with an angular velocity ${\color{magenta}\dot{\theta}}$, the Coriolis acceleration induces a vibration along the ${\color{cyan}y'}$ axis. By measuring the amplitude of this vibration along ${\color{cyan}y'}$, it is possible to infer the angular velocity of the housing ${\color{magenta}\dot{\theta}}$.

![](images/sensor_gyroscope_3axis.svg){: width=300 style="display: block; margin: auto;" }

By mounting three gyroscopes orthogonally to one another—one aligned with each axis—we obtain what is known as a three-axis gyroscope, capable of measuring angular velocity about all three axes.

### Integration

The gyroscope is fixed to the drone's body-fixed reference frame and measures angular velocity. Therefore, the angular displacement can be obtained simply by integrating its measurements(1):
{.annotate}

1. We use the subscript $_g$ to indicate that this angle was computed from the gyroscope measurements.

![](images/readings_gyroscope_2d.svg){: width=250 style="display: block; margin: auto;" }

$$
\phi_g(t) = \int g_x(t)\,dt
$$

In the frequency domain, this can be represented by the following block diagram:

![](images/integrator.svg){: width=300 style="display: block; margin: auto;" }

Once again, to derive the discrete-time equivalent, we first obtain the corresponding differential equation:

$$
\begin{align*}
    \frac{\phi_g(s)}{g_x(s)} &= \frac{1}{s} \\
    s \phi_g(s) &= g_x(s) \\
    &\Downarrow ^\text{Inverse Laplace}_\text{transform} \\
    \frac{d}{dt} \phi_g(t) &= g_x(t)
\end{align*}
$$

Next, we discretize the differential equation:

$$
\begin{align*}
    \frac{d}{dt} \phi_g(t) &= g_x(t) \\
    &\Downarrow ^\text{Implicit}_\text{Euler} \\
    \frac{\phi_g[k]-\phi_g[k-1]}{\Delta t} &= g_x[k] \\
    \phi_g[k]-\phi_g[k-1] &= g_x[k] \Delta t \\ 
    \phi_g[k] &= \phi_g[k-1] + g_x[k] \Delta t
\end{align*}
$$

Now let's implement an attitude estimator in which the estimated angle $\phi$ is given by the gyroscope-based angle $\phi_g$, which is obtained by integrating the gyroscope measurement $g_x$, as illustrated in the block diagram below:

![](images/estimator_gyroscope.svg){: width=600 style="display: block; margin: auto;" }

In the `attitudeEstimator()` function, create a local variable $\phi_g$ corresponding to the angle obtained by integrating the gyroscope measurement $g_x$, and then assign it to the estimated angle $\phi$.

```c hl_lines="5 8"
// Estimate orientation from IMU sensor
void attitudeEstimator()
{
    // Measured angle from gyroscope
    float phi_g =

    // Estimated angle (gyroscope)
    phi =

    // Auxiliary variables for logging Euler angles (CFClient uses degrees instead of radians)
    log_phi = phi * 180.0f / pi;
}
```

Verify how your estimator performs by uploading the program to the drone and visualizing the result in the Crazyflie Client.

!!! example "Expected result"
    You should notice that this estimator performs well only under dynamic conditions (high-frequency motion). This is because, under static conditions (low-frequency motion), the gyroscope exhibits small but constant systematic errors (*bias*). Although these errors are small, they are continuously integrated over time, causing the attitude estimate to drift. This is essentially the opposite problem of the accelerometer, and one way to mitigate it is by applying a high-pass filter.

### High-pass filter

A high-pass filter attenuates signals below a given cutoff frequency $\omega_c$. In other words, it performs the opposite operation of a low-pass filter.

To obtain the estimated angle $\phi$, we simply pass the measured angle $\phi_g$ through a high-pass filter. In the frequency domain, this can be represented by the following block diagram:

![](images/integrator_high_pass_filter.svg){: width=450 style="display: block; margin: auto;" }

Notice that, since the angular velocity is integrated before the high-pass filter, the block diagram can be simplified:

![](images/integrator_high_pass_filter_reduced.svg){: width=350 style="display: block; margin: auto;" }

Once again, we begin by deriving the corresponding differential equation:

$$
\begin{align}
    \frac{\phi(s)}{g_x(s)} &= \frac{1}{s+\omega_c} \\
    s\phi(s) + \omega_c\phi(s) &= g_x(s) \\
    &\Downarrow ^\text{Inverse Laplace}_\text{transform} \\
    \frac{d}{dt}{\phi}(t) + \omega_c\phi(t) &= g_x(t)
\end{align}
$$

Next, we discretize the differential equation:

$$
\begin{align}
    \frac{d}{dt}{\phi}(t) + \omega_c\phi(t) &= g_x(t) \\
    &\Downarrow ^\text{Implicit}_\text{Euler} \\
    \frac{\phi[k]-\phi[k-1]}{\Delta t} + \omega_c\phi[k] &= g_x[k] \\
    \phi[k]-\phi[k-1] + \omega_c\Delta t\phi[k] &= g_x[k]\Delta t \\
    \left( 1+\omega_c\Delta t \right) \phi[k] &= \phi[k-1] + g_x[k]\Delta t \\
    \phi[k] &= \underbrace{\frac{1}{1+\omega_c\Delta t}}_{\left(1-\alpha\right)} \underbrace{\left(\phi[k-1] + g_x[k]\Delta t\right)}_{\phi_g[k]} \\
    \phi[k] &= \left(1-\alpha\right) \phi_g[k]
\end{align}
$$

Therefore, integrating the gyroscope measurements followed by a high-pass filter can be represented by the following block diagram:

![](images/estimator_gyroscope_high_pass_filter.svg){: width=600 style="display: block; margin: auto;" }

Modify your `attitudeEstimator()` function so that the estimated angle $\phi$ is obtained by applying a high-pass filter to the gyroscope-based measurement $\phi_g$.

```c hl_lines="5 6 9 12"
// Estimate orientation from IMU sensor
void attitudeEstimator()
{
    // Estimator parameters
    static const float wc =
    static const float alpha =

    // Measured angle from gyroscope
    float phi_g =

    // Estimated angle (gyroscope with high-pass filter)
    phi =

    // Auxiliary variables for logging Euler angles (CFClient uses degrees instead of radians)
    log_phi = phi * 180.0f / pi;
}
```

Try cutoff frequencies of 0.1 rad/s, 1 rad/s, and 10 rad/s, and observe how they affect the estimated angle. To do so, upload the program to the drone and visualize the result in the Crazyflie Client.

!!! example "Expected result"
    You should notice that the drone's attitude always converges to zero. This is beneficial because systematic errors are no longer accumulated through integration, but it also means that the estimator cannot maintain a non-zero attitude when the drone remains stationary.

## Accelerometer + Gyroscope

As we have seen, the accelerometer provides good attitude estimates under static conditions (low-frequency motion), whereas the gyroscope performs well under dynamic conditions (high-frequency motion). Each sensor succeeds precisely where the other falls short. So why not combine them to obtain accurate attitude estimates under both static and dynamic conditions? That is the idea behind a complementary filter!

### Complementary filter

The idea behind a complementary filter is to pass the accelerometer-based angle through a low-pass filter and the gyroscope-based angle through a high-pass filter, as illustrated in the block diagram below:

![](images/complementary_filter.svg){: width=500 style="display: block; margin: auto;" }

Since the sum of these two filters has unity gain, they can simply be added together(1):
{.annotate}

1. This is where the term *complementary* comes from.

$$
    \underbrace{\frac{\omega_c}{s+\omega_c}}_{\begin{array}{c} \text{Low-pass} \\ \text{filter} \end{array}} + \underbrace{\frac{s}{s+\omega_c}}_{\begin{array}{c} \text{High-pass} \\ \text{filter} \end{array}} = 1
$$

Since the angular velocity is integrated before the high-pass filter, and both the low-pass and high-pass filters share the same transfer function denominator, the block diagram can be simplified as follows:

![](images/complementary_filter_reduced.svg){: width=500 style="display: block; margin: auto;" }

Notice that we are now left with a single transfer function, namely that of a low-pass filter. Since we have already derived its discrete-time equivalent, we obtain:

$$
\begin{align}
    \phi[k] &= \left( 1-\alpha \right)\phi[k-1]+\alpha \left( \frac{1}{\omega_c} g_x[k] + \phi_a[k] \right) \\
    \phi[k] &= \left( 1-\alpha \right)\phi[k-1]+ \underbrace{\alpha\frac{1}{\omega_c}}_{(1-\alpha)\Delta t} g_x[k] + \alpha \phi_a[k] \\
    \phi[k] &= \left( 1-\alpha \right)\phi[k-1]+ (1-\alpha) g_x[k]\Delta t + \alpha \phi_a[k] \\
    \phi[k] &= \left( 1-\alpha \right)\underbrace{\left(\phi[k-1]+g_x[k] \Delta t \right)}_{\phi_g[k]} + \alpha \phi_a[k] \\
    \phi[k] &= \left( 1-\alpha \right)\phi_g[k] + \alpha \phi_a[k]
\end{align}
$$

In other words, a discrete-time complementary filter is simply a weighted average between the gyroscope-based angle $\phi_g$ and the accelerometer-based angle $\phi_a$. This can be represented by the following block diagram:

![](images/estimator_accelerometer_gyroscope_complementary_filter.svg){: width=600 style="display: block; margin: auto;" }

Modify your `attitudeEstimator()` function so that the estimated angle $\phi$ is obtained using a complementary filter that combines the accelerometer-based measurement $\phi_a$ and the gyroscope-based measurement $\phi_g$.

```c hl_lines="5 6 9 12 15"
// Estimate orientation from IMU sensor
void attitudeEstimator()
{
    // Estimator parameters
    static const float wc =
    static const float alpha =

    // Measured angle from accelerometer
    float phi_a =

    // Measured angle from gyroscope
    float phi_g =

    // Estimated angle (accelerometer and gyroscope with complementary filter)
    phi =

    // Auxiliary variables for logging Euler angles (CFClient uses degrees instead of radians)
    log_phi = phi * 180.0f / pi;
}
```

Try cutoff frequencies of 0.1 rad/s, 1 rad/s, and 10 rad/s, and observe how they affect the estimated angle. To do so, upload the program to the drone and visualize the result in the Crazyflie Client.

!!! example "Expected result"
    This time, the estimated attitude should behave much better!

### Full Dynamics

Finally, extend the attitude estimator to the remaining Euler angles and the angular velocities:

$$
\left\{
\begin{array}{l}
    \phi =  \left( 1 - \alpha \right) \phi_g + \alpha \phi_a \\ 
    \theta = \left( 1 - \alpha \right) \theta_g + \alpha \theta_a  \\
    \psi = \psi_g
\end{array}
\right.
\qquad \qquad \qquad
\left\{
\begin{array}{l}
    \omega_x = g_x \\ 
    \omega_y = g_y \\
    \omega_z = g_z
\end{array}
\right.
$$

Notice that the yaw angle $\psi$ cannot be estimated from the accelerometer measurements. Therefore, it is estimated using only the gyroscope. As a result, the yaw estimate $\psi$ is expected to drift over time. Fortunately, this angle is not essential for maintaining the drone's stability(1).
{.annotate}

1. Attitude and Heading Reference Systems (AHRS) use a magnetometer to complement the gyroscope-based yaw estimate $\psi$, preventing this angle from drifting over time.

The Euler angles $\phi_a$ and $\theta_a$ computed from the accelerometer measurements $a_x$, $a_y$, and $a_z$ are given by:

![](images/readings_accelerometer_3d.svg){: width=250 style="display: block; margin: auto;" }

$$
\left\{
\begin{array}{l}
    \phi_a = \tan^{-1} \left( \dfrac{-a_y}{-a_z} \right) \\
    \theta_a = \tan^{-1} \left( \dfrac{a_x}{\sqrt{a_y^2+a_z^2}} \right)
\end{array}
\right.
$$

??? info "Derivation"

    The accelerations $a_x$, $a_y$, and $a_z$ as functions of the gravitational acceleration $g$ and the Euler angles $\phi$ and $\theta$ are given by:

    $$
    \begin{align}
        \begin{bmatrix}
            a_x \\
            a_y \\
            a_z \\
        \end{bmatrix} &= R \vec{g} \\
        \begin{bmatrix}
            a_x \\
            a_y \\
            a_z \\
        \end{bmatrix}
        &=
        \begin{bmatrix}
            \cos\theta\cos\psi & \cos\theta\sin\psi & -\sin\theta \\
            - \cos\phi\sin\psi + \sin\phi\sin\theta\cos\psi  & \cos\phi\cos\psi + \sin\phi\sin\theta\sin\psi & \sin\phi\cos\theta \\
            \sin\phi\sin\psi + \cos\phi\sin\theta\cos\psi & - \sin\phi\cos\psi + \cos\phi\sin\theta\sin\psi  & \cos\phi\cos\theta
        \end{bmatrix}
        \begin{bmatrix}
            0 \\
            0 \\
            -g \\
        \end{bmatrix} \\
        \begin{bmatrix}
            a_x \\
            a_y \\
            a_z \\
        \end{bmatrix}
        &=
        \begin{bmatrix}
            g\sin\theta \\
            -g\sin\phi\cos\theta \\
            -g\cos\phi\cos\theta
        \end{bmatrix}
    \end{align}
    $$

    By dividing the second equation by the third, we can compute the angle $\phi_a$ from the accelerometer measurements $a_y$ and $a_z$:

    $$
    \begin{align}
        \frac{a_y}{a_z} &= \frac{-\cancel{g}\sin\phi_a\cancel{\cos\theta}}{-\cancel{g}\cos\phi_a\cancel{\cos\theta}} \\
        \frac{-a_y}{-a_z} &= \tan\phi_a \\
        \phi_a &= \tan^{-1} \left( \dfrac{-a_y}{-a_z} \right)
    \end{align}
    $$

    Computing the angle $\theta_a$ requires all three accelerometer measurements $a_x$, $a_y$, and $a_z$, making the derivation slightly more involved:

    $$
    \begin{align}
        \frac{a_x^2}{a_y^2+a_z^2} &= \frac{(g\sin\theta_a)^2}{(-g\sin\phi_a\cos\theta_a)^2+(-g\cos\phi_a\cos\theta_a)^2} \\
        \frac{a_x^2}{a_y^2+a_z^2} &= \frac{g^2\sin^2\theta_a}{g^2\sin^2\phi_a\cos^2\theta_a+g^2\cos^2\phi_a\cos^2\theta_a} \\
        \frac{a_x^2}{a_y^2+a_z^2} &= \frac{\cancel{g^2}\sin^2\theta_a}{\cancel{g^2}\cos^2\cancelto{1}{(\sin^2\phi_a+\cos^2\phi_a)}} \\
        \frac{a_x^2}{a_y^2+a_z^2} &= \frac{\sin^2\theta_a}{\cos^2\theta_a} \\
        \frac{a_x^2}{a_y^2+a_z^2} &= \tan^2\theta_a \\
        \sqrt{\frac{a_x^2}{a_y^2+a_z^2}} &= \tan\theta_a \\
        \frac{a_x}{\sqrt{a_y^2+a_z^2}} &= \tan\theta_a \\
        \theta_a &= \tan^{-1} \left( \frac{a_x}{\sqrt{a_y^2+a_z^2}} \right)
    \end{align}
    $$

The Euler angles $\phi_g$, $\theta_g$, and $\psi_g$ computed from the gyroscope measurements $g_x$, $g_y$, and $g_z$ are given by:

![](images/readings_gyroscope_3d.svg){: width=250 style="display: block; margin: auto;" }

$$
\left\{
\begin{array}{l}
    \phi_g = \phi + \left( g_x + g_y \sin\phi\tan\theta + g_z \cos\phi\tan\theta \right) \Delta t \\
    \theta_g = \theta + \left( g_y \cos\phi - g_z \sin\phi \right) \Delta t \\
    \psi_g = \psi + \left( g_y \sin\phi\sec\theta + g_z \cos\phi\sec\theta \right) \Delta t
\end{array}
\right.
$$

??? info "Derivation"

    The derivatives of the Euler angles as functions of the angular velocities are given by the rotational kinematic equation:

    $$
    \begin{bmatrix}
        \dot{\phi} \\
        \dot{\theta} \\
        \dot{\psi}
    \end{bmatrix}
    =
    \begin{bmatrix}
        1 & \sin\phi\tan\theta & \cos\phi\tan\theta \\
        0 & \cos\phi & - \sin\phi\\
        0 & \sin\phi\sec\theta & \cos\phi\sec\theta
    \end{bmatrix}
    \begin{bmatrix}
        \omega_x \\
        \omega_y \\
        \omega_z
    \end{bmatrix}
    $$

    Since:

    $$
    \begin{bmatrix}
        g_x \\
        g_y \\
        g_z
    \end{bmatrix}
    =
    \begin{bmatrix}
        \omega_x \\
        \omega_y \\
        \omega_z
    \end{bmatrix}
    $$

    substituting these expressions and integrating over time yields:

    $$
    \begin{align*}
        \begin{bmatrix}
            \phi_g \\
            \theta_g \\
            \psi_g
        \end{bmatrix}
        &=
        \begin{bmatrix}
            \phi \\
            \theta \\
            \psi
        \end{bmatrix}
        +
        \begin{bmatrix}
            \dot{\phi} \\
            \dot{\theta} \\
            \dot{\psi}
        \end{bmatrix}\Delta t \\
        \begin{bmatrix}
            \phi_g \\
            \theta_g \\
            \psi_g
        \end{bmatrix}
        &=
        \begin{bmatrix}
            \phi \\
            \theta \\
            \psi
        \end{bmatrix}
        +
        \begin{bmatrix}
            1 & \sin\phi\tan\theta & \cos\phi\tan\theta \\
            0 & \cos\phi & -\sin\phi \\
            0 & \sin\phi\sec\theta & \cos\phi\sec\theta
        \end{bmatrix}
        \begin{bmatrix}
            g_x \\
            g_y \\
            g_z
        \end{bmatrix}\Delta t
    \end{align*}
    $$

Modify your `attitudeEstimator()` function so that the estimated angles $\phi$, $\theta$, and $\psi$ are obtained using a complementary filter that combines the accelerometer-based measurements $\phi_a$ and $\theta_a$ with the gyroscope-based measurements $\phi_g$, $\theta_g$, and $\psi_g$.

```c hl_lines="5 6 9 10 13-15 18-20 23-25"
// Estimate orientation from IMU sensor
void attitudeEstimator()
{
    // Estimator parameters
    static const float wc =
    static const float alpha =

    // Measured angles from accelerometer
    float phi_a =
    float theta_a =

    // Measured angles from gyroscope
    float phi_g =
    float theta_g =
    float psi_g =

    // Estimated angles (accelerometer and gyroscope with complementary filter)
    phi =
    theta =
    psi =

    // Estimated angular velocities (gyroscope)
    wx =
    wy =
    wz =

    // Auxiliary variables for logging Euler angles (CFClient uses degrees instead of radians)
    log_phi = phi * 180.0f / pi;
    log_theta = -theta * 180.0f / pi;
    log_psi = psi * 180.0f / pi;
}
```

Upload the program to the drone and use the Crazyflie Client to visualize the output of your complete attitude estimator!



<!-- ---
title: Estimador de atitude
icon: material/radar
---

# :material-rotate-orbit: Estimador de atitude

Nesta secção você irá implementar o estimador de atitude, que estima os ângulos de Euler $\phi$, $\theta$ e $\psi$ e velocidades angulares $\omega_x$, $\omega_y$ e $\omega_z$ a partir das leituras do acelerômetro $a_x$, $a_y$ e $a_z$ e do giroscópio $g_x$, $g_y$ e $g_z$.

![Architecture - Attitude Estimator](../../images/architecture_attitude_estimator.svg){: width=100% style="display: block; margin: auto;" }
---

## Visão Geral

Inicialmente, você irá considerar apenas a dinâmica 2D e estimar um único ângulo de Euler. Só no final você irá considerar a dinâmica 3D e estimar todos os ângulos de Euler e velocidades angulares.

A IMU (*"Inertial Measurement Unit"*) do Crazyflie 2.1 Brushless é a [BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088.html){target=_blank} da Bosch. Ela fica localizada na parte superior do drone, escondida embaixo da bateria.

![](images/bmi088.png){: width=30% style="display: block; margin: auto;" }

Esse sensor utiliza tecnologia MEMS (*``Micro-Electro-Mechanical Systems''*), que permite medir aceleração linear e velocidade angular através do movimento de minúsculos elementos mecânicos integrados ao chip. Essas medições são obtidas de forma totalmente eletrônica e com alta taxa de amostragem, possibilitando estimar o movimento e a orientação do drone em tempo real.

Você começará implementando um estimador baseado apenas no acelerômetro, seguido de outro que utiliza apenas o giroscópio. Após compreender as vantagens e limitações de cada sensor isoladamente, ambos serão combinados de forma inteligente — resultando em um estimador mais robusto e preciso, que explorará o melhor dos dois mundos.

## Acelerômetro

Acelerômetros inerciais são sensores que medem aceleração linear. Eles são compostos por um corpo de prova conectada a um invólucro através de uma mola e um amortecedor:

![](images/sensor_accelerometer.svg){: width=300 style="display: block; margin: auto;" }

Quando o invólucro sofre uma aceleração ${\color{magenta}\ddot{x}}$, o corpo dentro do invólucro sofre um deslocamento ${\color{cyan}x'}$. Medindo o deslocamento do corpo ${\color{cyan}x'}$, é possível inferir a aceleração sofrida pelo invólucro ${\color{magenta}\ddot{x}}$. 

![](images/sensor_accelerometer_3axis.svg){: width=300 style="display: block; margin: auto;" }

Ao montarmos três acelerômetros perpendiculares entre si, ou seja, um alinhado com cada eixo, temos o que é chamado de acelerômetro de 3 eixos, que consegue medir a aceleração linear em todas as direções.

### Trigonometria

O acelerômetro está fixo no sistema de coordenadas móvel do drone. Como há sempre a aceleração da gravidade apontando para baixo no sistema de coordenadas inercial, as acelerações $a_y$ e $a_z$ em função da gravidade $g$ e do ângulo $\phi$ são dadas por:
{.annotate}

![](images/readings_accelerometer_2d.svg){: width=250 style="display: block; margin: auto;" }

$$
\begin{align}
    \begin{bmatrix}
        a_y \\
        a_z 
    \end{bmatrix} &= R \vec{g} \\
    \begin{bmatrix}
        a_y \\
        a_z 
    \end{bmatrix}
    &=
    \begin{bmatrix} 
        \cos \phi & \sin \phi \\
        -\sin \phi & \cos \phi
    \end{bmatrix}
    \begin{bmatrix}
        0 \\
        -g
    \end{bmatrix} \\
    \begin{bmatrix}
        a_y \\
        a_z 
    \end{bmatrix}
    &=
    \begin{bmatrix}
        -g\sin\phi	\\
        -g\cos\phi
    \end{bmatrix}
\end{align}
$$

Dividindo uma equação pela outra, podemos medir o ângulo $\phi_a$(1) em função das leituras do acelerômetro $a_y$ e $a_z$(2):
{.annotate}

1. Usamos o subescrito $_a$ para deixar claro que esse ângulo foi medido a partir das leituras do acelerômetro. 
2. Os sinais negativos não foram cortados pois você deverá utilizar a função `atan2f` em seu código, para saber em qual quadrante está o seu ângulo. 

$$
\begin{align}
    \frac{a_y}{a_z} &= \frac{-\cancel{g}\sin\phi_a}{-\cancel{g}\cos\phi_a} \\
    \frac{-a_y}{-a_z} &= \tan\phi_a \\
    \phi_a &= \tan^{-1} \left( \dfrac{-a_y}{-a_z} \right)
\end{align}
$$

Vamos começar implementando um estimador de atitude bem simples, cujo ângulo estimado $\phi$ é dado simplesmente pelo ângulo $\phi_a$ medido a partir das leituras do acelerômetro $a_y$ e $a_z$, conforme o diagrama de blocos abaixo:

![](images/estimator_accelerometer.svg){: width=600 style="display: block; margin: auto;" }

Inclua na função `attitudeEstimator()` uma variável local $\phi_a$, que corresponde ao ângulo medido a partir das leituras do acelerômetro $a_y$ e $a_z$ e, em seguida, atribua ela ao ângulo estimado $\phi$. Também vamos armazenar o valor dessa estimativa numa variável de registro, para que seja possível visualizá-la no Crazyflie Client.


```c hl_lines="5 8"
// Estimate orientation from IMU sensor
void attitudeEstimator()
{
    // Measured angle from accelerometer
    float phi_a = 

    // Estimated angle (accelerometer)
    phi = 

    // Auxiliary variables for logging Euler angles (CFClient uses degrees and not radians)
    log_phi = phi * 180.0f / pi;
}
```   
        
Verifique como está sua estimativa, para isso carregue esse programa no drone e utilize o Crazyflie Client para visualizar o resultado.

!!! example "Resultado esperado"        
    Você deve notar que o estimador implementado é adequado somente para condições estáticas (baixas frequências). Isso se deve ao fato de que, ao movimentar o drone, surgem outras acelerações além da aceleração da gravidade. Essas acelerações acabam sendo um ruído para o nosso estimador, e uma forma de removê-las é através de um filtro passa-baixas.

### Filtro passa-baixas

Um filtro passa-baixas é um filtro que atenua sinais superiores a uma determinada frequência de corte $\omega_c$. Ele é muito utilizado para filtrar ruídos, dado que os mesmos geralmente possuem uma frequência superior ao sinal que está sendo medido. 
        
Dessa forma, para obtermos um ângulo estimado $\phi$ sem ruídos, vamos passar o ângulo medido pelo acelerômetro $\phi_a$ por um filtro passa-baixas. No domínino da frequência, isso pode ser representado pelo seguinte diagrama de blocos:
        
![](images/low_pass_filter.svg){: width=350 style="display: block; margin: auto;" }
        
Dado que vamos implementar este filtro em um microcontrolador, torna-se necessário determinar o equivalente discreto do mesmo. Primeiro, vamos obter a equação diferencial correspondente, utilizando a transformada inversa de Laplace:
        
$$
\begin{align*}
    \frac{\phi(s)}{\phi_a(s)} &= \frac{\omega_c}{s+\omega_c} \\
    \left( s + \omega_c \right) \phi(s) &= \omega_c\phi_a(s) \\
    s\phi(s) + \omega_c\phi(s) &= \omega_c\phi_a(s) \\
    &\Downarrow ^\text{Transformada inversa}_\text{de Laplace} \\
    \frac{d}{dt}{\phi}(t) + \omega_c\phi(t) &= \omega_c\phi_a(t)
\end{align*}
$$
        
Em seguida, vamos discretizar a equação diferencial, utilizando o método de Euler implícito(1):
{.annotate}

1. O método de Euler explícito ("pra frente") utiliza a aproximação $\frac{d}{dt}x(t) \approx \frac{x(t+\Delta t)-x(t)}{\Delta t}$, equanto que o método de Euler implícito ("pra trás") utiliza a aproximação $\frac{d}{dt}x(t) \approx \frac{x(t)-x(t-\Delta t)}{\Delta t}$
    
$$
\begin{align*}
    \frac{d}{dt}{\phi}(t) + \omega_c\phi(t) &= \omega_c\phi_a(t) \\
    &\Downarrow ^\text{Euler}_\text{implícito} \\
    \frac{\phi[k]-\phi[k-1]}{\Delta t} + \omega_c\phi[k] &= \omega_c\phi_a[k] \\
    \phi[k]-\phi[k-1] + \omega_c\Delta t\phi[k] &= \omega_c\Delta t\phi_a[k] \\
    \left( 1+\omega_c\Delta t\right) \phi[k] &= \phi[k-1] + \omega_c\Delta t\phi_a[k] \\
    \phi[k] &= \underbrace{\frac{1}{1+\omega_c\Delta t}}_{\left(1-\alpha\right)} \phi[k-1] + \underbrace{\frac{\omega_c\Delta t}{1+\omega_c\Delta t}}_{\alpha} \phi_a[k] \\
    \phi[k] &= \left( 1-\alpha \right)\phi[k-1]+\alpha\phi_a[k]
\end{align*}
$$
        
Note que um filtro passa-baixas discretizado nada mais é do que uma média ponderada entre o valor antigo de $\phi$ e o valor medido $\phi_a$, e a variável $\alpha$ é exatamente esse fator de ponderação. O mesmo pode ser representado pelo seguinte diagrama de blocos:

![](images/estimator_accelerometer_low_pass_filter.svg){: width=600 style="display: block; margin: auto;" }
        
A variável $\alpha$ é chamada de fator de suavização, ela depende da frequência de corte $\omega_c$ e do intervalo de tempo $\Delta t$ entre medições:
        
$$
\alpha = \frac{\omega_c\Delta t}{1+\omega_c\Delta t}
$$


- Quanto maior for a frequência de corte $\omega_c$, mais próximo de 1 estará o fator de suavização $\alpha$ e, consequentemente, mais peso será dado aos valores medidos. Isso é vantajoso pois garante que o sinal estimado convirja mais rápido, no entanto, também deixa passar mais ruído.
- Quanto menor for a frequência de corte $\omega_c$, mais próximo de 0 estará o fator de suavização $\alpha$ e, consequentemente, mais peso será dado aos valores antigos. Isso é vantajoso pois deixa passar menos ruído, no entanto, faz com que o sinal estimado convirja mais devagar.

Determinar a frequência de corte $\omega_c$ ideal, que garante um bom compromisso entre redução de ruído e atraso, é o maior desafio na implementação de um filtro passa-baixas.


        
Modifique a sua função `attitudeEstimator()` de modo que agora o ângulo estimado $\phi$ seja dado por um filtro passa-baixas da medida do acelerômetro $\phi_a$.
        
```c hl_lines="5 6 9 12"
// Estimate orientation from IMU sensor
void attitudeEstimator()
{
    // Estimator parameters
    static const float wc = 
    static const float alpha = 

    // Measured angle from accelerometer
    float phi_a = 

    // Estimated angle (accelerometer with low pass filter)
    phi = 

    // Auxiliary variables for logging Euler angles (CFClient uses degrees and not radians)
    log_phi = phi * 180.0f / pi;
}
```   
        
Experimente valores de 1rad/s, 10rad/s e 100rad/s para a frequência de corte $\omega_c$ e verifique como isso influencia na sua estimativa. Para isso, carregue esse programa no drone e utilize o Crazyflie Client para visualizar o resultado.

!!! example "Resultado esperado"    
    Você deve notar que, mesmo no melhor dos casos, o estimador implementado não é adequado para condições dinâmicas (altas frequências). Vamos agora esquecer o acelerômetro por um instante e utilizar apenas o giroscópio para estimação de atitude.

## Giroscópio

Giroscópios inericiais são sensores que medem velocidade angular. Eles são compostos por um corpo de prova conectada a um invólucro através de duas molas e dois amortecedores:

![](images/sensor_gyroscope.svg){: width=300 style="display: block; margin: auto;" }

No eixo ${\color{cyan}x'}$ é forçada uma vibração ${\color{#65DD18}f}=f_0\sin(\omega_0t)$. Quando o invólucro possui uma velocidade angular ${\color{magenta}\dot{\theta}}$, devido à aceleração de Coriolis, é induzida uma vibração no eixo ${\color{cyan}y'}$. Medindo a amplitude da vibração em ${\color{cyan}y'}$ é possível inferir a velocidade angular do invólucro ${\color{magenta}\dot{\theta}}$.

![](images/sensor_gyroscope_3axis.svg){: width=300 style="display: block; margin: auto;" }

Ao montarmos três giroscópios perpendiculares entre si, ou seja, um alinhado com cada eixo, temos o que é chamado de giroscópio de 3 eixos, que consegue medir a velocidade angular em todas as direções.

### Integração

O giroscópio está fixo no sistema de coordenadas móvel drone e mede a velocidade angular, portanto o deslocamento angular pode ser obtido simplesmente integrando sua leitura(1):
{.annotate}

1. Usamos o subescrito $_g$ para deixar claro que esse ângulo foi medido a partir das leituras do giroscópio. 

![](images/readings_gyroscope_2d.svg){: width=250 style="display: block; margin: auto;" }

$$
\phi_g(t) = \int g_x(t) dt \\
$$

No domínio da frequência, isso pode ser representado pelo seguinte diagrama de blocos:

![](images/integrator.svg){: width=300 style="display: block; margin: auto;" }

Novamente, para determinar o correspondente discreto, primeiro obtemos a equação diferencial correspondente:

$$    
\begin{align*}
    \frac{\phi_g(s)}{g_x(s)} &= \frac{1}{s} \\
    s \phi_g(s) &= g_x(s) \\
    &\Downarrow ^\text{Transformada inversa}_\text{de Laplace} \\
    \frac{d}{dt} \phi_g(t) &= g_x(t)
\end{align*}
$$

E em seguida discretizamos a equação diferencial:

$$
\begin{align*}
    \frac{d}{dt} \phi_g(t) &= g_x(t) \\
    &\Downarrow ^\text{Euler}_\text{implícito} \\
    \frac{\phi_g[k]-\phi_g[k-1]}{\Delta t} &= g_x[k] \\
    \phi_g[k]-\phi_g[k-1] &= g_x[k] \Delta t \\ 
    \phi_g[k] &= \phi_g[k-1] + g_x[k] \Delta t 
\end{align*}
$$

Vamos implementar agora um estimador de atitude cujo ângulo estimado $\phi$ é dado pelo ângulo medido a partir das leituras do giroscópio $\phi_g$, que por sua vez é dado pela integração da leitura do giroscópio $g_x$, conforme o diagrama de blocos abaixo:

![](images/estimator_gyroscope.svg){: width=600 style="display: block; margin: auto;" }

Inclua na função `attitudeEstimator()` uma variável local $\phi_g$, que corresponde ao ângulo medido a partir da integração da leitura do giroscópio $g_x$ e, em seguida, atribua ela ao ângulo estimado $\phi$.
        
```c hl_lines="5 8"
// Estimate orientation from IMU sensor
void attitudeEstimator()
{
    // Measured angle from gyroscope
    float phi_g =

    // Estimated angle (gyroscope)
    phi =

    // Auxiliary variables for logging Euler angles (CFClient uses degrees and not radians)
    log_phi = phi * 180.0f / pi;
}
```   

Verifique como está sua estimativa, para isso carregue esse programa no drone e utilize o Crazyflie Client para visualizar o resultado.

!!! example "Resultado esperado"        
    Você deve notar que o estimador implementado é adequado somente para condições dinâmicas (altas frequências). Isso se deve ao fato de que, em condições estáticas (baixas frequências), o giroscópio possui erros sistemáticos constantes (*"bias"*), que, mesmo pequenos, acabam sendo integrados e fazendo com que a atitude divirja ao longo do tempo. É o problema inverso do acelerômetro, e uma forma de removê-lo é através de um filtro passa-altas.

### Filtro passa-altas

Um filtro passa-altas é um filtro que atenua sinais inferiores a uma determinada frequência de corte $\omega_c$. Ou seja, ele faz o inverso de um filtro passa-baixas.
        
Para se obter o ângulo estimado $\phi$, basta passar o ângulo medido $\phi_g$ por um filtro passa-altas. No domínio da frequência, isso pode ser representado pelo seguinte diagrama de blocos:

![](images/integrator_high_pass_filter.svg){: width=450 style="display: block; margin: auto;" }

Note que, como a velocidade angular está sendo integrada antes de passar pelo filtro, o diagrama de blocos pode ser reduzido:

![](images/integrator_high_pass_filter_reduced.svg){: width=350 style="display: block; margin: auto;" }

Novamente, primeiro obtemos a equação diferencial:
        
$$
\begin{align}
    \frac{\phi(s)}{g_x(s)} &= \frac{1}{s+\omega_c} \\
    s\phi(s) + \omega_c\phi(s) &= g_x(s) \\
    &\Downarrow ^\text{Transformada inversa}_\text{de Laplace} \\
    \frac{d}{dt}{\phi}(t) + \omega_c\phi(t) &= g_x(t)
\end{align}
$$

E, em seguida, realizamos a discretização:

$$
\begin{align}
    \frac{d}{dt}{\phi}(t) + \omega_c\phi(t) &= g_x(t) \\
    &\Downarrow ^\text{Euler}_\text{implícito} \\
    \frac{\phi[k]-\phi[k-1]}{\Delta t} + \omega_c\phi[k] &= g_x[k] \\
    \phi[k]-\phi[k-1] - \omega_c\Delta t\phi[k] &= g_x[k]\Delta t \\
    \left( 1+\omega_c\Delta t \right) \phi[k] &= \phi[k-1] + g_x[k]\Delta t \\
    \phi[k] &= \underbrace{\frac{1}{1+\omega_c\Delta t}}_{\left(1-\alpha\right)} \underbrace{\left(\phi[k-1] + g_x[k]\Delta t\right)}_{\phi_g[k]} \\
    \phi[k] &= \left(1-\alpha\right) \phi_g[k]
\end{align}
$$

Dessa forma, a integração do giroscópio com um filtro passa-altas pode ser representado pelo diagrama de blocos abaixo:

![](images/estimator_gyroscope_high_pass_filter.svg){: width=600 style="display: block; margin: auto;" }

Modifique a sua função `attitudeEstimator()` de modo que agora o ângulo estimado $\phi$ seja dado por um filtro passa-altas da medida do giroscópio $\phi_g$.

```c hl_lines="5 6 9 12"
// Estimate orientation from IMU sensor
void attitudeEstimator()
{
    // Estimator parameters
    static const float wc = 
    static const float alpha = 

    // Measured angle from gyroscope
    float phi_g = 

    // Estimated angle (gyroscope with high pass filter)
    phi = 

    // Auxiliary variables for logging Euler angles (CFClient uses degrees and not radians)
    log_phi = phi * 180.0f / pi;
}
```  

Experimente valores de 0,1rad/s, 1rad/s e 10rad/s para a frequência de corte $\omega_c$ e verifique como isso influencia na sua estimativa. Para isso, carregue esse programa no drone e utilize o Crazyflie Client para visualizar o resultado.

!!! example "Resultado esperado"   
    Você deve notar que a atitude do drone sempre converge para zero, o que é bom pois não estamos mais integrando os erros sistemáticos, mas ruim quando o drone fica parado em uma atitude que não seja zero.

## Acelerômetro + Giroscópio

Conforme vimos, o acelerômetro nos fornece boas estimativas para condições estáticas (baixas frequências), enquanto o giroscópio nos fornece boas estimativas para condições dinâmicas (altas frequências). Um tem sucesso exatamente onde o outro falha. Por que então não combinar os dois para ter boas estimativas durante condições estáticas e dinâmicas? Essa é a ideia por trás de um filtro complementar!

### Filtro complementar

A ideia desse filtro é passar o ângulo medido pelo acelerômetro por um filtro passa-baixas e o ângulo medido pelo giroscópio por um filtro passa-altas, conforme a o diagrama de blocos abaixo:

![](images/complementary_filter.svg){: width=500 style="display: block; margin: auto;" }

Como a somatória desses dois filtros gera um ganho unitário, eles podem simplesmente ser somados(1):
{.annotate}

1. É daí que vem o nome "complementar"
        
$$
    \underbrace{\frac{\omega_c}{s+\omega_c}}_{\begin{array}{c} \text{ Filtro} \\ \text{passa-baixas} \end{array}} + \underbrace{\frac{s}{s+\omega_c}}_{\begin{array}{c} \text{Filtro} \\ \text{passa-altas} \end{array}} = 1
$$

Dado que a velocidade angular está sendo integrada antes de passar pelo filtro passa-altas e, tanto o filtro passa-baixas como o filtro passa-altas possuem o mesmo denominador da função de transferência, o diagrama de blocos pode ser reduzido:


![](images/complementary_filter_reduced.svg){: width=500 style="display: block; margin: auto;" }

Note que agora nós só temos uma única função de transferência, que é a função de transferência de um filtro passa-baixas. Como já deduzimos o correspondente discreto deste filtro, tem-se que:

$$
\begin{align}
    \phi[k] &= \left( 1-\alpha \right)\phi[k-1]+\alpha \left( \frac{1}{\omega_c} g_x[k] + \phi_a[k] \right) \\
    \phi[k] &= \left( 1-\alpha \right)\phi[k-1]+ \underbrace{\alpha\frac{1}{\omega_c}}_{(1-\alpha)\Delta t} g_x[k] + \alpha \phi_a[k]  \\
    \phi[k] &= \left( 1-\alpha \right)\phi[k-1]+ (1-\alpha) g_x[k]\Delta t + \alpha \phi_a[k]  \\
    \phi[k] &= \left( 1-\alpha \right)\underbrace{\left(\phi[k-1]+g_x[k] \Delta t \right)}_{\phi_g[k]} + \alpha \phi_a[k] \\
    \phi[k] &= \left( 1-\alpha \right)\phi_g[k] + \alpha \phi_a[k] 
\end{align}
$$

Ou seja, um filtro complementar discretizado nada mais é do que uma média ponderada entre o ângulo medido pelo giroscópio $\phi_g$ e o ângulo medido pelo acelerômetro $\phi_a$. Isso pode ser representando pelo seguinte diagrama de blocos:

![](images/estimator_accelerometer_gyroscope_complementary_filter.svg){: width=600 style="display: block; margin: auto;" }

Modifique a sua função `attitudeEstimator()` de modo que agora o ângulo estimado $\phi$ seja dado por um filtro complementar das medidas do acelerômetro $\phi_a$ e giroscópio $\phi_g$.

```c hl_lines="5 6 9 12 15"
// Estimate orientation from IMU sensor
void attitudeEstimator()
{
    // Estimator parameters
    static const float wc = 
    static const float alpha = 

    // Measured angle from accelerometer
    float phi_a = 

    // Measured angle from gyroscope
    float phi_g = 

    // Estimated angle (accelerometer and gyroscope with complementary filter)
    phi = 

    // Auxiliary variables for logging Euler angles (CFClient uses degrees and not radians)
    log_phi = phi * 180.0f / pi;
}
```  

Experimente valores de 0,1rad/s, 1rad/s e 10rad/s para a frequência de corte $\omega_c$ e verifique como isso influencia na sua estimativa. Para isso, carregue esse programa no drone e utilize o Crazyflie Client para visualizar o resultado.

!!! example "Resultado esperado"   
    Agora sim a estimativa ficou legal!

### Dinâmica completa

Por fim, você deve replicar o estimador de atitude desenvolvido para os demais ângulos de Euler e também velocidades angulares:
    
$$
\left\{
\begin{array}{l}
    \phi =  \left( 1 - \alpha \right) \phi_g + \alpha \phi_a \\ 
    \theta = \left( 1 - \alpha \right) \theta_g + \alpha \theta_a  \\
    \psi = \psi_g 
\end{array}
\right.
\qquad \qquad \qquad
\left\{
\begin{array}{l}
    \omega_x = g_x \\ 
    \omega_y = g_y \\
    \omega_z = g_z 
\end{array}
\right.
$$

Note que não conseguimos estimar o ângulo de guinagem $\psi$ a partir das leituras do acelerômetro, portanto, neste caso, utilizaremos apenas o giroscópio. Ou seja, é esperado que o ângulo de guinagem $\psi$ divirja com o tempo, mas esse ângulo não é essencial para garantir a estabilidade do drone(1).
{.annotate}

1. Sistemas de referência de atitude e direção (AHRS) utilizam um magnetômetro para complementar a estimativa de guinagem $\psi$ do giroscópio, dessa forma evitando que esse ângulo também divirja.

Os ângulos de Euler $\phi_a$ e $\theta_a$ medidos a partir das leituras do acelerômetro $a_x$, $a_y$ e $a_z$ são dados por:

![](images/readings_accelerometer_3d.svg){: width=250 style="display: block; margin: auto;" }

$$
\left\{
\begin{array}{l}
    \phi_a = \tan^{-1} \left( \dfrac{-a_y}{-a_z} \right) \\
    \theta_a = \tan^{-1} \left( \dfrac{a_x}{\sqrt{a_y^2+a_z^2}} \right)
\end{array}
\right.
$$

??? info "Dedução"

    As acelerações $a_x$, $a_y$ e $a_z$ em função da gravidade $g$ e dos ângulo $\phi$ e $\theta$ são dadas por:
            
    $$
    \begin{align}
        \begin{bmatrix}
            a_x \\
            a_y \\
            a_z \\
        \end{bmatrix} &= R \vec{g} \\
        \begin{bmatrix}
            a_x \\
            a_y \\
            a_z \\
        \end{bmatrix}
        &=
        \begin{bmatrix} 
            \cos\theta\cos\psi & \cos\theta\sin\psi & -\sin\theta \\ 
            - \cos\phi\sin\psi + \sin\phi\sin\theta\cos\psi  & \cos\phi\cos\psi + \sin\phi\sin\theta\sin\psi & \sin\phi\cos\theta \\ 
            \sin\phi\sin\psi + \cos\phi\sin\theta\cos\psi & - \sin\phi\cos\psi + \cos\phi\sin\theta\sin\psi  & \cos\phi\cos\theta 
        \end{bmatrix}
        \begin{bmatrix}
            0 \\
            0 \\
            -g \\
        \end{bmatrix} \\
        \begin{bmatrix}
            a_x \\
            a_y \\
            a_z \\
        \end{bmatrix}
        &=
        \begin{bmatrix}
            g\sin\theta	\\
            -g\sin\phi\cos\theta \\
            -g\cos\phi\cos\theta
        \end{bmatrix}
    \end{align}
    $$

    Dividindo a segunda equação pela terceira, podemos medir o ângulo $\phi_a$ em função das leituras do acelerômetro $a_y$ e $a_z$:

    $$
    \begin{align}
        \frac{a_y}{a_z} &= \frac{-\cancel{g}\sin\phi_a\cancel{\cos\theta}}{-\cancel{g}\cos\phi_a\cancel{\cos\theta}} \\
        \frac{-a_y}{-a_z} &= \tan\phi_a \\
        \phi_a &= \tan^{-1} \left( \dfrac{-a_y}{-a_z} \right)
    \end{align}
    $$

    Já a medição do ângulo $\theta_a$ depende das leituras do acelerômetro $a_x$, $a_y$ e $a_z$, e a dedução é um pouco mais complexa:

    $$
    \begin{align}
        \frac{a_x^2}{a_y^2+a_z^2} &= \frac{(g\sin\theta_a)^2}{(-g\sin\phi_a\cos\theta_a)^2+(-g\cos\phi_a\cos\theta_a)^2} \\
        \frac{a_x^2}{a_y^2+a_z^2} &= \frac{g^2\sin^2\theta_a}{g^2\sin^2\phi_a\cos^2\theta_a+g^2\cos^2\phi_a\cos^2\theta_a} \\
        \frac{a_x^2}{a_y^2+a_z^2} &= \frac{\cancel{g^2}\sin^2\theta_a}{\cancel{g^2}\cos^2\cancelto{1}{(\sin^2\phi_a+\cos^2\phi_a)}} \\
        \frac{a_x^2}{a_y^2+a_z^2} &= \frac{\sin^2\theta_a}{\cos^2\theta_a} \\
        \frac{a_x^2}{a_y^2+a_z^2} &= \tan^2\theta_a \\
        \sqrt{\frac{a_x^2}{a_y^2+a_z^2}} &= \tan\theta_a \\
        \frac{a_x}{\sqrt{a_y^2+a_z^2}} &= \tan\theta_a \\
        \theta_a &= \tan^{-1} \left( \frac{a_x}{\sqrt{a_y^2+a_z^2}} \right)
    \end{align}
    $$

Os ângulos de Euler $\phi_g$, $\theta_g$ e $\psi_g$ medidos a partir das leituras do giroscópio $g_x$, $g_y$ e $g_z$ são dados por:

![](images/readings_gyroscope_3d.svg){: width=250 style="display: block; margin: auto;" }

$$
\left\{
\begin{array}{l}
    \phi_g = \phi + \left( g_x + g_y \sin\phi\tan\theta + g_z \cos\phi\tan\theta \right) \Delta t \\
    \theta_g = \theta + \left( g_y \cos\phi - g_z \sin\phi \right) \Delta t \\
    \psi_g = \psi + \left( g_y \sin\phi\sec\theta + g_z \cos\phi\sec\theta \right) \Delta t
\end{array}
\right.
$$

??? info "Dedução"

    As derivadas dos ângulos de Euler em função das velocidades angulares são dadas pela equação cinemática de rotação:

    $$
    \begin{bmatrix}
        \dot{\phi} \\
        \dot{\theta} \\
        \dot{\psi}
    \end{bmatrix}
    = 
    \begin{bmatrix} 
        1 & \sin\phi\tan\theta & \cos\phi\tan\theta \\
        0 & \cos\phi & - \sin\phi\\
        0 & \sin\phi\sec\theta & \cos\phi\sec\theta 
    \end{bmatrix}
    \begin{bmatrix}
        \omega_x \\
        \omega_z \\
        \omega_y
    \end{bmatrix}
    $$

    Como:

    $$
    \begin{bmatrix}
        g_x \\
        g_z \\
        g_y
    \end{bmatrix}
    =
    \begin{bmatrix}
        \omega_x \\
        \omega_z \\
        \omega_y
    \end{bmatrix}
    $$

    Logo, substituindo e integrando ao longo do tempo:

    $$
    \begin{align*}
        \begin{bmatrix}
            \phi_g \\
            \theta_g \\
            \psi_g
        \end{bmatrix}
        &=
        \begin{bmatrix}
            \phi \\
            \theta \\
            \psi
        \end{bmatrix}
        +
        \begin{bmatrix}
            \dot{\phi}  \\
            \dot{\theta} \\
            \dot{\psi}
        \end{bmatrix} \Delta t \\
        \begin{bmatrix}
            \phi_g  \\
            \theta_g  \\
            \psi_g 
        \end{bmatrix}
        &=
        \begin{bmatrix}
            \phi \\
            \theta \\
            \psi
        \end{bmatrix}
        +
        \begin{bmatrix}
            1 & \sin\phi\tan\theta & \cos\phi\tan\theta \\
            0 & \cos\phi & -\sin\phi \\
            0 & \sin\phi\sec\theta & \cos\phi\sec\theta
        \end{bmatrix}
        \begin{bmatrix}
            g_x  \\
            g_y  \\
            g_z 
        \end{bmatrix} \Delta t
    \end{align*} 
    $$

Modifique a sua função `attitudeEstimator()` de modo que agora os ângulos estimados $\phi$, $\theta$ e $\psi$ sejam dados por um filtro complementar entre as medidas do acelerômetro $\phi_a$ e $\theta_a$ e giroscópio $\phi_g$, $\theta_g$ e $\psi_g$.

```c hl_lines="5 6 9 10 13-15 18-20 23-25"
// Estimate orientation from IMU sensor
void attitudeEstimator()
{
    // Estimator parameters
    static const float wc = 
    static const float alpha = 

    // Measured angles from accelerometer
    float phi_a = 
    float theta_a = 

    // Measured angles from gyroscope
    float phi_g = 
    float theta_g = 
    float psi_g = 

    // Estimated angles (accelerometer and gyroscope with complementary filter)
    phi = 
    theta = 
    psi = 

    // Angular velocities estimation (gyroscope)
    wx = 
    wy = 
    wz = 

    // Auxiliary variables for logging Euler angles (CFClient uses degrees and not radians)
    log_phi = phi * 180.0f / pi;
    log_theta = -theta * 180.0f / pi;
    log_psi = psi * 180.0f / pi;
}
```  

Carregue esse programa no drone e utilize o Crazyflie Client para visualizar o resultado de um estimador de atitude completo! -->