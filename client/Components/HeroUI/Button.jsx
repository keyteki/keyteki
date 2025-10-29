// @ts-nocheck
import React from 'react';
import { Button as HB } from '@heroui/react';

const baseTextureClasses =
    'inline-flex items-center justify-center select-none cursor-pointer px-5 h-8 min-w-[130px] uppercase tracking-wide text-white font-[Keyforge,_Helvetica,_sans-serif] bg-center bg-no-repeat bg-[length:100%_100%] border-0 rounded-none !bg-transparent transition-all duration-200 ease-linear';

const variantMap = {
    primary: 'btn-texture-primary',
    default: 'btn-texture-default',
    danger: 'btn-texture-danger',
    success: 'btn-texture-success'
};

function cx(...parts) {
    return parts.filter(Boolean).join(' ');
}

export const Button = (props) => {
    const { className, style, color = 'primary', ...forwardProps } = props;

    const variantKey = Object.prototype.hasOwnProperty.call(variantMap, color) ? color : 'default';
    const variantClass = variantMap[variantKey];
    const texturedClasses = cx(baseTextureClasses, variantClass, className || '');
    const textShadow = '1px -1px 2px rgba(0,0,0,0.9), -1px 1px 2px rgba(0,0,0,0.9)';

    return (
        <HB
            {...forwardProps}
            color={color}
            className={texturedClasses}
            style={{ textShadow, ...style }}
        />
    );
};

export default Button;
