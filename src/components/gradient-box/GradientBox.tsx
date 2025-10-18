import React from 'react';
import { useMantineTheme, BoxProps, Flex } from '@mantine/core';

type GradientIntensity = 'light' | 'medium' | 'dark' | 'custom';

type MantineColorKey = keyof ReturnType<typeof useMantineTheme>['colors'];

type GradientBoxProps = BoxProps & {
  from?: MantineColorKey;
  to?: MantineColorKey;
  intensity?: GradientIntensity;
  fromShade?: number;
  toShade?: number;
  deg?: number;
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  direction?: React.CSSProperties['flexDirection'];
  columnGap?: React.CSSProperties['columnGap'];
  gap?: React.CSSProperties['gap'];
  rowGap?: React.CSSProperties['rowGap'];
  style?: React.CSSProperties;
  children: React.ReactNode;
  radius?: React.CSSProperties['borderRadius'];
};

// Extract constants for better maintainability
const INTENSITY_SHADE_MAP = {
  light: { from: 0, to: 2 },
  medium: { from: 4, to: 7 },
  dark: { from: 7, to: 9 },
} as const;

const DEFAULT_PROPS = {
  from: 'fresh-blue' as const,
  to: 'fresh-blue' as const,
  intensity: 'medium' as const,
  deg: 90,
  justify: 'center' as const,
  align: 'center' as const,
  direction: 'row' as const,
} as const;

const GradientBox = ({
  from = DEFAULT_PROPS.from,
  to = DEFAULT_PROPS.to,
  intensity = DEFAULT_PROPS.intensity,
  fromShade,
  toShade,
  deg = DEFAULT_PROPS.deg,
  justify = DEFAULT_PROPS.justify,
  align = DEFAULT_PROPS.align,
  direction = DEFAULT_PROPS.direction,
  style,
  columnGap,
  children,
  gap,
  rowGap,
  radius,
  ...props
}: GradientBoxProps) => {
  const theme = useMantineTheme();

  // Extract variable for cleaner logic
  const getColorValue = (colorKey: MantineColorKey, shade: number) =>
    theme.colors[colorKey]?.[shade] || colorKey;

  const getColorShades = () => {
    const isCustomIntensity =
      intensity === 'custom' &&
      fromShade !== undefined &&
      toShade !== undefined;

    if (isCustomIntensity) {
      return {
        colorFrom: getColorValue(from, fromShade),
        colorTo: getColorValue(to, toShade),
      };
    }

    // Type-safe access to INTENSITY_SHADE_MAP
    const shades =
      intensity in INTENSITY_SHADE_MAP
        ? INTENSITY_SHADE_MAP[intensity as keyof typeof INTENSITY_SHADE_MAP]
        : INTENSITY_SHADE_MAP.medium;

    return {
      colorFrom: getColorValue(from, shades.from),
      colorTo: getColorValue(to, shades.to),
    };
  };

  const { colorFrom, colorTo } = getColorShades();

  return (
    <Flex
      {...props}
      direction={direction}
      align={align}
      justify={justify}
      columnGap={columnGap}
      gap={gap}
      rowGap={rowGap}
      style={{
        background: `linear-gradient(${deg}deg, ${colorFrom}, ${colorTo})`,
        borderRadius: radius, 
        ...style,
      }}
    >
      {children}
    </Flex>
  );
};

export default GradientBox;
