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

/**
 * @param {...string} parts
 */
function cx(...parts) {
    return parts.filter(Boolean).join(' ');
}

/**
 * @typedef {Object} TexturedButtonProps
 * @property {boolean} [texture]
 * @property {'primary'|'default'|'danger'|'success'} [textureColor]
 */

/**
 * @param {import('react').ComponentProps<typeof HB> & TexturedButtonProps} props
 */
export const Button = ({ texture, textureColor = 'primary', className, style, ...props }) => {
    const resolvedColor = textureColor || 'primary';
    const textured = texture
        ? cx(baseTextureClasses, variantMap[resolvedColor], className || '')
        : className || '';
    const textShadow = texture
        ? '1px -1px 2px rgba(0,0,0,0.9), -1px 1px 2px rgba(0,0,0,0.9)'
        : undefined;

    return <HB {...props} className={textured} style={{ textShadow, ...style }} />;
};

export default Button;
