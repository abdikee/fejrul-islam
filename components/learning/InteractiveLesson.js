'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, CheckCircle, Circle, 
  BookOpen, Play, Award, Target, Lightbulb 
} from 'lucide-react';

export default function InteractiveLesson({ 
  lessonData, 
  onProgress, 
  onComplete 
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [completed, setCompleted] = useState(false);

  const slides = lessonData?.slides || [
    {
      id: 1,
      type: 'intro',
      title: 'Understanding Your Audience',
      content: 'Before engaging in dawah, it\'s crucial to understand who you\'re speaking with.',
      image: '/images/audience-analysis.jpg'
    },
    {
      id: 2,
      type: 'content',
      title: 'Types of Audiences',
      content: 'Different audiences require different approaches:',
      points: [
        'Muslims seeking to strengthen their faith',
        'Non-Muslims curious about Islam',
        'People with misconceptions about Islam',
        'Academic or intellectual audiences'
      ]
    },
    {
      id: 3,
      type: 'quiz',
      title: 'Quick Check',
      question: 'What is the most important factor when choosing your dawah approach?',
      options: [
        'Your own knowledge level',
        'Understanding your audience',
        'The time available',
        'The location of the conversation'
      ],
      correct: 1
    },
    {
      id: 4,
      type: 'content',
      title: 'Practical Tips',
      content: 'Here are some practical ways to understand your audience:',
      points: [
        'Listen actively to their questions and concerns',
        'Ask open-ended questions about their background',
        'Observe their body language and reactions',
        'Adapt your language to their level of understanding'
      ]
    },
    {
      id: 5,
      type: 'quiz',
      title: 'Scenario Question',
      question: 'A colleague asks you about Islamic prayer. They seem genuinely curious but know very little about Islam. What\'s your best approach?',
      options: [
        'Give them a detailed explanation of all five prayers',
        'Start with the basic concept and purpose of prayer',
        'Recommend they read the Quran first',
        'Invite them to the mosque immediately'
      ],
      correct: 1
    },
    {
      id: 6,
      type: 'summary',
      title: 'Key Takeaways',
      content: 'Remember these essential points:',
      points: [
        'Every person is unique and deserves a tailored approach',
        'Listening is often more important than speaking',
        'Start where they are, not where you want them to be',
        'Patience and wisdom are your greatest tools'
      ]
    }
  ];

  const currentSlideData = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;

  useEffect(() => {
    onProgress?.(progress);
    if (currentSlide === slides.length - 1 && !completed) {
      setCompleted(true);
      onComplete?.();
    }
  }, [currentSlide, progress, completed, onProgress, onComplete, slides.length]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const checkAnswer = (questionId, correctAnswer) => {
    return answers[questionId] === correctAnswer;
  };

  const renderSlide = () => {
    switch (currentSlideData.type) {
      case 'intro':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">{currentSlideData.title}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {currentSlideData.content}
            </p>
            {currentSlideData.image && (
              <div className="mt-8">
                <img 
                  src={currentSlideData.image} 
                  alt={currentSlideData.title}
                  className="rounded-xl shadow-lg mx-auto max-w-md"
                />
              </div>
            )}
          </div>
        );

      case 'content':
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{currentSlideData.title}</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6">{currentSlideData.content}</p>
            
            {currentSlideData.points && (
              <div className="space-y-4">
                {currentSlideData.points.map((point, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-slate-700">{point}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'quiz':
        const isAnswered = answers[currentSlideData.id] !== undefined;
        const isCorrect = checkAnswer(currentSlideData.id, currentSlideData.correct);
        
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{currentSlideData.title}</h2>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
              <p className="text-lg font-medium text-slate-800 mb-6">{currentSlideData.question}</p>
              
              <div className="space-y-3">
                {currentSlideData.options.map((option, index) => {
                  const isSelected = answers[currentSlideData.id] === index;
                  const isCorrectOption = index === currentSlideData.correct;
                  
                  let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all ";
                  
                  if (!isAnswered) {
                    buttonClass += isSelected 
                      ? "border-purple-500 bg-purple-100" 
                      : "border-slate-200 bg-white hover:border-purple-300";
                  } else {
                    if (isCorrectOption) {
                      buttonClass += "border-emerald-500 bg-emerald-100 text-emerald-800";
                    } else if (isSelected && !isCorrectOption) {
                      buttonClass += "border-red-500 bg-red-100 text-red-800";
                    } else {
                      buttonClass += "border-slate-200 bg-slate-50 text-slate-600";
                    }
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => !isAnswered && handleAnswer(currentSlideData.id, index)}
                      className={buttonClass}
                      disabled={isAnswered}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                          {isAnswered && isCorrectOption && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                          {isAnswered && isSelected && !isCorrectOption && <Circle className="w-5 h-5 text-red-600" />}
                          {!isAnswered && <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {isAnswered && (
                <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`font-medium ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                    {isCorrect ? '✓ Correct!' : '✗ Not quite right.'}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    {isCorrect 
                      ? 'Understanding your audience is the foundation of effective dawah.'
                      : 'Remember, effective dawah starts with understanding who you\'re speaking with.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">{currentSlideData.title}</h2>
            <p className="text-lg text-slate-600 mb-8">{currentSlideData.content}</p>
            
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {currentSlideData.points.map((point, index) => (
                <div key={index} className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-700 font-medium">{point}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {completed && (
              <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl">
                <Award className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Lesson Completed!</h3>
                <p>You've successfully completed this interactive lesson.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Progress Bar */}
      <div className="h-2 bg-slate-200">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="min-h-[400px]">
          {renderSlide()}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-6 bg-slate-50 border-t border-slate-200">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            currentSlide === 0
              ? 'text-slate-400 cursor-not-allowed'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-emerald-600'
                  : index < currentSlide
                  ? 'bg-emerald-300'
                  : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            currentSlide === slides.length - 1
              ? 'text-slate-400 cursor-not-allowed'
              : 'text-white bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}