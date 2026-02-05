"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ActiveSessionTracker() {
    const { data: session } = useSession();

    useEffect(() => {
        if (!session) return;

        // Initial heartbeat
        const sendHeartbeat = () => {
            fetch("/api/user/heartbeat", { method: "POST" }).catch(() => { });
        };

        sendHeartbeat();

        // Repeat every 2 minutes
        const interval = setInterval(sendHeartbeat, 2 * 60 * 1000);

        return () => clearInterval(interval);
    }, [session]);

    return null; // This component doesn't render anything
}
