// components/StationInitializer.js
import React, { useState, useEffect } from 'react';
import DeviceFingerprintService from '../utils/fingerprinting';
import axios from 'axios';

const StationInitializer = ({ onStationReady }) => {
    const [stationId, setStationId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [department, setDepartment] = useState('Pharmacy');
    const [location, setLocation] = useState('WSU Campus');
    const [error, setError] = useState(null);
    
    useEffect(() => {
        initializeStation();
    }, []);
    
    const initializeStation = async () => {
        try {
            setLoading(true);
            
            // Check localStorage first
            const savedStationId = localStorage.getItem('stationId');
            const savedTimestamp = localStorage.getItem('stationTimestamp');
            
            if (savedStationId && savedTimestamp) {
                // Verify station is still valid
                const response = await axios.get(`/api/stations/info?stationId=${savedStationId}`);
                if (response.data.success) {
                    setStationId(savedStationId);
                    // Update last seen
                    updateLastSeen(savedStationId);
                    onStationReady(savedStationId);
                    setLoading(false);
                    return;
                }
            }
            
            // Generate device fingerprint
            const fingerprint = await DeviceFingerprintService.generateFingerprint();
            const fingerprintHash = await DeviceFingerprintService.createFingerprintHash(fingerprint);
            
            // Register new station
            const registerResponse = await axios.post('/api/stations/register', {
                deviceFingerprint: fingerprintHash,
                department,
                location,
                browserUserAgent: navigator.userAgent,
                screenResolution: DeviceFingerprintService.getScreenResolution(),
                timezone: DeviceFingerprintService.getTimezone()
            });
            
            if (registerResponse.data.success) {
                const newStationId = registerResponse.data.station_id;
                setStationId(newStationId);
                
                // Store in localStorage for quick access
                localStorage.setItem('stationId', newStationId);
                localStorage.setItem('stationTimestamp', new Date().toISOString());
                localStorage.setItem('deviceFingerprint', JSON.stringify(fingerprint));
                
                onStationReady(newStationId);
            }
            
        } catch (err) {
            console.error('Station initialization error:', err);
            setError(err.response?.data?.error || 'Failed to initialize station');
        } finally {
            setLoading(false);
        }
    };
    
    const updateLastSeen = async (stId) => {
        try {
            const savedFingerprint = localStorage.getItem('deviceFingerprint');
            await axios.post('/api/stations/update-last-seen', {
                stationId: stId,
                fingerprint: JSON.parse(savedFingerprint)
            });
        } catch (err) {
            console.error('Failed to update last seen:', err);
        }
    };
    
    if (loading) {
        return (
            <div className="station-initializing">
                <div className="spinner"></div>
                <p>Initializing Station...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="error-container">
                <h3>Station Initialization Failed</h3>
                <p>{error}</p>
                <button onClick={initializeStation}>Retry</button>
            </div>
        );
    }
    
    if (stationId) {
        return (
            <div className="station-ready">
                <div className="station-badge">
                    <span className="label">Station:</span>
                    <span className="station-id">{stationId}</span>
                </div>
            </div>
        );
    }
    
    return (
        <div className="station-registration">
            <h2>Register Station</h2>
            <div className="form-group">
                <label>Department</label>
                <select 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)}
                >
                    <option>Pharmacy</option>
                    <option>Inventory</option>
                    <option>Lab/Dispensary</option>
                    <option>Administration</option>
                </select>
            </div>
            
            <div className="form-group">
                <label>Location</label>
                <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Main Counter"
                />
            </div>
            
            <button onClick={initializeStation} className="btn-primary">
                Register This Station
            </button>
        </div>
    );
};

export default StationInitializer;