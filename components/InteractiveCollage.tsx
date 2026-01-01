'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type PersonAction = 'vibing' | 'sipping' | 'listening' | null;

// Tarot cards data - Major Arcana with Rider-Waite images
const tarotCards = [
  { name: 'The Fool', meaning: 'New beginnings, innocence, spontaneity. Take a leap of faith.', number: '0', image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg' },
  { name: 'The Magician', meaning: 'Manifestation, resourcefulness, power. You have all you need.', number: 'I', image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg' },
  { name: 'The High Priestess', meaning: 'Intuition, sacred knowledge, the subconscious mind.', number: 'II', image: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg' },
  { name: 'The Empress', meaning: 'Femininity, beauty, nature, nurturing, abundance.', number: 'III', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg' },
  { name: 'The Emperor', meaning: 'Authority, structure, control, fatherhood.', number: 'IV', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg' },
  { name: 'The Hierophant', meaning: 'Spiritual wisdom, tradition, conformity.', number: 'V', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg' },
  { name: 'The Lovers', meaning: 'Love, harmony, relationships, choices.', number: 'VI', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg' },
  { name: 'The Chariot', meaning: 'Direction, control, willpower, victory.', number: 'VII', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg' },
  { name: 'Strength', meaning: 'Inner strength, bravery, compassion, focus.', number: 'VIII', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg' },
  { name: 'The Hermit', meaning: 'Soul searching, introspection, inner guidance.', number: 'IX', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg' },
  { name: 'Wheel of Fortune', meaning: 'Change, cycles, fate. What goes around comes around.', number: 'X', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg' },
  { name: 'Justice', meaning: 'Cause and effect, clarity, truth, fairness.', number: 'XI', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg' },
  { name: 'The Hanged Man', meaning: 'Pause, surrender, letting go, new perspectives.', number: 'XII', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg' },
  { name: 'Death', meaning: 'Endings, change, transformation, transition.', number: 'XIII', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg' },
  { name: 'Temperance', meaning: 'Balance, moderation, patience, purpose.', number: 'XIV', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg' },
  { name: 'The Devil', meaning: 'Shadow self, attachment, addiction, restriction.', number: 'XV', image: 'https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg' },
  { name: 'The Tower', meaning: 'Sudden change, upheaval, chaos, revelation.', number: 'XVI', image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg' },
  { name: 'The Star', meaning: 'Hope, faith, purpose, renewal, spirituality.', number: 'XVII', image: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg' },
  { name: 'The Moon', meaning: 'Illusion, fear, anxiety, subconscious, intuition.', number: 'XVIII', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg' },
  { name: 'The Sun', meaning: 'Positivity, fun, warmth, success, vitality.', number: 'XIX', image: 'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg' },
  { name: 'Judgement', meaning: 'Reflection, reckoning, awakening, rebirth.', number: 'XX', image: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg' },
  { name: 'The World', meaning: 'Completion, accomplishment, travel, fulfillment.', number: 'XXI', image: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg' },
];

// Music tracks
const musicTracks = [
  { name: 'Joeyconnects World', artist: 'Joey', url: '/JoeyconnectsworldBGM.mp3' },
  { name: 'BGM 2', artist: 'Joey', url: '/BGM2.mp3' },
];

export default function InteractiveCollage() {
  const [personAction, setPersonAction] = useState<PersonAction>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showTarot, setShowTarot] = useState(false);
  const [currentCard, setCurrentCard] = useState<typeof tarotCards[0] | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on mount
  useEffect(() => {
    audioRef.current = new Audio(musicTracks[currentTrack].url);
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle track change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = musicTracks[currentTrack].url;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrack]);

  // Select action from menu
  const handleSelectAction = (action: PersonAction) => {
    if (!action || personAction) return;

    setPersonAction(action);

    if (action === 'listening') {
      setIsPlaying(true);
    }

    // For sipping, only play animation once (1.2s)
    const duration = action === 'sipping' ? 1200 : 2500;

    setTimeout(() => {
      setPersonAction(null);
      if (action === 'listening') {
        setTimeout(() => setIsPlaying(false), 2000);
      }
    }, duration);
  };

  // Draw tarot card
  const handleDrawTarot = () => {
    setShowTarot(true);
    setIsFlipping(true);
    setCurrentCard(null);

    // Simulate card flip animation
    setTimeout(() => {
      const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
      setCurrentCard(randomCard);
      setIsFlipping(false);
    }, 600);
  };

  // Close tarot
  const handleCloseTarot = () => {
    setShowTarot(false);
    setCurrentCard(null);
  };

  // Music toggle
  const handleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, user interaction required
        console.log('Autoplay blocked');
      });
      setIsPlaying(true);
    }
  };

  // Switch track
  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrack((prev) => (prev + 1) % musicTracks.length);
  };

  const handlePrevTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrack((prev) => (prev - 1 + musicTracks.length) % musicTracks.length);
  };

  // Typewriter click - opens email
  const handleTypewriter = () => {
    if (isTyping) return;
    setIsTyping(true);
    const text = "hello@joeyconnects.world";
    let i = 0;
    setTypedText('');

    const typeInterval = setInterval(() => {
      if (i < text.length) {
        const char = text[i];
        setTypedText(prev => prev + char);
        i++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          window.location.href = 'mailto:hello@joeyconnects.world';
          setIsTyping(false);
          setTypedText('');
        }, 500);
      }
    }, 80);
  };

  return (
    <div className="relative w-full h-full">

      {/* Sheet Music Background - Merry Christmas Mr. Lawrence inspired, hand-drawn style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <svg
          className="absolute w-[450px] h-[260px] left-[72%] top-[50%] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
          viewBox="0 0 450 250"
          fill="none"
          stroke="currentColor"
        >
          {/* Staff lines - hand-drawn wobbly style */}
          <g strokeWidth="0.6" opacity="0.7">
            {/* First staff - slightly wavy */}
            <path d="M25 50 Q120 48 220 51 Q320 49 420 50" />
            <path d="M25 62 Q100 64 200 61 Q300 63 420 62" />
            <path d="M25 74 Q150 72 250 75 Q350 73 420 74" />
            <path d="M25 86 Q130 88 230 85 Q330 87 420 86" />
            <path d="M25 98 Q110 96 210 99 Q310 97 420 98" />

            {/* Second staff */}
            <path d="M25 150 Q140 152 240 149 Q340 151 420 150" />
            <path d="M25 162 Q120 160 220 163 Q320 161 420 162" />
            <path d="M25 174 Q150 176 250 173 Q350 175 420 174" />
            <path d="M25 186 Q130 184 230 187 Q330 185 420 186" />
            <path d="M25 198 Q110 200 210 197 Q310 199 420 198" />
          </g>

          {/* Treble Clef - sketchy hand-drawn */}
          <g strokeWidth="1.2" opacity="0.6">
            <path d="M38 98 Q42 85 38 72 Q35 60 40 52 Q48 44 52 55 Q55 68 48 82 Q42 95 47 102 Q53 108 47 115 Q40 118 38 110" fill="none" />
            <circle cx="42" cy="95" r="2" fill="currentColor" opacity="0.4" />
          </g>

          {/* Notes - First line: melody with hand-drawn irregular shapes */}
          <g strokeWidth="0.8">
            {/* Note 1 */}
            <ellipse cx="75" cy="74" rx="6" ry="4.5" fill="currentColor" transform="rotate(-20 75 74)" opacity="0.8" />
            <path d="M81 74 Q83 55 80 42" strokeWidth="1" />

            {/* Note 2 */}
            <ellipse cx="105" cy="68" rx="5.5" ry="4" fill="currentColor" transform="rotate(-18 105 68)" opacity="0.75" />
            <path d="M110 68 Q112 50 109 38" strokeWidth="1" />

            {/* Note 3 */}
            <ellipse cx="135" cy="80" rx="6" ry="4.5" fill="currentColor" transform="rotate(-22 135 80)" opacity="0.8" />
            <path d="M141 80 Q143 62 140 48" strokeWidth="1" />

            {/* Note 4 - whole note (hollow) */}
            <ellipse cx="175" cy="68" rx="7" ry="5" fill="none" strokeWidth="1.2" transform="rotate(-15 175 68)" opacity="0.7" />

            {/* Note 5 */}
            <ellipse cx="220" cy="74" rx="5.5" ry="4" fill="currentColor" transform="rotate(-18 220 74)" opacity="0.75" />
            <path d="M225 74 Q228 56 224 44" strokeWidth="1" />

            {/* Note 6 */}
            <ellipse cx="255" cy="62" rx="6" ry="4.5" fill="currentColor" transform="rotate(-20 255 62)" opacity="0.8" />
            <path d="M261 62 Q263 44 260 32" strokeWidth="1" />

            {/* Note 7 - half note */}
            <ellipse cx="295" cy="74" rx="6.5" ry="4.5" fill="none" strokeWidth="1.3" transform="rotate(-16 295 74)" opacity="0.7" />
            <path d="M301 74 Q303 55 300 42" strokeWidth="1" />

            {/* Note 8 */}
            <ellipse cx="340" cy="68" rx="5.5" ry="4" fill="currentColor" transform="rotate(-19 340 68)" opacity="0.75" />
            <path d="M345 68 Q348 50 344 38" strokeWidth="1" />
          </g>

          {/* Second line notes */}
          <g strokeWidth="0.8">
            <ellipse cx="75" cy="174" rx="5.5" ry="4" fill="currentColor" transform="rotate(-17 75 174)" opacity="0.75" />
            <path d="M80 174 Q82 156 79 144" strokeWidth="1" />

            <ellipse cx="115" cy="168" rx="6" ry="4.5" fill="currentColor" transform="rotate(-21 115 168)" opacity="0.8" />
            <path d="M121 168 Q123 150 120 138" strokeWidth="1" />

            <ellipse cx="160" cy="180" rx="5.5" ry="4" fill="currentColor" transform="rotate(-18 160 180)" opacity="0.75" />
            <path d="M165 180 Q168 162 164 148" strokeWidth="1" />

            {/* Whole note */}
            <ellipse cx="210" cy="168" rx="7" ry="5" fill="none" strokeWidth="1.2" transform="rotate(-14 210 168)" opacity="0.65" />

            <ellipse cx="265" cy="174" rx="6" ry="4.5" fill="currentColor" transform="rotate(-20 265 174)" opacity="0.8" />
            <path d="M271 174 Q273 156 270 142" strokeWidth="1" />

            <ellipse cx="310" cy="162" rx="5.5" ry="4" fill="currentColor" transform="rotate(-16 310 162)" opacity="0.75" />
            <path d="M315 162 Q318 144 314 132" strokeWidth="1" />
          </g>

          {/* Bar lines - slightly uneven */}
          <g strokeWidth="0.7" opacity="0.5">
            <path d="M195 48 Q196 70 195 100" />
            <path d="M320 48 Q319 72 320 100" />
            <path d="M195 148 Q196 170 195 200" />
            <path d="M320 148 Q319 172 320 200" />
          </g>

          {/* Handwritten annotation */}
          <text x="320" y="235" fontSize="12" fontStyle="italic" fill="currentColor" opacity="0.6" style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}>
            Merry Christmas...
          </text>
        </svg>
      </div>

      {/* CENTERED LAYOUT: Text + Circle with elements - shifted right */}
      <div className="flex flex-col lg:flex-row items-center justify-center h-full max-w-[1300px] mx-auto px-4 lg:pl-16 xl:pl-24 relative z-10">

        {/* LEFT - Hero Text (vertically centered) */}
        <div className="relative z-30 w-full lg:w-[320px] xl:w-[380px] pt-1 lg:pt-0 flex flex-col justify-center lg:mr-20 xl:mr-24 -mt-[40px] lg:-mt-[60px]">
          <h1 className="font-serif italic text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tighter mb-4 select-none relative">
            <span className="inline-flex items-center gap-2">
              Hiii
              <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" viewBox="0 0 100 100">
                <g transform="rotate(-15, 35, 50)">
                  <path d="M20 20 Q20 45, 35 50 Q50 45, 50 20 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M23 28 Q23 42, 35 46 Q47 42, 47 28 Z" fill="#8B0000" opacity="0.8"/>
                  <line x1="35" y1="50" x2="35" y2="70" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <ellipse cx="35" cy="72" rx="12" ry="3" fill="none" stroke="currentColor" strokeWidth="3"/>
                </g>
                <g transform="rotate(15, 65, 50)">
                  <path d="M50 20 Q50 45, 65 50 Q80 45, 80 20 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M53 28 Q53 42, 65 46 Q77 42, 77 28 Z" fill="#8B0000" opacity="0.8"/>
                  <line x1="65" y1="50" x2="65" y2="70" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <ellipse cx="65" cy="72" rx="12" ry="3" fill="none" stroke="currentColor" strokeWidth="3"/>
                </g>
                <circle cx="50" cy="25" r="2" fill="#FFD700"/>
                <circle cx="45" cy="18" r="1.5" fill="#FFD700"/>
                <circle cx="55" cy="18" r="1.5" fill="#FFD700"/>
              </svg>
            </span>
            <br />
            <span className="relative inline-block">
              this is{' '}
              <span className="relative inline-block">
                Joeyyy
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-yellow-300/70 -rotate-1 -z-10" />
              </span>
            </span>
          </h1>
          <p className="font-typewriter text-sm md:text-base opacity-70 mb-2">
            I'm on my way — enjoying the ride.
          </p>
          <p className="font-typewriter text-xs md:text-sm opacity-50 leading-relaxed">
            I find problems. I build solutions.<br />Product architect who believes every challenge has an elegant answer.
          </p>
        </div>

        {/* RIGHT - Circle Layout with Frame, iPod, Typewriter */}
        <div className="relative w-[440px] h-[440px] lg:w-[500px] lg:h-[500px] -mt-[40px] lg:-mt-[60px]">

          {/* Decorative Circle - shifted right */}
          <div className="absolute top-[4%] bottom-[4%] left-[18%] right-[-10%] border-2 border-dashed border-red-500/20 rounded-full pointer-events-none"></div>

          {/* Triangle connecting lines - adjusted to match element positions */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Frame to iPod */}
            <line x1="42" y1="50" x2="90" y2="22" stroke="#dc2626" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.25" />
            {/* iPod to Typewriter */}
            <line x1="93" y1="26" x2="93" y2="68" stroke="#dc2626" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.25" />
            {/* Typewriter to Frame */}
            <line x1="90" y1="72" x2="42" y2="50" stroke="#dc2626" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.25" />
          </svg>

          {/* 1. PERSON FRAME - Left of circle (9 o'clock position) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[160px] md:w-[180px] lg:w-[200px] group z-20">
            <div className="relative">
              {/* Red accent rectangle behind */}
              <div className="absolute -bottom-3 -right-3 w-full h-full bg-red-600/80 -z-10"></div>

              {/* Photo frame - clickable */}
              <div
                onClick={() => setShowMenu(!showMenu)}
                className="bg-white p-2 shadow-xl border border-black/10 transition-transform hover:scale-[1.02] hover:rotate-1 cursor-pointer"
              >
                <div className="relative overflow-hidden border border-black/5">
                  {/* Person listening to music - your illustration */}
                  <div className={`transition-all duration-500 ${personAction ? 'scale-105' : ''}`}>
                    <img
                      src="/images/person-listening.jpg"
                      alt="Person Listening to Music"
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  {/* Action indicator - different messages based on action */}
                  {personAction === 'vibing' && (
                    <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded font-mono text-[10px] text-red-600 animate-bounce">
                      *vibing*
                    </div>
                  )}
                  {personAction === 'sipping' && (
                    <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
                      <div className="bg-white/90 px-2 py-1 rounded font-mono text-[10px] text-amber-700 mb-1">
                        *sipping*
                      </div>
                      <div className="animate-drink-once">
                        <svg width="40" height="50" viewBox="0 0 40 50">
                          <g className="animate-pulse opacity-60">
                            <path d="M14 12 Q16 6 14 2" stroke="#888" strokeWidth="1.5" fill="none"/>
                            <path d="M20 10 Q22 4 20 0" stroke="#888" strokeWidth="1.5" fill="none"/>
                            <path d="M26 12 Q28 6 26 2" stroke="#888" strokeWidth="1.5" fill="none"/>
                          </g>
                          <path d="M8 16 L6 42 Q6 46 10 46 L30 46 Q34 46 34 42 L32 16 Z" fill="#8B4513" stroke="#5D3A1A" strokeWidth="1.5"/>
                          <ellipse cx="20" cy="16" rx="12" ry="4" fill="#6B4423"/>
                          <ellipse cx="20" cy="20" rx="10" ry="3" fill="#3d2314"/>
                          <path d="M34 22 Q42 26 38 34 Q34 40 34 36" stroke="#5D3A1A" strokeWidth="3" fill="none"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  {personAction === 'listening' && (
                    <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded font-mono text-[10px] text-blue-600 animate-bounce">
                      ♪ {musicTracks[currentTrack].name}
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative tape on corner with OBSERVER + Arrow to About */}
              <Link
                href="/about"
                className="absolute -top-2 left-4 w-24 h-6 bg-yellow-200/80 -rotate-12 shadow-sm flex items-center justify-center gap-1 hover:bg-yellow-300/90 transition-colors cursor-pointer group"
                title="About Me"
              >
                <span className="font-mono text-[7px] text-black/70 tracking-[0.15em] font-bold">OBSERVER</span>
                <span className="font-mono text-[10px] text-black/70 group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>

              {/* Dropdown menu - vintage paper style, positioned bottom-right */}
              {showMenu && (
                <div className="absolute top-full -mt-4 right-0 translate-x-4 bg-[#faf9f6] shadow-xl border border-black/10 min-w-[130px] z-50">
                  {/* Red accent top border */}
                  <div className="h-1 bg-red-600/80"></div>

                  {/* Header with tape effect */}
                  <div className="relative px-3 py-2 border-b border-dashed border-black/10">
                    <span className="font-typewriter text-[9px] text-black/50 uppercase tracking-wider">interact</span>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSelectAction('vibing'); setShowMenu(false); }}
                      className="w-full font-typewriter text-[11px] py-2 px-3 flex items-center gap-2 transition-colors text-left cursor-pointer hover:bg-red-50/50 text-black/70 hover:text-red-600"
                    >
                      <span className="text-[8px]">●</span>
                      <span>Vibing</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSelectAction('sipping'); setShowMenu(false); }}
                      className="w-full font-typewriter text-[11px] py-2 px-3 flex items-center gap-2 transition-colors text-left cursor-pointer hover:bg-amber-50/50 text-black/70 hover:text-amber-700"
                    >
                      <span className="text-[8px]">●</span>
                      <span>Sipping</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSelectAction('listening'); setShowMenu(false); }}
                      className="w-full font-typewriter text-[11px] py-2 px-3 flex items-center gap-2 transition-colors text-left cursor-pointer hover:bg-blue-50/50 text-black/70 hover:text-blue-600"
                    >
                      <span className="text-[8px]">●</span>
                      <span>Listening</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashed border-black/10"></div>

                  {/* Special item */}
                  <div className="py-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDrawTarot(); setShowMenu(false); }}
                      className="w-full font-typewriter text-[11px] py-2 px-3 flex items-center gap-2 transition-colors text-left cursor-pointer hover:bg-purple-50/50 text-black/70 hover:text-purple-600"
                    >
                      <span className="text-[8px]">✦</span>
                      <span>Draw Tarot</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Label */}
              <div className="absolute -bottom-6 left-2 bg-black text-white px-3 py-1 font-mono text-[8px] tracking-widest uppercase">
                BUILDING_ALWAYS
              </div>
            </div>
          </div>

          {/* 2. iPod / MUSIC PLAYER - Top-right of circle (1-2 o'clock position) */}
          <div
            className="absolute top-[8%] right-[1%] w-[85px] md:w-[95px] lg:w-[100px] cursor-pointer group z-30"
            onClick={handleMusic}
          >
            <div className="relative">
              {/* Dotted circle decoration */}
              <div className="absolute -top-3 -right-3 w-10 h-10 border-2 border-dashed border-red-500/40 rounded-full"></div>

              {/* iPod Classic Style */}
              <div className="bg-[#e8e8e8] rounded-2xl shadow-xl border border-black/10 p-3 transition-all hover:shadow-2xl hover:scale-105">
                {/* Screen */}
                <div className="bg-[#9abb98] rounded-lg p-2 mb-3 border border-black/20">
                  <div className="text-[8px] font-mono text-black/60 mb-1">iPod</div>
                  <div className="bg-[#8aab88] rounded p-1">
                    {isPlaying ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <div className="flex gap-[2px]">
                            <div className="w-1 h-3 bg-black/60 animate-pulse"></div>
                            <div className="w-1 h-4 bg-black/60 animate-pulse" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-1 h-2 bg-black/60 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-1 h-5 bg-black/60 animate-pulse" style={{animationDelay: '0.3s'}}></div>
                          </div>
                        </div>
                        <div className="text-[6px] font-mono text-black/80 truncate">
                          ♪ {musicTracks[currentTrack].name}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[7px] font-mono text-black/50 text-center py-1">
                        Click to Play
                      </div>
                    )}
                  </div>
                </div>

                {/* Click Wheel */}
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 bg-[#f5f5f5] rounded-full border-2 border-black/10 shadow-inner">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[5px] font-mono text-black/40">MENU</div>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[5px] font-mono text-black/40">
                      {isPlaying ? '⏸' : '▶'}
                    </div>
                    <button onClick={handlePrevTrack} className="absolute left-1 top-1/2 -translate-y-1/2 text-[5px] font-mono text-black/40 hover:text-black/70 cursor-pointer">◀◀</button>
                    <button onClick={handleNextTrack} className="absolute right-1 top-1/2 -translate-y-1/2 text-[5px] font-mono text-black/40 hover:text-black/70 cursor-pointer">▶▶</button>
                  </div>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-colors ${isPlaying ? 'bg-red-100' : 'bg-[#e0e0e0]'} border border-black/10`}></div>
                </div>
              </div>

              {/* Label */}
              <div className="absolute -bottom-5 left-0 font-typewriter text-[8px] tracking-wider opacity-50 uppercase">
                MUSIC PLAYER
              </div>
            </div>
          </div>

          {/* 3. TYPEWRITER - Bottom-right of circle (4-5 o'clock position) */}
          <div
            className="absolute bottom-[3%] right-[-4%] w-[150px] md:w-[165px] lg:w-[180px] cursor-pointer group z-10"
            onClick={handleTypewriter}
          >
            <div className="relative">
              {/* Red frame accent */}
              <div className="absolute inset-0 border-2 border-red-600/50 transform translate-x-3 translate-y-3 -z-10"></div>

              {/* Typewriter body */}
              <div className="bg-[#7cb4c4] rounded-t-lg p-2 shadow-2xl">
                {/* Paper */}
                <div className="bg-[#f4f1ea] rounded-t-sm p-3 min-h-[80px] relative overflow-hidden">
                  {/* Paper header */}
                  <div className="flex justify-between items-center mb-2 border-b border-black/10 pb-1">
                    <span className="font-typewriter text-[8px] opacity-60">omont.2024</span>
                    <span className="font-typewriter text-[8px] opacity-60">boring office</span>
                  </div>

                  {/* Typed text */}
                  <div className="font-typewriter text-xs leading-relaxed">
                    {isTyping ? (
                      <>
                        <div className="opacity-60 mb-1 text-[8px]">signal transmitting:</div>
                        <div className="text-red-600 font-bold text-[9px]">
                          {typedText}
                          <span className="animate-pulse">|</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="opacity-70 text-[10px]">transmit a signal</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Typewriter roller */}
                <div className="flex items-center justify-center gap-2 py-1">
                  <div className="w-2 h-2 bg-[#5a9aaa] rounded-full"></div>
                  <div className="flex-1 h-1.5 bg-[#5a9aaa] rounded-full"></div>
                  <div className="w-2 h-2 bg-[#5a9aaa] rounded-full"></div>
                </div>

                {/* Keyboard area */}
                <div className="bg-[#6aabb8] p-1.5 rounded-b-lg">
                  <div className="flex justify-center gap-[2px] mb-1">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 bg-[#5a9aaa] rounded-sm shadow-inner"></div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-[2px]">
                    {[...Array(11)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 bg-[#5a9aaa] rounded-sm shadow-inner"></div>
                    ))}
                  </div>
                </div>

                {/* Brand */}
                <div className="text-center mt-1">
                  <span className="font-mono text-[8px] text-white/80 tracking-[0.2em] uppercase">OMONT</span>
                </div>
              </div>

              {/* Label */}
              <div className="absolute -bottom-5 left-3 font-mono text-[8px] tracking-widest uppercase opacity-50">
                COSMIC COMMUNICATOR
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* TAROT CARD OVERLAY */}
      {showTarot && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center"
          onClick={handleCloseTarot}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Blue Tape Effect - like the original quote card */}
            <div className="absolute -top-3 left-8 w-32 h-6 bg-blue-600/90 -rotate-2 z-10 flex items-center justify-center shadow-sm">
              <span className="text-white font-mono text-[8px] tracking-[0.3em] font-bold">TAROT_READING</span>
            </div>

            {/* Card */}
            <div className={`relative w-[280px] bg-[#faf9f6] p-8 shadow-2xl border-2 border-black/5 transform transition-all duration-500 ${isFlipping ? 'scale-95 rotate-y-180' : 'scale-100'}`}>
              {/* Halftone texture */}
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(rgba(0,0,0,0.3) 1px, transparent 0)',
                backgroundSize: '3px 3px'
              }}></div>

              {isFlipping || !currentCard ? (
                // Card back
                <div className="h-[320px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">✦</div>
                    <div className="font-mono text-xs text-black/40 tracking-widest uppercase">Drawing...</div>
                  </div>
                </div>
              ) : (
                // Card front
                <div className="relative">
                  {/* Card number */}
                  <div className="absolute -top-4 -left-4 font-serif text-4xl text-purple-500/30 italic">
                    {currentCard.number}
                  </div>

                  {/* Decorative border */}
                  <div className="border-2 border-black/10 p-4">
                    {/* Rider-Waite Card Image */}
                    <div className="text-center mb-4">
                      <div className="relative inline-block border-4 border-purple-200/50 shadow-lg">
                        <img
                          src={currentCard.image}
                          alt={currentCard.name}
                          className="w-[140px] h-auto object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Card name */}
                    <h3 className="font-serif italic text-xl text-center mb-3 tracking-tight text-black border-b border-black/10 pb-3">
                      {currentCard.name}
                    </h3>

                    {/* Card meaning */}
                    <p className="font-typewriter text-xs text-center leading-relaxed opacity-70 mt-3">
                      {currentCard.meaning}
                    </p>

                    {/* Decorative stars */}
                    <div className="flex justify-center gap-2 mt-4 opacity-30">
                      <span>✦</span>
                      <span>✦</span>
                      <span>✦</span>
                    </div>
                  </div>

                  {/* Draw again button */}
                  <button
                    onClick={handleDrawTarot}
                    className="w-full mt-6 bg-black text-white py-3 font-mono text-xs uppercase tracking-widest hover:bg-purple-600 transition-colors"
                  >
                    Draw Again
                  </button>

                  {/* Close hint */}
                  <div className="text-center mt-3">
                    <span className="font-mono text-[10px] text-black/30">Click outside to close</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
