import React from 'react';
import { useMantineTheme, BoxProps, Flex } from '@mantine/core';

type GradientBoxProps = BoxProps & {
  from?: keyof ReturnType<typeof useMantineTheme>['colors'];
  to?: keyof ReturnType<typeof useMantineTheme>['colors'];
  deg?: number;
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  direction?: React.CSSProperties['flexDirection'];
  columnGap?: React.CSSProperties['columnGap'];
  gap?: React.CSSProperties['gap'];
  rowGap?: React.CSSProperties['rowGap'];
  style?: React.CSSProperties;
  children: React.ReactNode;
};

const GradientBox = ({
  from = 'blue',
  to = 'blue',
  deg = 90,
  justify = 'center',
  align = 'center',
  direction = 'row',
  style,
  columnGap,
  children,
  gap,
  rowGap,
  ...props
}: GradientBoxProps) => {
  const theme = useMantineTheme();

  const colorFrom = theme.colors[from]?.[4] || from;
  const colorTo = theme.colors[to]?.[7] || to;

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
        ...style,
      }}
    >
      {children}
    </Flex>
  );
};

export default GradientBox;
