import React, { useEffect, useRef } from "react";

// Optional: use a confetti-like animation package if you want! (here, a custom animation instead)
const OrderPlacedModal = ({ orderId, onClose }) => {
  const confettiRef = useRef();

  useEffect(() => {
    // simple confetti drops using CSS
    const confettiColors = ["#ef4444", "#f87171", "#fde68a", "#10b981", "#2563eb", "#fbbf24"];
    const confettiContainer = confettiRef.current;
    if (!confettiContainer) return;
    for (let i = 0; i < 40; i++) {
      const conf = document.createElement("div");
      conf.style.position = "absolute";
      conf.style.left = Math.random() * 100 + "vw";
      conf.style.width = "12px";
      conf.style.height = "12px";
      conf.style.background = confettiColors[i % confettiColors.length];
      conf.style.opacity = "0.88";
      conf.style.borderRadius = "2px";
      conf.style.top = "-40px";
      conf.style.transform = `rotate(${Math.random()*50 - 25}deg)`;
      conf.style.animation = `fallConfetti 1.6s ${(Math.random()*1.1).toFixed(2)}s cubic-bezier(.62,.63,0,1) forwards`;
      confettiContainer.appendChild(conf);
    }
    return () => { confettiContainer.innerHTML = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
      style={{ fontFamily: "inherit" }}
    >
      {/* Confetti Layer */}
      <div ref={confettiRef} className="pointer-events-none fixed inset-0 z-50"></div>
      {/* Modal Card */}
      <div className="relative z-60 bg-white rounded-2xl shadow-2xl px-10 py-10 max-w-md w-full border-red-100 border text-center flex flex-col items-center animate-fadeinpop">
        {/* Animated Checkmark */}
        <div className="mb-6">
          <svg
            width="90"
            height="90"
            viewBox="0 0 90 90"
            fill="none"
            className="mx-auto animate-checkpop"
          >
            <circle cx="45" cy="45" r="45" fill="#ef4444" opacity="0.18" />
            <circle
              cx="45"
              cy="45"
              r="38"
              stroke="#ef4444"
              strokeWidth="4"
              fill="white"
            />
            <path
              d="M28 49L41 62L62 35"
              stroke="#ef4444"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <animate
                attributeName="stroke-dasharray"
                from="0,40"
                to="40,0"
                dur="0.6s"
                fill="freeze"
              />
            </path>
          </svg>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-red-600 mb-2 animate-titlepop">Order Placed!</h2>
        <p className="text-gray-700 text-lg mb-6">Thank you for your order. 🎉</p>
        <div className="bg-gray-50 border border-red-200 rounded-lg px-4 py-3 mb-6 shadow-inner animate-fadeinpop">
          <span className="block text-gray-500 text-sm mb-2">Your Order ID</span>
          <span className="text-xl font-bold text-red-700 tracking-widest">{orderId}</span>
        </div>
        <button
          className="mt-4 px-8 py-3 rounded-md bg-red-600 hover:bg-red-700 text-white text-lg font-semibold shadow transition"
          onClick={onClose}
        >
          Continue Shopping
        </button>
      </div>
      {/* --- CSS Animations --- */}
      <style>
        {`
        @keyframes fallConfetti {
          to {
            top: 105vh;
            opacity: 0.05;
            transform: rotate(180deg);
          }
        }
        .animate-fadeinpop {
          animation: fadeInPop 0.5s cubic-bezier(.23,1.09,.59,.89) forwards;
        }
        @keyframes fadeInPop {
          0% { opacity: 0; transform: scale(0.7);}
          100% { opacity: 1; transform: scale(1);}
        }
        .animate-titlepop {
          animation: titlePopIn .8s cubic-bezier(.23,1.09,.59,.89) .15s forwards;
          opacity:0;
        }
        @keyframes titlePopIn {
          from {opacity:0; transform: scale(0.85);}
          to {opacity:1; transform: scale(1);}
        }
        .animate-checkpop {
          animation: checkPop .58s cubic-bezier(.23,1.09,.59,.89) .11s both;
        }
        @keyframes checkPop {
          0% { opacity: 0; transform: scale(0.2);}
          70% { opacity: 1; transform: scale(1.12);}
          100% { opacity: 1; transform: scale(1);}
        }
        `}
      </style>
    </div>
  );
};

export default OrderPlacedModal;
