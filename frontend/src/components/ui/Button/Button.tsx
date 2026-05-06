import React from "react";
import styles from "./Button.module.css";
type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "pill" | "rounded";
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    shape?: ButtonShape;
    loading?: boolean;
}
export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    shape = "pill",
    loading = false,
    disabled,
    type = "button",
    children,
    className,
    ...props
}) => {
    const isDisabled = disabled || loading;
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        styles[shape],
        isDisabled ? styles.disabled : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (
        <button
            type={type}
            className={classNames}
            disabled={isDisabled}
            {...props}
        >
            {loading ? <span className={styles.spinner} /> : children}
        </button>
    );
};