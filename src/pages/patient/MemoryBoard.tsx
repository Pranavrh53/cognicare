import React, { useState } from 'react';
import Navigation from '../../components/common/Navigation';
import { Plus, Heart, Calendar, Smile } from 'lucide-react';
import './MemoryBoard.css';

interface Memory {
    id: string;
    imageUrl: string;
    title: string;
    date: string;
    description: string;
    people: string[];
    emotion: 'happy' | 'neutral' | 'nostalgic';
}

const MemoryBoard: React.FC = () => {
    const [selectedEmotion, setSelectedEmotion] = useState<string>('all');

    const memories: Memory[] = [
        {
            id: '1',
            imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500',
            title: 'Family Picnic',
            date: 'Summer 2023',
            description: 'A wonderful day at the park with the grandkids.',
            people: ['Sarah', 'Mike', 'Emma'],
            emotion: 'happy'
        },
        {
            id: '2',
            imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500',
            title: 'Old Friends',
            date: 'Christmas 2022',
            description: 'Reunion with high school friends.',
            people: ['Robert', 'James'],
            emotion: 'nostalgic'
        },
        {
            id: '3',
            imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500',
            title: 'Gardening',
            date: 'Spring 2024',
            description: 'My prize-winning roses finally bloomed!',
            people: [],
            emotion: 'happy'
        },
        {
            id: '4',
            imageUrl: 'https://images.unsplash.com/photo-1516737488439-c3f589534792?w=500',
            title: 'Paris Trip',
            date: '1998',
            description: 'Visiting the Eiffel Tower.',
            people: ['Martha'],
            emotion: 'nostalgic'
        }
    ];

    const filteredMemories = selectedEmotion === 'all'
        ? memories
        : memories.filter(m => m.emotion === selectedEmotion);

    return (
        <div className="page-wrapper">
            <Navigation userRole="patient" />

            <div className="page-container">
                <div className="memory-header">
                    <div>
                        <h1 className="page-title">Memory Board</h1>
                        <p className="page-subtitle">Cherished moments and familiar faces</p>
                    </div>
                    <button className="btn btn-primary">
                        <Plus size={20} />
                        Add Memory
                    </button>
                </div>

                {/* Mood/Filter Selector */}
                <div className="mood-filters">
                    <button
                        className={`filter-chip ${selectedEmotion === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedEmotion('all')}
                    >
                        All Memories
                    </button>
                    <button
                        className={`filter-chip ${selectedEmotion === 'happy' ? 'active' : ''}`}
                        onClick={() => setSelectedEmotion('happy')}
                    >
                        <Smile size={18} /> Happy
                    </button>
                    <button
                        className={`filter-chip ${selectedEmotion === 'nostalgic' ? 'active' : ''}`}
                        onClick={() => setSelectedEmotion('nostalgic')}
                    >
                        <Heart size={18} /> Nostalgic
                    </button>
                </div>

                {/* Masonry Grid */}
                <div className="memory-grid">
                    {filteredMemories.map((memory) => (
                        <div key={memory.id} className="memory-card card">
                            <div className="memory-image-container">
                                <img src={memory.imageUrl} alt={memory.title} className="memory-image" />
                                <div className="memory-overlay">
                                    <span className="memory-date">
                                        <Calendar size={14} />
                                        {memory.date}
                                    </span>
                                </div>
                            </div>

                            <div className="memory-content">
                                <div className="memory-header-row">
                                    <h3>{memory.title}</h3>
                                    {memory.emotion === 'happy' && <Smile size={20} className="text-success" />}
                                    {memory.emotion === 'nostalgic' && <Heart size={20} className="text-primary" />}
                                </div>

                                <p className="memory-description">{memory.description}</p>

                                {memory.people.length > 0 && (
                                    <div className="memory-people">
                                        <span className="people-label">Recognized:</span>
                                        <div className="people-tags">
                                            {memory.people.map((person, idx) => (
                                                <span key={idx} className="person-tag">
                                                    {person}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MemoryBoard;
