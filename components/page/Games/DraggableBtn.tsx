"use client";
import React, { useState, useRef, useEffect } from "react";

interface MobileControlsProps {
  moveHorizontal: (direction: number) => void;
  moveDown: () => void;
  rotate: () => void;
  hardDrop: () => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  gameOver: boolean;
  className?: string;
}

const MobileControls: React.FC<MobileControlsProps> = ({
  moveHorizontal,
  moveDown,
  rotate,
  hardDrop,
  isPaused,
  setIsPaused,
  gameOver,
  className,
}) => {
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonGroupRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle the start of dragging
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    if (!buttonGroupRef.current) return;

    if ("touches" in e) {
      const touch = e.touches[0];
      const buttonRect = buttonGroupRef.current.getBoundingClientRect();
      setDragOffset({
        x: touch.clientX - buttonRect.left,
        y: touch.clientY - buttonRect.top,
      });
    } else {
      const buttonRect = buttonGroupRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - buttonRect.left,
        y: e.clientY - buttonRect.top,
      });
    }

    setIsDragging(true);
  };

  // Handle the dragging movement
  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !buttonGroupRef.current || !containerRef.current) return;

    let clientX, clientY;

    if ("touches" in e) {
      e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonRect = buttonGroupRef.current.getBoundingClientRect();

    // Calculate new position while keeping buttons within parent boundaries
    let newX = clientX - containerRect.left - dragOffset.x;
    let newY = clientY - containerRect.top - dragOffset.y;

    // Add constraints to keep the buttons within the parent div
    newX = Math.max(0, Math.min(newX, containerRect.width - buttonRect.width));
    newY = Math.max(
      0,
      Math.min(newY, containerRect.height - buttonRect.height)
    );

    setButtonPosition({ x: newX, y: newY });
  };

  // Handle the end of dragging
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchmove", handleDrag, { passive: false });
      document.addEventListener("touchend", handleDragEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    >
      <div
        ref={buttonGroupRef}
        className="absolute grid grid-cols-3 gap-1 z-10 pointer-events-auto"
        style={{
          bottom: 0,
          right: 0,
          transform: `translate(-${buttonPosition.x}px, -${buttonPosition.y}px)`,
          touchAction: "none",
        }}
      >
        {/* Drag handle */}
        <div
          className="col-span-3 h-6 bg-gray-700 bg-opacity-50 rounded-t-md mb-1 flex items-center justify-center cursor-move"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
        </div>

        <button
          className="min-w-10 bg py-3 rounded-full border border-itemborder hover:bg-blue-500 text-sm opacity-80 focus:bg-[#0e203f] active:bg-[#0e203f]"
          onClick={() => moveHorizontal(-1)}
        >
          ←
        </button>
        <button
          className="bg py-3 rounded-full border border-itemborder hover:bg-blue-500 text-sm opacity-80 focus:bg-[#0e203f] active:bg-[#0e203f]"
          onClick={rotate}
        >
          Rotate
        </button>
        <button
          className="min-w-10 bg py-3 rounded-full border border-itemborder hover:bg-blue-500 text-sm opacity-80 focus:bg-[#0e203f] active:bg-[#0e203f]"
          onClick={() => moveHorizontal(1)}
        >
          →
        </button>
        <button
          className="min-w-10 bg py-3 rounded-full border border-itemborder hover:bg-blue-500 text-sm opacity-80 focus:bg-[#0e203f] active:bg-[#0e203f]"
          onClick={moveDown}
        >
          ↓
        </button>
        <button
          className="bg py-3 rounded-full border border-itemborder hover:bg-blue-500 text-sm opacity-80 focus:bg-[#0e203f] active:bg-[#0e203f]"
          onClick={hardDrop}
        >
          Drop
        </button>
        <button
          className={`min-w-10 bg py-3 rounded-full border border-itemborder text-sm opacity-80 ${
            !gameOver && "hover:bg-blue-500"
          } ${
            isPaused ? "bg-blue-500" : "focus:bg-[#0e203f] active:bg-[#0e203f]"
          }`}
          onClick={() => setIsPaused(!isPaused)}
          disabled={gameOver}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
};

export default MobileControls;
