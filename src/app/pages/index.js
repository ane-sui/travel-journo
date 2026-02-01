import { useEffect, useState } from 'react';

const Entries = () => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const savedEntries = JSON.parse(localStorage.getItem('entries')) || [];
        setEntries(savedEntries);
    }, []);

    return (
        <div>
            <h1>Past Entries</h1>
            <ul>
                {entries.map((entry, index) => (
                    <li key={index}>
                        <h3>{entry.location}</h3>
                        <p>{entry.text}</p>
                        {entry.photo && <img src={entry.photo} alt="Travel" />}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Entries;
