"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CircuitBoard() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0"
            >
                {/* Circuit paths */}
                <g strokeOpacity="0.25" strokeWidth="1.2">
                    {/* Teal circuit paths */}
                    <path d="M-50 150H150L200 200V400" stroke="#14B8A6" />
                    <path d="M-50 180H120L170 230V350H400" stroke="#14B8A6" />
                    <path d="M300 0V150L350 200H1100L1150 250V600" stroke="#14B8A6" />

                    {/* Accent orange paths */}
                    <path d="M1200 -50V300L1150 350H900L850 400V900" stroke="#FF8A00" strokeOpacity="0.15" />
                    <path d="M0 700H300L350 750H800" stroke="#FF8A00" strokeOpacity="0.1" />

                    {/* More teal connections */}
                    <path d="M1490 100H1200L1150 150V300H1000" stroke="#14B8A6" />
                    <path d="M1490 400H1300L1250 350V150H1100" stroke="#14B8A6" />
                    <path d="M200 950V750L250 700H500" stroke="#14B8A6" />
                </g>

                {/* Nodes (Dots) - Glowing Blue and Orange */}
                <g>
                    <circle cx="150" cy="150" r="3" fill="#00A3FF" filter="url(#glow)" />
                    <circle cx="200" cy="200" r="2.5" fill="#00A3FF" filter="url(#glow)" />
                    <circle cx="350" cy="200" r="3" fill="#00A3FF" filter="url(#glow)" />
                    <circle cx="1150" cy="250" r="3" fill="#00A3FF" filter="url(#glow)" />
                    <circle cx="1200" cy="300" r="3" fill="#00A3FF" filter="url(#glow)" />
                    <circle cx="900" cy="350" r="2.5" fill="#FF8A00" filter="url(#glow-orange)" />
                    <circle cx="350" cy="750" r="3" fill="#FF8A00" filter="url(#glow-orange)" />
                    <circle cx="1150" cy="150" r="2.5" fill="#00A3FF" filter="url(#glow)" />
                </g>

                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
            </svg>

            {/* Glowing lines animation overlay */}
            <motion.div
                className="absolute inset-0 z-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            >
                {/* Random particles or light beams could go here */}
            </motion.div>
        </div>
    );
}
