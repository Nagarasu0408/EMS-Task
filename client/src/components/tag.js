
import React, { useState } from 'react';
import './tag.css';

const tag = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue) {
            setTags([...tags, inputValue]);
            setInputValue('');
        }
    };

    const removeTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <div className="tag-input">
            {tags.map((tag, index) => (
                <div className="tag" key={index}>
                    {tag}
                    <button type="button" onClick={() => removeTag(index)}>x</button>
                </div>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a course and press Enter"
            />
        </div>
    );
};

export default tag;