import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

/**
 * BackgroundAmbience renders a subtle particle animation that sits behind the app content.
 * It uses `react-tsparticles` with a minimal configuration that matches the golden /
 * saffron theme of the devotional app.
 */
export const BackgroundAmbience: React.FC = () => {
  // Init the tsparticles engine with the full bundle (allows all shapes/effects).
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  // Configuration for the particles – gentle floating circles.
  const particlesOptions = {
    background: {
      // The background is transparent because the page already has a gradient.
      color: { value: 'transparent' },
    },
    fpsLimit: 60,
    interactivity: {
      detectsOn: 'canvas' as const,
      events: {
        resize: true,
      },
    },
    particles: {
      color: {
        // Use gold/saffron tones for a premium feel.
        value: ['#d4af37', '#ff7e1a'],
      },
      move: {
        direction: 'none' as const,
        enable: true,
        outModes: {
          default: 'bounce' as const,
        },
        random: false,
        speed: 0.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 30,
      },
      opacity: {
        value: 0.4,
      },
      shape: {
        type: 'circle' as const,
      },
      size: {
        random: { enable: true, minimumValue: 2 },
        value: { min: 2, max: 6 },
      },
    },
    detectRetina: true,
  };

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
    </div>
  );
};
