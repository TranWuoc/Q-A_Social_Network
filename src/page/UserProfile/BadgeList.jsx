// src/BadgeList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BadgeList = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/users/1'); // Thay đổi URL tương ứng với API của bạn
                setUser(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>User Badges</h1>
            <h2>{user.name}</h2>
            <ul>
                {user.badges.map(badge => (
                    <li key={badge.badgeType}>
                        <strong>{badge.badgeType}</strong>: {badge.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BadgeList;