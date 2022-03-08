# Interactive Recording of Slime Mold Simulation

This project is an implementation of Physarum (slime mold) simulation which concerns improving the user experience. The project is hosted on [glitch](https://slime-mold-timeline-simulation.glitch.me/).

## Problem Definition

Slime mold simulation has a few simple rules, but the resulting behavior is quite complex. As a result, it's difficult to make the simulation show intended pattern, specially for the users who lack a deep technical knowledge. We aim to achieve 3 goals with this implementation:
1. We want to give the user the ability to predict the effects changing a property has on the future frames, making it possible for the users to make informed changes and to not stuck in an undesirable simulation state.
2. We aim to create a close functionality to undoing an operation. Because the simulation is running at all times, every change has an effect on the final pattern. The existing tools provide the user with no return option, and once a change has been made there is no turning back other than restarting the simulation.
3. Make the simulation reproducible. Because the simulation keeps on running, the users must create the exact same operations on the exact same moments in the simulation to get the same result. This makes reproducing a pattern almost impossible.

## Proposed Solutions

We added a timeline which shows the future frames of the simulation. By looking at timeline the user can quickly see how the future patterns will change based on the changes they're applying to this frame. It makes it possible to see the relationship between the parameters and the produced shapes more clearly. Additionally, users also have the ability to pause the simulation at will, so they can pause on one frame, change the properties, and see how these changes affect the future states of the simulation almost immediately. By giving this ability to the users, they can think about the changes they want and make informed decisions. As a result, the users can work with the system even if they're inexperienced or lack the technical knowledge on the properties they can change.

## Work in Progress

We intend to add a change log on the timeline system. Having a timeline change log grants users the ability to view changes they made on each frame, and to change or undo them. By viewing the simulation not as the current state, but as a flow of states influenced by the changes the user made on each frame, these changes can be reviewed or reverted. Not only this gives the user the ability to revert any changes in any order, it also provides an overview of the changes and how they're affecting each part of the simulation, making it easier for the user to understand how the system works.

Additionally, we aim to add a recording system to this implementation. The recording system is intended to solve the problems arising from the users' inability to reproduce the results. It also makes makes it possible for the users to export, expand or share their simulations. While one image can be viewed as the final generated pattern, it is important to let the users save the simulation in a way that they can expand or change later. As stated above, because in the current implementations the simulation keeps running at all times, it is almost impossible to reproduce the result. So, we solve this problem by adding a way to save the whole simulation instead of the final result. Using this in combination with the timeline feature, not only the users can share their creations, but also they can look at how other users create these results.

## Implementation

In this implementation, the system first simulates the whole timeline of 100 frames. Each frame contains the trail map (which shows the values of each pixel in that frame, showing particles and their trails) and a list of particles with a heading direction and a position. From this data, the timeline shows a number of trail maps in a smaller scale. Upon changing any of the parameters, the frames are calculated again and the timeline changes after a small pause.
Additionally, user can pause the simulation in this version. As explained above, this is important because the user can now change parameters, see the results, and revert them. We also added a "Start Over" button, just because two of the parameters (changing the simulation canvas size and the number of particles) can't be modified in the middle of simulation.

![Screenshot 2022-03-08 at 14-12-06 slime mold simulation](https://user-images.githubusercontent.com/25642714/157334554-33118789-7855-4f4e-aceb-e964faa6fec1.png)

## Running the Simulation

The easiest way to run the simulation is to just use the  [glitch](https://slime-mold-timeline-simulation.glitch.me/) page. You can view the source code in [glitch](https://glitch.com/edit/#!/slime-mold-timeline-simulation) too. Using the remix button, you can change the source code and see the results.

## Example Results

These are all the results created by the system. This section will be updated to include the recording files when we add the recording feature.

![Screenshot 2022-03-08 at 14-18-44 slime mold simulation](https://user-images.githubusercontent.com/25642714/157335648-d0006749-c33b-4973-a8c9-dae76f88ab3b.png)
![Screenshot 2022-03-08 at 14-14-16 slime mold simulation](https://user-images.githubusercontent.com/25642714/157335650-3fdc50f9-c4ce-4d1e-81be-1a6924dd2a34.png)
![Screenshot 2022-03-08 at 14-12-54 slime mold simulation](https://user-images.githubusercontent.com/25642714/157335651-3d3e053f-5faa-4167-a2b7-57182fc37227.png)
![Screenshot 2022-03-08 at 14-21-00 slime mold simulation](https://user-images.githubusercontent.com/25642714/157335653-e675f2ba-9d05-4473-a11b-2146c0ea82c2.png)
![Screenshot 2022-03-08 at 14-23-17 slime mold simulation](https://user-images.githubusercontent.com/25642714/157335974-a1a83693-7cc2-4d06-9880-a330c69a5122.png)
![Screenshot 2022-03-08 at 14-22-49 slime mold simulation](https://user-images.githubusercontent.com/25642714/157335976-7fb09835-ace5-4a59-a833-8e5fcefb1fda.png)
