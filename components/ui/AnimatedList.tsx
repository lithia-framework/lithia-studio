'use client';

import { motion, useInView } from 'framer-motion';
import type React from 'react';
import { type MouseEventHandler, type ReactNode, type UIEvent, useCallback, useRef, useState } from 'react';

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

interface AnimatedListProps<T = string> {
  items?: T[];
  onItemSelect?: (item: T, index: number) => void;
  showGradients?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  renderItem?: (item: T, index: number, isSelected: boolean) => ReactNode;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="cursor-pointer">
      {children}
    </motion.div>
  );
};

const AnimatedList = <T = string>({
  items = [] as T[],
  onItemSelect,
  showGradients = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  renderItem,
}: AnimatedListProps<T>) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  }, []);

  const handleItemClick = useCallback(
    (item: T, index: number) => {
      setSelectedIndex(index);
      onItemSelect?.(item, index);
    },
    [onItemSelect],
  );

  const handleMouseLeave = useCallback(() => {
    setSelectedIndex(-1);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={listRef}
        className={`max-h-[400px] overflow-y-auto ${
          displayScrollbar
            ? '[&::-webkit-scrollbar-thumb]:rounded-[4px] [&::-webkit-scrollbar-thumb]:bg-[#ddd] [&::-webkit-scrollbar-track]:bg-[#f8f9fa] [&::-webkit-scrollbar]:w-[8px]'
            : 'scrollbar-hide'
        }`}
        onScroll={handleScroll}
        onMouseLeave={handleMouseLeave}
        tabIndex={-1}
        style={{
          scrollbarWidth: displayScrollbar ? 'thin' : 'none',
          scrollbarColor: '#ddd #f8f9fa',
          maxHeight: className?.includes('h-full') ? '100%' : className?.includes('max-h-') ? 'inherit' : '400px',
        }}>
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => handleItemClick(item, index)}>
            {renderItem ? (
              renderItem(item, index, selectedIndex === index)
            ) : (
              <div
                className={`rounded-lg bg-[#111] p-4 ${selectedIndex === index ? 'bg-[#222]' : ''} ${itemClassName}`}>
                <p className="m-0 text-white">{String(item)}</p>
              </div>
            )}
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div
            className="ease pointer-events-none absolute left-0 right-0 top-0 h-[50px] bg-gradient-to-b from-[#060010] to-transparent transition-opacity duration-300"
            style={{ opacity: topGradientOpacity }}></div>
          <div
            className="ease pointer-events-none absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#060010] to-transparent transition-opacity duration-300"
            style={{ opacity: bottomGradientOpacity }}></div>
        </>
      )}
    </div>
  );
};

export default AnimatedList;
