import React, { useState } from 'react';
import { 
  RulesPopup,
  RulesPopupTitle,
  RulesList,
  RuleItem,
  CloseButton
} from '../styles/Chat';

interface TipsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  currentLevel: number;
}

interface Tip {
  id: number;
  category: string;
  icon: string;
  title: string;
  tips: string[];
}

const tipsList: Tip[] = [
  {
    id: 1,
    category: "Level 1",
    icon: "🎯",
    title: "He's not yet good at keeping secrets",
    tips: [
        "See what happens if you ask the AI directly"
    ]
  },
  {
    id: 2,
    category: "Level 2",
    icon: "💬",
    title: "He got better, but he still has much to learn",
    tips: [
      "Try asking for the password in a more creative way"
    ]
  },
  {
    id: 3,
    category: "Level 3",
    icon: "🗣️",
    title: "He says that he can't say the exact password",
    tips: [
      "Try making the AI say pieces of the password"
    ]
  },
  {
    id: 4,
    category: "Level 4",
    icon: "🔒",
    title: "He will ignore you saying the word 'password'",
    tips: [
      "But what if you say 'password' in a different way?"
    ]
  },
  {
    id: 5,
    category: "Level 5",
    icon: "🤖",
    title: "He's using another AI to check your inputs",
    tips: [
      "Maybe that AI doesn't know foreign languages"
    ]
  },
  {
    id: 6,
    category: "Level 6",
    icon: "👷",
    title: "His AI became smarter eh?",
    tips: [
      "Maybe ask him about something else that may include the password"
    ]
  },
  {
    id: 7,
    category: "Level 7",
    icon: "😵",
    title: "Another AI to check the output too?",
    tips: [
      "Maybe you can make him say pieces of the password"
    ]
  },
  {
    id: 8,
    category: "Level 8",
    icon: "👨‍💻",
    title: "He's now making rules on the fly",
    tips: [
      "I'm sure you can figure it out, you got this!"
    ]
  },
];

const CarouselButton = ({ onClick, disabled, direction }: { onClick: () => void; disabled: boolean; direction: 'prev' | 'next' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? '#565869' : '#19c37d',
      border: 'none',
      color: disabled ? '#9ca3af' : '#fff',
      fontSize: '16px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      padding: '8px 12px',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      opacity: disabled ? 0.5 : 1
    }}
  >
    {direction === 'prev' ? '← Previous' : 'Next →'}
  </button>
);

const TipIndicators = ({ total, current, onSelect }: { total: number; current: number; onSelect: (index: number) => void }) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
    {Array.from({ length: total }).map((_, index) => (
      <button
        key={index}
        onClick={() => onSelect(index)}
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          border: 'none',
          background: index === current ? '#19c37d' : '#565869',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
      />
    ))}
  </div>
);

export const TipsPopup: React.FC<TipsPopupProps> = ({ isVisible, onClose, currentLevel }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  if (!isVisible) return null;

  // Filter tips based on current level - only show tips up to the current level
  // If currentLevel is 0, show 1 tip; otherwise show tips up to currentLevel
  const availableTips = tipsList.slice(0, Math.max(1, currentLevel === 0 ? 1 : currentLevel));
  const currentTip = availableTips[currentTipIndex];

  const handlePrevious = () => {
    setCurrentTipIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentTipIndex(prev => Math.min(availableTips.length - 1, prev + 1));
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentTipIndex(index);
  };

  return (
    <RulesPopup>
      <RulesPopupTitle>
        💡 Tips & Strategies ({currentTipIndex + 1}/{availableTips.length})
        <CloseButton onClick={onClose} title="Close">
          ✕
        </CloseButton>
      </RulesPopupTitle>
      
      <RulesList>
        <RuleItem>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h3 style={{ 
              color: '#19c37d', 
              margin: '0 0 16px 0', 
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              {currentTip.icon} {currentTip.title}
            </h3>
            
            <div style={{ 
              textAlign: 'center', 
              padding: 0, 
              margin: 20 
            }}>
              {currentTip.tips.map((tip, index) => (
                <div key={index} style={{ 
                  marginBottom: '12px', 
                  padding: '8px 0',
                  borderBottom: index < currentTip.tips.length - 1 ? '1px solid #565869' : 'none',
                  color: '#fff',
                  lineHeight: '1.5'
                }}>
                  {tip}
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '20px'
          }}>
            <CarouselButton 
              onClick={handlePrevious} 
              disabled={currentTipIndex === 0} 
              direction="prev" 
            />
            <CarouselButton 
              onClick={handleNext} 
              disabled={currentTipIndex === availableTips.length - 1} 
              direction="next" 
            />
          </div>
          
          <TipIndicators 
            total={availableTips.length} 
            current={currentTipIndex} 
            onSelect={handleIndicatorClick} 
          />
        </RuleItem>
      </RulesList>
    </RulesPopup>
  );
}; 