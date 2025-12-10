---
title: Hardware
icon: material/quadcopter
---

<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>

# :material-quadcopter: Hardware

This section brings together all the hardware used in the course: the Bitcraze components that form the core of the system, the test fixtures used for controlled experiments, and the measurement tools that allow you to measure and validate the drone’s physical behavior. The goal is to make sure you know exactly what you need and have everything ready before moving on to the practical activities.

---

## Bitcraze Components

[Bitcraze](https://bitcraze.io){target=_blank} offers an entire ecosystem of drones, radios and expansion decks, but for this course you only need three of them(1). These devices form the drone you will program, communicate with and fly throughout the course.
{.annotate}

1. These components are also available as a complete bundle from Bitcraze: the [STEM Bundle – Crazyflie 2.1 Brushless](https://store.bitcraze.io/collections/bundles/products/stem-bundle-crazyflie-2-1-brushless){target=_blank}.  

### Crazyflie 2.1 Brushless

![Crazyflie](images/crazyflie.png){: width="400" style="display: block; margin: auto;" }

The [Crazyflie 2.1 Brushless](https://store.bitcraze.io/products/crazyflie-2-1-brushless){target=_blank} is the core of the system: an open-source minidrone built around a printed circuit board (PCB) frame. It is compact, robust and equipped with:

- ARM Cortex-M4 processor (168 MHz)  
- BLDC motors (08028-10000KV)  
- BLDC motor controllers (5 A ESCs)  
- Integrated IMU (BMI088)

Released recently, the brushless version brings significantly more power and durability compared to earlier models.

---

### Crazyradio 2.0

![Crazyradio](images/crazyradio.png){: width="250" style="display: block; margin: auto;" }

The [Crazyradio 2.0](https://store.bitcraze.io/products/crazyradio-2-0){target=_blank} is the USB dongle that enables wireless communication between your computer and the drone. It allows you to:

- Upload firmware  
- Send real-time control commands  
- Receive telemetry data  

It connects directly over USB and works seamlessly with Bitcraze’s official tools.

---

### Flow Deck v2

![Flow deck](images/flow_deck.png){: width="150" style="display: block; margin: auto;" }

The [Flow Deck v2](https://store.bitcraze.io/collections/decks/products/flow-deck-v2){target=_blank} is a small expansion board mounted underneath the drone. It adds two essential sensors for autonomous flight:

- Time-of-Flight distance sensor (VL53L1X)  
- Optical-flow sensor (PMW3901)

Together, they allow the drone to measure its altitude above the ground and estimate horizontal motion relative to the floor, which is crucial for position estimation(1).
{.annotate}

1. Bitcraze also provides three absolute [positioning systems](https://www.bitcraze.io/documentation/system/positioning/){target=_blank}: the Lighthouse Positioning System, the Loco Positioning System and Motion Capture Positioning. The Flow Deck, however, offers relative positioning and does not rely on external infrastructure such as base stations, anchors or motion-capture cameras, which makes the entire positioning process self-contained on the drone.


---

## Test Fixtures

The test fixtures are 3D printed structures used to study the drone under controlled motion. Each one constrains specific degrees of freedom so you can isolate thrust, yaw or pitch behavior without risking the drone. All STL files are provided, and you can print every fixture yourself to build the full setup at home.

### Thrust Stand

<model-viewer src="../images/thrust_stand.glb"
    disable-zoom
    camera-controls
    auto-rotate
    style="width: 100%; max-width: 600px; height: 350px; margin: auto;">
</model-viewer>


**STL files**

[ :material-download: Thrust Stand (Base) ](models/pitch_rig_frame.stl){ .md-button }

The thrust stand holds the drone firmly above a scale so the vertical force produced by the motors can be measured directly. The base can be manufactured on any 3D printer, but there are also two M2 brass inserts(1) at the top (to fix the drone) and one neodymium magnet(2) at the bottom (to fix the thrust stand to the scale) that must be purchased separately and attached to the base.
{.annotate}

1. Outer diameter: 3.2mm / Length: 3mm
2. Diameter: 20mm / Length: 2mm


### Yaw Rotation Rig

<model-viewer src="../images/yaw_rotation_rig.glb"
    disable-zoom
    camera-controls
    auto-rotate
    style="width: 100%; max-width: 600px; height: 200px; margin: auto;">
</model-viewer>


**STL files**

[ :material-download: Yaw Rig (Base) ](models/pitch_rig_frame.stl){ .md-button }
[ :material-download: Yaw Rig (Mount) ](models/pitch_rig_frame.stl){ .md-button }

The yaw rotation rig constrains every degree of freedom except rotation around the vertical axis. 


With the drone free to spin only in yaw, you can observe the yaw torque balance, characterize drag torque coefficients and test your yaw control loops in isolation. This fixture makes it easy to experiment with step inputs, disturbances and controller tuning without worrying about the drone drifting away.


### Pitch Rotation Rig

<model-viewer src="../images/pitch_rotation_rig.glb"
    disable-zoom
    camera-controls
    auto-rotate
    style="width: 100%; max-width: 600px; height: 600px; margin: auto;">
</model-viewer>

**STL files**

[ :material-download: Pitch Rig (Base) ](models/pitch_rig_frame.stl){ .md-button }
[ :material-download: Pitch Rig (Mount) ](models/pitch_rig_frame.stl){ .md-button }
[ :material-download: Pitch Rig (Cap) ](models/pitch_rig_frame.stl){ .md-button }

The pitch rotation rig restricts the drone to rotate only around its lateral axis. It allows you to study pitch dynamics independently from roll and yaw, making it ideal for identifying inertia parameters, validating linearized models and tuning pitch controllers. By isolating the pitch motion, this fixture provides clean, repeatable experiments even with aggressive inputs.


---

## Measurement Tools

The measurement tools listed here are used to capture key physical quantities during the experiments, such as motor speed, thrust and mass. Links to affordable AliExpress options are provided for convenience, but any equivalent instrument that performs the same function will work just as well.

### Tachometer

A tachometer is used to measure the rotational speed of each motor. This reading is essential for identifying the thrust and drag coefficients, validating the motor model and checking whether the motor responds linearly to changes in PWM or commanded angular velocity. Any laser or optical tachometer capable of detecting reflective tape works fine. A link to an inexpensive AliExpress option is provided, but any equivalent instrument can be used.


### Scale

The scale is used to measure the vertical force generated by the drone when mounted on the thrust stand. Since thrust acts directly against gravity, the scale reading provides an immediate measurement of total thrust for a given motor speed. This is the key instrument for building thrust curves and validating the mixer model. Any small, fast-response digital scale works, and an AliExpress link is included only as a reference.

