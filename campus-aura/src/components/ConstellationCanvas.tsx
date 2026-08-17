import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import type { NodeData } from "@/pages/CampusAura";

interface Props {
  isGlobal: boolean;
  onNodeClick: (node: NodeData) => void;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
}

export function ConstellationCanvas({ isGlobal, onNodeClick, cameraRef }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isGlobalRef = useRef(isGlobal);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isGlobalRef.current = isGlobal;
  }, [isGlobal]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030305, 0.015);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 45);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Nodes
    const nodesCount = 800;
    const nodesGeo = new THREE.BufferGeometry();
    const nodesPos = new Float32Array(nodesCount * 3);
    const nodesColor = new Float32Array(nodesCount * 3);
    const nodeData: NodeData[] = [];

    const depts = ["Engineering", "Medical School", "Computer Science", "Business", "Law School", "Architecture", "Liberal Arts", "Fine Arts", "Psychology", "Physics"];

    for (let i = 0; i < nodesCount; i++) {
      const r = 3 + Math.random() * 35;
      const t = Math.random() * 2 * Math.PI + r * 0.1;
      const y = (Math.random() - 0.5) * (10 - r * 0.1);
      nodesPos[i * 3] = r * Math.cos(t);
      nodesPos[i * 3 + 1] = y;
      nodesPos[i * 3 + 2] = r * Math.sin(t);
      const isDanger = Math.random() > 0.98;
      nodesColor[i * 3] = isDanger ? 1 : 0.8;
      nodesColor[i * 3 + 1] = isDanger ? 0 : 0.95;
      nodesColor[i * 3 + 2] = isDanger ? 0.2 : 1.0;
      nodeData.push({
        id: `User #${Math.floor(1000 + Math.random() * 9000)}`,
        hr: isDanger ? Math.floor(88 + Math.random() * 20) : Math.floor(62 + Math.random() * 20),
        isDanger,
        index: i,
        position: { x: nodesPos[i * 3], y: nodesPos[i * 3 + 1], z: nodesPos[i * 3 + 2] },
      });
    }

    nodesGeo.setAttribute("position", new THREE.BufferAttribute(nodesPos, 3));
    nodesGeo.setAttribute("color", new THREE.BufferAttribute(nodesColor, 3));

    const dataNodes = new THREE.Points(
      nodesGeo,
      new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })
    );
    scene.add(dataNodes);

    // Star background
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      starsPos[i * 3] = (Math.random() - 0.5) * 400;
      starsPos[i * 3 + 1] = (Math.random() - 0.5) * 400;
      starsPos[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starsPos, 3));
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0x888888, size: 0.15, transparent: true, opacity: 0.5 })));

    // Mouse / raycaster
    const raycaster = new THREE.Raycaster();
    const hoverRaycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let mouseX = 0;
    let mouseY = 0;

    const toNDC = (clientX: number, clientY: number) => ({
      x: (clientX / window.innerWidth) * 2 - 1,
      y: -(clientY / window.innerHeight) * 2 + 1,
    });

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouse.x = toNDC(e.clientX, e.clientY).x;
      mouse.y = toNDC(e.clientX, e.clientY).y;
    };

    // Click: run a fresh raycaster at click coords — no dependence on hover state
    const onClick = (e: MouseEvent) => {
      // Ignore clicks on UI panels (anything that is not the canvas or its ancestors)
      const target = e.target as HTMLElement;
      if (target && target !== renderer.domElement && renderer.domElement.contains(target)) return;
      // Allow clicks that land on the canvas or pass-through (pointer-events:none) elements
      if (!isGlobalRef.current) return;

      const ndc = toNDC(e.clientX, e.clientY);
      const clickMouse = new THREE.Vector2(ndc.x, ndc.y);
      hoverRaycaster.setFromCamera(clickMouse, camera);
      hoverRaycaster.params.Points = { threshold: 2.5 }; // generous threshold — easy to click
      const hits = hoverRaycaster.intersectObject(dataNodes);
      if (hits.length === 0) return;

      const node = nodeData[hits[0].index!];
      onNodeClick(node);

      // Smooth camera zoom toward clicked node
      const nx = nodesPos[node.index * 3];
      const ny = nodesPos[node.index * 3 + 1];
      const nz = nodesPos[node.index * 3 + 2];
      const camTarget = { x: nx * 0.9, y: ny + 6, z: nz + 18 };
      let t = 0;
      const startPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
      const animCam = () => {
        t += 0.04;
        if (t >= 1) { camera.position.set(camTarget.x, camTarget.y, camTarget.z); return; }
        const ease = 1 - Math.pow(1 - t, 3);
        camera.position.set(
          startPos.x + (camTarget.x - startPos.x) * ease,
          startPos.y + (camTarget.y - startPos.y) * ease,
          startPos.z + (camTarget.z - startPos.z) * ease,
        );
        requestAnimationFrame(animCam);
      };
      requestAnimationFrame(animCam);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    // Animation loop — hover detection only (for tooltip + cursor)
    let time = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.01;
      dataNodes.rotation.y = time * 0.03;

      raycaster.setFromCamera(mouse, camera);
      raycaster.params.Points = { threshold: 1.2 };
      const intersects = raycaster.intersectObject(dataNodes);

      if (tooltipRef.current) {
        if (intersects.length > 0 && isGlobalRef.current) {
          renderer.domElement.style.cursor = "pointer";
          const idx = intersects[0].index!;
          const node = nodeData[idx];
          tooltipRef.current.style.opacity = "1";
          tooltipRef.current.style.left = mouseX + 15 + "px";
          tooltipRef.current.style.top = mouseY + 15 + "px";
          tooltipRef.current.innerHTML = `<div style="color:${node.isDanger ? "#ff003c" : "#00f3ff"};font-weight:bold;font-size:12px;">${node.id}</div><div style="font-size:9px;color:rgba(255,255,255,0.6);margin-top:3px;">✦ Click to chat anonymously</div>`;
        } else {
          renderer.domElement.style.cursor = "default";
          tooltipRef.current.style.opacity = "0";
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [onNodeClick, cameraRef]);

  return (
    <>
      <div ref={mountRef} style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0 }} />
      <div
        ref={tooltipRef}
        id="node-tooltip"
        style={{ opacity: 0, left: 0, top: 0 }}
      />
    </>
  );
}
