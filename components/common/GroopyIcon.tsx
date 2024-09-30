import React, { useEffect, useState } from "react";

const GroopyIcon = () => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveEyes = (event: any) => {
      const rect = event.target.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // 눈의 움직임을 비율에 맞춰 조정 (최대 이동 범위 설정)
      const maxMovement = 5; // 눈의 최대 이동 범위
      const x = Math.min(maxMovement, (mouseX - centerX) / 20);
      const y = Math.min(maxMovement, (mouseY - centerY) / 20);

      setEyePosition({ x, y });
    };

    window.addEventListener("mousemove", moveEyes);
    return () => window.removeEventListener("mousemove", moveEyes);
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="w-48 h-48"
    >
      {/* 몸체 */}
      <path
        d="M14472.812 13996.615a2.333 2.333 0 0 1-1.818-.848l-.009-.012a1.824 1.824 0 0 0-3.078 0l-.008.012a2.377 2.377 0 0 1-3.641 0l-.009-.012a1.822 1.822 0 0 0-3.074 0l-.009.012a2.383 2.383 0 0 1-3.415.237 2.143 2.143 0 0 1-.71-1.5v-.085c0-.12-.086-3.13 0-5.44a39.866 39.866 0 0 1 .355-4.086v-.011a9.968 9.968 0 0 1 1.053-3.147 9.293 9.293 0 0 1 1.937-2.5 8.631 8.631 0 0 1 2.613-1.649 8.282 8.282 0 0 1 6.161 0 8.637 8.637 0 0 1 2.614 1.648 9.312 9.312 0 0 1 1.937 2.5 9.96 9.96 0 0 1 1.053 3.147 39.343 39.343 0 0 1 .355 4.092c.086 2.3 0 5.32 0 5.44v.085a2.147 2.147 0 0 1-.71 1.5 2.359 2.359 0 0 1-1.597.617z"
        transform="translate(-14457 -13976.999)"
        style={{ fill: "#5eeb8a" }}
      />
      {/* 눈의 위치와 크기 */}
      <circle
        cx={35 + eyePosition.x} // 왼쪽 눈 위치 조정
        cy={45 + eyePosition.y} // 위아래 눈의 위치 조정
        r="5"
        fill="black"
      />
      <circle
        cx={65 + eyePosition.x} // 오른쪽 눈 위치 조정
        cy={45 + eyePosition.y} // 위아래 눈의 위치 조정
        r="5"
        fill="black"
      />
    </svg>
  );
};

export default GroopyIcon;
