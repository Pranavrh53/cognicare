import React, { useState } from 'react';
import Navigation from '../../components/common/Navigation';
import { Calendar, Image as ImageIcon, CheckCircle, Award, RefreshCw, Trophy } from 'lucide-react';
import './DailyChallenge.css';

interface ChallengeImage {
    id: string;
    url: string;
    correctAnswer: string;
    userAnswer?: string;
}

const DailyChallenge: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [completed, setCompleted] = useState(false);
    const [score, setScore] = useState(0);

    // Demo images - in real app, these would come from Firebase Storage
    const [images, setImages] = useState<ChallengeImage[]>([
        {
            id: '1',
            url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
            correctAnswer: 'dog',
            userAnswer: undefined
        },
        {
            id: '2',
            url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
            correctAnswer: 'cat',
            userAnswer: undefined
        },
        {
            id: '3',
            url: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400',
            correctAnswer: 'flower',
            userAnswer: undefined
        },
        {
            id: '4',
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            correctAnswer: 'mountain',
            userAnswer: undefined
        }
    ]);

    const currentImage = images[currentIndex];
    const totalImages = images.length;
    const answeredCount = images.filter(img => img.userAnswer !== undefined).length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!userInput.trim()) return;

        const isCorrect = userInput.toLowerCase().trim() === currentImage.correctAnswer.toLowerCase();

        const updatedImages = [...images];
        updatedImages[currentIndex] = {
            ...currentImage,
            userAnswer: userInput
        };
        setImages(updatedImages);

        if (isCorrect) {
            setScore(score + 25);
        }

        setUserInput('');

        if (currentIndex < totalImages - 1) {
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
            }, 500);
        } else {
            setTimeout(() => {
                setCompleted(true);
            }, 500);
        }
    };

    const handleReset = () => {
        setImages(images.map(img => ({ ...img, userAnswer: undefined })));
        setCurrentIndex(0);
        setUserInput('');
        setCompleted(false);
        setScore(0);
    };

    const correctAnswers = images.filter(
        img => img.userAnswer?.toLowerCase() === img.correctAnswer.toLowerCase()
    ).length;

    if (completed) {
        return (
            <div className="page-wrapper">
                <Navigation userRole="patient" />

                <div className="page-container">
                    <div className="completion-screen">
                        <div className="completion-card card">
                            <div className="trophy-icon">
                                <Trophy size={80} />
                            </div>

                            <h1>Challenge Complete!</h1>
                            <p className="completion-message">
                                Great job! You've completed today's challenge.
                            </p>

                            <div className="completion-stats">
                                <div className="completion-stat">
                                    <CheckCircle size={32} />
                                    <div>
                                        <h3>{correctAnswers}/{totalImages}</h3>
                                        <p>Correct Answers</p>
                                    </div>
                                </div>

                                <div className="completion-stat">
                                    <Award size={32} />
                                    <div>
                                        <h3>{score}</h3>
                                        <p>Points Earned</p>
                                    </div>
                                </div>
                            </div>

                            <div className="results-list">
                                <h3>Your Answers:</h3>
                                {images.map((img, idx) => {
                                    const isCorrect = img.userAnswer?.toLowerCase() === img.correctAnswer.toLowerCase();
                                    return (
                                        <div key={img.id} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                                            <span className="result-number">{idx + 1}</span>
                                            <div className="result-info">
                                                <p className="user-answer">Your answer: {img.userAnswer}</p>
                                                {!isCorrect && (
                                                    <p className="correct-answer">Correct answer: {img.correctAnswer}</p>
                                                )}
                                            </div>
                                            {isCorrect ? (
                                                <CheckCircle size={20} className="result-icon correct" />
                                            ) : (
                                                <span className="result-icon incorrect">✕</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <button className="btn btn-primary" onClick={handleReset}>
                                <RefreshCw size={20} />
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <Navigation userRole="patient" />

            <div className="page-container">
                <div className="challenge-header">
                    <div>
                        <h1 className="page-title">Daily Challenge</h1>
                        <p className="page-subtitle">Guess the images to earn points!</p>
                    </div>
                    <div className="challenge-stats">
                        <div className="stat-badge">
                            <Calendar size={20} />
                            <span>Today's Challenge</span>
                        </div>
                        <div className="stat-badge">
                            <Award size={20} />
                            <span>{score} Points</span>
                        </div>
                    </div>
                </div>

                <div className="challenge-content">
                    <div className="progress-bar-container">
                        <div className="progress-info">
                            <span>Progress</span>
                            <span>{answeredCount}/{totalImages}</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${(answeredCount / totalImages) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="challenge-card card">
                        <div className="image-number">
                            Image {currentIndex + 1} of {totalImages}
                        </div>

                        <div className="challenge-image-container">
                            <img
                                src={currentImage.url}
                                alt="Challenge"
                                className="challenge-image"
                            />
                        </div>

                        <form onSubmit={handleSubmit} className="answer-form">
                            <div className="form-group">
                                <label htmlFor="answer" className="form-label">
                                    <ImageIcon size={20} />
                                    What do you see in this image?
                                </label>
                                <input
                                    id="answer"
                                    type="text"
                                    className="form-input"
                                    placeholder="Type your answer..."
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary submit-btn"
                                disabled={!userInput.trim()}
                            >
                                Submit Answer
                            </button>
                        </form>
                    </div>

                    <div className="hint-card">
                        <p>💡 <strong>Hint:</strong> Look carefully at the image and describe what you see in one word.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyChallenge;
