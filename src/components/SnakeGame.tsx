import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { GameState } from '../types';
import { Trophy, RotateCcw, Play, Pause, Power } from 'lucide-react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    isGameOver: false,
    isPaused: true,
  });

  const generateFood = useCallback((snake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  };

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState(prev => {
      const head = { ...prev.snake[0] };
      switch (prev.direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        prev.snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [head, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;

      if (head.x === prev.food.x && head.y === prev.food.y) {
        newFood = generateFood(newSnake);
        newScore += 10;
      } else {
        newSnake.pop();
      }

      return { ...prev, snake: newSnake, food: newFood, score: newScore };
    });
  }, [gameState.isGameOver, gameState.isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setGameState(prev => {
        switch (e.key) {
          case 'ArrowUp': if (prev.direction !== 'DOWN') return { ...prev, direction: 'UP' }; break;
          case 'ArrowDown': if (prev.direction !== 'UP') return { ...prev, direction: 'DOWN' }; break;
          case 'ArrowLeft': if (prev.direction !== 'RIGHT') return { ...prev, direction: 'LEFT' }; break;
          case 'ArrowRight': if (prev.direction !== 'LEFT') return { ...prev, direction: 'RIGHT' }; break;
          case ' ': return { ...prev, isPaused: !prev.isPaused };
        }
        return prev;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#151619';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * cellSize + cellSize / 2,
      gameState.food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    gameState.snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#00f2ff' : 'rgba(0, 242, 255, 0.4)';
      ctx.shadowBlur = isHead ? 20 : 5;
      ctx.shadowColor = '#00f2ff';
      
      const padding = 1.5;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });
    ctx.shadowBlur = 0;

  }, [gameState]);

  return (
    <div id="snake-game-container" className="hw-widget p-6 flex flex-col items-center gap-6 w-full max-w-2xl">
      <div id="game-header" className="flex justify-between w-full items-center px-2 border-b border-hw-border pb-4">
        <div className="flex flex-col gap-1">
          <span className="hw-timecode">Neural.Score</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-neon-lime" />
            <span className="font-mono text-2xl font-bold text-white tracking-tighter">
              {gameState.score.toString().padStart(5, '0')}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            id="btn-pause"
            onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
            className="w-10 h-10 rounded-lg glass-surface flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 border border-hw-border"
            title="Pause/Resume"
          >
            {gameState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            id="btn-reset"
            onClick={resetGame}
            className="w-10 h-10 rounded-lg glass-surface flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 border border-hw-border"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div id="canvas-wrapper" className="relative group">
        {/* Hardware Frame Effect */}
        <div className="absolute -inset-4 border border-hw-border rounded-2xl pointer-events-none opacity-50" />
        <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-lg pointer-events-none" />
        
        <canvas
          id="game-canvas"
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-[#0a0a0a] rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] cursor-none"
          style={{ width: 'min(85vw, 400px)', height: 'min(85vw, 400px)' }}
        />

        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div
              id="game-over-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-hw-bg/90 backdrop-blur-md rounded-lg z-10"
            >
              <div className="hw-timecode text-neon-magenta mb-4">CRITICAL_FAILURE</div>
              <h2 className="text-5xl font-bold text-white mb-2 italic tracking-tighter">TERMINATED</h2>
              <p className="hw-timecode mb-8">Final_Score: {gameState.score}</p>
              <button
                id="btn-restart"
                onClick={resetGame}
                className="group relative px-10 py-4 bg-transparent border border-neon-cyan rounded-full overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(0,242,255,0.3)]"
              >
                <div className="absolute inset-0 bg-neon-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 text-neon-cyan group-hover:text-black font-bold uppercase tracking-widest text-xs">Re-Initialize</span>
              </button>
            </motion.div>
          )}

          {gameState.isPaused && !gameState.isGameOver && (
            <motion.div
              id="paused-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-lg z-10 pointer-events-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" />
                <span className="hw-timecode text-white/50">Simulation.Suspended</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div id="game-footer" className="w-full flex justify-between items-center px-2 pt-2">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="hw-timecode text-[8px]">Input.Source</span>
            <span className="text-[10px] font-mono text-white/40 uppercase">Keyboard_HID</span>
          </div>
          <div className="w-[1px] h-6 bg-hw-border" />
          <div className="flex flex-col gap-0.5">
            <span className="hw-timecode text-[8px]">Refresh.Rate</span>
            <span className="text-[10px] font-mono text-white/40 uppercase">60_Hz</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Power className="w-3 h-3 text-neon-lime" />
          <span className="hw-timecode text-neon-lime">Live</span>
        </div>
      </div>
    </div>
  );
}
