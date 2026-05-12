import Image from 'next/image';

interface OxxoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  className?: string;
}

const SIZES = {
  xs:  { w: 52,  h: 22  },
  sm:  { w: 76,  h: 32  },
  md:  { w: 104, h: 44  },
  lg:  { w: 140, h: 59  },
  xl:  { w: 190, h: 80  },
};

const ICON_SIZES = { xs: 22, sm: 32, md: 44, lg: 59, xl: 80 };

export default function OxxoLogo({ size = 'md', variant = 'full', className = '' }: OxxoLogoProps) {
  if (variant === 'icon') {
    const s = ICON_SIZES[size];
    return (
      <div
        className={`flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0 ${className}`}
        style={{ width: s, height: s }}
      >
        <Image src="/store-logo.svg" alt="Store" width={s} height={s}
          style={{ objectFit: 'contain', width: s, height: s }} priority />
      </div>
    );
  }

  const { w, h } = SIZES[size];
  return (
    <Image
      src="/store-logo.svg"
      alt="Store"
      width={w}
      height={h}
      className={className}
      style={{ objectFit: 'contain', width: w, height: h }}
      priority
    />
  );
}
