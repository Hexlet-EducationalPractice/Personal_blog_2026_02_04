import React from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "xs" | "s" | "m" | "l";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant,
    size?: ButtonSize,
    loading?: boolean,
}

export const Button: React.FC<ButtonProps> =
    ({
         variant = "primary",
         size = "md",
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
            isDisabled ? styles.disabled : "",
            className
        ]
            .filter(Boolean)
            .join(" ")
        return (
            <button
                type={type}
                className={classNames}
                disabled={isDisabled}
                {...props}
            >
                {loading ? <span className={styles.spinner}/> : children}
            </button>
        );
     };
