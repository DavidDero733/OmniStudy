import { PresetProblem } from './types';

export const SAMPLE_PRESETS: PresetProblem[] = [
  {
    id: 'ixl-geom-1',
    title: 'IXL Geometry: Scale Factor & Perimeter',
    badge: 'IXL Math',
    mode: 'instant',
    subject: 'Geometry',
    text: 'A rectangular garden has a length of 18 meters and a width of 12 meters. A landscape architect creates a scaled blueprint with a scale factor of 1/3. What is the perimeter of the scaled garden in meters? Write your answer as an integer or decimal.',
  },
  {
    id: 'quiz-bio-1',
    title: 'AP Biology: DNA Replication Quiz',
    badge: 'Multiple Choice',
    mode: 'instant',
    subject: 'Biology',
    text: `During eukaryotic DNA replication, which enzyme is primarily responsible for synthesizing the short RNA primers required for DNA polymerase III to initiate elongation on the lagging strand?

A) DNA Ligase
B) Topoisomerase (Gyrase)
C) RNA Primase
D) Helicase`,
  },
  {
    id: 'math-quad-1',
    title: 'Algebra II: Factoring Quadratic Equation',
    badge: 'Math Lab',
    mode: 'math',
    subject: 'Algebra II',
    text: 'Solve the quadratic equation by factoring: 3x² - 10x - 8 = 0. Identify the roots and the coordinates of the parabola vertex.',
  },
  {
    id: 'phys-kinematics-1',
    title: 'AP Physics: Projectile Motion & Range',
    badge: 'Physics',
    mode: 'step_by_step',
    subject: 'Physics',
    text: 'A projectile is launched from ground level with an initial velocity of 40 m/s at an angle of 30° above the horizontal over level ground. Assuming g = 9.8 m/s² and negligible air resistance, calculate: 1) Maximum height reached, 2) Total flight time, 3) Total horizontal range.',
  },
  {
    id: 'essay-lit-1',
    title: 'AP English Essay: Theme of Ambition in Macbeth',
    badge: 'Essay Draft',
    mode: 'essay',
    subject: 'English Literature',
    text: 'Write an analytical essay examining how Shakespeare employs the motif of blood and sleep to illustrate Macbeth and Lady Macbeth\'s descent into psychological ruin fueled by unchecked vaulting ambition. Target: 400-500 words with analytical thesis.',
  },
];
