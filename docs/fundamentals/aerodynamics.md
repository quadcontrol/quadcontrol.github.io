---
title: Aerodynamics
icon: material/airplane
---

# :material-airplane: Aerodynamics

This section introduces the fundamental aerodynamic principles that govern how a multirotor generates thrust and responds to forces in the air. We look at why a spinning propeller produces thrust, how drag appears as a natural consequence of motion, and how these effects scale with speed. Understanding these relationships is essential before we can discuss control, since every maneuver a quadcopter performs ultimately depends on how its propellers interact with the surrounding flow.

---

## Airfoil

Every mathematical model of a drone includes aerodynamic parameters. To understand where they come from, let’s begin by examining the aerodynamic forces acting on an airfoil, the building block of any wing or propeller blade.

### Aerodynamic forces

The figure below shows a cross section of an airfoil, a body shaped to generate lift when placed in an airflow:

![](images/airfoil1.svg){: width=50% style="display: block; margin: auto;" }

While the airfoil is designed to produce a desired lift force ${\color{var(--c2)}f_l}$ (perpendicular to the velocity ${\color{var(--c1)}v}$), it also produces an undesired drag force ${\color{var(--c2)}f_d}$ (parallel to the velocity ${\color{var(--c1)}v}$):

$$
{\color{var(--c2)}f_l} = \frac{1}{2} \rho A C_l {\color{var(--c1)}v}^2 
\qquad \qquad
{\color{var(--c2)}f_d} = \frac{1}{2} \rho A C_d {\color{var(--c1)}v}^2 
$$

Where:

- $\rho$ — Air density ($\text{kg/m}^3$)  
- $A$ — Surface area ($\text{m}^2$)  
- $C_l$ — Lift coefficient (dimensionless)  
- $C_d$ — Drag coefficient (dimensionless)  
- ${\color{var(--c1)}v}$ — Linear velocity of the airfoil ($\text{m/s}$)

### Aerodynamic coefficients

The lift and drag coefficients are not constant.  They vary according to three main aerodynamic conditions:

- Angle of attack ($\alpha$): the angle between the airfoil’s mean line (its *chord line*) and the airflow velocity vector  
- Reynolds number ($Re = \frac{\rho {\color{var(--c1)}v} D}{\mu}$): a dimensionless quantity defining the flow regime, which can be laminar(1) or turbulent(2)  
{.annotate}

    1. $Re<2300$
    3. $Re>4000$

- Mach number ($M = \frac{\color{var(--c1)}v}{v_s}$): the ratio between the airspeed and the speed of sound, which defines whether the flow is subsonic(1), supersonic(2) or hypersonic(3)
{.annotate}

    1. $M<1$
    2. $1<M<5$
    3. $M>5$

For airfoils operating in laminar flow at subsonic speeds, the angle of attack is the dominant factor:

![](images/airfoil2.svg){: width=50% style="display: block; margin: auto;" }

There are many possible airfoil shapes. One of the most widely used profiles is the Clark Y, whose lift and drag coefficients as functions of the angle of attack are well known and shown below(1):
{.annotate}

1. Assuming the Reynolds and Mach numbers remain within typical laminar subsonic ranges.

![](images/clarky.svg){: width=80% style="display: block; margin: auto;" }

While the drag coefficient increases monotonically with $\alpha$, the lift coefficient reaches a maximum around $\alpha = 18^{\circ}$. This point is known as the stall, which occurs when the airflow separates from the wing’s upper surface, creating turbulence and loss of lift. Note also that the lift coefficient is zero for a small negative angle and becomes negative only below that.

