import React, { useRef, useState, useEffect } from "react";
import { useCursor, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useControls } from "leva";
import gsap from "gsap";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

function Letter({ geometry, material, position, index, vec = new THREE.Vector3() }) {
  const letterRef = useRef();
  const [hovered, set] = useState()

  const handleClick = () => {
    // Create a GSAP animation to rotate the letter 360 degrees
    gsap.to(letterRef.current.rotation, {
      y: Math.PI * 2,
      duration: 0.8, // Adjust the duration as needed
      ease: "Power2.easeInOut",
      onComplete: () => {
        // Reset the rotation after the animation is complete
        gsap.set(letterRef.current.rotation, { y: 0 });
      },
    });
  };

  const handleAnimation = () => {
    const tl = gsap.timeline();

    tl.fromTo(
      letterRef.current.position,
      { y: -5, x: 5 },
      { y: position[1], x: position[0], duration: 0.8, delay: 0.01 * index, ease: "power2.out" },
      0.2 * index
    );

    tl.to(letterRef.current.rotation, {
      y: Math.PI * 2,
      duration: 1,
      onComplete: () => {
        gsap.set(letterRef.current.rotation, { y: 0 });
      },
    }, "-=1");

    return tl;
  };

  useCursor(hovered, /*'pointer', 'auto', document.body*/)

  // useEffect(() => {
  //   handleAnimation();
  // }, []);

  const api = useRef()
  useFrame((state, delta) => {
    delta = Math.min(0.1, delta)
    if (!api.current) return
    console.log(api.current.translation())
    api.current?.applyImpulse(vec.copy({
      x: position[0] - api.current.translation().x,
      y: position[1] - api.current.translation().y,
      z: position[2] - api.current.translation().z
    }).multiplyScalar(4.2))

  })

  return (
    <RigidBody
      type="Dynamic"
      linearDamping={4} angularDamping={1} friction={0.1} position={position} ref={api} colliders='hull'>
      <mesh
        onPointerOver={() => set(true)}
        onPointerOut={() => set(false)}
        castShadow
        receiveShadow
        geometry={geometry}
        material={material}
        ref={letterRef}
        onClick={handleClick}
      />
    </RigidBody>
  );
}

export function OtisBayLogo(props) {
  const { nodes } = useGLTF("/otis-bay.glb");
  const { color1, color2 } = useControls({
    color1: "#41F4D5",
    color2: "#9069F8",
  });

  const materials = {
    materialForOTIS: new THREE.MeshStandardMaterial({
      color: color1,
      metalness: 0,
      roughness: 0.2,
      delay: 0.1,
    }),

    materialForBAY: new THREE.MeshPhysicalMaterial({
      color: color2,
      metalness: 0,
      roughness: 0.3,
    }),
  };

  const letters = [
    {
      name: "O",
      geometry: nodes.O.geometry,
      material: materials.materialForOTIS,
      position: [-7.01, 3.769, -1.54]
    },

    {
      name: "T",
      geometry: nodes.T.geometry,
      material: materials.materialForOTIS,
      position: [-1.122, 5.764, -1.54]
    },
    {
      name: "I",
      geometry: nodes.I.geometry,
      material: materials.materialForOTIS,
      position: [3.552, 3.42, -1.54]
    },
    {
      name: "S",
      geometry: nodes.S.geometry,
      material: materials.materialForOTIS,
      position: [7.747, 5.97, -1.54]
    },
    {
      name: "B",
      geometry: nodes.B.geometry,
      material: materials.materialForBAY,
      position: [-6.812, -3.059, -1.54]
    },
    {
      name: "A",
      geometry: nodes.A.geometry,
      material: materials.materialForBAY,
      position: [-0.728, -2.75, -1.54]
    },
    {
      name: "Y",
      geometry: nodes.Y.geometry,
      material: materials.materialForBAY,
      position: [4.372, -3.529, -1.54]
    }
  ];

  return (
    <group {...props} dispose={null}>
      {letters.map((letter, index) => (
        <Letter
          key={index}
          index={index}
          position={letter.position}
          geometry={letter.geometry}
          material={letter.material}
        />
      ))}
    </group>
  );
}

useGLTF.preload("/otis-bay.glb");
