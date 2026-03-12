'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import {cn} from '@/lib/utils';

// 1. 타입을 확장하여 indicatorColor를 정식 속성으로 등록
interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor?: string;
}

const Progress = React.forwardRef<React.ComponentRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({className, value, indicatorColor, ...props}, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      data-slot="progress"
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        // 2. cn 함수 내부에 indicatorColor를 배치하여 외부에서 전달받은 색상이 적용되도록 함
        className={cn('h-full w-full flex-1 transition-all', indicatorColor || 'bg-primary')}
        style={{transform: `translateX(-${100 - (value || 0)}%)`}}
      />
    </ProgressPrimitive.Root>
  ),
);

Progress.displayName = 'Progress';

export {Progress};
