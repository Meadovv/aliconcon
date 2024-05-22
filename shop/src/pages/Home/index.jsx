import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {

    const navigate = useNavigate();
    React.useEffect(() => {
        navigate('/profile');
    }, [])

    return (
        <div>
            AAA
        </div>
    );
}