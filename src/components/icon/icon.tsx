"use client";

export function Icon({ name, className }: { name: string; className?: string }) {
    return (
        <span
            className={`material-symbols-rounded select-none leading-none ${className ?? ""}`}
            aria-hidden
        >
            {name}
        </span>
    );
}