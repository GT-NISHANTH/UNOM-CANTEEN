import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Package, Clock, CheckCircle2, MapPin, Navigation } from "lucide-react";

const socket = io("http://localhost:5000");

function Tracking() {
    const [status, setStatus] = useState("Pending");
    const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        socket.on("orderUpdated", (updatedOrder) => {
            console.log("Tracking update:", updatedOrder);
            setStatus(updatedOrder.status);
            setLastUpdated(new Date().toLocaleTimeString());
        });

        return () => {
            socket.off("orderUpdated");
        };
    }, []);

    const steps = [
        { name: "Order Placed", status: "Pending", icon: Package },
        { name: "Preparing", status: "Preparing", icon: Clock },
        { name: "Ready for Pickup", status: "Ready", icon: CheckCircle2 },
        { name: "Delivered", status: "Delivered", icon: CheckCircle2 },
    ];

    const currentStepIndex = steps.findIndex(step => step.status.toLowerCase() === status.toLowerCase());

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gray-900 text-white p-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-3xl font-black flex items-center gap-3">
                            <Navigation className="text-blue-400" size={32} />
                            Order Tracking
                        </h2>
                        <div className="bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                            Live Tracking
                        </div>
                    </div>
                    <p className="text-gray-400 font-medium">Last status update: {lastUpdated}</p>
                </div>

                <div className="p-8">
                    {/* Status Stepper */}
                    <div className="relative mb-12">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-1000"
                            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        ></div>

                        <div className="relative flex justify-between z-10">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;

                                return (
                                    <div key={step.name} className="flex flex-col items-center group">
                                        <div className={`
                                            w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                                            ${isActive ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-white text-gray-300 border-2 border-gray-100'}
                                            ${isCurrent ? 'ring-4 ring-green-100 scale-110' : ''}
                                        `}>
                                            <Icon size={24} />
                                        </div>
                                        <p className={`mt-3 text-xs font-bold uppercase tracking-tighter ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
                                            {step.name}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center border-t border-gray-50 pt-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="text-red-500" size={24} />
                                Canteen Location
                            </h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">
                                Your food is being prepared at the Central Canteen. Once the status hits <span className="text-green-600 font-bold italic">Ready</span>, you can head over for pickup!
                            </p>
                        </div>

                        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-64">
                            <iframe
                                title="canteen-location"
                                width="100%"
                                height="100%"
                                style={{ border: "0" }}
                                loading="lazy"
                                allowFullScreen
                                src="https://maps.google.com/maps?q=13.0827,80.2707&z=15&output=embed"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tracking;
