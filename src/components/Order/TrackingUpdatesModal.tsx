"use client";
import { TrackOrderResponse } from "@/types/orders";
import { X, Package, Truck, CheckCircle, Clock, RefreshCw, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface TrackingUpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingData: TrackOrderResponse;
  orderNumber: string;
}

const statusConfig: Record<string, { icon: typeof Package; color: string; bgColor: string; lineColor: string }> = {
  placed: { icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-100 border-yellow-300", lineColor: "bg-yellow-400" },
  processing: { icon: RefreshCw, color: "text-purple-600", bgColor: "bg-purple-100 border-purple-300", lineColor: "bg-purple-400" },
  shipped: { icon: Truck, color: "text-indigo-600", bgColor: "bg-indigo-100 border-indigo-300", lineColor: "bg-indigo-400" },
  delivered: { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100 border-green-300", lineColor: "bg-green-400" },
  cancelled: { icon: XCircle, color: "text-red-600", bgColor: "bg-red-100 border-red-300", lineColor: "bg-red-400" },
  refunded: { icon: XCircle, color: "text-gray-600", bgColor: "bg-gray-100 border-gray-300", lineColor: "bg-gray-400" },
};

function groupTimelineByDate(timeline: TrackOrderResponse["timeline"]) {
  const groups: { date: string; events: TrackOrderResponse["timeline"] }[] = [];
  const dateMap = new Map<string, TrackOrderResponse["timeline"]>();

  const reversed = [...timeline].reverse();

  for (const event of reversed) {
    const dateStr = new Date(event.timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    if (!dateMap.has(dateStr)) {
      dateMap.set(dateStr, []);
    }
    dateMap.get(dateStr)!.push(event);
  }

  for (const [date, events] of dateMap) {
    groups.push({ date, events });
  }

  return groups;
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();
}

export default function TrackingUpdatesModal({
  isOpen,
  onClose,
  trackingData,
  orderNumber,
}: TrackingUpdatesModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else {
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isMounted || !trackingData) return null;

  const dateGroups = groupTimelineByDate(trackingData.timeline);
  const latestEvent = trackingData.timeline[trackingData.timeline.length - 1];
  const latestConfig = statusConfig[latestEvent?.status] || statusConfig.placed;
  const LatestIcon = latestConfig.icon;

  return (
    <>
      <div
        data-lenis-prevent="true"
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[10000] flex md:items-center items-end justify-center md:p-4 p-0 pointer-events-none">
        <div
          className={`bg-white w-full md:max-w-lg overflow-hidden transition-all duration-300 ease-out pointer-events-auto
            md:rounded-xl md:max-h-[90vh] shadow-2xl
            rounded-t-3xl max-h-[92vh]
            ${isOpen ? "md:translate-y-0 md:opacity-100 translate-y-0 opacity-100" : "md:translate-y-4 md:opacity-0 translate-y-full opacity-0"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle - Mobile */}
          <div className="md:hidden flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 md:px-6 md:py-5 z-10">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-light tracking-wide uppercase text-gray-900">
                  Tracking Updates
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {
                    trackingData.tracking_number 
                    ? `Tracking ID: ${trackingData.tracking_number}`
                    : `Order Number: ${orderNumber}`
                  }
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors shrink-0 ml-3"
                aria-label="Close"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Current status badge */}
            <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${latestConfig.bgColor} ${latestConfig.color}`}>
              <LatestIcon size={14} />
              <span className="capitalize">{trackingData.current_status.replace(/_/g, " ")}</span>
            </div>

            {trackingData.tracking_number && (
              <p className="mt-2 text-xs text-gray-500">
                Tracking ID: <span className="font-mono text-gray-700">{trackingData.tracking_number}</span>
                {trackingData.carrier && (
                  <span className="ml-2">via {trackingData.carrier}</span>
                )}
              </p>
            )}
          </div>

          {/* Timeline Content */}
          <div
            data-lenis-prevent="true"
            className="overflow-y-auto overscroll-contain md:max-h-[calc(90vh-200px)] max-h-[calc(92vh-210px)] px-5 py-5 md:px-6 md:py-6"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {dateGroups.map((group, groupIdx) => (
              <div key={group.date} className={groupIdx > 0 ? "mt-6" : ""}>
                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  {group.date}
                </p>

                <div className="relative">
                  {group.events.map((event, eventIdx) => {
                    const config = statusConfig[event.status] || statusConfig.placed;
                    const Icon = config.icon;
                    const isLast = eventIdx === group.events.length - 1 &&
                                   groupIdx === dateGroups.length - 1;

                    return (
                      <div key={`${event.timestamp}-${eventIdx}`} className="relative flex gap-4 pb-6 last:pb-0">
                        {/* Vertical connector line */}
                        {!isLast && (
                          <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-200" />
                        )}

                        {/* Icon */}
                        <div className={`relative z-10 w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${config.bgColor}`}>
                          <Icon size={14} className={config.color} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-medium text-gray-900 leading-snug">
                              {event.message}
                            </p>
                            <span className="text-xs text-gray-400 shrink-0 pt-0.5">
                              {formatTime(event.timestamp)}
                            </span>
                          </div>
                          {event.location && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {trackingData.estimated_delivery && trackingData.current_status !== "delivered" && (
              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Estimated Delivery
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(trackingData.estimated_delivery).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 md:px-6 md:py-4">
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
