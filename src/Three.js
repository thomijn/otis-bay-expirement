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
    api.current?.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(4.2))
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
      position: [0, 9.667, 5.469]
    },

    {
      name: "T",
      geometry: nodes.T.geometry,
      material: materials.materialForOTIS,
      position: [0, 11.662, -0.418]
    },
    {
      name: "I",
      geometry: nodes.I.geometry,
      material: materials.materialForOTIS,
      position: [0, 9.318, -5.093]
    },
    {
      name: "S",
      geometry: nodes.S.geometry,
      material: materials.materialForOTIS,
      position: [0, 11.868, -9.288]
    },
    {
      name: "B",
      geometry: nodes.B.geometry,
      material: materials.materialForBAY,
      position: [0, 2.839, 5.271]
    },
    {
      name: "A",
      geometry: nodes.A.geometry,
      material: materials.materialForBAY,
      position: [0, 4.148, -0.813]
    },
    {
      name: "Y",
      geometry: nodes.Y.geometry,
      material: materials.materialForBAY,
      position: [0, 2.37, -5.913]
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
