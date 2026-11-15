"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { toPassageId } from "@/lib/bible";

interface ScriptureContent {
  reference: string;
  content: string;
  copyright: string;
}

const cache = new Map<string, Promise<ScriptureContent | null>>();

export function ScriptureTooltip({
  reference,
  locale = "es",
}: {
  reference: string;
  locale?: "es" | "en";
}) {
  const passageId = toPassageId(reference);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ScriptureContent | null>(null);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const [coords, setCoords] = useState({ top: 0, left: 0, arrowLeft: 0 });

  const [isPositioned, setIsPositioned] = useState(false);
  const [scrollState, setScrollState] = useState<{ canScrollUp: boolean; canScrollDown: boolean }>({
    canScrollUp: false,
    canScrollDown: false,
  });

  const triggerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const enterTimeoutRef = useRef<NodeJS.Timeout>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout>(null);
  const id = useId();
  const tooltipId = `scripture-tooltip-${id}`;

  const checkScroll = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    const canScrollUp = el.scrollTop > 4;
    const canScrollDown = el.scrollHeight - el.scrollTop - el.clientHeight > 6;
    setScrollState((prev) => {
      if (prev.canScrollUp === canScrollUp && prev.canScrollDown === canScrollDown) return prev;
      return { canScrollUp, canScrollDown };
    });
  }, []);

  const fetchContent = useCallback(async () => {
    if (!passageId) return;
    const cacheKey = `${passageId}-${locale}`;

    if (!cache.has(cacheKey)) {
      const promise = fetch(`/api/bible?ref=${passageId}&lang=${locale}`)
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .catch(() => null);
      cache.set(cacheKey, promise);
    }

    setLoading(true);
    const data = await cache.get(cacheKey);
    setContent(data ?? null);
    setLoading(false);
  }, [passageId, locale]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();

    // Default to top
    let pos: "top" | "bottom" = "top";
    let top = triggerRect.top - popoverRect.height - 16; // 16px spacing

    // If it goes above the viewport, flip to bottom
    if (top < 16) {
      pos = "bottom";
      top = triggerRect.bottom + 16;
    }

    // Center horizontally
    let left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;

    // Clamp to viewport
    const minLeft = 16;
    const maxLeft = window.innerWidth - popoverRect.width - 16;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    // Calculate arrow position relative to popover
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    const arrowLeft = triggerCenter - left;

    setPosition(pos);
    setCoords({ top, left, arrowLeft });
    setIsPositioned(true);
  }, []);

  useEffect(() => {
    let ignore = false;
    if (isOpen) {
      void Promise.resolve().then(() => {
        if (!ignore) {
          void fetchContent();
        }
      });
    }
    return () => {
      ignore = true;
      setIsPositioned(false);
    };
  }, [isOpen, fetchContent]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();

      // Measure scroll overflow
      const frameId = requestAnimationFrame(() => {
        checkScroll();
      });

      const handleScroll = (e: Event) => {
        // If scrolling inside the popover itself (e.g. long verse text), do not reposition!
        if (popoverRef.current && popoverRef.current.contains(e.target as Node)) {
          return;
        }
        updatePosition();
      };

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen, updatePosition, content, loading, checkScroll]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    // Prefetch immediately on hover so content is ready before opening
    fetchContent();
    if (!isOpen) {
      enterTimeoutRef.current = setTimeout(() => {
        setIsOpen(true);
      }, 250);
    }
  };

  const handleMouseLeave = () => {
    if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  if (!passageId) {
    return <span>{reference}</span>;
  }

  return (
    <>
      <span
        ref={triggerRef}
        className="scripture-ref"
        role="button"
        tabIndex={0}
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-expanded={isOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {reference}
      </span>
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popoverRef}
            id={tooltipId}
            className="scripture-popover"
            data-position={position}
            role="tooltip"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              opacity: isPositioned ? undefined : 0,
              visibility: isPositioned ? undefined : "hidden",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="scripture-popover-arrow"
              style={{ left: coords.arrowLeft }}
            />
            {loading ? (
              <div className="scripture-popover-loading">
                <div /><div /><div />
              </div>
            ) : content ? (
              <>
                <p
                  ref={textRef}
                  className="scripture-popover-text"
                  data-scroll-up={scrollState.canScrollUp}
                  data-scroll-down={scrollState.canScrollDown}
                  onScroll={checkScroll}
                >
                  {content.content.replace(/\u00B6\s*/g, " ").trim()}
                </p>
                <p className="scripture-popover-cite">
                  {content.reference} · {locale === "es" ? "NBLA" : "ASV"}
                </p>
              </>
            ) : (
              <p className="scripture-popover-error">
                {locale === "es"
                  ? "No se pudo cargar el versículo"
                  : "Could not load verse"}
              </p>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
