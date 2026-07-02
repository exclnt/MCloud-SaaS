import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const extractOptions = (nodes) => {
  const list = [];
  React.Children.forEach(nodes, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === React.Fragment) {
      list.push(...extractOptions(child.props.children));
    } else if (child.type === 'option' || child.props?.value !== undefined) {
      list.push({
        value: child.props.value !== undefined ? child.props.value : child.props.children,
        label: child.props.children,
        disabled: child.props.disabled,
        className: child.props.className,
      });
    }
  });
  return list;
};

export default function CustomSelect({
  value,
  onChange,
  options: propOptions,
  children,
  placeholder = 'Pilih opsi...',
  disabled = false,
  size = 'md',
  className = '',
  name,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const options = propOptions || extractOptions(children);

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  );

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // If less than 240px below and more space above, open upwards
      setOpenUp(spaceBelow < 240 && spaceAbove > spaceBelow);
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (opt) => {
    if (opt.disabled || disabled) return;
    setIsOpen(false);
    if (onChange) {
      onChange({
        target: {
          value: opt.value,
          name: name,
        },
      });
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      const currentIndex = options.findIndex((opt) => String(opt.value) === String(value));
      let nextIndex = currentIndex;
      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex + 1 < options.length ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : options.length - 1;
      }
      while (options[nextIndex]?.disabled) {
        if (e.key === 'ArrowDown') {
          nextIndex = nextIndex + 1 < options.length ? nextIndex + 1 : 0;
        } else {
          nextIndex = nextIndex - 1 >= 0 ? nextIndex - 1 : options.length - 1;
        }
        if (nextIndex === currentIndex) break;
      }
      if (options[nextIndex] && !options[nextIndex].disabled) {
        handleSelect(options[nextIndex]);
      }
    }
  };

  const sizeClasses = {
    sm: 'py-1 px-2.5 text-xs rounded-lg min-h-[28px]',
    md: 'py-2.5 px-3.5 text-sm rounded-xl min-h-[42px]',
    lg: 'py-3 px-4 text-base rounded-xl min-h-[48px]',
  };

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 text-left transition-all duration-200 outline-none select-none ${
          sizeClasses[size] || sizeClasses.md
        } ${
          disabled
            ? 'bg-zinc-900/50 border border-zinc-800/50 text-zinc-600 cursor-not-allowed'
            : isOpen
            ? 'bg-zinc-900 border border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20'
            : 'bg-zinc-900 border border-zinc-800 text-white hover:border-zinc-700 hover:bg-zinc-850 cursor-pointer'
        }`}
      >
        <span className={`block truncate ${!selectedOption ? 'text-zinc-500' : 'text-white font-medium'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 w-full min-w-[140px] z-[9999] bg-[#18181b]/95 backdrop-blur-md border border-zinc-700/80 rounded-xl shadow-2xl py-1.5 max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 duration-150 ${
            openUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
          role="listbox"
        >
          {options.length === 0 ? (
            <div className="px-3.5 py-2.5 text-xs text-zinc-500 text-center">Tidak ada opsi</div>
          ) : (
            options.map((opt, index) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <div
                  key={index}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt)}
                  className={`flex items-center justify-between px-3.5 py-2 text-sm transition-colors cursor-pointer select-none mx-1 rounded-lg ${
                    opt.disabled
                      ? 'opacity-40 cursor-not-allowed text-zinc-500'
                      : isSelected
                      ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/20 shadow-sm'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                  } ${opt.className || ''}`}
                >
                  <span className="truncate pr-2">{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
