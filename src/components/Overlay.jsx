import { motion, AnimatePresence } from 'framer-motion';

export function Overlay({ coreState, hearts, shockwave, onStart, onStop }) {
  const isRecording = coreState === 'recording';
  const isDepleted = hearts <= 0;
  const isActive = coreState === 'recording' || coreState === 'pressed';

  return (
    <div className="fixed inset-0 pointer-events-none z-10 text-white">
      {/* Vignette during recording */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Radio wave rings */}
      <AnimatePresence>
        {isRecording && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`wave-${i}`}
                initial={{ scale: 0.5, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: 'easeOut',
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] rounded-full border border-primary/40"
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Shockwave */}
      <AnimatePresence>
        {shockwave && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] rounded-full border-2 border-primary/60"
          />
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 sm:px-6 sm:py-4 pointer-events-auto">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary animate-pulse" />
          <span className="text-white text-foreground/70 text-xs sm:text-sm font-light tracking-widest uppercase">
            Signal
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href='https://www.xn--app-2na.com/'
            className="text-white no-underline text-[10px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, hsl(25, 90%, 50%), hsl(35, 90%, 55%))',
              boxShadow: '0 0 12px hsla(25, 90%, 55%, 0.3)',
              border: '1px solid hsla(35, 90%, 60%, 0.4)',
            }}
          >
            Send QR Signals
          </a>
        </div>
      </div>

      {/* Hero text */}
      <div className="absolute top-12 sm:top-16 left-1/2 -translate-x-1/2 text-center pointer-events-none max-w-xs sm:max-w-md px-4 mt-6 sm:mt-12">
        <AnimatePresence mode="wait">
          {!isActive && !isDepleted && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-white text-foreground/90 text-base sm:text-lg font-light tracking-wide mb-1 sm:mb-2">
                Talk to the universe
              </h1>
              <p className="text-white text-muted-foreground text-[10px] sm:text-xs tracking-widest leading-relaxed">
                Hold the core to transmit your voice.
                <br />
                Each signal costs one heartbeat.
              </p>
            </motion.div>
          )}

          {isActive && (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400/80 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-medium">
                Live — transmitting
              </span>
            </motion.div>
          )}

          {isDepleted && !isActive && (
            <motion.div
              key="depleted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-white text-muted-foreground/50 text-xs sm:text-sm tracking-widest">
                Signal depleted. No energy remains.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Push-to-talk */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex flex-col items-center gap-4 sm:gap-6">
        <button
          onPointerDown={!isDepleted ? onStart : undefined}
          onPointerUp={isActive ? onStop : undefined}
          onPointerLeave={isActive ? onStop : undefined}
          className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full cursor-pointer bg-transparent border-none outline-none group"
          aria-label={
            isDepleted
              ? 'No energy remaining'
              : isRecording
              ? 'Release to send signal'
              : 'Hold to transmit'
          }
        >
          <motion.div
            animate={{
              boxShadow: isActive
                ? '0 0 40px 8px hsl(25 90% 55% / 0.4), 0 0 80px 20px hsl(25 90% 55% / 0.15)'
                : isDepleted
                ? 'none'
                : '0 0 20px 4px hsl(25 90% 55% / 0.15)',
              borderColor: isActive
                ? 'hsl(25 90% 55% / 0.6)'
                : isDepleted
                ? 'hsl(220 20% 20% / 0.3)'
                : 'hsl(25 90% 55% / 0.2)',
            }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 rounded-full border-2"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={
                  isActive ? 'release' : isDepleted ? 'empty' : 'hold'
                }
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className={`text-base sm:text-lg tracking-[0.3em] uppercase font-semibold ${
                  isActive
                    ? 'text-[#44403b]'
                    : isDepleted
                    ? 'text-muted-foreground/30'
                    : 'text-foreground/40'
                }`}
              >
                {isActive ? 'Release' : isDepleted ? '—' : 'Hold'}
              </motion.span>
            </AnimatePresence>
          </div>
        </button>
      </div>

      <div className='absolute bottom-20 sm:bottom-24 flex items-center justify-center w-full pointer-events-auto px-4'>
        <a href='https://www.indian-ai.com/' className='no-underline'>
          <p className='text-white text-[10px] sm:text-sm text-center'>
            Backed by Veteran Army Officers and <span className='text-yellow-300 font-semibold'>🇮🇳(indian-ai) </span>
          </p>
        </a>
      </div>

      {/* Frequency bars */}
      <AnimatePresence>
        {isActive && (
          <motion.div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-1">
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [4, 8 + Math.random() * 16, 4],
                }}
                transition={{
                  duration: 0.3 + Math.random() * 0.3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: i * 0.05,
                }}
                className="w-[2px] rounded-full bg-primary/60"
                style={{ height: 4 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hearts */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-3 pointer-events-none">
        <span className="text-muted-foreground/40 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase">
          {hearts > 0
            ? `${hearts} signal${hearts !== 1 ? 's' : ''} remaining`
            : 'depleted'}
        </span>

        <div className="flex gap-2 sm:gap-2.5">
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i < hearts ? [1, 1.2, 1] : 0.5,
                opacity: i < hearts ? 1 : 0.12,
              }}
              transition={{
                scale: {
                  repeat: i < hearts ? Infinity : 0,
                  duration: 2,
                  delay: i * 0.3,
                },
                opacity: { duration: 0.5 },
              }}
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
              style={{
                background:
                  i < hearts
                    ? 'radial-gradient(circle, hsl(42 90% 65%), hsl(25 90% 55%))'
                    : 'hsl(220 20% 20%)',
                boxShadow: i < hearts
                  ? '0 0 8px hsl(25 90% 55% / 0.5)'
                  : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}