<a id="exercise-1"></a>
!!! question "Exercise 1"

    To consolidate these concepts, consider a fixed-wing drone (flying wing) using Clark Y airfoils, flying in level cruise with the following parameters:

    ![](images/fixed_wind_drone.svg){: width=30% style="display: block; margin: auto;" align=right } 

    - Mass: $m = 40~\text{g}$  
    - Length: $l = 10~\text{cm}$  
    - Wing span: $b = 10~\text{cm}$  
    - Propeller efficiency: $\eta_p = 60~\%$
    - Motor efficiency: $\eta_m = 75~\%$  
    - ESC efficiency: $\eta_e = 95~\%$  
    - Battery efficiency: $\eta_b = 95~\%$  
    - Battery voltage: $e_s = 3.7~\text{V}$  
    - Battery capacity: $q_s = 350~\text{mAh}$  
    - Gravitational acceleration: $g = 9.81~\text{m/s}^2$  
    - Air density: $\rho = 1.225~\text{kg.m}^{-3}$ 

    ??? info "a) Draw the free-body diagram of the forces acting on the drone."

        ![](images/fixed_wind_drone_fbl.svg){: width=50% style="display: block; margin: auto;" }

    ??? info "b) Compute the total wing area assuming the body is triangular."

        Given that it is a flying-wing drone, the wing area can be approximated as a triangle with a base equal to the wing span and a height equal to the length of the drone:

        $$
        \begin{align}
            A &= \frac{b \cdot l}{2} \\
            A &= \frac{10 \cdot 10}{2} \\
            A &= 50~\text{cm}^2
        \end{align}
        $$

    ??? info "c) Determine the lift and drag coefficients of the drone’s wings."

        Since the drone is flying in level cruise with zero angle of attack, we can read the coefficients from the Clark Y airfoil graph:

        $$
        \left\{
        \begin{array}{l}
            C_l = 0.35 \\
            C_d = 0.02
        \end{array}
        \right.
        $$

    ??? info "d) Compute the drone’s cruise speed."

        In level cruise, the net vertical force is zero, allowing us to compute the cruising velocity:

        $$
        \begin{align}
            \sum {\color{var(--c2)}f_y} &= 0 \\
            {\color{var(--c2)}f_l} - {\color{var(--c2)}f_w} &= 0 \\
            \frac{1}{2} \rho A C_l {\color{var(--c1)}v}^2 - mg &= 0 \\
            {\color{var(--c1)}v} &= \sqrt{\frac{2mg}{\rho A C_l}} \\
            {\color{var(--c1)}v} &= \sqrt{\frac{2 \cdot 0.04 \cdot 9.81}{1.225 \cdot 50 \times 10^{-4} \cdot 0.35}} \\
            {\color{var(--c1)}v} &= 19.13~\text{m/s} \quad (\approx 69~\text{km/h})
        \end{align}
        $$

    ??? info "e) Compute the thrust generated by the propellers."

        In level cruise, the net horizontal force is zero, which allows us to compute the thrust force:

        $$
        \begin{align}
            \sum {\color{var(--c2)}f_x} &= 0 \\
            {\color{var(--c2)}f_t} - {\color{var(--c2)}f_d} &= 0 \\
            {\color{var(--c2)}f_t} &= \frac{1}{2} \rho A C_d {\color{var(--c1)}v}^2 \\
            {\color{var(--c2)}f_t} &= \frac{1}{2} \cdot 1.225 \cdot 50 \times 10^{-4} \cdot 0.02 \cdot {\color{var(--c1)}19.13}^2 \\
            {\color{var(--c2)}f_t} &= 2.24 \times 10^{-2}~\text{N}
        \end{align}
        $$

    ??? info "f) Calculate the mechanical and electrical power required."

        Mechanical power is given by the product of thrust and velocity:

        $$
        \begin{align}
            P_m &= {\color{var(--c2)}f_t} {\color{var(--c1)}v} \\
            P_m &= {\color{var(--c2)}2.24 \times 10^{-2}} \cdot {\color{var(--c1)}19.13} \\
            P_m &= 0.43~\text{W}
        \end{align}
        $$

        The electrical power accounts for the propulsion system efficiency:

        $$
        \begin{align}
            P_e &= \frac{P_m}{\eta_p \eta_m \eta_e \eta_b} \\
            P_e &= \frac{0.43}{0.6 \cdot 0.75 \cdot 0.95 \cdot 0.95} \\
            P_e &= 1.06~\text{W}
        \end{align}
        $$

    ??? info "g) Estimate how long the drone can stay airborne."

        The total energy stored in the battery is given by the product of its voltage and capacity:

        $$
        \begin{align}
            E_s &= e_s q_s \\
            E_s &= 3.7 \cdot 0.35 \\
            E_s &= 1.3~\text{Wh}
        \end{align}
        $$

        Dividing this energy by the electrical power consumption gives an estimate of the flight time:

        $$
        \begin{align}
            \Delta t &= \frac{E_s}{P_e} \\
            \Delta t &= \frac{1.3 \cdot 3600}{1.06} \\
            \Delta t &= 4413~\text{s} \quad (\approx 1~\text{h}~14~\text{min})
        \end{align}
        $$

---

## Propeller

A propeller consists of $n$ blades(1), each of which can be treated as an individual airfoil.
{.annotate}

1. Typically 2–4 blades, though certain applications may use 5–6.

### Aerodynamic forces and torques

As the propeller spins, each blade generates lift and drag forces, as illustrated below:

![Propeller1](images/propeller1.svg){: width=50% style="display: block; margin: auto;" }

Where:

- $d$ — Distance from the pressure center to the rotation axis ($\text{m}$)  
- ${\color{var(--c1)}\omega}$ — Angular velocity of the propeller ($\text{rad/s}$)

!!! question "Exercise 2"

    Derive the expressions for the lift ${\color{var(--c2)}f_l}$ and drag ${\color{var(--c2)}f_d}$ forces acting on the propeller blades as functions of the angular velocity ${\color{var(--c1)}\omega}$.

    ??? info "Answer"

        Starting from the general lift equation and substituting ${\color{var(--c1)}v} = {\color{var(--c1)}\omega} d$ gives:

        $$
        \begin{align}
            {\color{var(--c2)}f_l} &= \frac{1}{2} \rho A C_l {\color{var(--c1)}v}^2 \\ 
            {\color{var(--c2)}f_l} &= \frac{1}{2} \rho A C_l ({\color{var(--c1)}\omega} d)^2 \\
            {\color{var(--c2)}f_l} &= \frac{1}{2} \rho A C_l d^2 {\color{var(--c1)}\omega}^2 
        \end{align}
        $$

        Repeating the same procedure for the drag force yields:

        $$
        \begin{align}
            {\color{var(--c2)}f_d} &= \frac{1}{2} \rho A C_d {\color{var(--c1)}v}^2 \\ 
            {\color{var(--c2)}f_d} &= \frac{1}{2} \rho A C_d ({\color{var(--c1)}\omega} d)^2 \\
            {\color{var(--c2)}f_d} &= \frac{1}{2} \rho A C_d d^2 {\color{var(--c1)}\omega}^2 
        \end{align}
        $$

The lift and drag forces on each blades can be represented by an equivalent thrust force and drag torque on the propeller, as shown below:

![Propeller2](images/propeller2.svg){: width=50% style="display: block; margin: auto;" }

!!! question "Exercise 3"

    Determine the thrust force ${\color{var(--c2)}f}$ and drag torque ${\color{var(--c2)}\tau}$ of the propeller.

    ??? info "Answer"

        The thrust force ${\color{var(--c2)}f}$ of the propeller is simply the sum of each blade lift force ${\color{var(--c2)}f_l}$:

        $$
        \begin{align}
            {\color{var(--c2)}f} &= 2 {\color{var(--c2)}f_l} \\ 
            {\color{var(--c2)}f} &= \cancel{2} \left( \frac{1}{\cancel{2}} \rho A C_l d^2 {\color{var(--c1)}\omega}^2 \right) \\
            {\color{var(--c2)}f} &= \rho A C_l d^2 {\color{var(--c1)}\omega}^2 
        \end{align}
        $$

        Whereas the drag torque ${\color{var(--c2)}\tau}$ is the sum of each blade drag force ${\color{var(--c2)}f_d}$ multiplied by its arm $d$:

        $$
        \begin{align}
            {\color{var(--c2)}\tau} &= 2 {\color{var(--c2)}f_d} d \\ 
            {\color{var(--c2)}\tau} &= \cancel{2} \left( \frac{1}{\cancel{2}} \rho A C_d d^2 {\color{var(--c1)}\omega}^2  \right) d \\
            {\color{var(--c2)}\tau} &= \rho A C_d d^3 {\color{var(--c1)}\omega}^2 
        \end{align}
        $$

Since all other parameters are constant, the thrust and drag torque depend only on the square of the angular velocity:

$$
{\color{var(--c2)}f} = \underbrace{\rho A C_l d^2}_{k_l} {\color{var(--c1)}\omega}^2 
\qquad \qquad
{\color{var(--c2)}\tau} = \underbrace{\rho A C_d d^3}_{k_d} {\color{var(--c1)}\omega}^2 
$$

Where:

- $k_l$ — Thrust constant ($\text{N.s}^2\text{/rad}^2$)  
- $k_d$ — Drag constant ($\text{N.m.s}^2\text{/rad}^2$)

### Aerodynamic constants

These two constants fully describe how a propeller converts rotational speed into force and torque:

![Propeller3](images/propeller3.svg){: width=50% style="display: block; margin: auto;" }

$$
{\color{var(--c2)}f} = k_l {\color{var(--c1)}\omega}^2 
\qquad \qquad
{\color{var(--c2)}\tau} = k_d {\color{var(--c1)}\omega}^2 
$$

!!! question "Exercise 4"

    ![](images/crazyflie_propellers.png){: width=20% style="display: block; margin: auto;" align=right } 

    Using a ruler, roughly estimate(1) the thrust constant $k_l$ and drag constant $k_d$ of the [Bitcraze Crazyflie 2.1 brushless propellers](https://store.bitcraze.io/collections/spare-parts-crazyflie-brushless/products/propeller-55-35-4ccw-4cw-green){target=_blank}. Assume the blade shape resembles a Clark Y profile with an angle of attack $\alpha = 5^\circ$, where the lift coefficient is similar, but the drag coefficient is eight times larger(2).
    {.annotate}

    1. We are interested only in the order of magnitude.  
    2. Due to additional turbulence generated by the propeller.

    ??? info "Answer"

        The air density can be assumed as:

        $$
        \rho = 1.225~\text{kg/m}^3
        $$

        The surface area can be estimated with a ruler assuming each blade is a rectangle:

        ![](images/crazyflie_propeller_dimension_1.png){: width=50% style="display: block; margin: auto;" }

        $$
        A = 2.5 \cdot 0.5 = 1.25~\text{cm}^2 \\    
        $$

        The coefficients can be determined from the Clark Y airfoil graph with an angle of attack $\alpha = 5^\circ$:

        $$
        \left\{
        \begin{array}{l}
            C_l = 0.7 \\
            C_d = 0.04 \cdot 8 = 0.32
        \end{array}
        \right.
        $$

        The  distance from the pressure center to the rotation axis can be estimated with a ruler:

        ![](images/crazyflie_propeller_dimension_2.png){: width=40% style="display: block; margin: auto;" }

        $$
            d = 1.5~\text{cm}
        $$

        With all those values, the thrust and drag constants can be determined:

        $$
        \begin{align}
        k_l &= \rho A C_l d^2 \\
        k_l &= 1.225 \cdot 1.25\times10^{-4} \cdot 0.7 \cdot {\left( 1.5\times10^{-2} \right)}^2 \\
        k_l &= 2.41\times10^{-8}~\text{N.s}^2/\text{rad}^2
        \end{align}
        $$

        $$
        \begin{align}
        k_d &= \rho A C_d d^3 \\
        k_d &= 1.225 \cdot 1.25\times10^{-4} \cdot 0.32 \cdot {\left( 1.5\times10^{-2} \right)}^3 \\
        k_d &= 1.65\times10^{-10}~\text{N.m.s}^2/\text{rad}^2
        \end{align}
        $$

These two parameters will later be determined experimentally in the indentification section of [thrust constant](../identification/thrust_constant.md) and [drag constant](../identification/drag_constant.md), and you’ll find that the measured values closely match these estimates.

!!! question "Exercise 5"

    To consolidate these ideas, consider a quadrotor drone hovering in place with the following parameters:

    - Mass: $m = 40~\text{g}$  
    - Thrust constant: $k_l = 2.4\times10^{-8}~\text{N·s}^2\text{/rad}^2$  
    - Drag constant: $k_d = 1.6\times10^{-10}~\text{N·m·s}^2\text{/rad}^2$  
    - Motor efficiency: $\eta_m = 75~\%$
    - ESC efficiency: $\eta_e = 95~\%$
    - Battery efficiency: $\eta_b = 95~\%$  
    - Battery voltage: $e_s = 3.7~\text{V}$  
    - Battery capacity: $q_s = 350~\text{mAh}$  
    - Gravitational acceleration: $g = 9.81~\text{m/s}^2$  
    - Air density: $\rho = 1.225~\text{kg·m}^{-3}$  


    ??? info "a) Draw the free-body diagram of the forces acting on the drone."

    ??? info "b) Compute the angular velocity of the propellers."

        In hover, the net vertical force is zero, allowing us to compute the angular velocity of the propellers:

        $$
        \begin{align}
            \sum {\color{var(--c2)}f_y} &= 0 \\
            4 {\color{var(--c2)}f} - {\color{var(--c2)}f_w} &= 0 \\
            4 k_l {\color{var(--c1)}\omega}^2 - mg &= 0 \\
            {\color{var(--c1)}\omega} &= \sqrt{\frac{mg}{4k_l}} \\
            {\color{var(--c1)}\omega} &= \sqrt{\frac{0.04\cdot9.81}{4 \cdot 2.6\times10^{-8}}} \\
            {\color{var(--c1)}\omega} &= 2022~\text{rad/s} \quad (\approx 19306~\text{rpm})
        \end{align}
        $$

    ??? info "c) Compute each motor torque."

        Since the angular velocity of the motors is constant, their net torque is zero, which allows us to compute the motor torque:

        $$
        \begin{align}
            \sum {\color{var(--c2)}\tau_z} &= 0 \\
            {\color{var(--c2)}\tau_m} - {\color{var(--c2)}\tau} &= 0 \\
            {\color{var(--c2)}\tau_m} - k_d {\color{var(--c1)}\omega}^2 &= 0 \\
            {\color{var(--c2)}\tau_m} &= k_d {\color{var(--c1)}\omega}^2 \\
            {\color{var(--c2)}\tau_m} &= 1.4\times10^{-10} \cdot {\color{var(--c1)}2022}^2 \\
            {\color{var(--c2)}\tau_m} &= 6.54\times10^{-4}\text{ N·m}
        \end{align}
        $$

    ??? info "d) Calculate the mechanical and electrical power required."

        Mechanical power is given by the product of torque and angular velocity times the number of motors:

        $$
        \begin{align}
            P_m &= 4 {\color{var(--c2)}\tau} {\color{var(--c1)}\omega} \\
            P_m &= 4 \cdot {\color{var(--c2)}6.54\times10^{-4}} \cdot {\color{var(--c1)}2022} \\
            P_m &= 5.29~\text{W}
        \end{align}
        $$

        The electrical power accounts for the propulsion system efficiency:

        $$
        \begin{align}
            P_e &= \frac{P_m}{\eta_b \eta_e \eta_m} \\
            P_e &= \frac{5.29}{0.95 \cdot 0.95 \cdot 0.7} \\
            P_e &= 7.81~\text{W}
        \end{align}
        $$

    ??? info "e) Estimate how long the drone can stay airborne."

        The total energy stored in the battery is given by the product of its voltage and capacity:

        $$
        \begin{align}
            E_s &= e_s q_s \\
            E_s &= 3.7 \cdot 0.35 \\
            E_s &= 1.30~\text{Wh}
        \end{align}
        $$

        Dividing this energy by the electrical power consumption gives an estimate of the flight time:

        $$
        \begin{align}
            \Delta t &= \frac{E_s}{P_e} \\
            \Delta t &= \frac{1.30 \cdot 3600}{7.81} \\
            \Delta t &= 597~\text{s} \quad (\approx 10~\text{min})
        \end{align}
        $$

Compare this result with the fixed-wing drone from [Exercise 1](#exercise-1). Notice how the fixed-wing configuration can stay airborne nearly eight times longer, though it cannot hover or perform vertical take-off and landing like a multirotor drone. Those are the advantages and disavantages of each configuration